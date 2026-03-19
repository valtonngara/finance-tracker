import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { ApiService } from '@app/core/api.service';
import { ToastService } from '@app/shared/toast.service';
import { Transaction, TransactionCreate, TransactionFilters } from '@app/models/transaction.model';

const CATEGORIES = [
  'Food', 'Transport', 'Housing', 'Health', 'Entertainment',
  'Shopping', 'Salary', 'Freelance', 'Investment', 'Other'
];

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  animations: [
    trigger('rowAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-12px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(12px)' }))
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
        <h1>Transactions</h1>
        <div class="page-actions">
          <button class="btn btn-primary ripple" (click)="openModal()">+ Add Transaction</button>
        </div>
      </div>

      <!-- Filters -->
      <div class="glass-card-static filters-bar">
        <input
          type="text"
          class="form-input"
          placeholder="Search transactions..."
          [(ngModel)]="filters.search"
          (input)="loadTransactions()"
          style="max-width: 280px;"
        />
        <select class="form-select" [(ngModel)]="filters.category" (change)="loadTransactions()" style="max-width: 180px;">
          <option value="">All Categories</option>
          @for (cat of categories; track cat) {
            <option [value]="cat">{{ cat }}</option>
          }
        </select>
        <input type="date" class="form-input" [(ngModel)]="filters.start_date" (change)="loadTransactions()" style="max-width: 170px;" />
        <input type="date" class="form-input" [(ngModel)]="filters.end_date" (change)="loadTransactions()" style="max-width: 170px;" />
      </div>

      <!-- Table -->
      @if (loading()) {
        <div class="glass-card-static mt-2" style="padding: 24px;">
          @for (i of [1,2,3,4,5]; track i) {
            <div class="skeleton" style="height: 48px; margin-bottom: 8px;"></div>
          }
        </div>
      } @else {
        <div class="glass-card-static mt-2" style="padding: 0; overflow: hidden;">
          @if (transactions().length === 0) {
            <p class="text-muted" style="padding: 40px; text-align: center;">No transactions found</p>
          } @else {
            <table class="data-table">
              <thead>
                <tr>
                  <th (click)="sort('date')">Date {{ sortIcon('date') }}</th>
                  <th (click)="sort('description')">Description {{ sortIcon('description') }}</th>
                  <th (click)="sort('category')">Category {{ sortIcon('category') }}</th>
                  <th (click)="sort('amount')" style="text-align:right">Amount {{ sortIcon('amount') }}</th>
                  <th style="width: 100px;">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (tx of transactions(); track tx.id) {
                  <tr @rowAnim>
                    <td class="text-secondary">{{ tx.date | date:'mediumDate' }}</td>
                    <td>{{ tx.description }}</td>
                    <td>
                      <span class="badge" [class]="tx.type === 'income' ? 'badge badge-income' : 'badge badge-expense'">
                        {{ tx.category }}
                      </span>
                    </td>
                    <td style="text-align:right" [class]="tx.type === 'income' ? 'amount-income' : 'amount-expense'">
                      {{ tx.type === 'income' ? '+' : '-' }}{{ tx.amount | currency:'USD':'symbol':'1.2-2' }}
                    </td>
                    <td>
                      <div class="action-btns">
                        <button class="btn btn-ghost btn-sm" (click)="openModal(tx)">Edit</button>
                        <button class="btn btn-danger btn-sm" (click)="deleteTransaction(tx)">Del</button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          }
        </div>
      }

      <!-- FAB for mobile -->
      <button class="fab" (click)="openModal()">+</button>

      <!-- Modal -->
      @if (showModal()) {
        <div class="modal-overlay" @modalAnim (click)="closeModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ editingTransaction() ? 'Edit' : 'Add' }} Transaction</h2>
              <button class="close-btn" (click)="closeModal()">&times;</button>
            </div>

            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="form-group">
                <label>Type</label>
                <div class="type-toggle">
                  <button
                    type="button"
                    class="toggle-btn"
                    [class.active-expense]="form.value.type === 'expense'"
                    (click)="form.patchValue({type: 'expense'})"
                  >Expense</button>
                  <button
                    type="button"
                    class="toggle-btn"
                    [class.active-income]="form.value.type === 'income'"
                    (click)="form.patchValue({type: 'income'})"
                  >Income</button>
                </div>
              </div>

              <div class="form-group">
                <label for="m-amount">Amount</label>
                <input id="m-amount" type="number" step="0.01" class="form-input" formControlName="amount" placeholder="0.00" />
                @if (form.controls.amount.invalid && form.controls.amount.touched) {
                  <span class="error-text">Amount must be greater than 0</span>
                }
              </div>

              <div class="form-group">
                <label for="m-desc">Description</label>
                <input id="m-desc" type="text" class="form-input" formControlName="description" placeholder="What was this for?" />
                @if (form.controls.description.invalid && form.controls.description.touched) {
                  <span class="error-text">Description is required</span>
                }
              </div>

              <div class="form-group">
                <label for="m-cat">Category</label>
                <select id="m-cat" class="form-select" formControlName="category">
                  @for (cat of categories; track cat) {
                    <option [value]="cat">{{ cat }}</option>
                  }
                </select>
              </div>

              <div class="form-group">
                <label for="m-date">Date</label>
                <input id="m-date" type="date" class="form-input" formControlName="date" />
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary ripple" [disabled]="form.invalid || submitting()">
                  {{ submitting() ? 'Saving...' : (editingTransaction() ? 'Update' : 'Add') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .filters-bar {
      display: flex;
      gap: 12px;
      padding: 16px 20px;
      flex-wrap: wrap;
      align-items: center;
    }

    .action-btns {
      display: flex;
      gap: 6px;
    }

    .type-toggle {
      display: flex;
      gap: 8px;
    }

    .toggle-btn {
      flex: 1;
      padding: 10px;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--bg-input);
      color: var(--text-secondary);
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;

      &.active-expense {
        background: var(--red-soft);
        color: var(--red);
        border-color: var(--red);
      }

      &.active-income {
        background: var(--green-soft);
        color: var(--green);
        border-color: var(--green);
      }
    }
  `]
})
export class TransactionsComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  categories = CATEGORIES;
  loading = signal(true);
  transactions = signal<Transaction[]>([]);
  showModal = signal(false);
  editingTransaction = signal<Transaction | null>(null);
  submitting = signal(false);

  filters: TransactionFilters = {};
  private currentSort = 'date';
  private currentOrder: 'asc' | 'desc' = 'desc';

  form = this.fb.nonNullable.group({
    type: ['expense' as 'income' | 'expense'],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    description: ['', [Validators.required]],
    category: ['Food'],
    date: [new Date().toISOString().split('T')[0]]
  });

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    const filters: TransactionFilters = {
      ...this.filters,
      sort_by: this.currentSort,
      sort_order: this.currentOrder
    };
    this.api.getTransactions(filters).subscribe({
      next: (txs) => {
        this.transactions.set(txs);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  sort(field: string): void {
    if (this.currentSort === field) {
      this.currentOrder = this.currentOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort = field;
      this.currentOrder = 'desc';
    }
    this.loadTransactions();
  }

  sortIcon(field: string): string {
    if (this.currentSort !== field) return '';
    return this.currentOrder === 'asc' ? '\u25B2' : '\u25BC';
  }

  openModal(tx?: Transaction): void {
    if (tx) {
      this.editingTransaction.set(tx);
      this.form.patchValue({
        type: tx.type,
        amount: tx.amount,
        description: tx.description,
        category: tx.category,
        date: tx.date
      });
    } else {
      this.editingTransaction.set(null);
      this.form.reset({
        type: 'expense',
        amount: 0,
        description: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0]
      });
    }
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingTransaction.set(null);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);
    const data = this.form.getRawValue() as TransactionCreate;
    const editing = this.editingTransaction();

    if (editing) {
      this.api.updateTransaction(editing.id, data).subscribe({
        next: () => {
          this.toast.success('Transaction updated');
          this.closeModal();
          this.submitting.set(false);
          this.loadTransactions();
        },
        error: (err) => {
          this.submitting.set(false);
          this.toast.error(err.error?.detail || 'Failed to update');
        }
      });
    } else {
      this.api.createTransaction(data).subscribe({
        next: () => {
          this.toast.success('Transaction added');
          this.closeModal();
          this.submitting.set(false);
          this.loadTransactions();
        },
        error: (err) => {
          this.submitting.set(false);
          this.toast.error(err.error?.detail || 'Failed to add');
        }
      });
    }
  }

  deleteTransaction(tx: Transaction): void {
    if (!confirm('Delete this transaction?')) return;
    this.api.deleteTransaction(tx.id).subscribe({
      next: () => {
        this.toast.success('Transaction deleted');
        this.loadTransactions();
      },
      error: () => this.toast.error('Failed to delete')
    });
  }
}
