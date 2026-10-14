import { Component, computed, input } from '@angular/core';

/** Smooth area / line chart drawn with plain SVG. */
@Component({
  selector: 'app-area-chart',
  template: `
  <svg class="chart-svg" [attr.viewBox]="'0 0 ' + w + ' ' + height()" preserveAspectRatio="none" [style.height.px]="height()" role="img" [attr.aria-label]="label()">
    <path [attr.d]="area()" [attr.fill]="color()" fill-opacity=".15" />
    <path [attr.d]="line()" fill="none" [attr.stroke]="color()" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round" />
  </svg>`
})
export class AreaChart {
  readonly w = 300;
  values = input.required<number[]>();
  height = input(60);
  color = input('#206bc4');
  label = input('Trend chart');
  private pts = computed(() => {
    const v = this.values(); const h = this.height(); const max = Math.max(...v); const min = Math.min(...v);
    const pad = 4;
    return v.map((y, i) => [i * (this.w / (v.length - 1)), h - pad - ((y - min) / (max - min || 1)) * (h - pad * 2)]);
  });
  line = computed(() => this.pts().map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' '));
  area = computed(() => this.line() + ` L ${this.w} ${this.height()} L 0 ${this.height()} Z`);
}

/** Grouped bar chart with month labels. */
@Component({
  selector: 'app-bar-chart',
  template: `
  <svg class="chart-svg" style="direction: ltr" viewBox="0 0 600 240" role="img" [attr.aria-label]="label()">
    @for (t of ticks(); track t) {
      <line x1="30" x2="600" [attr.y1]="y(t)" [attr.y2]="y(t)" stroke="var(--tblr-border-color)" />
      <text x="0" [attr.y]="y(t) + 4" font-size="11" fill="var(--tblr-secondary)">{{ t }}k</text>
    }
    @for (l of labels(); track l; let i = $index) {
      <rect [attr.x]="40 + i * 47" [attr.y]="y(a()[i])" width="16" [attr.height]="200 - y(a()[i]) + 10" rx="2" fill="#206bc4" />
      <rect [attr.x]="58 + i * 47" [attr.y]="y(b()[i])" width="16" [attr.height]="200 - y(b()[i]) + 10" rx="2" fill="#79a6dc" />
      <text [attr.x]="58 + i * 47" y="230" font-size="11" text-anchor="middle" fill="var(--tblr-secondary)">{{ l }}</text>
    }
  </svg>`
})
export class BarChart {
  labels = input.required<string[]>();
  a = input.required<number[]>();
  b = input.required<number[]>();
  label = input('Bar chart');
  private max = computed(() => Math.ceil(Math.max(...this.a(), ...this.b()) / 20) * 20);
  ticks = computed(() => [0, 1, 2, 3, 4].map(i => (this.max() / 4) * i));
  y = (v: number) => 210 - (v / this.max()) * 200;
}

/** Donut chart built from stroke-dasharray segments. */
@Component({
  selector: 'app-donut',
  template: `
  <svg viewBox="0 0 120 120" width="160" height="160" role="img" [attr.aria-label]="label()">
    <g transform="rotate(-90 60 60)">
      @for (s of segs(); track s.label) {
        <circle cx="60" cy="60" r="44" fill="none" stroke-width="18" [attr.stroke]="s.color"
          [attr.stroke-dasharray]="s.len + ' ' + (c - s.len)" [attr.stroke-dashoffset]="-s.offset" />
      }
    </g>
  </svg>`
})
export class Donut {
  data = input.required<{ label: string; value: number; color: string }[]>();
  label = input('Donut chart');
  readonly c = 2 * Math.PI * 44;
  segs = computed(() => {
    const total = this.data().reduce((s, d) => s + d.value, 0); let off = 0;
    return this.data().map(d => { const len = (d.value / total) * this.c; const seg = { ...d, len, offset: off }; off += len; return seg; });
  });
}
