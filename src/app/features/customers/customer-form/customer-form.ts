import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CustomerService } from '../../../core/services/customer.service';
import { ApiError } from '../../../models/api-error.model';
import { CreateCustomerRequest } from '../../../models/create-customer-request.model';

function futureDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  const inputDate = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return inputDate > today ? { futureDate: true } : null;
}

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.scss'
})
export class CustomerForm {
  private readonly fb = inject(FormBuilder);
  private readonly customerService = inject(CustomerService);

  protected readonly submitting = signal(false);
  protected readonly apiErrorMessage = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    fechaNacimiento: ['', [Validators.required, futureDateValidator]]
  });

  protected submit(): void {
    this.successMessage.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.apiErrorMessage.set(null);
    this.submitting.set(true);

    const request: CreateCustomerRequest = this.form.getRawValue();

    this.customerService.createCustomer(request).subscribe({
      next: () => {
        this.submitting.set(false);
        this.successMessage.set('Cliente creado correctamente.');
        this.apiErrorMessage.set(null);
        this.form.reset();
      },
      error: (error: HttpErrorResponse) => {
        this.submitting.set(false);
        this.handleError(error);
      }
    });
  }

  protected resetForm(): void {
    this.form.reset();
    this.apiErrorMessage.set(null);
    this.successMessage.set(null);
  }

  private handleError(error: HttpErrorResponse): void {
    const apiError = error.error as ApiError | undefined;

    if (error.status === 400 && apiError?.errors) {
      for (const [field, message] of Object.entries(apiError.errors)) {
        const control = this.form.get(field);
        if (control) {
          control.setErrors({ backend: message });
          control.markAsTouched();
        }
      }
      this.apiErrorMessage.set(apiError.message);
      return;
    }

    if (error.status === 409 && apiError?.message) {
      this.apiErrorMessage.set(apiError.message);
      return;
    }

    this.apiErrorMessage.set('No se pudo crear el cliente.');
  }
}
