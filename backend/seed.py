"""
Seed script: creates a demo user with 3 months of realistic transactions and sample budgets.
Run with:  python seed.py
"""

import sys
import os
import random
from datetime import datetime, timezone

# Ensure the backend directory is on the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import engine, Base, SessionLocal
from models import User, Transaction, Budget, TransactionType
from auth import hash_password

# Create all tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# ── Check if demo user already exists ────────────────────────
existing = db.query(User).filter(User.email == "demo@example.com").first()
if existing:
    print("Demo user already exists. Deleting existing data to re-seed...")
    db.query(Transaction).filter(Transaction.user_id == existing.id).delete()
    db.query(Budget).filter(Budget.user_id == existing.id).delete()
    db.delete(existing)
    db.commit()

# ── Create demo user ─────────────────────────────────────────
user = User(
    email="demo@example.com",
    name="Demo User",
    hashed_password=hash_password("password123"),
    currency="USD",
    theme="dark",
)
db.add(user)
db.commit()
db.refresh(user)

print(f"Created user: demo@example.com / password123  (id={user.id})")

# ── Define transaction templates ─────────────────────────────
expense_templates = [
    ("Food", "Grocery shopping", 40, 120),
    ("Food", "Restaurant dinner", 25, 75),
    ("Food", "Coffee shop", 4, 8),
    ("Transport", "Gas station", 35, 65),
    ("Transport", "Uber ride", 10, 30),
    ("Transport", "Monthly metro pass", 80, 80),
    ("Housing", "Rent payment", 1500, 1500),
    ("Housing", "Electricity bill", 60, 120),
    ("Housing", "Internet bill", 55, 55),
    ("Health", "Pharmacy", 15, 50),
    ("Health", "Gym membership", 40, 40),
    ("Entertainment", "Netflix subscription", 15, 15),
    ("Entertainment", "Movie tickets", 12, 25),
    ("Entertainment", "Concert tickets", 50, 120),
    ("Shopping", "New shoes", 60, 150),
    ("Shopping", "Electronics", 30, 200),
    ("Shopping", "Books", 10, 35),
    ("Other", "Haircut", 25, 40),
    ("Other", "Gift for friend", 20, 60),
]

income_templates = [
    ("Salary", "Monthly salary", 4500, 4500),
    ("Freelance", "Freelance web project", 300, 1200),
    ("Freelance", "Consulting call", 100, 300),
    ("Investment", "Stock dividends", 50, 200),
    ("Investment", "Interest income", 10, 30),
    ("Other", "Cashback reward", 5, 25),
]

# ── Generate 3 months of transactions ────────────────────────
months = ["2026-01", "2026-02", "2026-03"]
transaction_count = 0

for month in months:
    year, m = month.split("-")
    year, m = int(year), int(m)

    # Always add salary
    db.add(Transaction(
        user_id=user.id,
        amount=4500.00,
        type=TransactionType.income,
        category="Salary",
        description="Monthly salary",
        date=f"{month}-01",
    ))
    transaction_count += 1

    # Add 1-2 freelance incomes per month
    for _ in range(random.randint(1, 2)):
        tmpl = random.choice(income_templates[1:])  # skip salary
        day = random.randint(1, 28)
        amount = round(random.uniform(tmpl[2], tmpl[3]), 2)
        db.add(Transaction(
            user_id=user.id,
            amount=amount,
            type=TransactionType.income,
            category=tmpl[0],
            description=tmpl[1],
            date=f"{month}-{day:02d}",
        ))
        transaction_count += 1

    # Always add fixed expenses
    fixed = [
        ("Housing", "Rent payment", 1500.00, 1),
        ("Housing", "Electricity bill", round(random.uniform(60, 120), 2), 5),
        ("Housing", "Internet bill", 55.00, 5),
        ("Health", "Gym membership", 40.00, 1),
        ("Entertainment", "Netflix subscription", 15.99, 1),
        ("Transport", "Monthly metro pass", 80.00, 1),
    ]
    for cat, desc, amt, day in fixed:
        db.add(Transaction(
            user_id=user.id,
            amount=amt,
            type=TransactionType.expense,
            category=cat,
            description=desc,
            date=f"{month}-{day:02d}",
        ))
        transaction_count += 1

    # Add 12-18 variable expenses per month
    for _ in range(random.randint(12, 18)):
        tmpl = random.choice(expense_templates)
        # skip fixed ones we already added
        if tmpl[1] in ("Rent payment", "Electricity bill", "Internet bill",
                        "Gym membership", "Netflix subscription", "Monthly metro pass"):
            continue
        day = random.randint(1, 28)
        amount = round(random.uniform(tmpl[2], tmpl[3]), 2)
        db.add(Transaction(
            user_id=user.id,
            amount=amount,
            type=TransactionType.expense,
            category=tmpl[0],
            description=tmpl[1],
            date=f"{month}-{day:02d}",
        ))
        transaction_count += 1

db.commit()
print(f"Created {transaction_count} transactions across {len(months)} months.")

# ── Create sample budgets for current month ──────────────────
budget_data = [
    ("Food", 500),
    ("Transport", 200),
    ("Housing", 1700),
    ("Health", 100),
    ("Entertainment", 100),
    ("Shopping", 300),
    ("Other", 150),
]

budget_count = 0
for category, amount in budget_data:
    db.add(Budget(
        user_id=user.id,
        category=category,
        amount=float(amount),
        month="2026-03",
    ))
    budget_count += 1

db.commit()
print(f"Created {budget_count} budgets for 2026-03.")

db.close()
print("\nSeed complete! Start the server with: uvicorn main:app --reload")
