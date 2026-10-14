# ERP Dashboard (Angular 20 + Tabler)

## Run
```bash
npm install
npm start          # http://localhost:4200
npm run build      # production build in dist/
```
Requires Node.js 20.19+ / 22.12+.

## Sign in (demo accounts)
| Email | Password | Role | Access |
|---|---|---|---|
| admin@erp.com | admin123 | admin | everything |
| sales@erp.com | sales123 | sales | no Accounting or Employees |

`src/app/core/auth.service.ts` holds the demo accounts. Replace `login()` with a call to your API and keep the token there.
Routes are protected by `authGuard` (`core/auth.guard.ts`); a route with `data: { roles: ['admin'] }` also checks the role.

## Arabic / RTL
The language button in the top bar (or sidebar on mobile) switches English and Arabic, flips the layout to RTL with Tabler's RTL stylesheet, and remembers the choice.
Add or edit Arabic text in `src/app/core/translations.ts` (keyed by the English text) and use `{{ 'Text' | t }}` in templates.

## Structure
- `src/app/layout` – Tabler vertical sidebar (role-aware menu), top bar, theme and language toggles
- `src/app/pages` – Login, Dashboard, Sales orders, Purchasing, Inventory, Accounting, Customers, Employees (lazy-loaded)
- `src/app/core` – auth service and guard, i18n service and `t` pipe, mock data service
- `src/app/shared` – page header and SVG charts (area, bar, donut)
