import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { ApiService } from '@app/core/api.service';
import { AuthService } from '@app/core/auth.service';
import { ToastService } from '@app/shared/toast.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  animations: [
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
        <h1>Settings</h1>
      </div>

      @if (loading()) {
        <div class="glass-card-static" style="padding: 32px;">
          @for (i of [1,2,3]; track i) {
            <div class="skeleton" style="height: 48px; margin-bottom: 16px;"></div>
          }
        </div>
      } @else {
        <div class="settings-grid" @fadeUp>
          <!-- Profile -->
          <div class="glass-card-static" style="padding: 32px;">
            <h2 style="font-size: 1.25rem; margin-bottom: 24px;">Profile</h2>
            <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
              <div class="form-group">
                <label>Name</label>
                <input type="text" class="form-input" formControlName="name" />
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" class="form-input" formControlName="email" />
              </div>
              <div class="form-group">
                <label>Currency</label>
                <select class="form-select" formControlName="currency">
                  @for (c of currencies; track c) {
                    <option [value]="c">{{ c }}</option>
                  }
                </select>
              </div>
              <button type="submit" class="btn btn-primary ripple" [disabled]="profileForm.invalid || savingProfile()">
                {{ savingProfile() ? 'Saving...' : 'Save Profile' }}
              </button>
            </form>
          </div>

          <!-- Change Password -->
          <div class="glass-card-static" style="padding: 32px;">
            <h2 style="font-size: 1.25rem; margin-bottom: 24px;">Change Password</h2>
            <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
              <div class="form-group">
                <label>Current Password</label>
                <input type="password" class="form-input" formControlName="currentPassword" />
              </div>
              <div class="form-group">
                <label>New Password</label>
                <input type="password" class="form-input" formControlName="newPassword" />
                @if (passwordForm.controls.newPassword.invalid && passwordForm.controls.newPassword.touched) {
                  <span class="error-text">Min 6 characters</span>
                }
              </div>
              <button type="submit" class="btn btn-secondary ripple" [disabled]="passwordForm.invalid || savingPassword()">
                {{ savingPassword() ? 'Updating...' : 'Update Password' }}
              </button>
            </form>
          </div>

          <!-- Export Data -->
          <div class="glass-card-static" style="padding: 32px;">
            <h2 style="font-size: 1.25rem; margin-bottom: 16px;">Export Data</h2>
            <p class="text-secondary" style="margin-bottom: 20px;">Download all your transactions as a CSV file.</p>
            <button class="btn btn-secondary ripple" (click)="exportCSV()">
              &#128190; Export CSV
            </button>
          </div>

          <!-- Danger Zone -->
          <div class="glass-card-static" style="padding: 32px; border-color: rgba(255, 77, 106, 0.2);">
            <h2 style="font-size: 1.25rem; margin-bottom: 16px; color: var(--red);">Danger Zone</h2>
            <p class="text-secondary" style="margin-bottom: 20px;">Log out of your account.</p>
            <button class="btn btn-danger ripple" (click)="logout()">Logout</button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .settings-grid {
      display: flex;
      flex-direction: column;
      gap: 24px;
      max-width: 640px;
    }
  `]
})
export class SettingsComponent implements OnInit {
  private api = inject(ApiService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'ALL'];
  loading = signal(true);
  savingProfile = signal(false);
  savingPassword = signal(false);

  profileForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: [{ value: '', disabled: true }],
    currency: ['USD']
  });

  passwordForm = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit(): void {
    this.api.getUserSettings().subscribe({
      next: (user) => {
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
          currency: user.currency || 'USD'
        });
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    this.savingProfile.set(true);
    const { name, currency } = this.profileForm.getRawValue();
    this.api.updateUserSettings({ name, currency }).subscribe({
      next: () => {
        this.toast.success('Profile updated');
        this.savingProfile.set(false);
      },
      error: () => {
        this.toast.error('Failed to update profile');
        this.savingProfile.set(false);
      }
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;
    this.savingPassword.set(true);
    const { currentPassword, newPassword } = this.passwordForm.getRawValue();
    this.api.updatePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.toast.success('Password updated');
        this.savingPassword.set(false);
        this.passwordForm.reset();
      },
      error: (err) => {
        this.toast.error(err.error?.detail || 'Failed to update password');
        this.savingPassword.set(false);
      }
    });
  }

  exportCSV(): void {
    const token = this.authService.getToken();
    const url = `${environment.apiUrl}/settings/export`;
    // Trigger download via a hidden link
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.blob())
      .then(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'transactions.csv';
        a.click();
        URL.revokeObjectURL(a.href);
        this.toast.success('Export downloaded');
      })
      .catch(() => this.toast.error('Failed to export'));
  }

  logout(): void {
    this.authService.logout();
  }
}
