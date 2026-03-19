from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from collections import defaultdict
from datetime import datetime

from database import get_db
from models import User, Transaction, TransactionType
from schemas import (
    ForecastResponse,
    InsightResponse,
    SpendingSpike,
    SavingsSuggestion,
)
from auth import get_current_user

router = APIRouter(prefix="/predictions", tags=["Predictions"])


def _get_monthly_totals(transactions: list, tx_type: TransactionType) -> dict[str, float]:
    """Group transactions by month and sum amounts for a given type."""
    monthly: dict[str, float] = defaultdict(float)
    for t in transactions:
        if t.type == tx_type:
            month_key = t.date[:7]
            monthly[month_key] += t.amount
    return monthly


def _get_category_monthly(transactions: list) -> dict[str, dict[str, float]]:
    """Group expense amounts by category then by month."""
    data: dict[str, dict[str, float]] = defaultdict(lambda: defaultdict(float))
    for t in transactions:
        if t.type == TransactionType.expense:
            month_key = t.date[:7]
            data[t.category][month_key] += t.amount
    return data


@router.get("/forecast", response_model=ForecastResponse)
def get_forecast(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    transactions = (
        db.query(Transaction)
        .filter(Transaction.user_id == current_user.id)
        .all()
    )

    income_monthly = _get_monthly_totals(transactions, TransactionType.income)
    expense_monthly = _get_monthly_totals(transactions, TransactionType.expense)

    # Get the last 3 months with data
    all_months = sorted(set(list(income_monthly.keys()) + list(expense_monthly.keys())))
    last_3 = all_months[-3:] if len(all_months) >= 3 else all_months

    if not last_3:
        now = datetime.now()
        next_month = now.month + 1
        next_year = now.year
        if next_month > 12:
            next_month = 1
            next_year += 1
        forecast_month = f"{next_year}-{next_month:02d}"
        return ForecastResponse(
            forecast_month=forecast_month,
            predicted_income=0.0,
            predicted_expenses=0.0,
            predicted_savings=0.0,
        )

    avg_income = sum(income_monthly.get(m, 0) for m in last_3) / len(last_3)
    avg_expenses = sum(expense_monthly.get(m, 0) for m in last_3) / len(last_3)

    # Determine next month
    last_month_str = all_months[-1]
    year, month = int(last_month_str[:4]), int(last_month_str[5:7])
    month += 1
    if month > 12:
        month = 1
        year += 1
    forecast_month = f"{year}-{month:02d}"

    return ForecastResponse(
        forecast_month=forecast_month,
        predicted_income=round(avg_income, 2),
        predicted_expenses=round(avg_expenses, 2),
        predicted_savings=round(avg_income - avg_expenses, 2),
    )


@router.get("/insights", response_model=InsightResponse)
def get_insights(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    transactions = (
        db.query(Transaction)
        .filter(Transaction.user_id == current_user.id)
        .all()
    )

    category_monthly = _get_category_monthly(transactions)
    all_months = sorted(
        set(m for cat_data in category_monthly.values() for m in cat_data.keys())
    )

    spending_spikes: list[SpendingSpike] = []
    savings_suggestions: list[SavingsSuggestion] = []
    category_totals: dict[str, float] = {}

    if len(all_months) >= 2:
        current_month = all_months[-1]

        for category, month_data in category_monthly.items():
            # Calculate average of all months except the current one
            previous_months = [m for m in all_months if m != current_month]
            if not previous_months:
                continue

            avg_spending = sum(month_data.get(m, 0) for m in previous_months) / len(previous_months)
            current_spending = month_data.get(current_month, 0)

            category_totals[category] = current_spending

            # Detect spikes: current month > 30% above average
            if avg_spending > 0 and current_spending > avg_spending * 1.3:
                increase_pct = ((current_spending - avg_spending) / avg_spending) * 100
                spending_spikes.append(
                    SpendingSpike(
                        category=category,
                        current_amount=round(current_spending, 2),
                        average_amount=round(avg_spending, 2),
                        increase_percentage=round(increase_pct, 2),
                    )
                )

            # Savings suggestions: if spending is above average, suggest reducing to average
            if avg_spending > 0 and current_spending > avg_spending:
                potential = current_spending - avg_spending
                savings_suggestions.append(
                    SavingsSuggestion(
                        category=category,
                        current_spending=round(current_spending, 2),
                        suggested_target=round(avg_spending, 2),
                        potential_savings=round(potential, 2),
                    )
                )
    else:
        # Not enough data for comparison, just compute totals
        for category, month_data in category_monthly.items():
            category_totals[category] = sum(month_data.values())

    # Sort suggestions by potential savings descending
    savings_suggestions.sort(key=lambda s: s.potential_savings, reverse=True)
    spending_spikes.sort(key=lambda s: s.increase_percentage, reverse=True)

    top_expense_category = max(category_totals, key=category_totals.get) if category_totals else None
    total_potential = sum(s.potential_savings for s in savings_suggestions)

    return InsightResponse(
        spending_spikes=spending_spikes,
        savings_suggestions=savings_suggestions,
        top_expense_category=top_expense_category,
        total_potential_savings=round(total_potential, 2),
    )
