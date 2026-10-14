import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DataService } from '../core/data.service';
import { PageHeader } from '../shared/page-header';

import { Tr } from '../core/i18n.service';

@Component({
  selector: 'app-inventory',
  imports: [Tr, CurrencyPipe, PageHeader],
  template: `
  <app-page-header title="Inventory" pretitle="Warehouse">
    <button class="btn btn-primary" type="button"><i class="ti ti-plus me-1"></i>{{ 'Add product' | t }}</button>
  </app-page-header>
  <div class="page-body"><div class="container-xl">
    <div class="row row-cards mb-3">
      <div class="col-sm-4"><div class="card card-body"><div class="subheader">{{ 'Products' | t }}</div><div class="h1 mb-0">{{ data.products.length }}</div></div></div>
      <div class="col-sm-4"><div class="card card-body"><div class="subheader">{{ 'Below reorder level' | t }}</div><div class="h1 mb-0 text-red">{{ low }}</div></div></div>
      <div class="col-sm-4"><div class="card card-body"><div class="subheader">{{ 'Stock value' | t }}</div><div class="h1 mb-0">{{ value | currency: 'USD' : 'symbol' : '1.0-0' }}</div></div></div>
    </div>
    <div class="card">
      <div class="table-responsive">
        <table class="table card-table table-vcenter text-nowrap">
          <thead><tr><th>{{ 'SKU' | t }}</th><th>{{ 'Product' | t }}</th><th>{{ 'Category' | t }}</th><th style="width:22%">{{ 'Stock level' | t }}</th><th class="text-end">{{ 'Unit price' | t }}</th><th>{{ 'Status' | t }}</th></tr></thead>
          <tbody>
            @for (p of data.products; track p.sku) {
              <tr>
                <td class="text-secondary">{{ p.sku }}</td><td class="fw-medium">{{ p.name }}</td><td>{{ p.category | t }}</td>
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <div class="progress progress-sm flex-fill"><div class="progress-bar" [class.bg-red]="p.stock <= p.reorderAt" [class.bg-green]="p.stock > p.reorderAt" [style.width.%]="Math.min(100, (p.stock / (p.reorderAt * 3)) * 100)"></div></div>
                    <span class="small">{{ p.stock }}</span>
                  </div>
                </td>
                <td class="text-end">{{ p.price | currency: 'USD' }}</td>
                <td>@if (p.stock <= p.reorderAt) { <span class="badge bg-red-lt">{{ 'Reorder' | t }}</span> } @else { <span class="badge bg-green-lt">{{ 'In stock' | t }}</span> }</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  </div></div>`
})
export class Inventory {
  data = inject(DataService);
  Math = Math;
  low = this.data.products.filter(p => p.stock <= p.reorderAt).length;
  value = this.data.products.reduce((s, p) => s + p.stock * p.price, 0);
}
