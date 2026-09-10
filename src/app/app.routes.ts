import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'customers',
    loadComponent: () =>
      import('./features/customers/customer-list/customer-list').then((m) => m.CustomerList)
  },
  {
    path: 'customers/new',
    loadComponent: () =>
      import('./features/customers/customer-form/customer-form').then((m) => m.CustomerForm)
  },
  { path: '', pathMatch: 'full', redirectTo: 'customers' }
];
