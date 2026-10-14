import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { DataService, OrderStatus } from '../core/data.service';
import { PageHeader } from '../shared/page-header';

@Component({
  selector: 'app-orders',
  imports: [CurrencyPipe, DatePipe, PageHeader],
  template: `
  <app-page-header title="Sales orders" pretitle="Sales">
    <button class="btn btn-primary" type="button"><i class="ti ti-plus me-1"></i>New sales order</button>
  </app-page-header>
  <div class="page-body"><div class="container-xl">
    <div class="card">
      <div class="card-body border-bottom py-3">
        <div class="d-flex flex-wrap gap-2 align-items-center">
          <div class="text-secondary">{{ filtered().length }} orders</div>
          <select class="form-select w-auto ms-auto" aria-label="Filter by status" (change)="setStatus($any($event.target).value)">
            <option value="">All statuses</option>
            @for (s of statuses; track s) { <option [value]="s">{{ s }}</option> }
          </select>
          <input class="form-control w-auto" placeholder="Search order or customer" aria-label="Search orders" (input)="setQuery($any($event.target).value)">
        </div>
      </div>
      <div class="table-responsive">
        <table class="table card-table table-vcenter text-nowrap table-hover">
          <thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Items</th><th class="text-end">Total</th><th>Status</th></tr></thead>
          <tbody>
            @for (o of pageRows(); track o.id) {
              <tr>
                <td class="fw-medium">{{ o.id }}</td><td>{{ o.customer }}</td>
                <td class="text-secondary">{{ o.date | date: 'mediumDate' }}</td><td>{{ o.items }}</td>
                <td class="text-end">{{ o.total | currency: 'USD' : 'symbol' : '1.0-0' }}</td>
                <td><span class="badge bg-{{ data.statusColor(o.status) }}-lt">{{ o.status }}</span></td>
              </tr>
            } @empty {
              <tr><td colspan="6" class="text-center text-secondary py-5">No orders match your filters. Clear the search or choose another status.</td></tr>
            }
          </tbody>
        </table>
      </div>
      <div class="card-footer d-flex align-items-center">
        <p class="m-0 text-secondary">Page {{ page() }} of {{ pages() }}</p>
        <ul class="pagination m-0 ms-auto">
          <li class="page-item" [class.disabled]="page() === 1"><button class="page-link" type="button" (click)="page.set(page() - 1)"><i class="ti ti-chevron-left"></i> Previous</button></li>
          <li class="page-item" [class.disabled]="page() === pages()"><button class="page-link" type="button" (click)="page.set(page() + 1)">Next <i class="ti ti-chevron-right"></i></button></li>
        </ul>
      </div>
    </div>
  </div></div>`
})
export class Orders {
  data = inject(DataService);
  statuses: OrderStatus[] = ['Paid', 'Shipped', 'Pending', 'Cancelled'];
  query = signal(''); status = signal(''); page = signal(1);
  readonly size = 10;
  filtered = computed(() => {
    const q = this.query().toLowerCase(); const s = this.status();
    return this.data.orders.filter(o => (!s || o.status === s) && (!q || (o.id + o.customer).toLowerCase().includes(q)));
  });
  pages = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.size)));
  pageRows = computed(() => this.filtered().slice((this.page() - 1) * this.size, this.page() * this.size));
  setQuery(v: string) { this.query.set(v); this.page.set(1); }
  setStatus(v: string) { this.status.set(v); this.page.set(1); }
}
