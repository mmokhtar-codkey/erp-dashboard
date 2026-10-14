# ERP Dashboard (Angular 20 + Tabler)

## Run
```bash
npm install
npm start          # http://localhost:4200
npm run build      # production build in dist/
```
Requires Node.js 20.19+ / 22.12+.

## Structure
- `src/app/layout` – Tabler vertical sidebar, top bar, dark/light toggle
- `src/app/pages` – Dashboard, Sales orders, Inventory, Customers, Employees (lazy-loaded)
- `src/app/shared` – page header and SVG charts (area, bar, donut), no chart library needed
- `src/app/core/data.service.ts` – mock data; replace with HttpClient calls to your API
