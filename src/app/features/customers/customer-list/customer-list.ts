import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { CustomerService } from '../../../core/services/customer.service';
import { Customer } from '../../../models/customer.model';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.scss'
})
export class CustomerList implements OnInit {
  private readonly customerService = inject(CustomerService);

  protected readonly customers = signal<Customer[]>([]);
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected dniFilter = '';
  protected emailFilter = '';

  ngOnInit(): void {
    this.search();
  }

  protected search(): void {
    const dni = this.dniFilter.trim();
    const email = this.emailFilter.trim();

    if (dni && email) {
      this.fetchCustomers(this.customerService.getCustomersByDniAndEmail(dni, email));
    } else if (dni) {
      this.fetchCustomers(this.customerService.getCustomersByDni(dni));
    } else if (email) {
      this.fetchCustomers(this.customerService.getCustomersByEmail(email));
    } else {
      this.fetchCustomers(this.customerService.getCustomers());
    }
  }

  protected clear(): void {
    this.dniFilter = '';
    this.emailFilter = '';
    this.search();
  }

  private fetchCustomers(request: Observable<Customer[]>): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    request.subscribe({
      next: (customers) => {
        this.customers.set(customers);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudo cargar la lista de clientes.');
        this.loading.set(false);
      }
    });
  }
}
