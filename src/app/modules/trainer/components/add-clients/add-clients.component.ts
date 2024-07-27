import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieStorageService } from 'src/app/services/cookie-storage.service';

@Component({
  selector: 'app-add-clients',
  templateUrl: './add-clients.component.html',
  styleUrls: ['./add-clients.component.scss'],
})
export class AddClientsComponent implements OnInit {
  @Output() register = new EventEmitter();

  registerUserForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private _cookieStorage: CookieStorageService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.registerUserForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      whatsapp: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      hasPaid: [true],
      plan: ['6 dias a la semana', [Validators.required]],
      discount: [false, [Validators.required]],
      discountDescription: [''],
      monthlyPayment: [60000, [Validators.required]],
    });
  }

  registerUser() {
    if (this.registerUserForm.valid) {
      const user = {
        data: {
          name: this.registerUserForm.value['name'],
          whatsapp: this.registerUserForm.value['whatsapp'],
          startDate: this.registerUserForm.value['startDate'],
          endDate: this.registerUserForm.value['endDate'],
          plan: this.registerUserForm.value['plan'],
          discount: this.registerUserForm.value['discount'],
          hasPaid: this.registerUserForm.value['hasPaid'],
          discountDescription:
            this.registerUserForm.value['discountDescription'],
          monthlyPayment: this.registerUserForm.value['monthlyPayment'],
          trainer: this.getUserName,
        },
      };
      this.register.emit(user);
      this.initForm();
    }
  }

  get getUserName(): string {
    return this._cookieStorage.getCookie('user.name');
  }
}
