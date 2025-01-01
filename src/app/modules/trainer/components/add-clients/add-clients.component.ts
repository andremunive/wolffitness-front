import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ClientsService } from 'src/app/services/clients.service';
import { CookieStorageService } from 'src/app/services/cookie-storage.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-add-clients',
  templateUrl: './add-clients.component.html',
  styleUrls: ['./add-clients.component.scss'],
})
export class AddClientsComponent {
  registerForm: FormGroup;

  genders = [
    { value: 'male', viewValue: 'Masculino' },
    { value: 'female', viewValue: 'Femenino' },
  ];

  // constructor(
  //   private formBuilder: FormBuilder,
  //   private _cookieStorage: CookieStorageService
  // ) {}

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddClientsComponent>,
    private _cookieStorage: CookieStorageService,
    private _clients: ClientsService,
    private _toast: ToastrService,
    private _global: GlobalService
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      gender: ['', Validators.required],
      birthDate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      whatsapp: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    });
  }

  submit() {
    if (this.registerForm.valid) {
      const user = {
        data: {
          name: this.registerForm.value['fullName'],
          gender: this.registerForm.value['gender'],
          birthDate: this.registerForm.value['birthDate'],
          email: this.registerForm.value['email'],
          whatsapp: this.registerForm.value['whatsapp'],
          trainer: this.getUserName,
          visible: true,
        },
      };
      this._clients.registerUser(user).subscribe(() => {
        this._toast.success('Usuario registrado', 'Exito');
        this.dialogRef.close();
        this._global.updateDataUpdated(true);
      });
    }
  }

  cancel() {
    this.dialogRef.close(); // Solo cierra el modal sin enviar datos
  }

  get getUserName(): string {
    return this._cookieStorage.getCookie('user.name');
  }
}
