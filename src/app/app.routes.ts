import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { authGuard, guestGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: 'login', title: 'Sign in', canActivate: [guestGuard], loadComponent: () => import('./pages/login').then(m => m.Login) },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', pathMatch: 'full', title: 'Dashboard', loadComponent: () => import('./pages/dashboard').then(m => m.Dashboard) },
      { path: 'orders', title: 'Sales orders', loadComponent: () => import('./pages/orders').then(m => m.Orders) },
      { path: 'purchasing', title: 'Purchasing', loadComponent: () => import('./pages/purchasing').then(m => m.Purchasing) },
      { path: 'inventory', title: 'Inventory', loadComponent: () => import('./pages/inventory').then(m => m.Inventory) },
      { path: 'accounting', title: 'Accounting', data: { roles: ['admin'] }, loadComponent: () => import('./pages/accounting').then(m => m.Accounting) },
      { path: 'customers', title: 'Customers', loadComponent: () => import('./pages/customers').then(m => m.Customers) },
      { path: 'employees', title: 'Employees', data: { roles: ['admin'] }, loadComponent: () => import('./pages/employees').then(m => m.Employees) }
    ]
  },
  { path: '**', redirectTo: '' }
];
