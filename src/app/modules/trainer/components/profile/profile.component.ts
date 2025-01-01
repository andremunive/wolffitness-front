import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  MonthlyPaymentSummary,
  PaymentSummaryData,
  PaymentSummaryResponse,
} from 'src/app/core/models/payment-summary.model';
import { CookieStorageService } from 'src/app/services/cookie-storage.service';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  trainerName = '';
  dataSource = new MatTableDataSource<PaymentSummaryData>([]);
  currentMonth: MonthlyPaymentSummary;

  displayedColumns: string[] = [
    'date',
    'fortNight',
    'threeDaysActives',
    'threeDaysPending',
    'sixDaysActives',
    'sixDaysPending',
    'total',
    'myFortNight',
  ];

  constructor(
    private _cookies: CookieStorageService,
    private _payment: PaymentService
  ) {}

  ngOnInit(): void {
    this.trainerName = this._cookies.getCookie('user.name');
    this.getPaymentSummary();
  }

  getPaymentSummary() {
    this._payment
      .getPaymentSummaryByTrainer(this.trainerName, 4)
      .subscribe((response: PaymentSummaryResponse) => {
        const tableData = this.transformPaymentSummaryToTableData(response);
        this.dataSource.data = tableData;
        this.currentMonth = Object.values(response.data.attributes)[0];
      });
  }

  transformPaymentSummaryToTableData(response: PaymentSummaryResponse) {
    const tableData: any[] = [];

    const attributes = response.data.attributes;

    for (const month in attributes) {
      if (attributes.hasOwnProperty(month)) {
        const summary = attributes[month];
        tableData.push({
          date: `${month}`,
          fortNight: `Primera quincena`,
          threeDaysActives: `${summary.firstHalf.planCounts.actives['3 dias']}`,
          threeDaysPending: `${summary.firstHalf.planCounts.pending['3 dias']}`,
          sixDaysActives: `${summary.firstHalf.planCounts.actives['6 dias']}`,
          sixDaysPending: `${summary.firstHalf.planCounts.pending['6 dias']}`,
          totalCollected: summary.firstHalf.totalCollected,
          totalGenerated: summary.firstHalf.totalGenerated,
        });
        tableData.push({
          date: `${month}`,
          fortNight: `Segunda quincena`,
          threeDaysActives: `${summary.secondHalf.planCounts.actives['3 dias']}`,
          threeDaysPending: `${summary.secondHalf.planCounts.pending['3 dias']}`,
          sixDaysActives: `${summary.secondHalf.planCounts.actives['6 dias']}`,
          sixDaysPending: `${summary.secondHalf.planCounts.pending['6 dias']}`,
          totalCollected: summary.secondHalf.totalCollected,
          totalGenerated: summary.secondHalf.totalGenerated,
        });
      }
    }

    return tableData;
  }
}
