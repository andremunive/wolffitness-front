import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class CookieStorageService {
  constructor(private cookieService: CookieService) {}

  getPermissions(): Record<string, boolean> {
    const raw = this.cookieService.get('permissions');
    return raw ? JSON.parse(raw) : {};
  }

  setCookie(key: string, value: string) {
    this.cookieService.set(key, value);
  }

  getCookie(key: string): string {
    return this.cookieService.get(key);
  }

  deleteCookie(key: string) {
    this.cookieService.delete(key);
  }

  getJWT() {
    return this.getCookie('user.jwt');
  }
}
