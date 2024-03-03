import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ErrorsEnum } from 'src/app/core/enum/errors.enum';
import { RolesEnum } from 'src/app/core/enum/roles.enum';
import { UserAuthModel } from 'src/app/core/models/user-auth.model';
import { AuthService } from 'src/app/services/auth.service';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      user: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.auth
        .login(this.loginForm.value['user'], this.loginForm.value['password'])
        .subscribe(
          (res: UserAuthModel) => {
            this.auth.saveLogin(res);
            this.loginRedirect(res.user.wfRole);
          },
          (error) => {
            if (error.error.error.message === ErrorsEnum.USER_NOT_FOUND) {
              this.toast.error('Revisa el usuario o la contraseña', 'Error');
            }
          }
        );
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  loginRedirect(role: RolesEnum) {
    this.router.navigate([`/${role}`]);
  }
}
