import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ClientModel, Datum } from 'src/app/core/models/client.model';
import { ClientsService } from 'src/app/services/clients.service';

@Component({
  selector: 'app-all-clients',
  templateUrl: './all-clients.component.html',
  styleUrls: ['./all-clients.component.scss'],
})
export class AllClientsComponent implements OnInit {
  @Input() clients: Datum[];
  @Input() copyClients: Datum[];

  filterForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private toast: ToastrService) {}

  ngOnInit(): void {
    this.initFilterForm();
    this.toFilter();
  }

  initFilterForm() {
    this.filterForm = this.formBuilder.group({
      status: ['todos'],
      name: [''],
      trainer: ['todos'],
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

    //By Trainer
    const trainerFiltered = this.filterForm.value['trainer'];
    if (trainerFiltered != 'todos') {
      this.clients = this.clients.filter(
        (client) => client.attributes.trainer === trainerFiltered
      );
    } else {
      this.clients = this.clients.filter(
        (client) => client.attributes.trainer != null
      );
    }

    //By Date
    const startDate = this.filterForm.value['startDate'];
    const endDate = this.filterForm.value['endDate'];
    if (startDate && endDate) {
      this.clients = this.clients.filter(
        (client) =>
          client.attributes.endDate >= startDate &&
          client.attributes.endDate <= endDate
      );
    }
  }

  isActive(date: Date): string {
    let dateFormat = new Date(date);
    dateFormat.setHours(0, 0, 0, 0); // Establecer horas, minutos, segundos y milisegundos a cero
    dateFormat.setDate(dateFormat.getDate() + 1);

    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Establecer horas, minutos, segundos y milisegundos a cero

    if (dateFormat >= currentDate) {
      return 'Activo';
    } else {
      return 'Inactivo';
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

  notAvailableYet() {
    this.toast.info('Opciones no disponibles aun', 'INFO');
  }
}
