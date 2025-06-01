import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, of, switchMap } from 'rxjs';
import { ErrorsEnum } from 'src/app/core/enum/errors.enum';
import { RolesEnum } from 'src/app/core/enum/roles.enum';
import { UserAuthModel } from 'src/app/core/models/user-auth.model';
import { AuthService } from 'src/app/services/auth.service';
import { CookieStorageService } from 'src/app/services/cookie-storage.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  hidePassword = true;

  loginForm = this.formBuilder.group({
    user: ['', Validators.required],
    password: ['', Validators.required],
  });
  constructor(
    private formBuilder: FormBuilder,
    private _auth: AuthService,
    private toast: ToastrService,
    private router: Router,
    private _cookies: CookieStorageService
  ) {}

  login() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const user = this.loginForm.value['user'];
    const password = this.loginForm.value['password'];
    this._auth.login(user, password).subscribe({
      error: () =>
        this.toast.error('Revisa el usuario o la contraseña', 'Error'),
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this._auth
        .login(this.loginForm.value['user'], this.loginForm.value['password'])
        .pipe(
          switchMap((response: UserAuthModel) => {
            this._auth.saveLogin(response);
            this.loginRedirect(response.user.wfRole);
            if (response.user.wfRole == 'trainer') {
              return this._auth.getTrainerInfo(response.user.name);
            }
            return of(null);
          }),
          catchError((error) => {
            if (error.error.error.message === ErrorsEnum.USER_NOT_FOUND) {
              this.toast.error('Revisa el usuario o la contraseña', 'Error');
            }
            return of(null);
          })
        )
        .subscribe({
          next: (trainerResponse: any) => {
            this._cookies.setCookie('user.id', trainerResponse?.data[0].id);
          },
          error: () => {
            this.toast.error('Error encontrando al entrenador', 'Error');
          },
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  loginRedirect(role: RolesEnum) {
    this.router.navigate([`/${role}`]);
  }
}
