import { Injectable } from '@angular/core';

export type OrderStatus = 'Paid' | 'Pending' | 'Shipped' | 'Cancelled';
export interface Order { id: string; customer: string; date: string; items: number; total: number; status: OrderStatus; }
export interface Product { sku: string; name: string; category: string; stock: number; reorderAt: number; price: number; }
export interface Customer { id: number; name: string; company: string; email: string; city: string; orders: number; spent: number; }
export interface Employee { id: number; name: string; role: string; department: string; email: string; status: 'Active' | 'On leave'; joined: string; }

export interface PurchaseOrder { id: string; vendor: string; date: string; expected: string; total: number; status: 'Draft' | 'Approved' | 'Received' | 'Cancelled'; }
export interface Invoice { id: string; customer: string; due: string; amount: number; status: 'Paid' | 'Open' | 'Overdue'; }
export interface TrialRow { account: string; debit: number; credit: number; }

const names = ['Omar Hassan', 'Layla Mansour', 'Youssef Adel', 'Nour El-Din', 'Salma Khaled', 'Karim Fathy', 'Mariam Saad', 'Hany Gamal', 'Dina Ashraf', 'Tarek Samir', 'Rana Wael', 'Ali Mostafa'];
const companies = ['Delta Trading', 'Nile Logistics', 'Atlas Foods', 'Orbit Tech', 'Sahara Steel', 'Pyramid Pharma', 'Cairo Textiles', 'Red Sea Marine', 'Alpha Retail', 'Horizon Build', 'Zad Supplies', 'Bright Energy'];
const cities = ['Cairo', 'Alexandria', 'Giza', 'Muscat', 'Dubai', 'Riyadh', 'Amman', 'Doha'];
const slug = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, '.');

@Injectable({ providedIn: 'root' })
export class DataService {
  readonly months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  readonly revenue = [42, 48, 45, 56, 61, 58, 67, 72, 70, 81, 86, 94];
  readonly expenses = [30, 33, 35, 38, 41, 40, 46, 49, 50, 54, 57, 60];
  readonly categories = [
    { label: 'Electronics', value: 38, color: '#206bc4' },
    { label: 'Furniture', value: 24, color: '#4299e1' },
    { label: 'Office supplies', value: 21, color: '#79a6dc' },
    { label: 'Other', value: 17, color: '#bfe399' }
  ];

  readonly customers: Customer[] = names.map((name, i) => ({
    id: i + 1, name, company: companies[i], email: slug(name) + '@' + slug(companies[i]).replace(/\./g, '') + '.com',
    city: cities[i % cities.length], orders: 4 + ((i * 7) % 23), spent: 3200 + ((i * 4137) % 48000)
  }));

  readonly orders: Order[] = Array.from({ length: 48 }, (_, i) => {
    const st: OrderStatus[] = ['Paid', 'Shipped', 'Pending', 'Paid', 'Cancelled', 'Shipped'];
    const d = new Date(2026, 9, 14 - (i % 28));
    return {
      id: 'SO-' + (24100 - i), customer: companies[(i * 5) % companies.length],
      date: d.toISOString(), items: 1 + ((i * 3) % 9), total: 450 + ((i * 1297) % 9800), status: st[(i * 7) % st.length]
    };
  });

  readonly products: Product[] = ([
    ['LAP-1401', 'Business laptop 14"', 'Electronics', 42, 20, 890], ['MON-2702', 'Monitor 27" 4K', 'Electronics', 15, 20, 420],
    ['KEY-0310', 'Wireless keyboard', 'Electronics', 128, 40, 45], ['DSK-1800', 'Standing desk', 'Furniture', 9, 10, 560],
    ['CHR-0455', 'Ergonomic chair', 'Furniture', 33, 15, 310], ['SHF-0912', 'Steel shelf unit', 'Furniture', 61, 20, 120],
    ['PAP-A400', 'A4 paper (box of 5)', 'Office supplies', 240, 100, 18], ['PEN-0020', 'Gel pens (pack of 12)', 'Office supplies', 18, 50, 7],
    ['PRN-3300', 'Laser printer', 'Electronics', 11, 8, 260], ['TON-0870', 'Toner cartridge', 'Office supplies', 72, 30, 64]
  ] as [string, string, string, number, number, number][]).map(([sku, name, category, stock, reorderAt, price]) => ({ sku, name, category, stock, reorderAt, price }));

  readonly employees: Employee[] = names.map((_, i) => {
    const dep = ['Sales', 'Finance', 'Warehouse', 'HR', 'IT', 'Procurement'][i % 6];
    const roles: Record<string, string> = { Sales: 'Account manager', Finance: 'Accountant', Warehouse: 'Stock controller', HR: 'HR specialist', IT: 'Systems engineer', Procurement: 'Buyer' };
    const name = names[(i + 4) % names.length];
    return { id: i + 1, name, role: roles[dep], department: dep, email: slug(name) + '@company.com',
      status: i % 7 === 3 ? 'On leave' : 'Active', joined: new Date(2019 + (i % 7), (i * 5) % 12, 1 + i).toISOString() } as Employee;
  });

  readonly activity = [
    { who: 'Layla Mansour', what: 'approved purchase order PO-5521', when: '12 min ago' },
    { who: 'Karim Fathy', what: 'received 40 units of LAP-1401', when: '1 hour ago' },
    { who: 'Salma Khaled', what: 'issued invoice INV-90318 to Atlas Foods', when: '3 hours ago' },
    { who: 'Hany Gamal', what: 'marked SO-24096 as shipped', when: 'Yesterday' },
    { who: 'Dina Ashraf', what: 'added a new vendor: Zad Supplies', when: 'Yesterday' }
  ];

  readonly vendors = ['Gulf Components', 'Nile Packaging', 'Delta Chemicals', 'Orbit Parts', 'Atlas Metals', 'Zad Supplies'];

  readonly purchaseOrders: PurchaseOrder[] = Array.from({ length: 18 }, (_, i) => {
    const st: PurchaseOrder['status'][] = ['Approved', 'Received', 'Draft', 'Received', 'Approved', 'Cancelled'];
    const d = new Date(2026, 9, 13 - i);
    const e = new Date(d.getTime() + (5 + (i % 6)) * 86400000);
    return { id: 'PO-' + (5560 - i), vendor: this.vendors[(i * 5) % this.vendors.length], date: d.toISOString(), expected: e.toISOString(), total: 800 + ((i * 2113) % 14000), status: st[(i * 5) % st.length] };
  });

  readonly invoices: Invoice[] = Array.from({ length: 20 }, (_, i) => {
    const st: Invoice['status'][] = ['Paid', 'Open', 'Paid', 'Overdue', 'Open', 'Paid'];
    const d = new Date(2026, 9, 20 - i * 2);
    return { id: 'INV-' + (90330 - i), customer: companies[(i * 7) % companies.length], due: d.toISOString(), amount: 900 + ((i * 3371) % 12000), status: st[(i * 5) % st.length] };
  });

  readonly trialBalance: TrialRow[] = [
    { account: 'Cash and bank', debit: 184000, credit: 0 }, { account: 'Accounts receivable', debit: 96500, credit: 0 },
    { account: 'Inventory', debit: 212000, credit: 0 }, { account: 'Fixed assets', debit: 340000, credit: 0 },
    { account: 'Accounts payable', debit: 0, credit: 78300 }, { account: 'Loans', debit: 0, credit: 150000 },
    { account: 'Equity', debit: 0, credit: 250000 }, { account: 'Sales revenue', debit: 0, credit: 354200 }
  ];

  statusColor(s: string): string {
    return ({ Paid: 'green', Shipped: 'blue', Pending: 'orange', Cancelled: 'red', Active: 'green', 'On leave': 'orange', Draft: 'secondary', Approved: 'blue', Received: 'green', Open: 'orange', Overdue: 'red' } as Record<string, string>)[s] ?? 'secondary';
  }
  initials(n: string): string { return n.split(' ').map(p => p[0]).slice(0, 2).join(''); }
}
