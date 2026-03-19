import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '@app/core/auth.service';
import { ToastService } from '@app/shared/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
  template: `
    <div class="auth-page">
      <div class="auth-card glass-card-static" [@fadeIn]>
        <div class="auth-header">
          <div class="logo">
            <span class="logo-icon">&#9670;</span>
            <span class="logo-text">Expensera</span>
          </div>
          <h1>Create account</h1>
          <p class="text-secondary">Start tracking your finances</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input
              id="name"
              type="text"
              class="form-input"
              formControlName="name"
              placeholder="John Doe"
            />
            @if (form.controls.name.invalid && form.controls.name.touched) {
              <span class="error-text">Name is required</span>
            }
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              class="form-input"
              formControlName="email"
              placeholder="you&#64;example.com"
            />
            @if (form.controls.email.invalid && form.controls.email.touched) {
              <span class="error-text">Valid email is required</span>
            }
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              class="form-input"
              formControlName="password"
              placeholder="Min 6 characters"
            />
            @if (form.controls.password.invalid && form.controls.password.touched) {
              <span class="error-text">Password must be at least 6 characters</span>
            }
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-lg w-full ripple"
            [disabled]="form.invalid || loading"
          >
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <p class="auth-footer text-secondary">
          Already have an account? <a routerLink="/login">Sign in</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: radial-gradient(ellipse at 50% 0%, rgba(0, 212, 255, 0.08) 0%, transparent 60%);
    }

    .auth-card {
      width: 100%;
      max-width: 440px;
      padding: 40px;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 32px;

      .logo {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin-bottom: 24px;
      }

      .logo-icon {
        font-size: 2rem;
        color: var(--accent);
        filter: drop-shadow(0 0 12px rgba(0, 212, 255, 0.5));
      }

      .logo-text {
        font-family: var(--font-display);
        font-size: 1.75rem;
        color: var(--text-primary);
      }

      h1 {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 8px;
      }
    }

    .auth-footer {
      text-align: center;
      margin-top: 24px;
      font-size: 0.875rem;
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  loading = false;

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const { name, email, password } = this.form.getRawValue();
    this.authService.register(email, password, name).subscribe({
      next: () => {
        this.toast.success('Account created!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.toast.error(err.error?.detail || 'Registration failed');
      }
    });
  }
}
