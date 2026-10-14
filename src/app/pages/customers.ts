import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DataService } from '../core/data.service';
import { PageHeader } from '../shared/page-header';

import { Tr } from '../core/i18n.service';

@Component({
  selector: 'app-customers',
  imports: [Tr, CurrencyPipe, PageHeader],
  template: `
  <app-page-header title="Customers" pretitle="Sales">
    <button class="btn btn-primary" type="button"><i class="ti ti-plus me-1"></i>{{ 'Add customer' | t }}</button>
  </app-page-header>
  <div class="page-body"><div class="container-xl">
    <div class="row row-cards">
      @for (c of data.customers; track c.id) {
        <div class="col-md-6 col-lg-3">
          <div class="card">
            <div class="card-body p-4 text-center">
              <span class="avatar avatar-xl mb-3 rounded">{{ data.initials(c.name) }}</span>
              <h3 class="m-0 mb-1">{{ c.name }}</h3>
              <div class="text-secondary">{{ c.company }}</div>
              <div class="mt-3"><span class="badge bg-blue-lt">{{ c.city }}</span></div>
            </div>
            <div class="d-flex">
              <div class="card-btn flex-fill text-center py-2 border-end"><div class="h3 mb-0">{{ c.orders }}</div><div class="small text-secondary">{{ 'Orders' | t }}</div></div>
              <div class="card-btn flex-fill text-center py-2"><div class="h3 mb-0">{{ c.spent | currency: 'USD' : 'symbol' : '1.0-0' }}</div><div class="small text-secondary">{{ 'Spent' | t }}</div></div>
            </div>
          </div>
        </div>
      }
    </div>
  </div></div>`
})
export class Customers { data = inject(DataService); }
