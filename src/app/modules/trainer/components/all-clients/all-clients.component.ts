import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import {
  ClientModel,
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
  filterForm: FormGroup;

  isMobile: boolean = false;

  mainSearchValue = '';
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  currentMonth = this.currentDate.getMonth();
  showFilters: boolean = false;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientsService,
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private _global: GlobalService
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
  }

  ngOnInit(): void {
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

  getUsers(pagination?: any) {
    const pageSize = pagination ? pagination.pageSize + '' : '10';
    const page = pagination ? pagination.pageIndex + 1 + '' : '1';
    this.clientService
      .getUsersByTrainerLogged(pageSize, page)
      .subscribe((res: ClientModel) => {
        this.clients = res.data.data;
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
