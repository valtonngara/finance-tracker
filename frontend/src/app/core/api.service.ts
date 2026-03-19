import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Transaction, TransactionCreate, TransactionFilters } from '@app/models/transaction.model';
import { Summary, MonthlyBreakdown, CategoryBreakdown } from '@app/models/analytics.model';
import { Budget } from '@app/models/budget.model';
import { Forecast, InsightResponse } from '@app/models/prediction.model';
import { User } from '@app/models/user.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Generic methods

  get<T>(path: string, params?: Record<string, string>): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<T>(`${this.baseUrl}${path}`, { params: httpParams });
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, body);
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${path}`, body);
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${path}`);
  }

  // Transaction methods

  getTransactions(filters?: TransactionFilters): Observable<Transaction[]> {
    const params: Record<string, string> = {};
    if (filters) {
      if (filters.search) params['search'] = filters.search;
      if (filters.category) params['category'] = filters.category;
      if (filters.start_date) params['start_date'] = filters.start_date;
      if (filters.end_date) params['end_date'] = filters.end_date;
      if (filters.sort_by) params['sort_by'] = filters.sort_by;
      if (filters.sort_order) params['sort_order'] = filters.sort_order;
    }
    return this.get<Transaction[]>('/transactions', params);
  }

  getTransaction(id: number): Observable<Transaction> {
    return this.get<Transaction>(`/transactions/${id}`);
  }

  createTransaction(transaction: TransactionCreate): Observable<Transaction> {
    return this.post<Transaction>('/transactions', transaction);
  }

  updateTransaction(id: number, transaction: Partial<TransactionCreate>): Observable<Transaction> {
    return this.put<Transaction>(`/transactions/${id}`, transaction);
  }

  deleteTransaction(id: number): Observable<void> {
    return this.delete<void>(`/transactions/${id}`);
  }

  // Analytics methods

  getSummary(): Observable<Summary> {
    return this.get<Summary>('/analytics/summary');
  }

  getMonthlyBreakdown(): Observable<MonthlyBreakdown[]> {
    return this.get<MonthlyBreakdown[]>('/analytics/monthly');
  }

  getCategoryBreakdown(): Observable<CategoryBreakdown[]> {
    return this.get<CategoryBreakdown[]>('/analytics/categories');
  }

  // Budget methods

  getBudgets(): Observable<Budget[]> {
    return this.get<Budget[]>('/budgets');
  }

  getBudget(id: number): Observable<Budget> {
    return this.get<Budget>(`/budgets/${id}`);
  }

  createBudget(budget: Omit<Budget, 'id' | 'created_at' | 'spent'>): Observable<Budget> {
    return this.post<Budget>('/budgets', budget);
  }

  updateBudget(id: number, budget: Partial<Budget>): Observable<Budget> {
    return this.put<Budget>(`/budgets/${id}`, budget);
  }

  deleteBudget(id: number): Observable<void> {
    return this.delete<void>(`/budgets/${id}`);
  }

  // Predictions methods

  getForecast(): Observable<Forecast> {
    return this.get<Forecast>('/predictions/forecast');
  }

  getInsights(): Observable<InsightResponse> {
    return this.get<InsightResponse>('/predictions/insights');
  }

  // Settings methods

  getUserSettings(): Observable<User> {
    return this.get<User>('/settings');
  }

  updateUserSettings(settings: Partial<User>): Observable<User> {
    return this.put<User>('/settings', settings);
  }

  updatePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.put<void>('/settings/password', {
      current_password: currentPassword,
      new_password: newPassword
    });
  }
}
