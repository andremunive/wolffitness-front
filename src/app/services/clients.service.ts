import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  getUsersByTrainerLogged(): Observable<ClientModel> {
    const trainer = this.cookiesStorageService.getCookie('user.name');
    const url = `${environment.URL_BASE}${environment.host.users.methods.getUsers}?filters[trainer][$eq]=${trainer}&?sort=startDate&?pagination[page]=1&pagination[pageSize]=200`;
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

  makePayment(user: any, id) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.cookiesStorageService.getJWT()}`,
    });
    const url = `${environment.URL_BASE}${environment.host.users.methods.getUsers}/${id}`;
    return this.http.put(url, user, { headers });
  }

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
