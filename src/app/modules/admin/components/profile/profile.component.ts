import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  AllPaymentSummaryResponse,
  MonthlyPaymentSummary,
  PaymentSummaryByTrainer,
  PaymentSummaryData,
} from 'src/app/core/models/payment-summary.model';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  dataSource = new MatTableDataSource<PaymentSummaryData>([]);
  currentMonth: MonthlyPaymentSummary;
  panelOpenState = false;
  trainers: string[] = [];
  paymentSummary: AllPaymentSummaryResponse;

  displayedColumns: string[] = [
    'date',
    'fortNight',
    'threeDaysActives',
    'threeDaysPending',
    'sixDaysActives',
    'sixDaysPending',
    'grossIncome',
    'toPay',
    'netIncome',
  ];
  constructor(private _payment: PaymentService) {}

  ngOnInit(): void {
    this.getPaymentSummary();
  }

  getPaymentSummary() {
    this._payment
      .getAllPaymentSummary(6)
      .subscribe((response: AllPaymentSummaryResponse) => {
        this.trainers = Object.keys(response?.data.attributes);
        this.paymentSummary = response;
      });
  }

  transformPaymentSummaryToTableData(trainer: string) {
    const tableData: any[] = [];
    const attributes = this.paymentSummary.data.attributes[trainer];
    if (attributes.message) {
      return tableData;
    } else {
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
}
