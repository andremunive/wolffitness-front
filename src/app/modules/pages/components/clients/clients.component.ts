import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RolesEnum } from 'src/app/core/enum/roles.enum';
import { ClientModelSearch } from 'src/app/core/models/client.model';
import { ColumnsModel, DataTypeEnum } from 'src/app/core/models/table.model';
import { UserPermissions } from 'src/app/core/models/user-auth.model';
import { ClientsService } from 'src/app/core/services/clients.service';
import { PermissionsService } from 'src/app/core/services/permissions.service';
import { CookieStorageService } from 'src/app/services/cookie-storage.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
})
export class ClientsComponent implements OnInit {
  role: RolesEnum;
  permissions: UserPermissions;
  readonly columnsToDisplay: ColumnsModel[] = [
    {
      matColumnDef: 'name',
      name: 'Nombre',
      roles: [RolesEnum.ADMIN, RolesEnum.TRAINER],
      dataType: DataTypeEnum.TEXT,
    },
    {
      matColumnDef: 'trainer',
      name: 'Entrenador',
      roles: [RolesEnum.ADMIN],
      dataType: DataTypeEnum.TEXT,
    },
    {
      matColumnDef: 'createdAt',
      name: 'Registro',
      roles: [RolesEnum.ADMIN],
      dataType: DataTypeEnum.DATE,
    },
    {
      matColumnDef: 'updatedAt',
      name: 'Modificacion',
      roles: [RolesEnum.ADMIN],
      dataType: DataTypeEnum.DATE,
    },
    {
      matColumnDef: 'status',
      name: 'Estado',
      roles: [RolesEnum.ADMIN, RolesEnum.TRAINER],
      dataType: DataTypeEnum.TEXT,
    },
    {
      matColumnDef: 'plan',
      name: 'Plan',
      roles: [RolesEnum.ADMIN, RolesEnum.TRAINER],
      dataType: DataTypeEnum.TEXT,
    },
    {
      matColumnDef: 'monthlyPayment',
      name: 'Mensualidad',
      roles: [RolesEnum.ADMIN, RolesEnum.TRAINER],
      dataType: DataTypeEnum.CURRENCY,
    },
  ];
  clients: ClientModelSearch;
  constructor(
    private _permissions: PermissionsService,
    private _cookiesStorage: CookieStorageService,
    private _clients: ClientsService
  ) {}

  ngOnInit(): void {
    this.role = this._permissions.role;
    this.permissions = this._permissions.permissions;
    this.loadClients();
  }

  loadClients(pagination?: any) {
    if (this.role === 'admin') {
      const pageSize = pagination ? pagination.pageSize + '' : '10';
      const page = pagination ? pagination.pageIndex + 1 + '' : '1';
      this._clients
        .getAllUsers(pageSize, page)
        .subscribe((res: ClientModelSearch) => {
          this.clients = res;
          // console.log(res);
        });
      // Obtengo todos los clientes
      return;
    }
    const trainerName = this._cookiesStorage.getCookie('user.name');
  }

  onPageChange(pagination: any) {
    // this.getUsers(pagination);
    console.log(pagination);
    this.loadClients(pagination);
  }
}
