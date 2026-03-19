from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from collections import defaultdict
from typing import List
from datetime import datetime

from database import get_db
from models import User, Budget, Transaction, TransactionType, CATEGORIES
from schemas import BudgetCreate, BudgetResponse
from auth import get_current_user

router = APIRouter(prefix="/budgets", tags=["Budgets"])


@router.get("", response_model=List[BudgetResponse])
def list_budgets(
    month: str = Query(None, description="Month in YYYY-MM format, defaults to current month"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if month is None:
        month = datetime.now().strftime("%Y-%m")

    budgets = (
        db.query(Budget)
        .filter(Budget.user_id == current_user.id, Budget.month == month)
        .all()
    )

    # Compute spent amounts from transactions for this month
    transactions = (
        db.query(Transaction)
        .filter(
            Transaction.user_id == current_user.id,
            Transaction.type == TransactionType.expense,
            Transaction.date.like(f"{month}%"),
        )
        .all()
    )
    spent_by_category: dict[str, float] = defaultdict(float)
    for t in transactions:
        spent_by_category[t.category] += t.amount

    result = []
    for b in budgets:
        resp = BudgetResponse.model_validate(b)
        resp.spent = round(spent_by_category.get(b.category, 0), 2)
        result.append(resp)

    return result


@router.post("", response_model=BudgetResponse, status_code=status.HTTP_201_CREATED)
def create_or_update_budget(
    data: BudgetCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if data.category not in CATEGORIES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Category must be one of: {', '.join(CATEGORIES)}",
        )
    if data.amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Budget amount must be positive",
        )

    # Check if budget already exists for this category + month
    existing = (
        db.query(Budget)
        .filter(
            Budget.user_id == current_user.id,
            Budget.category == data.category,
            Budget.month == data.month,
        )
        .first()
    )

    if existing:
        existing.amount = data.amount
        db.commit()
        db.refresh(existing)
        return existing

    budget = Budget(
        user_id=current_user.id,
        category=data.category,
        amount=data.amount,
        month=data.month,
    )
    db.add(budget)
    db.commit()
    db.refresh(budget)
    return budget


@router.put("/{budget_id}", response_model=BudgetResponse)
def update_budget(
    budget_id: int,
    data: BudgetCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    budget = db.query(Budget).filter(Budget.id == budget_id).first()
    if not budget:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget not found")
    if budget.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    if data.category not in CATEGORIES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Category must be one of: {', '.join(CATEGORIES)}",
        )
    if data.amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Budget amount must be positive",
        )

    budget.category = data.category
    budget.amount = data.amount
    budget.month = data.month
    db.commit()
    db.refresh(budget)
    return budget
