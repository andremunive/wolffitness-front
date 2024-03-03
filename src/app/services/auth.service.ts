import { Injectable } from '@angular/core';
import { CookieStorageService } from './cookie-storage.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserAuthModel } from '../core/models/user-auth.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private cookiesStorageService: CookieStorageService,
    private http: HttpClient,
    private router: Router
  ) {}

  login(user: string, password: string): Observable<UserAuthModel> {
    const credentials = {
      identifier: user,
      password: password,
    };
    const url = `${environment.URL_BASE}${environment.host.auth.methods.login}`;
    return this.http.post<UserAuthModel>(url, credentials);
  }

  saveLogin(user: UserAuthModel) {
    this.cookiesStorageService.setCookie('user.jwt', user.jwt);
    this.cookiesStorageService.setCookie('user.name', user.user.name);
    this.cookiesStorageService.setCookie('user.role', user.user.wfRole);
  }

  logOut() {
    this.cookiesStorageService.deleteCookie('user.jwt');
    this.cookiesStorageService.deleteCookie('user.name');
    this.cookiesStorageService.deleteCookie('user.role');
    this.router.navigate([`/`]);
  }
}
