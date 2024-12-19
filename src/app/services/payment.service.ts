import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieStorageService } from './cookie-storage.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ClientModel } from '../core/models/client.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(
    private http: HttpClient,
    private cookiesStorageService: CookieStorageService
  ) {}

  makePayment(paymentRecord: any, clientId: number) {
    const URL = `${environment.URL_BASE}${environment.host.payment.methods.paymentRecords}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.cookiesStorageService.getJWT()}`,
    });
    const payload = {
      data: {
        ...paymentRecord,
        client: clientId, // Relación con el cliente
      },
    };
    return this.http.post(URL, payload, { headers });
  }

  updateClientPaymentData(payload: any, clientId: number) {
    const url = `${environment.URL_BASE}${environment.host.users.methods.getUsers}/${clientId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.cookiesStorageService.getJWT()}`,
    });
    return this.http.put(url, payload, { headers });
  }

  findPaymentRecord(clientId: number, endDate: string) {
    const url = `${environment.URL_BASE}${environment.host.payment.methods.paymentRecords}?filters[client][id][$eq]=${clientId}&filters[dueDate][$eq]=${endDate}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.cookiesStorageService.getJWT()}`,
    });
    return this.http.get(url, { headers });
  }

  updatePaymentRecord(paymentRecordId: number, status: string) {
    const url = `${environment.URL_BASE}${environment.host.payment.methods.paymentRecords}/${paymentRecordId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.cookiesStorageService.getJWT()}`,
    });
    const payload = {
      data: {
        status: status,
      },
    };
    return this.http.put(url, payload, { headers });
  }
}
