import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import {
  ClientModel,
  ClientModelSearch,
  Datum,
  Pagination,
} from 'src/app/core/models/client.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { ClientsService } from 'src/app/services/clients.service';
import { MatDialog } from '@angular/material/dialog';
import { AddClientsComponent } from '../add-clients/add-clients.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { GlobalService } from 'src/app/services/global.service';
import { FiltersModel } from 'src/app/core/models/filter.model';
import { CookieStorageService } from 'src/app/services/cookie-storage.service';

@Component({
  selector: 'app-all-clients',
  templateUrl: './all-clients.component.html',
  styleUrls: ['./all-clients.component.scss'],
  animations: [
    trigger('filterAnimation', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ height: 0, opacity: 0 })),
      ]),
    ]),
  ],
})
export class AllClientsComponent implements OnInit {
  clients: Datum[] = [];
  pagination: Pagination;
  @Output() mainSearch = new EventEmitter();
  filtersForm: FormGroup;

  isMobile: boolean = false;

  mainSearchValue = '';
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  currentMonth = this.currentDate.getMonth();
  showFilters: boolean = false;
  filters: FiltersModel;
  trainer: string;

  searchClient = '';

  constructor(
    private _client: ClientsService,
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private _global: GlobalService,
    private formBuilder: FormBuilder,
    private _cookiesStorage: CookieStorageService
  ) {
    // this.filterForm = this.fb.group({
    //   activos: [false],
    //   pendientes: [false],
    //   primeraQuincena: [false],
    //   segundaQuincena: [false],
    // });
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
    if (!this.showFilters) {
      this.filters = { trainer: this.trainer };
      this.filtersForm.reset();
      this.getUsers();
    }
  }

  ngOnInit(): void {
    this.trainer = this._cookiesStorage.getCookie('user.name');
    this.filters = { trainer: this.trainer };
    this.initForm();
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
    this.getUsers();

    this._global.getDataUpdatedObservable().subscribe((value: boolean) => {
      if (value) this.getUsers();
    });
  }

  applyFilters() {
    this.filters = this.filtersForm.getRawValue();
    this.getUsers();
  }

  initForm() {
    this.filtersForm = this.formBuilder.group({
      trainer: [''],
      fortNight: [''],
    });
  }

  onSearch() {
    if (this.searchClient.length > 1) {
      this._client
        .getUserByName(this.searchClient)
        .subscribe((clients: ClientModelSearch) => {
          this.clients = clients.data;
          this.pagination = clients.meta.pagination;
        });
    } else {
      this.getUsers();
    }
  }

  getUsers(pagination?: any) {
    const pageSize = pagination ? pagination.pageSize + '' : '10';
    const page = pagination ? pagination.pageIndex + 1 + '' : '1';
    this.filters.trainer = this.trainer;
    this._client
      .getAllUsers(pageSize, page, this.filters)
      .subscribe((res: ClientModelSearch) => {
        this.clients = res.data;
        this.pagination = res.meta.pagination;
      });
  }

  onPageChange(pagination: any) {
    this.getUsers(pagination);
  }

  addUser() {
    const dialogRef = this.dialog.open(AddClientsComponent);
  }
}
