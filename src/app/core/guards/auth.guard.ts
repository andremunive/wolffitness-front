import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { CookieStorageService } from 'src/app/services/cookie-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private cookieStorageService: CookieStorageService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const logged = this.cookieStorageService.getCookie('logged');
    if (logged && logged === 'true') {
      return true;
    } else {
      console.log('sdfsdffsdsdf');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
