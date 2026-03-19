import { Routes } from '@angular/router';
import { authGuard } from '@app/core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('@app/pages/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('@app/pages/register/register.component').then((m) => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@app/pages/dashboard/dashboard.component').then((m) => m.DashboardComponent)
  },
  {
    path: 'transactions',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@app/pages/transactions/transactions.component').then((m) => m.TransactionsComponent)
  },
  {
    path: 'analytics',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@app/pages/analytics/analytics.component').then((m) => m.AnalyticsComponent)
  },
  {
    path: 'budget',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@app/pages/budget/budget.component').then((m) => m.BudgetComponent)
  },
  {
    path: 'predictions',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@app/pages/predictions/predictions.component').then((m) => m.PredictionsComponent)
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@app/pages/settings/settings.component').then((m) => m.SettingsComponent)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
