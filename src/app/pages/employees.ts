import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DataService } from '../core/data.service';
import { PageHeader } from '../shared/page-header';

@Component({
  selector: 'app-employees',
  imports: [DatePipe, PageHeader],
  template: `
  <app-page-header title="Employees" pretitle="Human resources">
    <button class="btn btn-primary" type="button"><i class="ti ti-plus me-1"></i>Add employee</button>
  </app-page-header>
  <div class="page-body"><div class="container-xl">
    <div class="card">
      <div class="table-responsive">
        <table class="table card-table table-vcenter text-nowrap">
          <thead><tr><th>Employee</th><th>Role</th><th>Department</th><th>Joined</th><th>Status</th></tr></thead>
          <tbody>
            @for (e of data.employees; track e.id) {
              <tr>
                <td><div class="d-flex align-items-center gap-2">
                  <span class="avatar avatar-sm">{{ data.initials(e.name) }}</span>
                  <div><div class="fw-medium">{{ e.name }}</div><div class="small text-secondary">{{ e.email }}</div></div>
                </div></td>
                <td>{{ e.role }}</td><td>{{ e.department }}</td><td class="text-secondary">{{ e.joined | date: 'MMM y' }}</td>
                <td><span class="badge bg-{{ data.statusColor(e.status) }}-lt">{{ e.status }}</span></td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  </div></div>`
})
export class Employees { data = inject(DataService); }
