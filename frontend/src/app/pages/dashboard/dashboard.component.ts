import { Component, inject, OnInit, signal, OnDestroy, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { ApiService } from '@app/core/api.service';
import { Summary, MonthlyBreakdown, CategoryBreakdown } from '@app/models/analytics.model';
import { Transaction } from '@app/models/transaction.model';
import { forkJoin } from 'rxjs';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  animations: [
    trigger('cardStagger', [
      transition(':enter', [
        query('.summary-card', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('fadeUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(16px)' }),
        animate('400ms 200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Dashboard</h1>
      </div>

      @if (loading()) {
        <div class="grid grid-4">
          @for (i of [1,2,3,4]; track i) {
            <div class="glass-card-static" style="padding: 24px;">
              <div class="skeleton" style="width: 60%; height: 14px; margin-bottom: 12px;"></div>
              <div class="skeleton" style="width: 80%; height: 32px; margin-bottom: 8px;"></div>
            </div>
          }
        </div>
      } @else {
        <div class="grid grid-4" @cardStagger>
          <div class="summary-card glass-card" style="padding: 24px;">
            <span class="card-label text-secondary">Total Balance</span>
            <span class="stat-number" [class]="summary()!.balance >= 0 ? 'text-green' : 'text-red'">
              {{ animatedBalance() | currency:'USD':'symbol':'1.0-0' }}
            </span>
          </div>
          <div class="summary-card glass-card" style="padding: 24px;">
            <span class="card-label text-secondary">Income</span>
            <span class="stat-number text-green">
              {{ animatedIncome() | currency:'USD':'symbol':'1.0-0' }}
            </span>
          </div>
          <div class="summary-card glass-card" style="padding: 24px;">
            <span class="card-label text-secondary">Expenses</span>
            <span class="stat-number text-red">
              {{ animatedExpenses() | currency:'USD':'symbol':'1.0-0' }}
            </span>
          </div>
          <div class="summary-card glass-card" style="padding: 24px;">
            <span class="card-label text-secondary">Savings Rate</span>
            <span class="stat-number text-accent">
              {{ animatedSavings() | number:'1.0-0' }}%
            </span>
          </div>
        </div>

        <div class="grid grid-2 mt-3" @fadeUp>
          <div class="glass-card-static" style="padding: 24px;">
            <h3 style="margin-bottom: 16px;">Monthly Trend</h3>
            <div class="chart-container">
              <canvas #trendChart></canvas>
            </div>
          </div>
          <div class="glass-card-static" style="padding: 24px;">
            <h3 style="margin-bottom: 16px;">Spending by Category</h3>
            <div class="chart-container" style="max-height: 280px; display:flex; justify-content:center;">
              <canvas #donutChart></canvas>
            </div>
          </div>
        </div>

        <div class="glass-card-static mt-3" style="padding: 24px;" @fadeUp>
          <div class="flex items-center justify-between mb-2">
            <h3>Recent Transactions</h3>
            <a routerLink="/transactions" class="btn btn-ghost btn-sm">View All &#8594;</a>
          </div>
          @if (recentTransactions().length === 0) {
            <p class="text-muted" style="padding: 20px 0; text-align: center;">No transactions yet. Add your first one!</p>
          } @else {
            <table class="data-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th style="text-align:right">Amount</th>
                </tr>
              </thead>
              <tbody>
                @for (tx of recentTransactions().slice(0, 7); track tx.id) {
                  <tr>
                    <td>{{ tx.description }}</td>
                    <td><span class="badge" [class]="tx.type === 'income' ? 'badge badge-income' : 'badge badge-expense'">{{ tx.category }}</span></td>
                    <td class="text-secondary">{{ tx.date | date:'mediumDate' }}</td>
                    <td style="text-align:right" [class]="tx.type === 'income' ? 'amount-income' : 'amount-expense'">
                      {{ tx.type === 'income' ? '+' : '-' }}{{ tx.amount | currency:'USD':'symbol':'1.2-2' }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          }
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
      margin-bottom: 8px;
    }
  `]
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  private api = inject(ApiService);

  @ViewChild('trendChart') trendChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('donutChart') donutChartRef!: ElementRef<HTMLCanvasElement>;

  loading = signal(true);
  summary = signal<Summary | null>(null);
  monthly = signal<MonthlyBreakdown[]>([]);
  categories = signal<CategoryBreakdown[]>([]);
  recentTransactions = signal<Transaction[]>([]);

  animatedBalance = signal(0);
  animatedIncome = signal(0);
  animatedExpenses = signal(0);
  animatedSavings = signal(0);

  private charts: Chart[] = [];
  private animFrames: number[] = [];

  ngOnInit(): void {
    forkJoin({
      summary: this.api.getSummary(),
      monthly: this.api.getMonthlyBreakdown(),
      categories: this.api.getCategoryBreakdown(),
      transactions: this.api.getTransactions()
    }).subscribe({
      next: (data) => {
        this.summary.set(data.summary);
        this.monthly.set(data.monthly);
        this.categories.set(data.categories);
        this.recentTransactions.set(data.transactions);
        this.loading.set(false);
        this.animateNumbers(data.summary);
        setTimeout(() => this.createCharts(), 50);
      },
      error: () => this.loading.set(false)
    });
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.charts.forEach(c => c.destroy());
    this.animFrames.forEach(f => cancelAnimationFrame(f));
  }

  private animateNumbers(s: Summary): void {
    this.countUp(this.animatedBalance, s.balance, 1000);
    this.countUp(this.animatedIncome, s.total_income, 1000);
    this.countUp(this.animatedExpenses, s.total_expenses, 1000);
    this.countUp(this.animatedSavings, s.savings_rate, 800);
  }

  private countUp(sig: ReturnType<typeof signal<number>>, target: number, duration: number): void {
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      sig.set(Math.round(target * eased));
      if (progress < 1) {
        this.animFrames.push(requestAnimationFrame(step));
      }
    };
    this.animFrames.push(requestAnimationFrame(step));
  }

  private createCharts(): void {
    if (this.trendChartRef?.nativeElement) {
      const months = this.monthly();
      const chart = new Chart(this.trendChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: months.map(m => m.month),
          datasets: [
            {
              label: 'Income',
              data: months.map(m => m.income),
              borderColor: '#00e68a',
              backgroundColor: 'rgba(0, 230, 138, 0.1)',
              fill: true,
              tension: 0.4,
              pointRadius: 4,
              pointHoverRadius: 6
            },
            {
              label: 'Expenses',
              data: months.map(m => m.expenses),
              borderColor: '#ff4d6a',
              backgroundColor: 'rgba(255, 77, 106, 0.1)',
              fill: true,
              tension: 0.4,
              pointRadius: 4,
              pointHoverRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          animation: { duration: 1200, easing: 'easeOutQuart' },
          plugins: {
            legend: { labels: { color: '#94a3b8', font: { family: 'Inter' } } }
          },
          scales: {
            x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.04)' } },
            y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.04)' } }
          }
        }
      });
      this.charts.push(chart);
    }

    if (this.donutChartRef?.nativeElement) {
      const cats = this.categories();
      const colors = ['#00d4ff', '#00e68a', '#ff4d6a', '#ffb800', '#a855f7', '#f472b6', '#38bdf8', '#fb923c', '#4ade80', '#e879f9'];
      const chart = new Chart(this.donutChartRef.nativeElement, {
        type: 'doughnut',
        data: {
          labels: cats.map(c => c.category),
          datasets: [{
            data: cats.map(c => c.total),
            backgroundColor: colors.slice(0, cats.length),
            borderWidth: 0,
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          cutout: '65%',
          animation: { duration: 1200, easing: 'easeOutQuart' },
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 }, padding: 16, usePointStyle: true }
            }
          }
        }
      });
      this.charts.push(chart);
    }
  }
}
