import { Routes } from '@angular/router';
import { Layout } from './layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', pathMatch: 'full', title: 'Dashboard', loadComponent: () => import('./pages/dashboard').then(m => m.Dashboard) },
      { path: 'orders', title: 'Sales orders', loadComponent: () => import('./pages/orders').then(m => m.Orders) },
      { path: 'inventory', title: 'Inventory', loadComponent: () => import('./pages/inventory').then(m => m.Inventory) },
      { path: 'customers', title: 'Customers', loadComponent: () => import('./pages/customers').then(m => m.Customers) },
      { path: 'employees', title: 'Employees', loadComponent: () => import('./pages/employees').then(m => m.Employees) }
    ]
  },
  { path: '**', redirectTo: '' }
];
