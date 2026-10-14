import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  template: `
  <div class="page-header d-print-none">
    <div class="container-xl">
      <div class="row g-2 align-items-center">
        <div class="col">
          <div class="page-pretitle">{{ pretitle() }}</div>
          <h2 class="page-title">{{ title() }}</h2>
        </div>
        <div class="col-auto ms-auto"><ng-content /></div>
      </div>
    </div>
  </div>`
})
export class PageHeader {
  title = input.required<string>();
  pretitle = input('Overview');
}
