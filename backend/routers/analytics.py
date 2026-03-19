from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List
from datetime import datetime, timedelta
from collections import defaultdict

from database import get_db
from models import User, Transaction, TransactionType
from schemas import SummaryResponse, MonthlyBreakdown, CategoryBreakdown
from auth import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/summary", response_model=SummaryResponse)
def get_summary(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Transaction).filter(Transaction.user_id == current_user.id)
    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)

    transactions = query.all()

    total_income = sum(t.amount for t in transactions if t.type == TransactionType.income)
    total_expenses = sum(t.amount for t in transactions if t.type == TransactionType.expense)
    balance = total_income - total_expenses
    savings_rate = ((total_income - total_expenses) / total_income * 100) if total_income > 0 else 0.0

    return SummaryResponse(
        total_income=round(total_income, 2),
        total_expenses=round(total_expenses, 2),
        balance=round(balance, 2),
        savings_rate=round(savings_rate, 2),
    )


@router.get("/monthly", response_model=List[MonthlyBreakdown])
def get_monthly_breakdown(
    months: int = Query(12, ge=1, le=36),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Calculate the start date for the requested number of months back
    now = datetime.now()
    start = now - timedelta(days=months * 31)
    start_date = start.strftime("%Y-%m-01")

    transactions = (
        db.query(Transaction)
        .filter(
            Transaction.user_id == current_user.id,
            Transaction.date >= start_date,
        )
        .all()
    )

    monthly_data: dict[str, dict[str, float]] = defaultdict(lambda: {"income": 0.0, "expenses": 0.0})

    for t in transactions:
        month_key = t.date[:7]  # "YYYY-MM"
        if t.type == TransactionType.income:
            monthly_data[month_key]["income"] += t.amount
        else:
            monthly_data[month_key]["expenses"] += t.amount

    result = []
    for month_key in sorted(monthly_data.keys()):
        data = monthly_data[month_key]
        result.append(
            MonthlyBreakdown(
                month=month_key,
                income=round(data["income"], 2),
                expenses=round(data["expenses"], 2),
            )
        )

    return result


@router.get("/categories", response_model=List[CategoryBreakdown])
def get_category_breakdown(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    transaction_type: str = Query("expense", enum=["income", "expense"]),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == TransactionType(transaction_type),
    )
    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)

    transactions = query.all()

    category_totals: dict[str, float] = defaultdict(float)
    for t in transactions:
        category_totals[t.category] += t.amount

    grand_total = sum(category_totals.values())

    result = []
    for category, total in sorted(category_totals.items(), key=lambda x: x[1], reverse=True):
        result.append(
            CategoryBreakdown(
                category=category,
                total=round(total, 2),
                percentage=round((total / grand_total * 100) if grand_total > 0 else 0, 2),
            )
        )

    return result
