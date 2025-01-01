import { Component, OnInit } from '@angular/core';
import { ClientModel, Datum } from 'src/app/core/models/client.model';
import { ToolbarModel } from 'src/app/core/models/toolbar.model';
import { AuthService } from 'src/app/services/auth.service';
import { ClientsService } from 'src/app/services/clients.service';
import { CookieStorageService } from 'src/app/services/cookie-storage.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  toolbarMenu: ToolbarModel[] = [
    {
      title: 'Asesorados',
    },
    {
      title: 'Perfil',
    },
  ];
  page: string;
  actionActive: string = 'clients';
  clients: Datum[];
  copyClients: Datum[];
  trainerClients: Datum[];
  copyTrainerClients: Datum[];
  trainers: Datum[];
  soloActivos: boolean;

  constructor(
    private cookieStorageService: CookieStorageService,
    private authService: AuthService,
    private clientService: ClientsService,
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

  applyFilterPerTrainer(filter) {
    switch (filter) {
      case 'all':
        this.trainerClients = this.copyTrainerClients;
        break;
      case 'actives':
        this.trainerClients = this.copyTrainerClients.filter(
          (client) => this.isActive(client.attributes.endDate) === 'Si'
        );
        break;
      case 'fortnight':
        this.trainerClients = this.copyTrainerClients.filter((client) =>
          this.thisFortnight(client.attributes.endDate)
        );
    }
  }

  applyFilter(filter) {
    switch (filter) {
      case 'all':
        this.clients = this.copyClients;
        break;
      case 'actives':
        this.clients = this.copyClients.filter(
          (client) => this.isActive(client.attributes.endDate) === 'Si'
        );
        break;
      case 'fortnight':
        this.clients = this.copyClients.filter((client) =>
          this.thisFortnight(client.attributes.endDate)
        );
    }
  }

  thisFortnight(startDate: Date): boolean {
    const date = startDate + '';
    const [day, month, year] = date.split('/');

    const newDateFormat = `${year}/${month}/${day}`;
    const today = new Date();
    const dateFormat = new Date(newDateFormat);

    if (
      dateFormat.getMonth() !== today.getMonth() ||
      dateFormat.getFullYear() !== today.getFullYear()
    ) {
      return false;
    }

    if (today.getDate() <= 15) {
      return dateFormat.getDate() <= 15;
    } else {
      return dateFormat.getDate() > 15;
    }
  }

  get getUserName(): string {
    return this.cookieStorageService.getCookie('user.name');
  }

  getTrainers() {
    this.clientService.getTrainers().subscribe((res: ClientModel) => {
      this.trainers = res.data.data;
    });
  }

  filterClients(trainer: string) {
    this.trainerClients = this.clients.filter(
      (client) => client.attributes.trainer === trainer
    );
    this.copyTrainerClients = this.trainerClients;
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

  logOut() {
    this.authService.logOut();
  }
}
