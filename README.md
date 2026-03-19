# FinTrack - Personal Finance Tracker

A full-featured personal finance tracker with a sleek dark UI, built with Angular 17 and Python FastAPI.

## Tech Stack

- **Frontend**: Angular 17+ (standalone components, signals, Angular Animations, Chart.js)
- **Backend**: Python FastAPI with SQLite (SQLAlchemy ORM)
- **Auth**: JWT tokens with HttpInterceptor
- **Styling**: SCSS with CSS custom properties, glassmorphism design

## Setup

### Backend

```bash
cd backend
pip install -r requirements.txt

# Seed the database with demo data
python seed.py

# Start the server
uvicorn main:app --reload
```

The API runs at `http://localhost:8000`. Swagger docs available at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
ng serve
```

The app runs at `http://localhost:4200`.

### Demo Account

After running the seed script:
- **Email**: demo@example.com
- **Password**: password123

## Features

- **Dashboard**: Animated summary cards, trend charts, recent transactions
- **Transactions**: Full CRUD with search, filters, sorting, and modal forms
- **Analytics**: Bar charts, donut charts, income vs expenses comparison, spending heatmap, 3-month moving average
- **Budget**: Per-category monthly budgets with animated progress bars and projected end-of-month spend
- **Predictions**: Expense forecasting (3-month rolling average), spending spike detection, savings goal tracker
- **Settings**: Profile management, password change, CSV export

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Create user |
| POST | /auth/login | Login, returns JWT |
| GET/POST | /transactions | List/create transactions |
| PUT/DELETE | /transactions/{id} | Update/delete transaction |
| GET | /analytics/summary | Balance, income, expenses, savings rate |
| GET | /analytics/monthly | Monthly breakdown |
| GET | /analytics/categories | Spending per category |
| GET | /predictions/forecast | 3-month rolling average forecast |
| GET | /predictions/insights | Spending spikes & savings suggestions |
| GET/POST/PUT | /budgets | Budget CRUD |
| GET/PUT | /settings | User preferences |
| GET | /settings/export | CSV export |
