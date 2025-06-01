import { Injectable } from '@angular/core';
import { CookieStorageService } from './cookie-storage.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { UserAuthModel } from '../core/models/user-auth.model';
import { Router } from '@angular/router';
import { LoaderService } from '../core/services/loader.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private cookiesStorageService: CookieStorageService,
    private http: HttpClient,
    private router: Router,
    private _loader: LoaderService
  ) {}

  login(user: string, password: string): Observable<UserAuthModel> {
    const credentials = {
      identifier: user,
      password: password,
    };
    const url = `${environment.URL_BASE}${environment.host.auth.methods.login}`;
    this._loader.show();
    return this.http.post<UserAuthModel>(url, credentials).pipe(
      tap((res: UserAuthModel) => {
        this.saveLogin(res);
        this.router.navigate(['']);
      }),
      catchError((error) => {
        return throwError(() => error);
      }),
      finalize(() => this._loader.hide())
    );
  }

  saveLogin(user: UserAuthModel) {
    this.cookiesStorageService.setCookie('user.jwt', user.jwt);
    this.cookiesStorageService.setCookie('user.name', user.user.name);
    this.cookiesStorageService.setCookie('user.role', user.user.wfRole);
    this.setValidPermissions(user.user.permissions);
  }

  getTrainerInfo(trainerName: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.cookiesStorageService.getJWT()}`,
    });
    const url = `${environment.URL_BASE}${environment.host.users.methods.getTrainers}?filters[name][$eq]=${trainerName}`;
    return this.http.get(url, { headers });
  }

  setValidPermissions(permissions: Record<string, boolean>) {
    const validPermissions = Object.entries(permissions)
      .filter(([_, value]) => value === true)
      .reduce((acc, [key, _]) => {
        acc[key] = true;
        return acc;
      }, {} as Record<string, boolean>);

    this.cookiesStorageService.setCookie(
      'permissions',
      JSON.stringify(validPermissions)
    );
  }

  logOut() {
    this.cookiesStorageService.deleteCookie('user.jwt');
    this.cookiesStorageService.deleteCookie('user.name');
    this.cookiesStorageService.deleteCookie('user.role');
    this.cookiesStorageService.deleteCookie('permissions');
    this.router.navigate([`/login`]);
  }
}
