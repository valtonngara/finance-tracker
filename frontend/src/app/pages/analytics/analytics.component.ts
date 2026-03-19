import { Component, inject, OnInit, OnDestroy, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { ApiService } from '@app/core/api.service';
import { MonthlyBreakdown, CategoryBreakdown } from '@app/models/analytics.model';
import { Transaction } from '@app/models/transaction.model';
import { forkJoin } from 'rxjs';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('fadeUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(16px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Analytics</h1>
      </div>

      @if (loading()) {
        <div class="grid grid-2">
          @for (i of [1,2,3,4]; track i) {
            <div class="glass-card-static" style="padding: 24px;">
              <div class="skeleton" style="width: 40%; height: 16px; margin-bottom: 16px;"></div>
              <div class="skeleton" style="height: 200px;"></div>
            </div>
          }
        </div>
      } @else {
        <div class="grid grid-2" @fadeUp>
          <!-- Monthly Spending Bar Chart -->
          <div class="glass-card-static" style="padding: 24px;">
            <h3 style="margin-bottom: 16px;">Monthly Spending</h3>
            <div class="chart-container">
              <canvas #barChart></canvas>
            </div>
          </div>

          <!-- Category Donut -->
          <div class="glass-card-static" style="padding: 24px;">
            <h3 style="margin-bottom: 16px;">By Category</h3>
            <div class="chart-container" style="max-height: 300px; display: flex; justify-content: center;">
              <canvas #donutChart></canvas>
            </div>
          </div>

          <!-- Income vs Expenses Comparison -->
          <div class="glass-card-static" style="padding: 24px;">
            <h3 style="margin-bottom: 16px;">Income vs Expenses</h3>
            <div class="chart-container">
              <canvas #comparisonChart></canvas>
            </div>
          </div>

          <!-- Spending Heatmap -->
          <div class="glass-card-static" style="padding: 24px;">
            <h3 style="margin-bottom: 16px;">Spending by Day of Week</h3>
            <div class="heatmap-grid">
              @for (day of heatmapData; track day.label) {
                <div class="heatmap-row">
                  <span class="heatmap-label">{{ day.label }}</span>
                  <div class="heatmap-cells">
                    @for (week of day.weeks; track $index) {
                      <div
                        class="heatmap-cell"
                        [style.background]="getCellColor(week)"
                        [title]="'$' + week.toFixed(0)"
                      ></div>
                    }
                  </div>
                  <span class="heatmap-value text-secondary">{{ day.total | currency:'USD':'symbol':'1.0-0' }}</span>
                </div>
              }
            </div>
            <div class="heatmap-legend mt-2">
              <span class="text-muted" style="font-size: 0.75rem;">Less</span>
              <div class="legend-cells">
                @for (level of [0, 0.25, 0.5, 0.75, 1]; track level) {
                  <div class="heatmap-cell" [style.background]="getCellColor(level * maxDaySpend)"></div>
                }
              </div>
              <span class="text-muted" style="font-size: 0.75rem;">More</span>
            </div>
          </div>
        </div>

        <!-- Trend Line -->
        <div class="glass-card-static mt-3" style="padding: 24px;" @fadeUp>
          <h3 style="margin-bottom: 16px;">3-Month Moving Average</h3>
          <div class="chart-container">
            <canvas #trendChart></canvas>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .heatmap-grid {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .heatmap-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .heatmap-label {
      width: 36px;
      font-size: 0.75rem;
      color: var(--text-muted);
      text-align: right;
      flex-shrink: 0;
    }

    .heatmap-cells {
      display: flex;
      gap: 4px;
      flex: 1;
    }

    .heatmap-cell {
      width: 28px;
      height: 28px;
      border-radius: 4px;
      transition: transform 0.15s ease;
      cursor: pointer;

      &:hover {
        transform: scale(1.2);
      }
    }

    .heatmap-value {
      width: 60px;
      font-size: 0.75rem;
      text-align: right;
      flex-shrink: 0;
    }

    .heatmap-legend {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: center;
    }

    .legend-cells {
      display: flex;
      gap: 3px;

      .heatmap-cell {
        width: 16px;
        height: 16px;

        &:hover { transform: none; }
      }
    }
  `]
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  private api = inject(ApiService);

  @ViewChild('barChart') barChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('donutChart') donutChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('comparisonChart') comparisonChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('trendChart') trendChartRef!: ElementRef<HTMLCanvasElement>;

  loading = signal(true);
  monthly = signal<MonthlyBreakdown[]>([]);
  categories = signal<CategoryBreakdown[]>([]);
  transactions = signal<Transaction[]>([]);

  heatmapData: { label: string; weeks: number[]; total: number }[] = [];
  maxDaySpend = 0;
  private charts: Chart[] = [];

  ngOnInit(): void {
    forkJoin({
      monthly: this.api.getMonthlyBreakdown(),
      categories: this.api.getCategoryBreakdown(),
      transactions: this.api.getTransactions()
    }).subscribe({
      next: (data) => {
        this.monthly.set(data.monthly);
        this.categories.set(data.categories);
        this.transactions.set(data.transactions);
        this.buildHeatmap(data.transactions);
        this.loading.set(false);
        setTimeout(() => this.createCharts(), 50);
      },
      error: () => this.loading.set(false)
    });
  }

  ngOnDestroy(): void {
    this.charts.forEach(c => c.destroy());
  }

  getCellColor(value: number): string {
    if (this.maxDaySpend === 0) return 'rgba(0, 212, 255, 0.05)';
    const intensity = Math.min(value / this.maxDaySpend, 1);
    return `rgba(0, 212, 255, ${0.05 + intensity * 0.7})`;
  }

  private buildHeatmap(txs: Transaction[]): void {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayTotals: number[][] = days.map(() => [0, 0, 0, 0]);

    txs.filter(t => t.type === 'expense').forEach(t => {
      const d = new Date(t.date);
      const dayOfWeek = d.getDay();
      const weekOfMonth = Math.floor(d.getDate() / 7);
      const weekIdx = Math.min(weekOfMonth, 3);
      dayTotals[dayOfWeek][weekIdx] += t.amount;
    });

    let max = 0;
    dayTotals.forEach(weeks => weeks.forEach(v => { if (v > max) max = v; }));
    this.maxDaySpend = max;

    this.heatmapData = days.map((label, i) => ({
      label,
      weeks: dayTotals[i],
      total: dayTotals[i].reduce((a, b) => a + b, 0)
    }));
  }

  private createCharts(): void {
    const months = this.monthly();
    const cats = this.categories();
    const chartColors = ['#00d4ff', '#00e68a', '#ff4d6a', '#ffb800', '#a855f7', '#f472b6', '#38bdf8', '#fb923c', '#4ade80', '#e879f9'];

    // Bar chart
    if (this.barChartRef?.nativeElement) {
      this.charts.push(new Chart(this.barChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: months.map(m => m.month),
          datasets: [{
            label: 'Expenses',
            data: months.map(m => m.expenses),
            backgroundColor: 'rgba(255, 77, 106, 0.6)',
            borderColor: '#ff4d6a',
            borderWidth: 1,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          animation: { duration: 1200, easing: 'easeOutQuart' },
          plugins: { legend: { labels: { color: '#94a3b8' } } },
          scales: {
            x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.04)' } },
            y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.04)' } }
          }
        }
      }));
    }

    // Donut
    if (this.donutChartRef?.nativeElement) {
      this.charts.push(new Chart(this.donutChartRef.nativeElement, {
        type: 'doughnut',
        data: {
          labels: cats.map(c => c.category),
          datasets: [{ data: cats.map(c => c.total), backgroundColor: chartColors.slice(0, cats.length), borderWidth: 0 }]
        },
        options: {
          responsive: true,
          cutout: '65%',
          animation: { duration: 1200 },
          plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 12, usePointStyle: true } } }
        }
      }));
    }

    // Comparison
    if (this.comparisonChartRef?.nativeElement) {
      this.charts.push(new Chart(this.comparisonChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: months.map(m => m.month),
          datasets: [
            { label: 'Income', data: months.map(m => m.income), backgroundColor: 'rgba(0, 230, 138, 0.6)', borderColor: '#00e68a', borderWidth: 1, borderRadius: 6 },
            { label: 'Expenses', data: months.map(m => m.expenses), backgroundColor: 'rgba(255, 77, 106, 0.6)', borderColor: '#ff4d6a', borderWidth: 1, borderRadius: 6 }
          ]
        },
        options: {
          responsive: true,
          animation: { duration: 1200 },
          plugins: { legend: { labels: { color: '#94a3b8' } } },
          scales: {
            x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.04)' } },
            y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.04)' } }
          }
        }
      }));
    }

    // Trend line with moving average
    if (this.trendChartRef?.nativeElement) {
      const expenseData = months.map(m => m.expenses);
      const movingAvg: (number | null)[] = expenseData.map((_, i) => {
        if (i < 2) return null;
        return (expenseData[i] + expenseData[i - 1] + expenseData[i - 2]) / 3;
      });

      this.charts.push(new Chart(this.trendChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: months.map(m => m.month),
          datasets: [
            {
              label: 'Expenses',
              data: expenseData,
              borderColor: '#ff4d6a',
              backgroundColor: 'rgba(255, 77, 106, 0.1)',
              fill: true,
              tension: 0.3,
              pointRadius: 4
            },
            {
              label: '3-Month Avg',
              data: movingAvg,
              borderColor: '#00d4ff',
              borderDash: [6, 4],
              tension: 0.3,
              pointRadius: 3,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          animation: { duration: 1500 },
          plugins: { legend: { labels: { color: '#94a3b8' } } },
          scales: {
            x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.04)' } },
            y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.04)' } }
          }
        }
      }));
    }
  }
}
