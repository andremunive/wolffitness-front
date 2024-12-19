import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ClientModel, Datum } from 'src/app/core/models/client.model';
import { ClientsService } from 'src/app/services/clients.service';

@Component({
  selector: 'app-clients-filter',
  templateUrl: './clients-filter.component.html',
  styleUrls: ['./clients-filter.component.scss'],
})
export class ClientsFilterComponent implements OnInit, OnChanges {
  @Input() trainer: string;
  clients: Datum[];
  copyClients: Datum[];

  constructor(private clientService: ClientsService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trainer']) {
      this.getUsers(changes['trainer'].currentValue);
    }
  }

  getUsers(trainer: string) {
    this.clientService.getAllUsers().subscribe((res: ClientModel) => {
      this.clients = res.data.data.filter(
        (client) => client.attributes.trainer === trainer
      );
      this.copyClients = this.clients;
    });
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

  isActive(date: Date): string {
    const dateFormat = new Date(date);

    const currentDate = new Date();

    if (dateFormat >= currentDate) {
      return 'Si';
    } else {
      return 'No';
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
}
