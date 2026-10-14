import { Component, input } from '@angular/core';

import { Tr } from '../core/i18n.service';

@Component({
  selector: 'app-page-header',
  imports: [Tr],
  template: `
  <div class="page-header d-print-none">
    <div class="container-xl">
      <div class="row g-2 align-items-center">
        <div class="col">
          <div class="page-pretitle">{{ pretitle() | t }}</div>
          <h2 class="page-title">{{ title() | t }}</h2>
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
