import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Customer } from '../../models/customer.model';
import { CreateCustomerRequest } from '../../models/create-customer-request.model';
import { CustomerIndicators } from '../../models/customer-indicators.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/customers';

  createCustomer(request: CreateCustomerRequest): Observable<Customer> {
    return this.http.post<Customer>(this.baseUrl, request);
  }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.baseUrl);
  }

  getCustomersByDni(dni: string): Observable<Customer[]> {
    const params = new HttpParams().set('dni', dni);
    return this.http.get<Customer[]>(this.baseUrl, { params });
  }

  getCustomersByEmail(email: string): Observable<Customer[]> {
    const params = new HttpParams().set('email', email);
    return this.http.get<Customer[]>(this.baseUrl, { params });
  }

  getCustomersByDniAndEmail(dni: string, email: string): Observable<Customer[]> {
    const params = new HttpParams().set('dni', dni).set('email', email);
    return this.http.get<Customer[]>(this.baseUrl, { params });
  }

  getIndicators(): Observable<CustomerIndicators> {
    return this.http.get<CustomerIndicators>(`${this.baseUrl}/indicadores`);
  }
}
