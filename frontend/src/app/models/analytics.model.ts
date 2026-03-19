export interface Summary {
  balance: number;
  total_income: number;
  total_expenses: number;
  savings_rate: number;
}

export interface MonthlyBreakdown {
  month: string;
  income: number;
  expenses: number;
}

export interface CategoryBreakdown {
  category: string;
  total: number;
  percentage: number;
}
