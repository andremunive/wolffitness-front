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

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  constructor(
    private http: HttpClient,
    private cookiesStorageService: CookieStorageService
  ) {}

  getUsersByTrainerLogged(
    pageSize: string,
    page: string
  ): Observable<ClientModel> {
    const trainer = this.cookiesStorageService.getCookie('user.name');
    const url = `${environment.URL_BASE}${environment.host.users.methods.getByTrainer}/${trainer}?page=${page}&pageSize=${pageSize}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.cookiesStorageService.getJWT()}`,
    });

    return this.http.get<ClientModel>(url, { headers });
  }

  getAllUsers(
    pageSize: string,
    page: string,
    filters?: FiltersModel
  ): Observable<ClientModelSearch> {
    const url = `${environment.URL_BASE}${environment.host.users.methods.getUsers}?pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.cookiesStorageService.getJWT()}`,
    });

    // Inicializar parámetros
    let params = new HttpParams();

    // Agregar filtro por trainer si existe
    if (filters?.trainer) {
      params = params.set('filters[trainer][$eq]', filters.trainer);
    }

    // Agregar filtro por quincena si existe
    if (filters?.fortNight) {
      const startOfMonth = new Date();
      const midOfMonth = new Date();
      const endOfMonth = new Date();

      startOfMonth.setMonth(startOfMonth.getMonth() + 1, 1); // Primer día del próximo mes
      midOfMonth.setMonth(midOfMonth.getMonth() + 1, 15); // Día 15 del próximo mes
      endOfMonth.setMonth(endOfMonth.getMonth() + 2, 0);

      if (filters.fortNight === '1') {
        params = params
          .set('filters[endDate][$gte]', startOfMonth.toISOString())
          .set('filters[endDate][$lte]', midOfMonth.toISOString());
      } else if (filters.fortNight === '2') {
        params = params
          .set('filters[endDate][$gte]', midOfMonth.toISOString())
          .set('filters[endDate][$lte]', endOfMonth.toISOString());
      }
    }

    // Realizar la petición con o sin parámetros
    if (params.keys().length) {
      return this.http.get<ClientModelSearch>(url, { params, headers });
    } else {
      return this.http.get<ClientModelSearch>(url, { headers });
    }
  }

  getUserByName(
    userName: string,
    allClients?: boolean
  ): Observable<ClientModelSearch> {
    const trainer = this.cookiesStorageService.getCookie('user.name');
    const url = `${environment.URL_BASE}${environment.host.users.methods.getUsers}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.cookiesStorageService.getJWT()}`,
    });
    const params = allClients
      ? new HttpParams().set('filters[name][$startsWith]', userName)
      : new HttpParams()
          .set('filters[trainer][$eq]', trainer)
          .set('filters[name][$startsWith]', userName);
    return this.http.get<ClientModelSearch>(url, { params, headers });
  }

  getUserById(userId: string): Observable<SingleCLient> {
    const url = `${environment.URL_BASE}${environment.host.users.methods.getUsers}/${userId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.cookiesStorageService.getJWT()}`,
    });
    return this.http.get<SingleCLient>(url, { headers });
  }

  registerUser(user: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.cookiesStorageService.getJWT()}`,
    });
    const url = `${environment.URL_BASE}${environment.host.users.methods.getUsers}`;
    return this.http.post(url, user, { headers });
  }

  getTrainers(): Observable<ClientModel> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.cookiesStorageService.getJWT()}`,
    });
    const url = `${environment.URL_BASE}${environment.host.users.methods.getTrainers}`;
    return this.http.get<ClientModel>(url, { headers });
  }

  updateClient(payload: any, clientId: number) {
    const url = `${environment.URL_BASE}${environment.host.users.methods.getUsers}/${clientId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.cookiesStorageService.getJWT()}`,
    });
    return this.http.put(url, payload, { headers });
  }
}
