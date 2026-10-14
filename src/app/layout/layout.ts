import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
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
            <span>ERP Suite</span>
          </a>
        </h1>
        <div class="collapse navbar-collapse" [class.show]="menuOpen()">
          <ul class="navbar-nav pt-lg-3">
            @for (item of nav; track item.path) {
              <li class="nav-item">
                <a class="nav-link" [routerLink]="item.path" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: item.path === '/' }" (click)="menuOpen.set(false)">
                  <span class="nav-link-icon d-md-none d-lg-inline-block"><i class="ti ti-{{ item.icon }}"></i></span>
                  <span class="nav-link-title">{{ item.label }}</span>
                </a>
              </li>
            }
          </ul>
        </div>
      </div>
    </aside>

    <header class="navbar navbar-expand-md d-none d-lg-flex d-print-none">
      <div class="container-xl">
        <div class="navbar-nav flex-row order-md-last align-items-center gap-2">
          <button class="nav-link px-0" type="button" (click)="toggleTheme()" [attr.aria-label]="dark() ? 'Switch to light mode' : 'Switch to dark mode'">
            <i class="ti" [class.ti-moon]="!dark()" [class.ti-sun]="dark()"></i>
          </button>
          <button class="nav-link px-0 position-relative" type="button" aria-label="Notifications">
            <i class="ti ti-bell"></i><span class="badge bg-red badge-notification badge-blink"></span>
          </button>
          <div class="d-flex align-items-center gap-2 ps-2">
            <span class="avatar avatar-sm">SA</span>
            <div class="d-none d-xl-block lh-1">
              <div>Software Engineer</div>
              <div class="mt-1 small text-secondary">Administrator</div>
            </div>
          </div>
        </div>
        <div class="collapse navbar-collapse">
          <div class="input-icon w-100" style="max-width: 24rem">
            <span class="input-icon-addon"><i class="ti ti-search"></i></span>
            <input type="text" class="form-control" placeholder="Search orders, products, customers…" aria-label="Search">
          </div>
        </div>
      </div>
    </header>

    <div class="page-wrapper">
      <router-outlet />
      <footer class="footer footer-transparent d-print-none">
        <div class="container-xl text-center text-secondary">ERP Suite · built with Angular and Tabler</div>
      </footer>
    </div>
  </div>`
})
export class Layout {
  menuOpen = signal(false);
  dark = signal(false);
  nav = [
    { path: '/', label: 'Dashboard', icon: 'home' },
    { path: '/orders', label: 'Sales orders', icon: 'shopping-cart' },
    { path: '/inventory', label: 'Inventory', icon: 'packages' },
    { path: '/customers', label: 'Customers', icon: 'users' },
    { path: '/employees', label: 'Employees', icon: 'id-badge-2' }
  ];
  toggleTheme() {
    this.dark.update(v => !v);
    document.documentElement.setAttribute('data-bs-theme', this.dark() ? 'dark' : 'light');
  }
}
