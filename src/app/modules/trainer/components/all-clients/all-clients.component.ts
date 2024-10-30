import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Datum } from 'src/app/core/models/client.model';
import { EditClientComponent } from '../edit-client/edit-client.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-all-clients',
  templateUrl: './all-clients.component.html',
  styleUrls: ['./all-clients.component.scss'],
})
export class AllClientsComponent implements OnInit {
  @Input() clients: Datum[] = [];
  @Output() mainSearch = new EventEmitter();
  filterForm: FormGroup;
  @Input() clientsBackup: Datum[] = [];

  mainSearchValue = '';
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  currentMonth = this.currentDate.getMonth();

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.filterForm = this.fb.group({
      activos: [false],
      pendientes: [false],
      primeraQuincena: [false],
      segundaQuincena: [false],
    });
  }

  ngOnInit(): void {
    // Suscribirse a los cambios del formulario para llamar la API cada vez que se cambie un valor
    this.filterForm.valueChanges.subscribe((values) => {
      this.applyFilters(values);
    });
  }

  applyFilters(filters: any): void {
    let filteredClients = [...this.clientsBackup];

    if (filters.activos) {
      filteredClients = filteredClients.filter((client) =>
        this.isActive(client.attributes.endDate)
      );
    }

    if (filters.pendientes) {
      filteredClients = filteredClients.filter(
        (client) => client.attributes.hasPaid == false
      );
    }

    if (filters.primeraQuincena) {
      filteredClients = filteredClients.filter((client) =>
        this.fortnightClients(
          1,
          client.attributes.startDate,
          client.attributes.name
        )
      );
    }

    if (filters.segundaQuincena) {
      filteredClients = filteredClients.filter((client) =>
        this.fortnightClients(2, client.attributes.startDate)
      );
    }

    this.clients = filteredClients;
  }

  fortnightClients(fortnight: number, date: Date, name?: string): boolean {
    let startOfFortnight: Date;
    let endOfFortnight: Date;
    const startDate = new Date(date);
    startDate.setDate(startDate.getDate() + 1);
    console.log({ name: name, date: startDate });
    if (fortnight == 1) {
      // Primera quincena del mes
      startOfFortnight = new Date(this.currentYear, this.currentMonth, 1);
      endOfFortnight = new Date(
        this.currentYear,
        this.currentMonth,
        15,
        23,
        59,
        59
      ); // Final del 15 de mes
    } else if (fortnight == 2) {
      // Segunda quincena del mes
      startOfFortnight = new Date(this.currentYear, this.currentMonth, 16);
      endOfFortnight = new Date(
        this.currentYear,
        this.currentMonth + 1,
        0,
        23,
        59,
        59
      );
    }
    if (startDate >= startOfFortnight && startDate <= endOfFortnight) {
      return true;
    }
    return false;
  }

  isActive(date: Date): boolean {
    let dateFormat = new Date(date);
    dateFormat.setHours(0, 0, 0, 0);
    dateFormat.setDate(dateFormat.getDate() + 1);

    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (dateFormat >= currentDate) {
      return true;
    }
    return false;
  }

  search() {
    this.mainSearch.emit(this.mainSearchValue);
  }
}
