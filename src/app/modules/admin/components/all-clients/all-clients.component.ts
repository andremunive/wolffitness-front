import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  ClientModelSearch,
  Datum,
  Pagination,
} from 'src/app/core/models/client.model';
import { FiltersModel } from 'src/app/core/models/filter.model';
import { ClientsService } from 'src/app/services/clients.service';
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
  searchClient = '';
  clients: Datum[] = [];
  pagination: Pagination;
  @Output() mainSearch = new EventEmitter();
  showFilters: boolean = false;
  filtersForm: FormGroup;
  filters: FiltersModel;

  constructor(
    private _client: ClientsService,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private _global: GlobalService
  ) {}

  ngOnInit(): void {
    this.getUsers();
    this.initForm();

    this._global.getDataUpdatedObservable().subscribe((value: boolean) => {
      if (value) this.getUsers();
    });
  }

  initForm() {
    this.filtersForm = this.formBuilder.group({
      trainer: [''],
      fortNight: [''],
    });
  }

  applyFilters() {
    this.filters = this.filtersForm.getRawValue();
    this.getUsers();
  }

  onPageChange(pagination: any) {
    this.getUsers(pagination);
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
    if (!this.showFilters) {
      this.filters = undefined;
      this.filtersForm.reset();
      this.getUsers();
    }
  }

  getUsers(pagination?: any) {
    const pageSize = pagination ? pagination.pageSize + '' : '10';
    const page = pagination ? pagination.pageIndex + 1 + '' : '1';
    this._client
      .getAllUsers(pageSize, page, this.filters)
      .subscribe((res: ClientModelSearch) => {
        this.clients = res.data;
        this.pagination = res.meta.pagination;
      });
  }

  onSearch() {
    if (this.searchClient.length > 1) {
      this._client
        .getUserByName(this.searchClient, true)
        .subscribe((clients: ClientModelSearch) => {
          this.clients = clients.data;
          this.pagination = clients.meta.pagination;
        });
    } else {
      this.getUsers();
    }
  }

  updateVisibility(client: Datum) {
    const visible = client.attributes.visible ? false : true;
    const payload = {
      data: {
        visible: visible,
      },
    };
    this._client.updateClient(payload, client.id).subscribe(() => {
      this.toast.success('Usuario actualizado', 'Exito');
      this.getUsers();
    });
  }
}
