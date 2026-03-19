from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import Optional, List

from database import get_db
from models import User, Transaction, TransactionType, CATEGORIES
from schemas import TransactionCreate, TransactionUpdate, TransactionResponse
from auth import get_current_user

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.get("", response_model=List[TransactionResponse])
def list_transactions(
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    sort_by: str = Query("date", enum=["date", "amount", "category"]),
    sort_order: str = Query("desc", enum=["asc", "desc"]),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Transaction).filter(Transaction.user_id == current_user.id)

    if search:
        query = query.filter(Transaction.description.ilike(f"%{search}%"))
    if category:
        query = query.filter(Transaction.category == category)
    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)

    sort_column = {
        "date": Transaction.date,
        "amount": Transaction.amount,
        "category": Transaction.category,
    }[sort_by]

    if sort_order == "desc":
        query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(sort_column.asc())

    transactions = query.offset(skip).limit(limit).all()
    return transactions


@router.post("", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def create_transaction(
    data: TransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if data.type not in ("income", "expense"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Type must be 'income' or 'expense'",
        )
    if data.category not in CATEGORIES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Category must be one of: {', '.join(CATEGORIES)}",
        )

    transaction = Transaction(
        user_id=current_user.id,
        amount=data.amount,
        type=TransactionType(data.type),
        category=data.category,
        description=data.description,
        date=data.date,
    )
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction


@router.put("/{transaction_id}", response_model=TransactionResponse)
def update_transaction(
    transaction_id: int,
    data: TransactionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    if transaction.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    if data.type is not None:
        if data.type not in ("income", "expense"):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Type must be 'income' or 'expense'")
        transaction.type = TransactionType(data.type)
    if data.category is not None:
        if data.category not in CATEGORIES:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Category must be one of: {', '.join(CATEGORIES)}")
        transaction.category = data.category
    if data.amount is not None:
        transaction.amount = data.amount
    if data.description is not None:
        transaction.description = data.description
    if data.date is not None:
        transaction.date = data.date

    db.commit()
    db.refresh(transaction)
    return transaction


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(
    transaction_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    if transaction.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    db.delete(transaction)
    db.commit()
