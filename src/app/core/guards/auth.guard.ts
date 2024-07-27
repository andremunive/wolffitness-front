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
    const logged = this.cookieStorageService.getCookie('user.role');
    if (logged) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
