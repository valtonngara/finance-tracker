import csv
import io
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from models import User, Transaction
from schemas import SettingsUpdate, SettingsResponse
from auth import get_current_user, hash_password, verify_password


class PasswordChange(BaseModel):
    current_password: str
    new_password: str

router = APIRouter(prefix="/settings", tags=["Settings"])


@router.get("", response_model=SettingsResponse)
def get_settings(
    current_user: User = Depends(get_current_user),
):
    return current_user


@router.put("", response_model=SettingsResponse)
def update_settings(
    data: SettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if data.name is not None:
        if not data.name.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Name cannot be empty",
            )
        current_user.name = data.name.strip()

    if data.currency is not None:
        if len(data.currency) != 3:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Currency must be a 3-letter code (e.g., USD)",
            )
        current_user.currency = data.currency.upper()

    if data.theme is not None:
        if data.theme not in ("dark", "light"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Theme must be 'dark' or 'light'",
            )
        current_user.theme = data.theme

    db.commit()
    db.refresh(current_user)
    return current_user


@router.put("/password")
def change_password(
    data: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not verify_password(data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )
    if len(data.new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 6 characters",
        )
    current_user.hashed_password = hash_password(data.new_password)
    db.commit()
    return {"message": "Password updated successfully"}


@router.get("/export")
def export_transactions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    transactions = (
        db.query(Transaction)
        .filter(Transaction.user_id == current_user.id)
        .order_by(Transaction.date.desc())
        .all()
    )

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Date", "Type", "Category", "Amount", "Description"])

    for t in transactions:
        writer.writerow([t.id, t.date, t.type.value, t.category, t.amount, t.description])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=transactions.csv"},
    )
