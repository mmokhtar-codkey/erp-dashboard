import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { DataService } from '../core/data.service';
import { PageHeader } from '../shared/page-header';

import { Tr } from '../core/i18n.service';

@Component({
  selector: 'app-purchasing',
  imports: [Tr, CurrencyPipe, DatePipe, PageHeader],
  template: `
  <app-page-header title="Purchasing" pretitle="Procurement">
    <button class="btn btn-primary" type="button"><i class="ti ti-plus me-1"></i>{{ 'New purchase order' | t }}</button>
  </app-page-header>
  <div class="page-body"><div class="container-xl">
    <div class="row row-cards mb-3">
      <div class="col-sm-4"><div class="card card-body"><div class="subheader">{{ 'Open purchase orders' | t }}</div><div class="h1 mb-0">{{ open }}</div></div></div>
      <div class="col-sm-4"><div class="card card-body"><div class="subheader">{{ 'Awaiting approval' | t }}</div><div class="h1 mb-0 text-orange">{{ drafts }}</div></div></div>
      <div class="col-sm-4"><div class="card card-body"><div class="subheader">{{ 'Spend this month' | t }}</div><div class="h1 mb-0">{{ spend | currency: 'USD' : 'symbol' : '1.0-0' }}</div></div></div>
    </div>
    <div class="card">
      <div class="card-body border-bottom py-3 d-flex align-items-center">
        <div class="text-secondary">{{ rows().length }} {{ 'orders' | t }}</div>
        <select class="form-select w-auto ms-auto" aria-label="Filter by status" (change)="status.set($any($event.target).value)">
          <option value="">{{ 'All statuses' | t }}</option>
          @for (s of statuses; track s) { <option [value]="s">{{ s | t }}</option> }
        </select>
      </div>
      <div class="table-responsive">
        <table class="table card-table table-vcenter text-nowrap table-hover">
          <thead><tr><th>{{ 'Order' | t }}</th><th>{{ 'Vendor' | t }}</th><th>{{ 'Date' | t }}</th><th>{{ 'Expected' | t }}</th><th class="text-end">{{ 'Total' | t }}</th><th>{{ 'Status' | t }}</th></tr></thead>
          <tbody>
            @for (po of rows(); track po.id) {
              <tr>
                <td class="fw-medium">{{ po.id }}</td><td>{{ po.vendor }}</td>
                <td class="text-secondary">{{ po.date | date: 'mediumDate' }}</td><td class="text-secondary">{{ po.expected | date: 'mediumDate' }}</td>
                <td class="text-end">{{ po.total | currency: 'USD' : 'symbol' : '1.0-0' }}</td>
                <td><span class="badge bg-{{ data.statusColor(po.status) }}-lt">{{ po.status | t }}</span></td>
              </tr>
            } @empty {
              <tr><td colspan="6" class="text-center text-secondary py-5">{{ 'No orders match your filters. Clear the search or choose another status.' | t }}</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  </div></div>`
})
export class Purchasing {
  data = inject(DataService);
  statuses = ['Draft', 'Approved', 'Received', 'Cancelled'];
  status = signal('');
  rows = computed(() => this.data.purchaseOrders.filter(p => !this.status() || p.status === this.status()));
  open = this.data.purchaseOrders.filter(p => p.status === 'Draft' || p.status === 'Approved').length;
  drafts = this.data.purchaseOrders.filter(p => p.status === 'Draft').length;
  spend = this.data.purchaseOrders.filter(p => p.status !== 'Cancelled').reduce((s, p) => s + p.total, 0);
}
