# Expensera

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
