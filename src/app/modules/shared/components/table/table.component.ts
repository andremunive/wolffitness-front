import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  ClientModel,
  Datum,
  Pagination,
} from 'src/app/core/models/client.model';
import { AssessmentComponent } from 'src/app/modules/trainer/components/assessment/assessment.component';
import { PaymentComponent } from 'src/app/modules/trainer/components/payment/payment.component';
import { EditClientComponent } from '../edit-client/edit-client.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, OnChanges {
  @Input() clients: Datum[] = [];
  @Input() pagination: Pagination;
  @Input() isAdmin = false;
  @Output() paginationChange = new EventEmitter<any>();
  @Output() updateVisibility = new EventEmitter<Datum>();
  dataSource = new MatTableDataSource<Datum>([]);

  displayedColumns: string[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.dataSource.data = this.clients;

    this.displayedColumns = this.isAdmin
      ? [
          'name',
          'trainer',
          'whatsapp',
          'birthDate',
          'createdAt',
          'updatedAt',
          'status',
          'plan',
          'monthlyPayment',
          'discountValue',
          'discountReason',
          'endDate',
          'visible',
          'actions',
        ]
      : [
          'name',
          'status',
          'whatsapp',
          'plan',
          'monthlyPayment',
          'discountValue',
          'discountReason',
          'endDate',
          'actions',
        ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clients'] && changes['clients'].currentValue) {
      this.dataSource.data = this.clients;
    }
  }

  isActive(client: Datum): boolean {
    let dateFormat = new Date(client.attributes.endDate);
    dateFormat.setHours(0, 0, 0, 0);
    dateFormat.setDate(dateFormat.getDate() + 1);

    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (dateFormat >= currentDate) {
      return true;
    }
    return false;
  }

  isPending(client: Datum): boolean {
    if (this.isActive(client) && client.attributes.status === 'paid') {
      return false;
    }
    return true;
  }

  onPageChange(event: any) {
    this.paginationChange.emit(event);
  }

  editClient(client: Datum) {
    const dialogRef = this.dialog.open(EditClientComponent, { data: client });
  }

  openPayment(client: Datum) {
    const dialogRef = this.dialog.open(PaymentComponent, { data: client });
  }

  openAssessment(client: Datum) {
    const dialogRef = this.dialog.open(AssessmentComponent, {
      disableClose: true,
      data: client,
    });
  }

  clientDetails(client: Datum) {
    this.router.navigate([`trainer/client/${client.id}`]);
  }

  modifyVisibility(client: Datum) {
    this.updateVisibility.emit(client);
  }
}
