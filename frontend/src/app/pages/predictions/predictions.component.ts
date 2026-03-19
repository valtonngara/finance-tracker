import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { ApiService } from '@app/core/api.service';
import { Forecast, InsightResponse, SpendingSpike, SavingsSuggestion } from '@app/models/prediction.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-predictions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  animations: [
    trigger('cardStagger', [
      transition(':enter', [
        query('.pred-card', [
          style({ opacity: 0, transform: 'translateY(16px)' }),
          stagger(80, [
            animate('350ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('fadeUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(12px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Predictions & Insights</h1>
      </div>

      @if (loading()) {
        <div class="grid grid-3">
          @for (i of [1,2,3]; track i) {
            <div class="glass-card-static" style="padding: 24px;">
              <div class="skeleton" style="width: 50%; height: 14px; margin-bottom: 12px;"></div>
              <div class="skeleton" style="width: 70%; height: 28px; margin-bottom: 8px;"></div>
              <div class="skeleton" style="width: 90%; height: 14px;"></div>
            </div>
          }
        </div>
      } @else {
        <!-- Spending Spikes -->
        @if (insightData()?.spending_spikes?.length) {
          <div class="mb-3" @fadeUp>
            <h2 style="font-size: 1.25rem; margin-bottom: 16px;">Spending Spikes</h2>
            <div class="insights-list">
              @for (spike of insightData()!.spending_spikes; track spike.category) {
                <div class="insight-card glass-card severity-high" style="padding: 20px;">
                  <div class="insight-icon">&#9888;</div>
                  <div class="insight-body">
                    <span class="badge badge-expense">{{ spike.category }}</span>
                    <p style="margin-top: 6px;">
                      Spending is <strong class="text-red">{{ spike.increase_percentage | number:'1.0-0' }}%</strong> above average
                    </p>
                    <span class="text-muted" style="font-size: 0.8125rem;">
                      Current: {{ spike.current_amount | currency:'USD':'symbol':'1.0-0' }} &middot;
                      Avg: {{ spike.average_amount | currency:'USD':'symbol':'1.0-0' }}
                    </span>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        <!-- Savings Suggestions -->
        @if (insightData()?.savings_suggestions?.length) {
          <div class="mb-3" @fadeUp>
            <h2 style="font-size: 1.25rem; margin-bottom: 16px;">Savings Opportunities</h2>
            <div class="insights-list">
              @for (sug of insightData()!.savings_suggestions; track sug.category) {
                <div class="insight-card glass-card severity-medium" style="padding: 20px;">
                  <div class="insight-icon">&#128161;</div>
                  <div class="insight-body">
                    <span class="badge badge-warning">{{ sug.category }}</span>
                    <p style="margin-top: 6px;">
                      Reduce to {{ sug.suggested_target | currency:'USD':'symbol':'1.0-0' }} to save
                      <strong class="text-green">{{ sug.potential_savings | currency:'USD':'symbol':'1.0-0' }}</strong>
                    </p>
                    <span class="text-muted" style="font-size: 0.8125rem;">
                      Currently spending {{ sug.current_spending | currency:'USD':'symbol':'1.0-0' }}
                    </span>
                  </div>
                </div>
              }
            </div>
            @if (insightData()!.total_potential_savings > 0) {
              <div class="glass-card-static mt-2" style="padding: 16px 20px;">
                <span class="text-secondary">Total potential savings: </span>
                <span class="text-green" style="font-weight: 700; font-size: 1.125rem;">
                  {{ insightData()!.total_potential_savings | currency:'USD':'symbol':'1.0-0' }}
                </span>
              </div>
            }
          </div>
        }

        <!-- Forecast -->
        <h2 style="font-size: 1.25rem; margin-bottom: 16px;">Next Month Forecast</h2>
        @if (forecast()) {
          <div class="grid grid-3" @cardStagger>
            <div class="pred-card glass-card" style="padding: 24px;">
              <span class="card-label text-secondary">Predicted Income</span>
              <div class="stat-number text-green" style="margin: 8px 0;">
                {{ forecast()!.predicted_income | currency:'USD':'symbol':'1.0-0' }}
              </div>
              <span class="text-muted" style="font-size: 0.8125rem;">{{ forecast()!.forecast_month }}</span>
            </div>
            <div class="pred-card glass-card" style="padding: 24px;">
              <span class="card-label text-secondary">Predicted Expenses</span>
              <div class="stat-number text-red" style="margin: 8px 0;">
                {{ forecast()!.predicted_expenses | currency:'USD':'symbol':'1.0-0' }}
              </div>
              <span class="text-muted" style="font-size: 0.8125rem;">{{ forecast()!.method }}</span>
            </div>
            <div class="pred-card glass-card" style="padding: 24px;">
              <span class="card-label text-secondary">Predicted Savings</span>
              <div class="stat-number text-accent" style="margin: 8px 0;">
                {{ forecast()!.predicted_savings | currency:'USD':'symbol':'1.0-0' }}
              </div>
              <span class="text-muted" style="font-size: 0.8125rem;">{{ forecast()!.forecast_month }}</span>
            </div>
          </div>
        } @else {
          <div class="glass-card-static" style="padding: 40px; text-align: center;">
            <p class="text-muted">Not enough data to generate forecasts yet.</p>
          </div>
        }

        <!-- Savings Goal Tracker -->
        <div class="glass-card-static mt-3" style="padding: 32px;" @fadeUp>
          <h2 style="font-size: 1.25rem; margin-bottom: 20px;">Savings Goal Tracker</h2>
          <div class="savings-form">
            <form [formGroup]="savingsForm" class="flex gap-2 items-center" style="flex-wrap: wrap;">
              <div class="form-group" style="margin-bottom: 0; flex: 1; min-width: 200px;">
                <label>Target Amount</label>
                <input type="number" class="form-input" formControlName="target" placeholder="10000" />
              </div>
              <div class="form-group" style="margin-bottom: 0; flex: 1; min-width: 200px;">
                <label>Current Savings</label>
                <input type="number" class="form-input" formControlName="current" placeholder="3000" />
              </div>
              <div class="form-group" style="margin-bottom: 0; flex: 1; min-width: 200px;">
                <label>Monthly Savings Rate</label>
                <input type="number" class="form-input" formControlName="monthly" placeholder="500" />
              </div>
            </form>

            @if (savingsForm.valid && savingsForm.value.monthly && savingsForm.value.monthly > 0) {
              <div class="savings-result mt-3">
                <div class="progress-bar" style="height: 12px;">
                  <div
                    class="progress-fill green"
                    [style.width.%]="savingsProgress()"
                  ></div>
                </div>
                <div class="flex justify-between mt-1">
                  <span class="text-secondary" style="font-size: 0.875rem;">
                    {{ savingsProgress() | number:'1.0-0' }}% of goal
                  </span>
                  <span class="text-accent" style="font-size: 0.875rem; font-weight: 600;">
                    {{ monthsToGoal() }} months to reach goal
                  </span>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .card-label {
      display: block;
      font-size: 0.8125rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .insights-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .insight-card {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }

    .insight-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
    }

    .severity-high .insight-icon {
      background: var(--red-soft);
      color: var(--red);
    }

    .severity-medium .insight-icon {
      background: var(--amber-soft);
      color: var(--amber);
    }

    .insight-body {
      flex: 1;
    }

    .savings-result {
      padding-top: 16px;
    }
  `]
})
export class PredictionsComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);

  loading = signal(true);
  forecast = signal<Forecast | null>(null);
  insightData = signal<InsightResponse | null>(null);

  savingsForm = this.fb.nonNullable.group({
    target: [10000, [Validators.min(1)]],
    current: [0],
    monthly: [500, [Validators.min(1)]]
  });

  ngOnInit(): void {
    forkJoin({
      forecast: this.api.getForecast(),
      insights: this.api.getInsights()
    }).subscribe({
      next: (data) => {
        this.forecast.set(data.forecast);
        this.insightData.set(data.insights);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  savingsProgress(): number {
    const { target, current } = this.savingsForm.getRawValue();
    if (!target || target <= 0) return 0;
    return Math.min((current / target) * 100, 100);
  }

  monthsToGoal(): number {
    const { target, current, monthly } = this.savingsForm.getRawValue();
    const remaining = target - current;
    if (remaining <= 0) return 0;
    if (!monthly || monthly <= 0) return Infinity;
    return Math.ceil(remaining / monthly);
  }
}
