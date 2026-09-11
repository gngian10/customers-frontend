import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';

import { CustomerService } from '../../../core/services/customer.service';
import { Customer } from '../../../models/customer.model';
import { CustomerForm } from '../customer-form/customer-form';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTableModule
  ],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.scss'
})
export class CustomerList implements OnInit {
  private readonly customerService = inject(CustomerService);
  private readonly dialog = inject(MatDialog);

  protected readonly customers = signal<Customer[]>([]);
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly displayedColumns = [
    'nombre',
    'apellido',
    'email',
    'dni',
    'fechaNacimiento',
    'fechaCreacion'
  ];

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

  protected openCreateCustomerDialog(): void {
    this.dialog
      .open(CustomerForm, {
        width: '600px',
        maxWidth: '95vw'
      })
      .afterClosed()
      .subscribe((created) => {
        if (created) {
          this.search();
        }
      });
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
