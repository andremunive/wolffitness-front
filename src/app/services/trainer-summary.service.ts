import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieStorageService } from './cookie-storage.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import {
  ClientModel,
  ClientModelSearch,
  SingleCLient,
} from '../core/models/client.model';
import { FiltersModel } from '../core/models/filter.model';
import { ClientCountsResponse } from '../core/models/clients-count';
import { PaymentSummaryResponse } from '../core/models/payment-summary';
import { AllTrainersClientSummaryResponse } from '../core/models/all-clients-count';
import { AllTrainersClientAccountsResponse } from '../core/models/all-payment-summary';
import { ClientsSummary } from '../core/models/clients-summary';

@Injectable({
  providedIn: 'root',
})
export class TrainerSummaryService {
  trainer = '';
  constructor(
    private http: HttpClient,
    private _cookies: CookieStorageService
  ) {
    this.trainer = this._cookies.getCookie('user.name');
  }

  getClientsSummary(months: number): Observable<ClientsSummary> {
    const TRAINERID = this._cookies.getCookie('user.id');
    const URL = `${environment.URL_BASE}${environment.host.payment.methods.paymentRecords}${environment.host.trainer.methods.clientsSummary}${TRAINERID}/${months}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this._cookies.getJWT()}`,
    });
    return this.http.get<ClientsSummary>(URL, { headers });
  }
}
