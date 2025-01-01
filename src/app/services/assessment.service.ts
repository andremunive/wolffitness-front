import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieStorageService } from './cookie-storage.service';
import { BodyMeasurementResponse } from '../core/models/measurement.mode';

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {
  private apiUrl = `${environment.URL_BASE}${environment.host.measurement.methods.measurements}`;

  constructor(
    private http: HttpClient,
    private cookiesStorageService: CookieStorageService
  ) {}

  createMeasurement(measurementData: any, clientId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.cookiesStorageService.getJWT()}`,
    });
    const payload = {
      data: {
        ...measurementData,
        client: clientId, // Relación con el cliente
      },
    };
    return this.http.post(this.apiUrl, payload, { headers });
  }

  getLastThreeMeasurements(clientId): Observable<BodyMeasurementResponse> {
    const url = `${environment.URL_BASE}${environment.host.measurement.methods.lastThreeMeasurements}/${clientId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.cookiesStorageService.getJWT()}`,
    });
    return this.http.get<BodyMeasurementResponse>(url, { headers });
  }
}
