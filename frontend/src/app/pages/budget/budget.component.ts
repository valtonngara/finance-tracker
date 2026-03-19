import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { ApiService } from '@app/core/api.service';
import { ToastService } from '@app/shared/toast.service';
import { Budget } from '@app/models/budget.model';

const CATEGORIES = [
  'Food', 'Transport', 'Housing', 'Health', 'Entertainment',
  'Shopping', 'Salary', 'Freelance', 'Investment', 'Other'
];

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  animations: [
    trigger('listStagger', [
      transition(':enter', [
        query('.budget-item', [
          style({ opacity: 0, transform: 'translateY(12px)' }),
          stagger(80, [
            animate('350ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('modalAnim', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Budget</h1>
        <div class="page-actions">
          <button class="btn btn-primary ripple" (click)="openModal()">+ Set Budget</button>
        </div>
      </div>

      @if (loading()) {
        <div class="budget-list">
          @for (i of [1,2,3,4]; track i) {
            <div class="glass-card-static" style="padding: 24px;">
              <div class="skeleton" style="width: 40%; height: 16px; margin-bottom: 12px;"></div>
              <div class="skeleton" style="height: 8px; margin-bottom: 8px;"></div>
              <div class="skeleton" style="width: 60%; height: 14px;"></div>
            </div>
          }
        </div>
      } @else if (budgets().length === 0) {
        <div class="glass-card-static" style="padding: 60px; text-align: center;">
          <p class="text-muted" style="font-size: 1.125rem; margin-bottom: 16px;">No budgets set yet</p>
          <button class="btn btn-primary ripple" (click)="openModal()">Create Your First Budget</button>
        </div>
      } @else {
        <!-- Summary card -->
        <div class="glass-card-static summary-strip">
          <div class="summary-item">
            <span class="text-secondary">Total Budget</span>
            <span class="stat-number text-accent" style="font-size: 1.5rem;">{{ totalBudget() | currency:'USD':'symbol':'1.0-0' }}</span>
          </div>
          <div class="summary-item">
            <span class="text-secondary">Total Spent</span>
            <span class="stat-number text-red" style="font-size: 1.5rem;">{{ totalSpent() | currency:'USD':'symbol':'1.0-0' }}</span>
          </div>
          <div class="summary-item">
            <span class="text-secondary">Remaining</span>
            <span class="stat-number" style="font-size: 1.5rem;" [class]="totalBudget() - totalSpent() >= 0 ? 'text-green' : 'text-red'">
              {{ totalBudget() - totalSpent() | currency:'USD':'symbol':'1.0-0' }}
            </span>
          </div>
          <div class="summary-item">
            <span class="text-secondary">Projected End-of-Month</span>
            <span class="stat-number" style="font-size: 1.5rem;" [class]="projectedSpend() <= totalBudget() ? 'text-green' : 'text-red'">
              {{ projectedSpend() | currency:'USD':'symbol':'1.0-0' }}
            </span>
          </div>
        </div>

        <div class="budget-list mt-3" @listStagger>
          @for (budget of budgets(); track budget.id) {
            <div class="budget-item glass-card" style="padding: 24px;">
              <div class="budget-header">
                <div>
                  <h3>{{ budget.category }}</h3>
                  <span class="text-secondary" style="font-size: 0.875rem;">{{ budget.month }}</span>
                </div>
                <div class="budget-amounts">
                  <span [class]="getStatusClass(budget)">
                    {{ (budget.spent || 0) | currency:'USD':'symbol':'1.0-0' }}
                  </span>
                  <span class="text-muted"> / {{ budget.amount | currency:'USD':'symbol':'1.0-0' }}</span>
                </div>
              </div>
              <div class="progress-bar" style="margin-top: 12px;">
                <div
                  class="progress-fill"
                  [class]="getBarColorClass(budget)"
                  [style.width.%]="getProgress(budget)"
                ></div>
              </div>
              <div class="budget-footer">
                <span class="text-muted" style="font-size: 0.8125rem;">
                  {{ getProgress(budget) | number:'1.0-0' }}% used
                </span>
                <button class="btn btn-ghost btn-sm" (click)="openModal(budget)">Edit</button>
              </div>
            </div>
          }
        </div>
      }

      <!-- Modal -->
      @if (showModal()) {
        <div class="modal-overlay" @modalAnim (click)="closeModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ editing() ? 'Edit' : 'Set' }} Budget</h2>
              <button class="close-btn" (click)="closeModal()">&times;</button>
            </div>
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="form-group">
                <label>Category</label>
                <select class="form-select" formControlName="category">
                  @for (cat of categories; track cat) {
                    <option [value]="cat">{{ cat }}</option>
                  }
                </select>
              </div>
              <div class="form-group">
                <label>Monthly Budget Amount</label>
                <input type="number" step="1" class="form-input" formControlName="amount" placeholder="500" />
                @if (form.controls.amount.invalid && form.controls.amount.touched) {
                  <span class="error-text">Amount must be greater than 0</span>
                }
              </div>
              <div class="form-group">
                <label>Month</label>
                <input type="month" class="form-input" formControlName="month" />
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary ripple" [disabled]="form.invalid">Save</button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .budget-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .budget-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .budget-amounts {
      font-size: 1.125rem;
      font-weight: 600;
    }

    .budget-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
    }

    .summary-strip {
      display: flex;
      gap: 32px;
      padding: 24px 32px;
      flex-wrap: wrap;
    }

    .summary-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 0.8125rem;
    }
  `]
})
export class BudgetComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  categories = CATEGORIES;
  loading = signal(true);
  budgets = signal<Budget[]>([]);
  showModal = signal(false);
  editing = signal<Budget | null>(null);

  totalBudget = signal(0);
  totalSpent = signal(0);
  projectedSpend = signal(0);

  form = this.fb.nonNullable.group({
    category: ['Food'],
    amount: [0, [Validators.required, Validators.min(1)]],
    month: [new Date().toISOString().slice(0, 7)]
  });

  ngOnInit(): void {
    this.loadBudgets();
  }

  loadBudgets(): void {
    this.api.getBudgets().subscribe({
      next: (budgets) => {
        this.budgets.set(budgets);
        const tb = budgets.reduce((s, b) => s + b.amount, 0);
        const ts = budgets.reduce((s, b) => s + (b.spent || 0), 0);
        this.totalBudget.set(tb);
        this.totalSpent.set(ts);
        // Project end-of-month based on daily rate
        const today = new Date();
        const dayOfMonth = today.getDate();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        this.projectedSpend.set(Math.round(ts / dayOfMonth * daysInMonth));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getProgress(b: Budget): number {
    if (!b.amount) return 0;
    return Math.min(((b.spent || 0) / b.amount) * 100, 100);
  }

  getBarColorClass(b: Budget): string {
    const pct = this.getProgress(b);
    if (pct >= 90) return 'red';
    if (pct >= 70) return 'amber';
    return 'green';
  }

  getStatusClass(b: Budget): string {
    const pct = this.getProgress(b);
    if (pct >= 90) return 'text-red';
    if (pct >= 70) return 'text-amber';
    return 'text-green';
  }

  openModal(budget?: Budget): void {
    if (budget) {
      this.editing.set(budget);
      this.form.patchValue({ category: budget.category, amount: budget.amount, month: budget.month });
    } else {
      this.editing.set(null);
      this.form.reset({ category: 'Food', amount: 0, month: new Date().toISOString().slice(0, 7) });
    }
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editing.set(null);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const data = this.form.getRawValue();
    const ed = this.editing();

    if (ed) {
      this.api.updateBudget(ed.id, data).subscribe({
        next: () => {
          this.toast.success('Budget updated');
          this.closeModal();
          this.loadBudgets();
        },
        error: () => this.toast.error('Failed to update budget')
      });
    } else {
      this.api.createBudget(data).subscribe({
        next: () => {
          this.toast.success('Budget created');
          this.closeModal();
          this.loadBudgets();
        },
        error: (err) => this.toast.error(err.error?.detail || 'Failed to create budget')
      });
    }
  }
}
