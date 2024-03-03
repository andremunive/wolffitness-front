import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs';
import { ClientModel, Datum } from 'src/app/core/models/client.model';
import { AuthService } from 'src/app/services/auth.service';
import { ClientsService } from 'src/app/services/clients.service';
import { CookieStorageService } from 'src/app/services/cookie-storage.service';

@Component({
  selector: 'app-trainer',
  templateUrl: './trainer.component.html',
  styleUrls: ['./trainer.component.scss'],
})
export class TrainerComponent implements OnInit {
  actionActive: string = 'clients';
  user: string = '';
  clients: Datum[];
  makePaymentForm: FormGroup;
  registerUserForm: FormGroup;

  constructor(
    private cookieStorageService: CookieStorageService,
    private clientService: ClientsService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getUsers();
    this.initForm();
  }

  initForm() {
    this.makePaymentForm = this.formBuilder.group({
      name: ['Selecciona un cliente...', [Validators.required]],
      startDate: ['', [Validators.required]],
      plan: ['Selecciona un plan...', [Validators.required]],
      discount: [false, [Validators.required]],
      discountDescription: [''],
      monthlyPayment: [40000, [Validators.required]],
    });

    this.registerUserForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      whatsapp: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      plan: ['Selecciona un plan...', [Validators.required]],
      discount: [false, [Validators.required]],
      discountDescription: [''],
      monthlyPayment: [40000, [Validators.required]],
    });
  }

  get getUserName(): string {
    return this.cookieStorageService.getCookie('user.name');
  }

  getUsers() {
    this.clientService
      .getUsersByTrainerLogged()
      .subscribe((res: ClientModel) => {
        this.clients = res.data;
      });
  }

  isActive(date: Date): string {
    const dateFormat = new Date(date);

    const currentDate = new Date();

    if (dateFormat >= currentDate) {
      return 'Si';
    } else {
      return 'No';
    }
  }

  getEndDate(startDate: Date): string {
    const copyDate = new Date(startDate);
    let endDate = new Date(copyDate.setMonth(copyDate.getMonth() + 1));

    const year = endDate.getFullYear();
    const month = (endDate.getMonth() + 1).toString().padStart(2, '0'); // Agregar 1 porque los meses son de 0 a 11
    const day = endDate.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  pay(): void {
    if (this.makePaymentForm.valid) {
      let id;
      const startDate = this.makePaymentForm.value['startDate'];
      const user = {
        data: {
          startDate: this.makePaymentForm.value['startDate'],
          endDate: this.getEndDate(startDate),
          plan: this.makePaymentForm.value['plan'],
          discount: this.makePaymentForm.value['discount'],
          discountDescription:
            this.makePaymentForm.value['discountDescription'],
          monthlyPayment: this.makePaymentForm.value['monthlyPayment'],
        },
      };

      this.clientService
        .getUserByName(this.makePaymentForm.value['name'])
        .pipe(
          switchMap((res: ClientModel) => {
            return this.clientService.makePayment(user, res.data[0].id);
          })
        )
        .subscribe(() => {
          this.initForm();
          this.toast.success('Pago registrado', 'Exito');
          this.getUsers();
        });
    }
  }

  registerUser() {
    if (this.registerUserForm.valid) {
      const startDate = this.registerUserForm.value['startDate'];

      const user = {
        data: {
          name: this.registerUserForm.value['name'],
          whatsapp: this.registerUserForm.value['whatsapp'],
          startDate: this.registerUserForm.value['startDate'],
          endDate: this.getEndDate(startDate),
          plan: this.registerUserForm.value['plan'],
          discount: this.registerUserForm.value['discount'],
          discountDescription:
            this.makePaymentForm.value['discountDescription'],
          monthlyPayment: this.makePaymentForm.value['monthlyPayment'],
          trainer: this.getUserName,
        },
      };

      this.clientService.registerUser(user).subscribe(() => {
        this.initForm();
        this.toast.success('Usuario registrado', 'Exito');
        this.getUsers();
      });
    }
  }

  logOut() {
    this.authService.logOut();
  }
}
