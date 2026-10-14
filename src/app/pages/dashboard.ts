import { Component, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../core/data.service';
import { PageHeader } from '../shared/page-header';
import { AreaChart, BarChart, Donut } from '../shared/charts';

import { Tr } from '../core/i18n.service';

@Component({
  selector: 'app-dashboard',
  imports: [Tr, CurrencyPipe, DatePipe, RouterLink, PageHeader, AreaChart, BarChart, Donut],
  template: `
  <app-page-header title="Dashboard" pretitle="Overview">
    <a routerLink="/orders" class="btn btn-primary"><i class="ti ti-plus me-1"></i>{{ 'New sales order' | t }}</a>
  </app-page-header>
  <div class="page-body">
    <div class="container-xl">
      <div class="row row-deck row-cards">
        @for (k of kpis; track k.label) {
          <div class="col-sm-6 col-lg-3">
            <div class="card">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="subheader">{{ k.label | t }}</div>
                  <div class="ms-auto lh-1 {{ k.up ? 'text-green' : 'text-red' }}">
                    {{ k.delta }}<i class="ti ms-1" [class.ti-trending-up]="k.up" [class.ti-trending-down]="!k.up"></i>
                  </div>
                </div>
                <div class="h1 mb-3 mt-1">{{ k.value }}</div>
              </div>
              <app-area-chart [values]="k.trend" [color]="k.color" [height]="44" [label]="k.label + ' trend'" />
            </div>
          </div>
        }

        <div class="col-lg-8">
          <div class="card">
            <div class="card-header"><h3 class="card-title">{{ 'Revenue vs expenses (thousands, 2026)' | t }}</h3>
              <div class="card-actions d-flex gap-3 small">
                <span><span class="badge bg-primary me-1"> </span>{{ 'Revenue' | t }}</span>
                <span><span class="badge me-1" style="background:#79a6dc"> </span>{{ 'Expenses' | t }}</span>
              </div>
            </div>
            <div class="card-body"><app-bar-chart [labels]="data.months" [a]="data.revenue" [b]="data.expenses" label="Revenue versus expenses by month" /></div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card">
            <div class="card-header"><h3 class="card-title">{{ 'Sales by category' | t }}</h3></div>
            <div class="card-body text-center">
              <app-donut [data]="data.categories" label="Sales by category" />
              <div class="mt-3 text-start">
                @for (c of data.categories; track c.label) {
                  <div class="d-flex align-items-center mb-2">
                    <span class="legend me-2 rounded" [style.background]="c.color"></span>
                    <span>{{ c.label | t }}</span><span class="ms-auto text-secondary">{{ c.value }}%</span>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-8">
          <div class="card">
            <div class="card-header"><h3 class="card-title">{{ 'Recent sales orders' | t }}</h3>
              <div class="card-actions"><a routerLink="/orders" class="btn btn-sm">{{ 'View all' | t }}</a></div>
            </div>
            <div class="table-responsive">
              <table class="table card-table table-vcenter text-nowrap">
                <thead><tr><th>{{ 'Order' | t }}</th><th>{{ 'Customer' | t }}</th><th>{{ 'Date' | t }}</th><th class="text-end">{{ 'Total' | t }}</th><th>{{ 'Status' | t }}</th></tr></thead>
                <tbody>
                  @for (o of data.orders.slice(0, 6); track o.id) {
                    <tr>
                      <td class="fw-medium">{{ o.id }}</td><td>{{ o.customer }}</td><td class="text-secondary">{{ o.date | date: 'mediumDate' }}</td>
                      <td class="text-end">{{ o.total | currency: 'USD' : 'symbol' : '1.0-0' }}</td>
                      <td><span class="badge bg-{{ data.statusColor(o.status) }}-lt">{{ o.status | t }}</span></td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card">
            <div class="card-header"><h3 class="card-title">{{ 'Needs restocking' | t }}</h3></div>
            <div class="list-group list-group-flush">
              @for (p of lowStock; track p.sku) {
                <div class="list-group-item">
                  <div class="d-flex justify-content-between mb-1"><span>{{ p.name }}</span><span class="text-red">{{ p.stock }} {{ 'left' | t }}</span></div>
                  <div class="progress progress-sm"><div class="progress-bar bg-red" [style.width.%]="(p.stock / p.reorderAt) * 100"></div></div>
                </div>
              }
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="card">
            <div class="card-header"><h3 class="card-title">{{ 'Team activity' | t }}</h3></div>
            <div class="list-group list-group-flush">
              @for (a of data.activity; track a.what) {
                <div class="list-group-item">
                  <div class="row align-items-center">
                    <div class="col-auto"><span class="avatar avatar-sm">{{ data.initials(a.who) }}</span></div>
                    <div class="col text-truncate"><strong>{{ a.who }}</strong> {{ a.what }}</div>
                    <div class="col-auto text-secondary small">{{ a.when }}</div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`
})
export class Dashboard {
  data = inject(DataService);
  lowStock = this.data.products.filter(p => p.stock <= p.reorderAt).slice(0, 5);
  kpis = [
    { label: 'Revenue (YTD)', value: '$760k', delta: '+12.4%', up: true, color: '#206bc4', trend: this.data.revenue },
    { label: 'Open orders', value: '128', delta: '+5.1%', up: true, color: '#2fb344', trend: [20, 24, 22, 30, 28, 35, 33, 41] },
    { label: 'Active customers', value: '1,284', delta: '+2.3%', up: true, color: '#4299e1', trend: [10, 11, 12, 12, 14, 15, 15, 17] },
    { label: 'Items below reorder level', value: String(this.data.products.filter(p => p.stock <= p.reorderAt).length), delta: '-1.2%', up: false, color: '#d63939', trend: [9, 8, 9, 7, 6, 7, 5, 4] }
  ];
}
