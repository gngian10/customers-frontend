import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.scss'
})
export class CustomerForm {
  private readonly fb = inject(FormBuilder);
  private readonly customerService = inject(CustomerService);
  private readonly dialogRef = inject(MatDialogRef<CustomerForm>);

  protected readonly submitting = signal(false);
  protected readonly apiErrorMessage = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    fechaNacimiento: ['', [Validators.required, futureDateValidator]]
  });

  protected submit(): void {
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
        this.dialogRef.close(true);
      },
      error: (error: HttpErrorResponse) => {
        this.submitting.set(false);
        this.handleError(error);
      }
    });
  }

  protected cancel(): void {
    this.dialogRef.close(false);
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
