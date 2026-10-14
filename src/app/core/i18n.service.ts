import { Injectable, Pipe, PipeTransform, effect, inject, signal } from '@angular/core';
import { AR } from './translations';

export type Lang = 'en' | 'ar';

@Injectable({ providedIn: 'root' })
export class I18n {
  readonly lang = signal<Lang>(localStorage.getItem('lang') === 'ar' ? 'ar' : 'en');

  constructor() {
    effect(() => {
      const ar = this.lang() === 'ar';
      const root = document.documentElement;
      root.lang = this.lang();
      root.dir = ar ? 'rtl' : 'ltr';
      document.getElementById('tabler-css')?.setAttribute('href', ar ? 'tabler-rtl.css' : 'tabler-ltr.css');
      localStorage.setItem('lang', this.lang());
    });
  }

  toggle() { this.lang.update(l => (l === 'ar' ? 'en' : 'ar')); }
  t(key: string): string { return this.lang() === 'ar' ? (AR[key] ?? key) : key; }
}

/** Usage: {{ 'Dashboard' | t }}. Unknown keys fall back to the English text. */
@Pipe({ name: 't', pure: false })
export class Tr implements PipeTransform {
  private i18n = inject(I18n);
  transform(key: string | null | undefined): string { return key ? this.i18n.t(key) : ''; }
}
