import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../core/auth.service';
import { I18n } from '../core/i18n.service';

import { Tr } from '../core/i18n.service';

@Component({
  selector: 'app-login',
  imports: [Tr, FormsModule],
  template: `
  <div class="page page-center">
    <div class="container container-tight py-4">
      <div class="text-center mb-4">
        <span class="avatar avatar-lg bg-primary text-white"><i class="ti ti-building-factory-2"></i></span>
        <h1 class="h2 mt-3">{{ 'ERP Suite' | t }}</h1>
      </div>
      <div class="card card-md">
        <div class="card-body">
          <h2 class="h2 text-center mb-4">{{ 'Sign in to your account' | t }}</h2>
          <form (ngSubmit)="submit()" novalidate>
            @if (error()) { <div class="alert alert-danger" role="alert">{{ 'Invalid email or password.' | t }}</div> }
            <div class="mb-3">
              <label class="form-label" for="email">{{ 'Email' | t }}</label>
              <input id="email" name="email" type="email" class="form-control" autocomplete="username" [(ngModel)]="email" required>
            </div>
            <div class="mb-3">
              <label class="form-label" for="password">{{ 'Password' | t }}</label>
              <input id="password" name="password" type="password" class="form-control" autocomplete="current-password" [(ngModel)]="password" required>
            </div>
            <button type="submit" class="btn btn-primary w-100">{{ 'Sign in' | t }}</button>
          </form>
        </div>
      </div>
      <div class="text-center text-secondary mt-3">{{ 'Demo account: admin@erp.com / admin123' | t }}</div>
      <div class="text-center mt-2">
        <button type="button" class="btn btn-link" (click)="i18n.toggle()">{{ i18n.lang() === 'ar' ? 'English' : 'العربية' }}</button>
      </div>
    </div>
  </div>`
})
export class Login {
  private auth = inject(Auth);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  i18n = inject(I18n);
  email = '';
  password = '';
  error = signal(false);

  submit() {
    if (!this.auth.login(this.email, this.password)) { this.error.set(true); return; }
    const back = this.route.snapshot.queryParamMap.get('returnUrl');
    this.router.navigateByUrl(back && back.startsWith('/') && !back.startsWith('//') ? back : '/');
  }
}
