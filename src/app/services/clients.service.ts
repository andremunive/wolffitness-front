import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieStorageService } from './cookie-storage.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ClientModel } from '../core/models/client.model';

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

  getAllUsers(): Observable<ClientModel> {
    const url = `${environment.URL_BASE}${environment.host.users.methods.getUsers}?sort=startDate&?pagination[page]=1&pagination[pageSize]=200`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.cookiesStorageService.getJWT()}`,
    });
    return this.http.get<ClientModel>(url, { headers });
  }

  autocompleteClients(nameStart: string): Observable<ClientModel> {
    const url = `${environment.URL_BASE}${environment.host.users.methods.getUsers}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.cookiesStorageService.getJWT()}`,
    });
    const trainer = this.cookiesStorageService.getCookie('user.name');
    const params = new HttpParams()
      .set('filters[trainer][$eq]', trainer)
      .set('filters[name][$startsWith]', nameStart)
      .set('pagination[pageSize]', '5')
      .set('pagination[page]', '1');

    return this.http.get<ClientModel>(url, { params, headers });
  }

  // makePayment(user: any, id) {
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${this.cookiesStorageService.getJWT()}`,
  //   });
  //   const url = `${environment.URL_BASE}${environment.host.users.methods.getUsers}/${id}`;
  //   return this.http.put(url, user, { headers });
  // }

  getUserByName(userName: string): Observable<ClientModel> {
    const url = `${environment.URL_BASE}${environment.host.users.methods.getUsers}?filters[name][$eq]=${userName}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.cookiesStorageService.getJWT()}`,
    });
    return this.http.get<ClientModel>(url, { headers });
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
}
