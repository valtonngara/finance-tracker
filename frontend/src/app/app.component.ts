import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '@app/core/auth.service';
import { ToastComponent } from '@app/shared/toast.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ToastComponent],
  template: `
    <div class="app-layout" [class.has-sidebar]="authService.isAuthenticated()">
      @if (authService.isAuthenticated()) {
        <button class="mobile-menu-btn" (click)="toggleMobileMenu()">
          <span class="hamburger" [class.open]="mobileMenuOpen()">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        @if (mobileMenuOpen()) {
          <div class="sidebar-backdrop" (click)="mobileMenuOpen.set(false)"></div>
        }

        <aside class="sidebar" [class.sidebar-open]="mobileMenuOpen()">
          <div class="sidebar-header">
            <div class="logo">
              <span class="logo-icon">&#9670;</span>
              <span class="logo-text">Expensera</span>
            </div>
          </div>

          <nav class="sidebar-nav">
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-item" (click)="mobileMenuOpen.set(false)">
              <span class="nav-icon">&#9632;</span>
              <span class="nav-label">Dashboard</span>
            </a>
            <a routerLink="/transactions" routerLinkActive="active" class="nav-item" (click)="mobileMenuOpen.set(false)">
              <span class="nav-icon">&#8644;</span>
              <span class="nav-label">Transactions</span>
            </a>
            <a routerLink="/analytics" routerLinkActive="active" class="nav-item" (click)="mobileMenuOpen.set(false)">
              <span class="nav-icon">&#9636;</span>
              <span class="nav-label">Analytics</span>
            </a>
            <a routerLink="/budget" routerLinkActive="active" class="nav-item" (click)="mobileMenuOpen.set(false)">
              <span class="nav-icon">&#9673;</span>
              <span class="nav-label">Budget</span>
            </a>
            <a routerLink="/predictions" routerLinkActive="active" class="nav-item" (click)="mobileMenuOpen.set(false)">
              <span class="nav-icon">&#10038;</span>
              <span class="nav-label">Predictions</span>
            </a>
            <a routerLink="/settings" routerLinkActive="active" class="nav-item" (click)="mobileMenuOpen.set(false)">
              <span class="nav-icon">&#9881;</span>
              <span class="nav-label">Settings</span>
            </a>
          </nav>

          <div class="sidebar-footer">
            @if (authService.currentUser(); as user) {
              <div class="user-info">
                <div class="user-avatar">{{ user.name?.charAt(0)?.toUpperCase() || 'U' }}</div>
                <div class="user-details">
                  <span class="user-name">{{ user.name || 'User' }}</span>
                  <span class="user-email">{{ user.email }}</span>
                </div>
              </div>
            }
            <button class="logout-btn" (click)="authService.logout(); mobileMenuOpen.set(false)">
              <span>&#10140;</span>
              <span>Logout</span>
            </button>
          </div>
        </aside>
      }

      <main class="main-content">
        <router-outlet />
      </main>

      <app-toast />
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      min-height: 100vh;
    }

    .has-sidebar .main-content {
      margin-left: var(--sidebar-width, 260px);
      width: calc(100% - var(--sidebar-width, 260px));
    }

    .main-content {
      flex: 1;
      min-height: 100vh;
      position: relative;
      animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: var(--sidebar-width, 260px);
      background: rgba(10, 14, 26, 0.95);
      backdrop-filter: blur(24px);
      border-right: 1px solid var(--border, rgba(255, 255, 255, 0.08));
      display: flex;
      flex-direction: column;
      z-index: 100;
      overflow-y: auto;
    }

    .sidebar-header {
      padding: 28px 24px 20px;
      border-bottom: 1px solid var(--border, rgba(255, 255, 255, 0.08));
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      font-size: 1.5rem;
      color: var(--accent, #00d4ff);
      filter: drop-shadow(0 0 8px rgba(0, 212, 255, 0.4));
    }

    .logo-text {
      font-family: var(--font-display, 'DM Serif Display', serif);
      font-size: 1.5rem;
      color: var(--text-primary, #f1f5f9);
      letter-spacing: -0.02em;
    }

    .sidebar-nav {
      flex: 1;
      padding: 16px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px 16px;
      border-radius: var(--radius-sm, 8px);
      color: var(--text-secondary, #94a3b8);
      font-size: 0.9375rem;
      font-weight: 500;
      transition: all 0.2s ease;
      text-decoration: none;
      position: relative;
      overflow: hidden;

      &:hover {
        color: var(--text-primary, #f1f5f9);
        background: rgba(255, 255, 255, 0.04);
      }

      &.active {
        color: var(--accent, #00d4ff);
        background: rgba(0, 212, 255, 0.08);

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 60%;
          background: var(--accent, #00d4ff);
          border-radius: 0 3px 3px 0;
          box-shadow: 0 0 12px rgba(0, 212, 255, 0.5);
        }
      }
    }

    .nav-icon {
      font-size: 1.125rem;
      width: 24px;
      text-align: center;
      flex-shrink: 0;
    }

    .nav-label {
      white-space: nowrap;
    }

    .sidebar-footer {
      padding: 16px 12px 20px;
      border-top: 1px solid var(--border, rgba(255, 255, 255, 0.08));
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      margin-bottom: 8px;
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent, #00d4ff), #0066ff);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: 700;
      color: #fff;
      flex-shrink: 0;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .user-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary, #f1f5f9);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-email {
      font-size: 0.75rem;
      color: var(--text-muted, #64748b);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 14px;
      width: 100%;
      padding: 12px 16px;
      border: none;
      border-radius: var(--radius-sm, 8px);
      background: transparent;
      color: var(--text-secondary, #94a3b8);
      font-size: 0.9375rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        color: var(--red, #ff4d6a);
        background: rgba(255, 77, 106, 0.08);
      }
    }

    .mobile-menu-btn {
      display: none;
      position: fixed;
      top: 16px;
      left: 16px;
      z-index: 200;
      width: 44px;
      height: 44px;
      border: none;
      border-radius: var(--radius-sm, 8px);
      background: rgba(10, 14, 26, 0.9);
      backdrop-filter: blur(12px);
      cursor: pointer;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
    }

    .hamburger {
      display: flex;
      flex-direction: column;
      gap: 5px;
      width: 20px;

      span {
        display: block;
        height: 2px;
        width: 100%;
        background: var(--text-primary, #f1f5f9);
        border-radius: 2px;
        transition: all 0.3s ease;
      }

      &.open span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
      }
      &.open span:nth-child(2) {
        opacity: 0;
      }
      &.open span:nth-child(3) {
        transform: rotate(-45deg) translate(5px, -5px);
      }
    }

    .sidebar-backdrop {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      z-index: 99;
    }

    @media (max-width: 768px) {
      .mobile-menu-btn {
        display: flex;
      }

      .sidebar-backdrop {
        display: block;
      }

      .sidebar {
        transform: translateX(-100%);
        transition: transform 0.3s ease;
      }

      .sidebar-open {
        transform: translateX(0);
      }

      .has-sidebar .main-content {
        margin-left: 0;
        width: 100%;
        padding-top: 60px;
      }
    }
  `]
})
export class AppComponent {
  authService = inject(AuthService);
  mobileMenuOpen = signal(false);

  private router = inject(Router);

  constructor() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => this.mobileMenuOpen.set(false));
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }
}
