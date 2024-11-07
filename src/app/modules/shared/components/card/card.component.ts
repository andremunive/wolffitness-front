import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Attributes } from 'src/app/core/models/client.model';
import { EditClientComponent } from 'src/app/modules/trainer/components/edit-client/edit-client.component';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() client: Attributes;

  constructor(public dialog: MatDialog) {}

  get isActive(): boolean {
    let dateFormat = new Date(this.client.endDate);
    dateFormat.setHours(0, 0, 0, 0);
    dateFormat.setDate(dateFormat.getDate() + 1);

    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (dateFormat >= currentDate) {
      return true;
    }
    return false;
  }

  openDialog(): void {
    this.dialog.open(EditClientComponent, {
      data: {
        startDate: this.client.startDate,
        endDate: this.client.endDate,
        hasPaid: this.client.hasPaid,
        name: this.client.name,
        plan: this.client.plan,
        monthlyPayment: this.client.monthlyPayment,
      },
    });
  }
}
