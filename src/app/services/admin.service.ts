import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieStorageService } from './cookie-storage.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ClientGeneralSummary } from '../core/models/clients-general-summary';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(
    private http: HttpClient,
    private cookiesStorageService: CookieStorageService
  ) {}

  getCLientGeneralSummary(months: number): Observable<ClientGeneralSummary> {
    const URL = `${environment.URL_BASE}${environment.host.payment.methods.paymentRecords}${environment.host.admin.methods.clientGeneralSummary}${months}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.cookiesStorageService.getJWT()}`,
    });
    return this.http.get<ClientGeneralSummary>(URL, { headers });
  }
}
