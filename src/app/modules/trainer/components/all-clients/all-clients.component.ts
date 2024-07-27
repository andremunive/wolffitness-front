import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Datum } from 'src/app/core/models/client.model';
import { EditClientComponent } from '../edit-client/edit-client.component';

@Component({
  selector: 'app-all-clients',
  templateUrl: './all-clients.component.html',
  styleUrls: ['./all-clients.component.scss'],
})
export class AllClientsComponent {
  @Input() clients: Datum[] = [];
  @Output() mainSearch = new EventEmitter();

  mainSearchValue = '';

  search() {
    this.mainSearch.emit(this.mainSearchValue);
  }
}
