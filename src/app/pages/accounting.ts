import { Component, inject } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { DataService } from '../core/data.service';
import { PageHeader } from '../shared/page-header';

import { Tr } from '../core/i18n.service';

@Component({
  selector: 'app-accounting',
  imports: [Tr, CurrencyPipe, DatePipe, DecimalPipe, PageHeader],
  template: `
  <app-page-header title="Accounting" pretitle="Finance">
    <button class="btn btn-primary" type="button"><i class="ti ti-plus me-1"></i>{{ 'New invoice' | t }}</button>
  </app-page-header>
  <div class="page-body"><div class="container-xl">
    <div class="row row-cards">
      <div class="col-sm-6 col-lg-3"><div class="card card-body"><div class="subheader">{{ 'Receivables' | t }}</div><div class="h1 mb-0">{{ receivables | currency: 'USD' : 'symbol' : '1.0-0' }}</div></div></div>
      <div class="col-sm-6 col-lg-3"><div class="card card-body"><div class="subheader">{{ 'Overdue' | t }}</div><div class="h1 mb-0 text-red">{{ overdue | currency: 'USD' : 'symbol' : '1.0-0' }}</div></div></div>
      <div class="col-sm-6 col-lg-3"><div class="card card-body"><div class="subheader">{{ 'Payables' | t }}</div><div class="h1 mb-0">{{ payables | currency: 'USD' : 'symbol' : '1.0-0' }}</div></div></div>
      <div class="col-sm-6 col-lg-3"><div class="card card-body"><div class="subheader">{{ 'Cash balance' | t }}</div><div class="h1 mb-0 text-green">{{ cash | currency: 'USD' : 'symbol' : '1.0-0' }}</div></div></div>

      <div class="col-lg-8">
        <div class="card">
          <div class="card-header"><h3 class="card-title">{{ 'Invoices' | t }}</h3></div>
          <div class="table-responsive">
            <table class="table card-table table-vcenter text-nowrap">
              <thead><tr><th>{{ 'Invoice' | t }}</th><th>{{ 'Customer' | t }}</th><th>{{ 'Due date' | t }}</th><th class="text-end">{{ 'Amount' | t }}</th><th>{{ 'Status' | t }}</th></tr></thead>
              <tbody>
                @for (inv of data.invoices; track inv.id) {
                  <tr>
                    <td class="fw-medium">{{ inv.id }}</td><td>{{ inv.customer }}</td><td class="text-secondary">{{ inv.due | date: 'mediumDate' }}</td>
                    <td class="text-end">{{ inv.amount | currency: 'USD' : 'symbol' : '1.0-0' }}</td>
                    <td><span class="badge bg-{{ data.statusColor(inv.status) }}-lt">{{ inv.status | t }}</span></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card">
          <div class="card-header"><h3 class="card-title">{{ 'Trial balance' | t }}</h3></div>
          <div class="table-responsive">
            <table class="table card-table table-vcenter">
              <thead><tr><th>{{ 'Account' | t }}</th><th class="text-end">{{ 'Debit' | t }}</th><th class="text-end">{{ 'Credit' | t }}</th></tr></thead>
              <tbody>
                @for (r of data.trialBalance; track r.account) {
                  <tr><td>{{ r.account | t }}</td><td class="text-end">{{ r.debit ? (r.debit | number: '1.0-0') : '' }}</td><td class="text-end">{{ r.credit ? (r.credit | number: '1.0-0') : '' }}</td></tr>
                }
                <tr class="fw-bold"><td>{{ 'Total' | t }}</td><td class="text-end">{{ totalDebit | number: '1.0-0' }}</td><td class="text-end">{{ totalCredit | number: '1.0-0' }}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div></div>`
})
export class Accounting {
  data = inject(DataService);
  receivables = this.data.invoices.filter(i => i.status !== 'Paid').reduce((s, i) => s + i.amount, 0);
  overdue = this.data.invoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.amount, 0);
  payables = this.data.purchaseOrders.filter(p => p.status === 'Approved' || p.status === 'Received').reduce((s, p) => s + p.total, 0);
  cash = this.data.trialBalance.find(r => r.account === 'Cash and bank')?.debit ?? 0;
  totalDebit = this.data.trialBalance.reduce((s, r) => s + r.debit, 0);
  totalCredit = this.data.trialBalance.reduce((s, r) => s + r.credit, 0);
}
