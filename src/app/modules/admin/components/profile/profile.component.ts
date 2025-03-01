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
      .getCLientGeneralSummary(3)
      .subscribe((summary: ClientGeneralSummary) => {
        this.clientGeneralSummary = summary;
        this.trainers = Object.keys(summary?.data.attributes);
      });
  }

  transformGeneralSummary() {
    const tableData: any[] = [];
    const rubyAttributes: TrainerData =
      this.clientGeneralSummary.data.attributes['Ruby Manjarres'];
    const ivanAttributes: TrainerData =
      this.clientGeneralSummary.data.attributes['Ivan Romero'];
    const julioAttributes: TrainerData =
      this.clientGeneralSummary.data.attributes['Julio Munive'];
    for (const month in rubyAttributes) {
      const rubySummary = rubyAttributes[month];
      const ivanSummary = ivanAttributes[month];
      const julioSummary = julioAttributes[month];
      tableData.push({
        fecha: `${month}`,
        quincena: 'Primera',
        clientesActivos6Dias: `${
          rubySummary.firstHalf.sixDaysPlanTotalPayments +
          julioSummary.firstHalf.sixDaysPlanTotalPayments +
          ivanSummary.firstHalf.sixDaysPlanTotalPayments
        }`,
        clientesPendientes6Dias: `${
          rubySummary.firstHalf.sixDaysPlanTotalPending +
          julioSummary.firstHalf.sixDaysPlanTotalPending +
          ivanSummary.firstHalf.sixDaysPlanTotalPending
        }`,
        clientesActivos3Dias: `${
          rubySummary.firstHalf.threeDaysPlanTotalPayments +
          julioSummary.firstHalf.threeDaysPlanTotalPayments +
          ivanSummary.firstHalf.threeDaysPlanTotalPayments
        }`,
        clientesPendientes3Dias: `${
          rubySummary.firstHalf.threeDaysPlanTotalPending +
          julioSummary.firstHalf.threeDaysPlanTotalPending +
          ivanSummary.firstHalf.threeDaysPlanTotalPending
        }`,
        ingresosDeEstaQuincena: `${
          rubySummary.firstHalf.fortNightIncome +
          julioSummary.firstHalf.fortNightIncome +
          ivanSummary.firstHalf.fortNightIncome
        }`,
        ingresosQuincenaPasada: `${
          rubySummary.firstHalf.incomeFromLastFortNight +
          julioSummary.firstHalf.incomeFromLastFortNight +
          ivanSummary.firstHalf.incomeFromLastFortNight
        }`,
        ingresosPendientes: `${
          rubySummary.firstHalf.pendinIncome +
          julioSummary.firstHalf.pendinIncome +
          ivanSummary.firstHalf.pendinIncome
        }`,
        ingresoBruto: `${
          rubySummary.firstHalf.grossIncome +
          julioSummary.firstHalf.grossIncome +
          ivanSummary.firstHalf.grossIncome
        }`,
        bonoDelMes: `0`,
        pagoDelEntrenador: `${
          rubySummary.firstHalf.trainerIncome +
          julioSummary.firstHalf.trainerIncome +
          ivanSummary.firstHalf.trainerIncome
        }`,
        ingresoNeto: `${
          rubySummary.firstHalf.grossIncome -
          rubySummary.firstHalf.trainerIncome +
          (julioSummary.firstHalf.grossIncome -
            julioSummary.firstHalf.trainerIncome) +
          (ivanSummary.firstHalf.grossIncome -
            ivanSummary.firstHalf.trainerIncome)
        }`,
      });
      tableData.push({
        fecha: `${month}`,
        quincena: 'Segunda',
        clientesActivos6Dias: `${
          rubySummary.secondHalf.sixDaysPlanTotalPayments +
          julioSummary.secondHalf.sixDaysPlanTotalPayments +
          ivanSummary.secondHalf.sixDaysPlanTotalPayments
        }`,
        clientesPendientes6Dias: `${
          rubySummary.secondHalf.sixDaysPlanTotalPending +
          julioSummary.secondHalf.sixDaysPlanTotalPending +
          ivanSummary.secondHalf.sixDaysPlanTotalPending
        }`,
        clientesActivos3Dias: `${
          rubySummary.secondHalf.threeDaysPlanTotalPayments +
          julioSummary.secondHalf.threeDaysPlanTotalPayments +
          ivanSummary.secondHalf.threeDaysPlanTotalPayments
        }`,
        clientesPendientes3Dias: `${
          rubySummary.secondHalf.threeDaysPlanTotalPending +
          julioSummary.secondHalf.threeDaysPlanTotalPending +
          ivanSummary.secondHalf.threeDaysPlanTotalPending
        }`,
        ingresosDeEstaQuincena: `${
          rubySummary.secondHalf.fortNightIncome +
          julioSummary.secondHalf.fortNightIncome +
          ivanSummary.secondHalf.fortNightIncome
        }`,
        ingresosQuincenaPasada: `${
          rubySummary.secondHalf.incomeFromLastFortNight +
          julioSummary.secondHalf.incomeFromLastFortNight +
          ivanSummary.secondHalf.incomeFromLastFortNight
        }`,
        ingresosPendientes: `${
          rubySummary.secondHalf.pendinIncome +
          julioSummary.secondHalf.pendinIncome +
          ivanSummary.secondHalf.pendinIncome
        }`,
        ingresoBruto: `${
          rubySummary.secondHalf.grossIncome +
          julioSummary.secondHalf.grossIncome +
          ivanSummary.secondHalf.grossIncome
        }`,
        bonoDelMes: `${
          rubySummary.secondHalf.monthBonus +
          julioSummary.secondHalf.monthBonus +
          ivanSummary.secondHalf.monthBonus
        }`,
        pagoDelEntrenador: `${
          rubySummary.secondHalf.trainerIncome +
          julioSummary.secondHalf.trainerIncome +
          ivanSummary.secondHalf.trainerIncome
        }`,
        ingresoNeto: `${
          rubySummary.secondHalf.grossIncome -
          rubySummary.secondHalf.trainerIncome -
          rubySummary.secondHalf.monthBonus +
          (julioSummary.secondHalf.grossIncome -
            julioSummary.secondHalf.trainerIncome -
            julioSummary.secondHalf.monthBonus) +
          (ivanSummary.secondHalf.grossIncome -
            ivanSummary.secondHalf.trainerIncome -
            ivanSummary.secondHalf.monthBonus)
        }`,
      });
    }
    return tableData;
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
        bonoDelMes: `0`,
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
        pagoDelEntrenador: `${summary.secondHalf.trainerIncome}`,
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
