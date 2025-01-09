import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap, tap } from 'rxjs';
import {
  AllTrainersClientSummaryResponse,
  TrainerClientSummary,
} from 'src/app/core/models/all-clients-count';
import { AllTrainersClientAccountsResponse } from 'src/app/core/models/all-payment-summary';
import {
  AllPaymentSummaryResponse,
  MonthlyPaymentSummary,
  PaymentSummaryAttributes,
  PaymentSummaryData,
  TrainerErrorSummary,
} from 'src/app/core/models/payment-summary.model';
import { PaymentService } from 'src/app/services/payment.service';
import { TrainerSummaryService } from 'src/app/services/trainer-summary.service';
import * as XLSX from 'xlsx';

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
  clientCounts: AllTrainersClientSummaryResponse;
  clientAccounts: AllTrainersClientAccountsResponse;

  clientsCountColumns: string[] = [
    'date',
    'fortNight',
    'threeDaysActives',
    'threeDaysPending',
    'sixDaysActives',
    'sixDaysPending',
  ];
  clientsAccountsColumns: string[] = [
    'date',
    'fortNight',
    'grossIncomeReported',
    'pendingToReport',
    'bonus',
    'toPay',
  ];

  constructor(private _trainerSummary: TrainerSummaryService) {}

  ngOnInit(): void {
    this.getAllSummary();
  }

  getAllSummary() {
    const months = 2;
    this._trainerSummary
      .getClientCounts(months)
      .pipe(
        tap((clientsCount: AllTrainersClientSummaryResponse) => {
          this.trainers = Object.keys(clientsCount?.data.attributes);
          this.clientCounts = clientsCount;
        }),
        switchMap(() => this._trainerSummary.getClientAccounts(months))
      )
      .subscribe((clientsAccounts: AllTrainersClientAccountsResponse) => {
        this.clientAccounts = clientsAccounts;
      });
  }

  transformClientAccountsToTableData(trainer: string) {
    const tableData: any[] = [];
    const attributes: PaymentSummaryAttributes | TrainerErrorSummary =
      this.clientAccounts?.data.attributes[trainer];
    if (attributes?.message) {
      return tableData;
    } else {
      for (const month in attributes) {
        if (attributes.hasOwnProperty(month)) {
          const summary = attributes[month];
          tableData.push({
            date: `${month}`,
            fortNight: 'Primera',
            grossIncomeReported: `${summary.firstHalf.totalGenerated}`,
            pendingToReport: `${summary.firstHalf.pendingGenerated}`,
            bonus: `${summary.firstHalf.bonus}`,
            toPay: `${
              summary.firstHalf.totalCollected + summary.firstHalf.bonus
            }`,
          });
          tableData.push({
            date: `${month}`,
            fortNight: 'Segunda',
            grossIncomeReported: `${summary.secondHalf.totalGenerated}`,
            pendingToReport: `${summary.secondHalf.pendingGenerated}`,
            bonus: `${summary.secondHalf.bonus}`,
            toPay: `${
              summary.secondHalf.totalCollected + summary.secondHalf.bonus
            }`,
          });
        }
      }

      return tableData;
    }
  }
  transformClientCountsToTableData(trainer: string) {
    const tableData: any[] = [];
    const attributes: TrainerClientSummary | TrainerErrorSummary =
      this.clientCounts?.data.attributes[trainer];
    if (attributes?.message) {
      return tableData;
    } else {
      for (const month in attributes) {
        if (attributes.hasOwnProperty(month)) {
          const summary = attributes[month];
          tableData.push({
            date: `${month}`,
            fortNight: 'Primera',
            threeDaysActives: `${summary.firstHalf.actives['3 dias']}`,
            threeDaysPending: `${summary.firstHalf.pending['3 dias']}`,
            sixDaysActives: `${summary.firstHalf.actives['6 dias']}`,
            sixDaysPending: `${summary.firstHalf.pending['6 dias']}`,
          });
          tableData.push({
            date: `${month}`,
            fortNight: 'Segunda',
            threeDaysActives: `${summary.secondHalf.actives['3 dias']}`,
            threeDaysPending: `${summary.secondHalf.pending['3 dias']}`,
            sixDaysActives: `${summary.secondHalf.actives['6 dias']}`,
            sixDaysPending: `${summary.secondHalf.pending['6 dias']}`,
          });
        }
      }

      return tableData;
    }
  }

  exportToExcel(trainer: string) {
    const clientCountsData = this.transformClientCountsToTableData(trainer);
    const clientAccountsData = this.transformClientAccountsToTableData(trainer);

    // Combina ambas tablas, eliminando columnas repetidas
    const combinedData = clientCountsData.map((clientRow, index) => ({
      ...clientRow,
      ...clientAccountsData[index], // Combina con la fila correspondiente
    }));

    // Genera un archivo Excel
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(combinedData);
    const workbook: XLSX.WorkBook = {
      Sheets: { Datos: worksheet },
      SheetNames: ['Datos'],
    };

    // Crea el nombre del archivo: Nombre del entrenador + fecha actual
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    });
    const fileName = `${trainer} - ${formattedDate}.xlsx`;

    // Exporta el archivo
    XLSX.writeFile(workbook, fileName);
  }
}
