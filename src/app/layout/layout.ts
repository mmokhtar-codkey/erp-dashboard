import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Auth, Role } from '../core/auth.service';
import { I18n } from '../core/i18n.service';

interface NavItem { path: string; label: string; icon: string; roles?: Role[]; }

import { Tr } from '../core/i18n.service';

@Component({
  selector: 'app-layout',
  imports: [Tr, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
  <div class="page">
    <aside class="navbar navbar-vertical navbar-expand-lg" data-bs-theme="dark">
      <div class="container-fluid">
        <button class="navbar-toggler" type="button" aria-label="Toggle navigation" (click)="menuOpen.set(!menuOpen())">
          <span class="navbar-toggler-icon"></span>
        </button>
        <h1 class="navbar-brand navbar-brand-autodark">
          <a routerLink="/" class="d-flex align-items-center gap-2 text-white text-decoration-none">
            <span class="avatar avatar-sm bg-primary text-white"><i class="ti ti-building-factory-2"></i></span>
            <span>{{ 'ERP Suite' | t }}</span>
          </a>
        </h1>
        <div class="collapse navbar-collapse" [class.show]="menuOpen()">
          <ul class="navbar-nav pt-lg-3">
            @for (item of visibleNav(); track item.path) {
              <li class="nav-item">
                <a class="nav-link" [routerLink]="item.path" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: item.path === '/' }" (click)="menuOpen.set(false)">
                  <span class="nav-link-icon d-md-none d-lg-inline-block"><i class="ti ti-{{ item.icon }}"></i></span>
                  <span class="nav-link-title">{{ item.label | t }}</span>
                </a>
              </li>
            }
            <li class="nav-item d-lg-none">
              <button class="nav-link w-100 bg-transparent border-0" type="button" (click)="i18n.toggle()">
                <span class="nav-link-icon d-md-none d-lg-inline-block"><i class="ti ti-language"></i></span>
                <span class="nav-link-title">{{ i18n.lang() === 'ar' ? 'English' : 'العربية' }}</span>
              </button>
            </li>
            <li class="nav-item d-lg-none">
              <button class="nav-link w-100 bg-transparent border-0" type="button" (click)="logout()">
                <span class="nav-link-icon d-md-none d-lg-inline-block"><i class="ti ti-logout"></i></span>
                <span class="nav-link-title">{{ 'Sign out' | t }}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </aside>

    <header class="navbar navbar-expand-md d-none d-lg-flex d-print-none">
      <div class="container-xl">
        <div class="navbar-nav flex-row order-md-last align-items-center gap-2">
          <button class="nav-link px-2" type="button" (click)="i18n.toggle()">{{ i18n.lang() === 'ar' ? 'English' : 'العربية' }}</button>
          <button class="nav-link px-0" type="button" (click)="toggleTheme()" aria-label="Toggle theme">
            <i class="ti" [class.ti-moon]="!dark()" [class.ti-sun]="dark()"></i>
          </button>
          <div class="d-flex align-items-center gap-2 ps-2">
            <span class="avatar avatar-sm">{{ initials() }}</span>
            <div class="d-none d-xl-block lh-1">
              <div>{{ auth.user()?.name }}</div>
              <div class="mt-1 small text-secondary">{{ (auth.user()?.role === 'admin' ? 'Administrator' : 'Sales') | t }}</div>
            </div>
          </div>
          <button class="nav-link px-2" type="button" (click)="logout()" title="Sign out" aria-label="Sign out"><i class="ti ti-logout"></i></button>
        </div>
        <div class="collapse navbar-collapse">
          <div class="input-icon w-100" style="max-width: 24rem">
            <span class="input-icon-addon"><i class="ti ti-search"></i></span>
            <input type="text" class="form-control" [placeholder]="'Search orders, products, customers…' | t" aria-label="Search">
          </div>
        </div>
      </div>
    </header>

    <div class="page-wrapper">
      <router-outlet />
      <footer class="footer footer-transparent d-print-none">
        <div class="container-xl text-center text-secondary">{{ 'ERP Suite · built with Angular and Tabler' | t }}</div>
      </footer>
    </div>
  </div>`
})
export class Layout {
  auth = inject(Auth);
  i18n = inject(I18n);
  private router = inject(Router);
  menuOpen = signal(false);
  dark = signal(false);
  private nav: NavItem[] = [
    { path: '/', label: 'Dashboard', icon: 'home' },
    { path: '/orders', label: 'Sales orders', icon: 'shopping-cart' },
    { path: '/purchasing', label: 'Purchasing', icon: 'truck-delivery' },
    { path: '/inventory', label: 'Inventory', icon: 'packages' },
    { path: '/accounting', label: 'Accounting', icon: 'report-money', roles: ['admin'] },
    { path: '/customers', label: 'Customers', icon: 'users' },
    { path: '/employees', label: 'Employees', icon: 'id-badge-2', roles: ['admin'] }
  ];
  visibleNav = computed(() => this.nav.filter(n => this.auth.hasRole(n.roles)));
  initials = computed(() => (this.auth.user()?.name ?? '').split(' ').map(p => p[0]).slice(0, 2).join(''));

  toggleTheme() {
    this.dark.update(v => !v);
    document.documentElement.setAttribute('data-bs-theme', this.dark() ? 'dark' : 'light');
  }
  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
