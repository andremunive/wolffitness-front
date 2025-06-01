import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RolesEnum } from 'src/app/core/enum/roles.enum';
import {
  ClientModelSearch,
  Datum,
  Pagination,
} from 'src/app/core/models/client.model';
import { ColumnsModel } from 'src/app/core/models/table.model';
import { UserPermissions } from 'src/app/core/models/user-auth.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  imports: [
    MatTableModule,
    CommonModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  standalone: true,
})
export class TableComponent implements OnInit, OnChanges {
  @Input() columnsToDisplay: ColumnsModel[];
  @Input() role: RolesEnum;
  @Input() clients: ClientModelSearch;
  @Input() permissions: UserPermissions;
  @Input() isActionable: boolean = false;
  @Output() paginationChange = new EventEmitter<any>();
  pagination: Pagination;
  data: Datum[] = [];
  displayedColumns: string[] = [];
  RolesEnum = RolesEnum;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.setColumnsToDisplay();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clients']?.currentValue) {
      this.data = this.clients?.data;
      this.pagination = this.clients?.meta.pagination;
    }
  }

  setColumnsToDisplay() {
    this.columnsToDisplay?.map((column) => {
      if (column.roles.includes(this.role)) {
        this.displayedColumns.push(column.matColumnDef);
      }
    });
    if (this.isActionable) this.displayedColumns.push('actions');
  }

  editClient(client) {
    console.log('CLIENT: ', client);
  }

  onPageChange(event: any) {
    this.paginationChange.emit(event);
  }
}
