import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CustomerService } from './customer.service';
import { Customer } from '../../models/customer.model';
import { CreateCustomerRequest } from '../../models/create-customer-request.model';
import { CustomerIndicators } from '../../models/customer-indicators.model';

describe('CustomerService', () => {
  let service: CustomerService;
  let httpTestingController: HttpTestingController;
  const baseUrl = 'http://localhost:8080/api/customers';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(CustomerService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create a customer via POST and return the backend response', () => {
    const request: CreateCustomerRequest = {
      nombre: 'John',
      apellido: 'Doe',
      email: 'john.doe@email.com',
      dni: '12345678',
      fechaNacimiento: '1995-04-15',
    };

    const response: Customer = {
      id: 1,
      nombre: 'John',
      apellido: 'Doe',
      email: 'john.doe@email.com',
      dni: '12345678',
      fechaCreacion: '2026-09-10T17:23:22.322599',
      fechaNacimiento: '1995-04-15',
    };

    let actual: Customer | undefined;
    service.createCustomer(request).subscribe((result) => (actual = result));

    const req = httpTestingController.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    expect(req.request.body.id).toBeUndefined();
    expect(req.request.body.fechaCreacion).toBeUndefined();

    req.flush(response);

    expect(actual).toEqual(response);
  });

  it('should propagate a 409 Conflict error when the DNI is duplicated', () => {
    const request: CreateCustomerRequest = {
      nombre: 'John',
      apellido: 'Doe',
      email: 'john.doe@email.com',
      dni: '12345678',
      fechaNacimiento: '1995-04-15',
    };

    const backendError = {
      status: 409,
      message: 'Ya existe un cliente con el DNI: 12345678',
      timestamp: '2026-09-10T17:30:00',
    };

    let actualError: HttpErrorResponse | undefined;
    service.createCustomer(request).subscribe({
      next: () => {
        throw new Error('expected the request to fail with a 409 error');
      },
      error: (err: HttpErrorResponse) => (actualError = err),
    });

    const req = httpTestingController.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');

    req.flush(backendError, { status: 409, statusText: 'Conflict' });

    expect(actualError).toBeDefined();
    expect(actualError?.status).toBe(409);
    expect(actualError?.error).toEqual(backendError);
  });

  it('should fetch customer indicators via GET and return the backend response', () => {
    const indicators: CustomerIndicators = {
      natalidadPorMesAnio: [
        {
          mes: 5,
          anio: 1994,
          cantidad: 2,
          tasaNatalidad: 33.33,
        },
        {
          mes: 4,
          anio: 1995,
          cantidad: 1,
          tasaNatalidad: 16.67,
        },
      ],
      mesAnioConMayorNatalidad: {
        mes: 5,
        anio: 1994,
        cantidad: 2,
        tasaNatalidad: 33.33,
      },
      mesAnioConMenorNatalidad: {
        mes: 4,
        anio: 1995,
        cantidad: 1,
        tasaNatalidad: 16.67,
      },
    };

    let actual: CustomerIndicators | undefined;
    service.getIndicators().subscribe((result) => (actual = result));

    const req = httpTestingController.expectOne(`${baseUrl}/indicadores`);
    expect(req.request.method).toBe('GET');

    req.flush(indicators);

    expect(actual).toEqual(indicators);
  });
});
