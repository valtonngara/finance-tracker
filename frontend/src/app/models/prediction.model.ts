export interface Forecast {
  forecast_month: string;
  predicted_income: number;
  predicted_expenses: number;
  predicted_savings: number;
  method: string;
}

export interface SpendingSpike {
  category: string;
  current_amount: number;
  average_amount: number;
  increase_percentage: number;
}

export interface SavingsSuggestion {
  category: string;
  current_spending: number;
  suggested_target: number;
  potential_savings: number;
}

export interface InsightResponse {
  spending_spikes: SpendingSpike[];
  savings_suggestions: SavingsSuggestion[];
  top_expense_category: string | null;
  total_potential_savings: number;
}
