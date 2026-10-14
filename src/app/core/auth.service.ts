import { Injectable, computed, signal } from '@angular/core';

export type Role = 'admin' | 'sales';
export interface User { name: string; email: string; role: Role; }

// Demo accounts only. Replace login() with a call to your API (and store its token).
const ACCOUNTS: (User & { password: string })[] = [
  { email: 'admin@erp.com', password: 'admin123', name: 'Admin User', role: 'admin' },
  { email: 'sales@erp.com', password: 'sales123', name: 'Sales User', role: 'sales' }
];

@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly KEY = 'erp_session';
  readonly user = signal<User | null>(this.load());
  readonly isLoggedIn = computed(() => this.user() !== null);

  login(email: string, password: string): boolean {
    const a = ACCOUNTS.find(x => x.email === email.trim().toLowerCase() && x.password === password);
    if (!a) return false;
    const user: User = { name: a.name, email: a.email, role: a.role };
    this.user.set(user);
    localStorage.setItem(this.KEY, JSON.stringify(user));
    return true;
  }

  logout() {
    this.user.set(null);
    localStorage.removeItem(this.KEY);
  }

  hasRole(roles?: Role[]): boolean {
    const u = this.user();
    return !!u && (!roles || roles.includes(u.role));
  }

  private load(): User | null {
    try { return JSON.parse(localStorage.getItem(this.KEY) ?? 'null'); } catch { return null; }
  }
}
