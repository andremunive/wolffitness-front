import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  Attributes,
  Datum,
  Pagination,
} from 'src/app/core/models/client.model';
import { AssessmentComponent } from 'src/app/modules/trainer/components/assessment/assessment.component';
import { PaymentComponent } from 'src/app/modules/trainer/components/payment/payment.component';
import { EditClientComponent } from '../edit-client/edit-client.component';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() clients: Datum[] = [];
  @Input() pagination: Pagination;
  @Output() paginationChange = new EventEmitter<any>();

  constructor(public dialog: MatDialog, private router: Router) {}

  isActive(client: Datum) {
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

  onPageChange(event: any) {
    this.paginationChange.emit(event);
  }

  openAssessment(client: Datum) {
    const dialogRef = this.dialog.open(AssessmentComponent, { data: client });
  }

  openPayment(client: Datum) {
    const dialogRef = this.dialog.open(PaymentComponent, { data: client });
  }

  clientDetails(client: Datum) {
    this.router.navigate([`trainer/client/${client.id}`]);
  }

  editClient(client: Datum) {
    const dialogRef = this.dialog.open(EditClientComponent, { data: client });
  }
}
