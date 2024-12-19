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
  @Output() register = new EventEmitter();
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

  // ngOnInit(): void {
  //   this.initForm();
  // }

  // initForm() {
  //   this.registerUserForm = this.formBuilder.group({
  //     name: ['', [Validators.required]],
  //     birthDate: ['', [Validators.required]],
  //     email: ['', [Validators.required]],
  //     whatsapp: ['', [Validators.required]],
  //     gender: ['', [Validators.required]],
  //   });
  // }

  // registerUser() {
  //   if (this.registerUserForm.valid) {
  //     const user = {
  //       data: {
  //         name: this.registerUserForm.value['name'],
  //         whatsapp: this.registerUserForm.value['whatsapp'],
  //         birthDate: this.registerUserForm.value['birthDate'],
  //         email: this.registerUserForm.value['email'],
  //         gender: this.registerUserForm.value['gender'],
  //         // trainer: this.getUserName,
  //       },
  //     };
  //     this.register.emit(user);
  //     this.initForm();
  //   }
  // }

  // calculateNextMonth(inputDate: string | Date): Date {
  //   // Forzar la hora local para evitar el ajuste
  //   const date =
  //     typeof inputDate === 'string'
  //       ? new Date(`${inputDate}T00:00:00`)
  //       : new Date(inputDate);

  //   console.log('inputDate: ', inputDate);
  //   console.log('date: ', date);

  //   // Guardar el día original
  //   const originalDay = date.getDate();

  //   // Sumar un mes
  //   const nextMonth = new Date(date);
  //   nextMonth.setMonth(nextMonth.getMonth() + 1);

  //   // Ajustar si el mes tiene menos días
  //   if (nextMonth.getDate() < originalDay) {
  //     nextMonth.setDate(0);
  //   }

  //   return nextMonth;
  // }

  cancel() {
    this.dialogRef.close(); // Solo cierra el modal sin enviar datos
  }

  get getUserName(): string {
    return this._cookieStorage.getCookie('user.name');
  }
}
