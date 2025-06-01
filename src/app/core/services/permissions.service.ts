import { Injectable } from '@angular/core';
import { CookieStorageService } from 'src/app/services/cookie-storage.service';
import { UserPermissions } from '../models/user-auth.model';
import { RolesEnum } from '../enum/roles.enum';

@Injectable({
  providedIn: 'root', // Asegura que sea singleton
})
export class PermissionsService {
  constructor(private _cookiesStorage: CookieStorageService) {}

  get permissions(): UserPermissions {
    const permissionsCookie = this._cookiesStorage.getCookie('permissions');
    if (!permissionsCookie) return null;
    return JSON.parse(permissionsCookie);
  }

  get role(): RolesEnum {
    return this._cookiesStorage.getCookie('user.role') as RolesEnum;
  }
}
