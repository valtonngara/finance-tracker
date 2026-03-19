from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


# ── Auth / User ──────────────────────────────────────────────

class UserCreate(BaseModel):
    email: str
    name: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    currency: str
    theme: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ── Transactions ─────────────────────────────────────────────

class TransactionCreate(BaseModel):
    amount: float
    type: str  # "income" or "expense"
    category: str
    description: str = ""
    date: str  # "YYYY-MM-DD"


class TransactionUpdate(BaseModel):
    amount: Optional[float] = None
    type: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    date: Optional[str] = None


class TransactionResponse(BaseModel):
    id: int
    user_id: int
    amount: float
    type: str
    category: str
    description: str
    date: str
    created_at: datetime

    class Config:
        from_attributes = True


# ── Budgets ──────────────────────────────────────────────────

class BudgetCreate(BaseModel):
    category: str
    amount: float
    month: str  # "2026-03"


class BudgetResponse(BaseModel):
    id: int
    user_id: int
    category: str
    amount: float
    month: str
    spent: float = 0.0
    created_at: datetime

    class Config:
        from_attributes = True


# ── Analytics ────────────────────────────────────────────────

class SummaryResponse(BaseModel):
    total_income: float
    total_expenses: float
    balance: float
    savings_rate: float  # percentage


class MonthlyBreakdown(BaseModel):
    month: str
    income: float
    expenses: float


class CategoryBreakdown(BaseModel):
    category: str
    total: float
    percentage: float


# ── Predictions ──────────────────────────────────────────────

class ForecastResponse(BaseModel):
    forecast_month: str
    predicted_income: float
    predicted_expenses: float
    predicted_savings: float
    method: str = "3-month rolling average"


class SpendingSpike(BaseModel):
    category: str
    current_amount: float
    average_amount: float
    increase_percentage: float


class SavingsSuggestion(BaseModel):
    category: str
    current_spending: float
    suggested_target: float
    potential_savings: float


class InsightResponse(BaseModel):
    spending_spikes: List[SpendingSpike]
    savings_suggestions: List[SavingsSuggestion]
    top_expense_category: Optional[str] = None
    total_potential_savings: float


# ── Settings ─────────────────────────────────────────────────

class SettingsUpdate(BaseModel):
    name: Optional[str] = None
    currency: Optional[str] = None
    theme: Optional[str] = None


class SettingsResponse(BaseModel):
    id: int
    email: str
    name: str
    currency: str
    theme: str
    created_at: datetime

    class Config:
        from_attributes = True
