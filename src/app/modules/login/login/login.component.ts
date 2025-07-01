import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ErrorsEnum } from 'src/app/core/enum/errors.enum';
import { RolesEnum } from 'src/app/core/enum/roles.enum';
import { UserAuthModel } from 'src/app/core/models/user-auth.model';
import { AuthService } from 'src/app/services/auth.service';
import { AuthV2Service } from 'src/app/services/authv2.service';
import { CookieStorageService } from 'src/app/services/cookie-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private toast: ToastrService,
    private router: Router,
    private _cookies: CookieStorageService,
    private authv2: AuthV2Service
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      user: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  async onSubmit() {
    try {
      await this.authv2.login(
        this.loginForm.value['user'],
        this.loginForm.value['password']
      );
      this.router.navigate([`/trainer`]);
    } catch (err: any) {
      console.error(err);
    }
    // if (this.loginForm.valid) {
    //   this.auth
    //     .login(this.loginForm.value['user'], this.loginForm.value['password'])
    //     .pipe(
    //       switchMap((response: UserAuthModel) => {
    //         this.auth.saveLogin(response);
    //         this.loginRedirect(response.user.wfRole);
    //         if (response.user.wfRole == 'trainer') {
    //           return this.auth.getTrainerInfo(response.user.name);
    //         }
    //         return of(null);
    //       }),
    //       catchError((error) => {
    //         if (error.error.error.message === ErrorsEnum.USER_NOT_FOUND) {
    //           this.toast.error('Revisa el usuario o la contraseña', 'Error');
    //         }
    //         return of(null);
    //       })
    //     )
    //     .subscribe({
    //       next: (trainerResponse: any) => {
    //         this._cookies.setCookie('user.id', trainerResponse?.data[0].id);
    //       },
    //       error: () => {
    //         this.toast.error('Error encontrando al entrenador', 'Error');
    //       },
    //     });
    // } else {
    //   this.loginForm.markAllAsTouched();
    // }
  }

  loginRedirect(role: RolesEnum) {
    this.router.navigate([`/${role}`]);
  }
}
