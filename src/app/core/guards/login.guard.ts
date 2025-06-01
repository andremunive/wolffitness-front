import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  UrlTree,
} from '@angular/router';
import { CookieStorageService } from 'src/app/services/cookie-storage.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(
    private _cookiesStorage: CookieStorageService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const jwt = this._cookiesStorage.getCookie('user.jwt');
    const permissionsCookie = this._cookiesStorage.getCookie('permissions');

    if (!jwt || !permissionsCookie) {
      return true;
    }

    try {
      const permissions = JSON.parse(permissionsCookie);
      const hasPermission = permissions['home'] === true;

      if (hasPermission) {
        return this.router.parseUrl(''); // Puedes crear una página de acceso denegado
      } else {
        return true;
      }
    } catch (e) {
      console.error('Error al parsear permisos:', e);
      return this.router.parseUrl('');
    }
  }
}
