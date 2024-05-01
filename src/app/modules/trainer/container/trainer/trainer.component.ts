import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
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
  copyClients: Datum[];
  makePaymentForm: FormGroup;
  registerUserForm: FormGroup;
  filterForm: FormGroup;

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
    this.initFilterForm();
    this.toFilter();
  }

  initForm() {
    this.makePaymentForm = this.formBuilder.group({
      name: ['Selecciona un cliente...', [Validators.required]],
      startDate: ['', [Validators.required]],
      plan: ['6 dias a la semana', [Validators.required]],
      discount: [false, [Validators.required]],
      discountDescription: [''],
      monthlyPayment: [40000, [Validators.required]],
    });

    this.registerUserForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      whatsapp: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      plan: ['6 dias a la semana', [Validators.required]],
      discount: [false, [Validators.required]],
      discountDescription: [''],
      monthlyPayment: [40000, [Validators.required]],
    });
  }

  get clientsMoney() {
    let sum = 0;
    this.clients.map((client) => {
      sum = sum + client.attributes.monthlyPayment;
    });
    return sum;
  }

  get getUserName(): string {
    return this.cookieStorageService.getCookie('user.name');
  }

  getUsers() {
    this.clientService
      .getUsersByTrainerLogged()
      .subscribe((res: ClientModel) => {
        this.clients = res.data;
        this.copyClients = res.data;
      });
  }

  isActive(date: Date): string {
    let dateFormat = new Date(date);
    dateFormat.setHours(0, 0, 0, 0);
    dateFormat.setDate(dateFormat.getDate() + 1);

    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (dateFormat >= currentDate) {
      return 'Activo';
    } else {
      return 'Inactivo';
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

  initFilterForm() {
    this.filterForm = this.formBuilder.group({
      status: ['todos'],
      name: [''],
      startDate: [''],
      endDate: [''],
    });
  }

  applyFilter() {
    //By status
    const statusFiltered = this.filterForm.value['status'];
    if (statusFiltered != 'todos') {
      this.clients = this.copyClients.filter(
        (client) => this.isActive(client.attributes.endDate) === statusFiltered
      );
    } else {
      this.clients = this.copyClients;
    }

    //By name
    let nameFiltered: string = this.filterForm.value['name'];
    this.clients = this.clients.filter((client) =>
      client.attributes.name.startsWith(nameFiltered)
    );

    //By Date
    const startDate = this.filterForm.value['startDate'];
    const endDate = this.filterForm.value['endDate'];
    if (startDate && endDate) {
      this.clients = this.clients.filter(
        (client) =>
          client.attributes.startDate >= startDate &&
          client.attributes.startDate <= endDate
      );
    }
  }

  toFilter() {
    this.filterForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.applyFilter();
      });
  }

  clearFilters() {
    this.initFilterForm();
    this.applyFilter();
    this.toFilter();
  }

  logOut() {
    this.authService.logOut();
  }
}
