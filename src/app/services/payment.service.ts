import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieStorageService } from './cookie-storage.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ClientModel } from '../core/models/client.model';
import { PaymentRecordResponse } from '../core/models/payment-record.model';
import {
  AllPaymentSummaryResponse,
  PaymentSummaryResponse,
} from '../core/models/payment-summary.model';

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
    const trainerId = this.cookiesStorageService.getCookie('user.id');
    const payload = {
      data: {
        ...paymentRecord,
        client: clientId, // Relación con el cliente
        trainer: +trainerId,
      },
    };
    return this.http.post(URL, payload, { headers });
  }

  updateClient(payload: any, clientId: number) {
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

  getLastThreePayments(clientId): Observable<PaymentRecordResponse> {
    const url = `${environment.URL_BASE}${environment.host.payment.methods.lastThreePayments}/${clientId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.cookiesStorageService.getJWT()}`,
    });
    return this.http.get<PaymentRecordResponse>(url, { headers });
  }

  updatePaymentRecord(paymentRecordId: number, status: string, date: Date) {
    const url = `${environment.URL_BASE}${environment.host.payment.methods.paymentRecords}${paymentRecordId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.cookiesStorageService.getJWT()}`,
    });
    const payload = {
      data: {
        currentPaymentStatus: status,
        receiptDate: date,
      },
    };
    return this.http.put(url, payload, { headers });
  }
}
