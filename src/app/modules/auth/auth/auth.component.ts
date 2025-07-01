import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, of, switchMap } from 'rxjs';
import { ErrorsEnum } from 'src/app/core/enum/errors.enum';
import { RolesEnum } from 'src/app/core/enum/roles.enum';
import { UserAuthModel } from 'src/app/core/models/user-auth.model';
import { AuthService } from 'src/app/services/auth.service';
import { AuthV2Service } from 'src/app/services/authv2.service';
import { CookieStorageService } from 'src/app/services/cookie-storage.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  hidePassword = true;

  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
  constructor(
    private formBuilder: FormBuilder,
    private _auth: AuthService,
    private authv2: AuthV2Service,
    private toast: ToastrService,
    private router: Router,
    private _cookies: CookieStorageService
  ) {}

  login() {
    this.authv2
      .login(this.loginForm.value['email'], this.loginForm.value['password'])
      .subscribe({
        next: () => this.router.navigate(['/home']),
        error: (err) => console.error('Error: ', err),
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
