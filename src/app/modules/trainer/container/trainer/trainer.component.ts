import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import {
  ClientModel,
  Datum,
  Pagination,
} from 'src/app/core/models/client.model';
import { ToolbarModel } from 'src/app/core/models/toolbar.model';
import { AuthService } from 'src/app/services/auth.service';
import { ClientsService } from 'src/app/services/clients.service';
import { CookieStorageService } from 'src/app/services/cookie-storage.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-trainer',
  templateUrl: './trainer.component.html',
  styleUrls: ['./trainer.component.scss'],
})
export class TrainerComponent implements OnInit {
  actionActive: string = 'clients';
  user: string = '';
  clients: Datum[];
  pagination: Pagination;
  clientsBackUp: Datum[];
  makePaymentForm: FormGroup;
  registerUserForm: FormGroup;
  filterForm: FormGroup;
  page: string;

  toolbarMenu: ToolbarModel[] = [
    {
      title: 'Asesorados',
    },
    {
      title: 'Perfil',
    },
  ];

  constructor(
    private cookieStorageService: CookieStorageService,
    private clientService: ClientsService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private authService: AuthService,
    private _global: GlobalService
  ) {}

  ngOnInit(): void {
    this.listenToChanges();
  }

  listenToChanges() {
    this._global
      .getPageSelectedObservable()
      .subscribe((res) => (this.page = res));
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

  registerUser(event) {
    this.clientService.registerUser(event).subscribe(() => {
      this.initForm();
      this.toast.success('Usuario registrado', 'Exito');
    });
  }

  initFilterForm() {
    this.filterForm = this.formBuilder.group({
      status: ['todos'],
      name: [''],
      startDate: [''],
      endDate: [''],
    });
  }

  applyFilter(value: string) {
    const param = value.toLowerCase();
    this.clients = this.clientsBackUp.filter((client) =>
      client.attributes.name.toLowerCase().startsWith(param)
    );
  }

  toFilter() {
    this.filterForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        // this.applyFilter();
      });
  }

  clearFilters() {
    this.initFilterForm();
    // this.applyFilter();
    this.toFilter();
  }

  logOut() {
    this.authService.logOut();
  }
}
