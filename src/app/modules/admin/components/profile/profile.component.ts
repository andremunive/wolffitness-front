import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AllTrainersClientSummaryResponse } from 'src/app/core/models/all-clients-count';
import { AllTrainersClientAccountsResponse } from 'src/app/core/models/all-payment-summary';
import {
  ClientGeneralSummary,
  TrainerData,
} from 'src/app/core/models/clients-general-summary';
import {
  AllPaymentSummaryResponse,
  MonthlyPaymentSummary,
  PaymentSummaryData,
} from 'src/app/core/models/payment-summary.model';
import { AdminService } from 'src/app/services/admin.service';

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
  clientGeneralSummary: ClientGeneralSummary;

  clientGeneralSummaryColumns: string[] = [
    'fecha',
    'quincena',
    'clientesActivos6Dias',
    'clientesPendientes6Dias',
    'clientesActivos3Dias',
    'clientesPendientes3Dias',
    'ingresosDeEstaQuincena',
    'ingresosQuincenaPasada',
    'ingresosPendientes',
    'ingresoBruto',
    'bonoDelMes',
    'pagoDelEntrenador',
    'ingresoNeto',
  ];
  incomeSummaryColumns: string[] = [
    'fecha',
    'quincena',
    'ingresosPendientes',
    'ingresoBruto',
    'bonoDelMes',
    'pagoDelEntrenador',
    'ingresoNeto',
  ];

  constructor(private _admin: AdminService) {}

  ngOnInit(): void {
    this.getClientGeneralSummary();
  }

  getClientGeneralSummary() {
    this._admin
      .getCLientGeneralSummary(2)
      .subscribe((summary: ClientGeneralSummary) => {
        this.clientGeneralSummary = summary;
        this.trainers = Object.keys(summary?.data.attributes);
      });
  }

  transformSummaryToTableData(trainer: string) {
    const tableData: any[] = [];
    const attributes: TrainerData =
      this.clientGeneralSummary.data.attributes[trainer];
    for (const month in attributes) {
      const summary = attributes[month];
      tableData.push({
        fecha: `${month}`,
        quincena: 'Primera',
        clientesActivos6Dias: `${summary.firstHalf.sixDaysPlanTotalPayments}`,
        clientesPendientes6Dias: `${summary.firstHalf.sixDaysPlanTotalPending}`,
        clientesActivos3Dias: `${summary.firstHalf.threeDaysPlanTotalPayments}`,
        clientesPendientes3Dias: `${summary.firstHalf.threeDaysPlanTotalPending}`,
        ingresosDeEstaQuincena: `${summary.firstHalf.fortNightIncome}`,
        ingresosQuincenaPasada: `${summary.firstHalf.incomeFromLastFortNight}`,
        ingresosPendientes: `${summary.firstHalf.pendinIncome}`,
        ingresoBruto: `${summary.firstHalf.grossIncome}`,
        bonoDelMes: `${summary.firstHalf.monthBonus}`,
        pagoDelEntrenador: `${summary.firstHalf.trainerIncome}`,
        ingresoNeto: `${
          summary.firstHalf.grossIncome - summary.firstHalf.trainerIncome
        }`,
      });
      tableData.push({
        fecha: `${month}`,
        quincena: 'Segunda',
        clientesActivos6Dias: `${summary.secondHalf.sixDaysPlanTotalPayments}`,
        clientesPendientes6Dias: `${summary.secondHalf.sixDaysPlanTotalPending}`,
        clientesActivos3Dias: `${summary.secondHalf.threeDaysPlanTotalPayments}`,
        clientesPendientes3Dias: `${summary.secondHalf.threeDaysPlanTotalPending}`,
        ingresosDeEstaQuincena: `${summary.secondHalf.fortNightIncome}`,
        ingresosQuincenaPasada: `${summary.secondHalf.incomeFromLastFortNight}`,
        ingresosPendientes: `${summary.secondHalf.pendinIncome}`,
        ingresoBruto: `${summary.secondHalf.grossIncome}`,
        bonoDelMes: `${summary.secondHalf.monthBonus}`,
        pagoDelEntrenador: `${
          summary.secondHalf.trainerIncome + summary.secondHalf.monthBonus
        }`,
        ingresoNeto: `${
          summary.secondHalf.grossIncome -
          summary.secondHalf.trainerIncome -
          summary.secondHalf.monthBonus
        }`,
      });
    }
    return tableData;
  }
}
