import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CookieStorageService } from 'src/app/services/cookie-storage.service';
import { PaymentService } from 'src/app/services/payment.service';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexDataLabels,
  ApexTitleSubtitle,
} from 'ng-apexcharts';
import { TrainerSummaryService } from 'src/app/services/trainer-summary.service';
import {
  ClientCountsResponse,
  MonthlyClientSummary,
} from 'src/app/core/models/clients-count';
import { switchMap, tap } from 'rxjs';
import { PaymentSummaryResponse } from 'src/app/core/models/payment-summary';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  trainerName = '';
  dataSource = new MatTableDataSource<any>([]);
  currentMonth: MonthlyClientSummary;

  public chartOptionsArray: Partial<ChartOptions>[] = [];
  data: PaymentSummaryResponse;
  chartsToBuild: ClientCountsResponse;
  panelOpenState = false;

  displayedColumns: string[] = [
    'date',
    'fortNight',
    'reported',
    'pendingReported',
    'bonus',
    'myFortNight',
  ];

  constructor(
    private _cookies: CookieStorageService,
    private _payment: PaymentService,
    private _trainerSummary: TrainerSummaryService
  ) {}

  ngOnInit(): void {
    this.trainerName = this._cookies.getCookie('user.name');
    this.getTrainerSummary();
    // this.getPaymentSummary();
  }

  buildCharts() {
    const attributes = this.chartsToBuild.data.attributes;
    for (const month in attributes) {
      if (attributes.hasOwnProperty(month)) {
        // Primera quincena
        const monthData = attributes[month];
        const firstHalf = monthData.firstHalf;
        this.chartOptionsArray.push({
          series: [
            firstHalf.actives['3 dias'],
            firstHalf.pending['3 dias'],
            firstHalf.actives['6 dias'],
            firstHalf.pending['6 dias'],
          ],
          chart: {
            width: 500,
            type: 'pie',
          },
          labels: [
            `Clientes activos 3 días`,
            `Clientes pendientes 3 días`,
            `Clientes activos 6 días`,
            `Clientes pendientes 6 días`,
          ],
          title: {
            text: `Primera quincena de ${month}`,
          },
          dataLabels: {
            enabled: true,
            formatter: function (val, opts) {
              // Retorna el valor original de la serie en lugar del porcentaje
              return opts.w.globals.series[opts.seriesIndex];
            },
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 310,
                },
                legend: {
                  position: 'bottom',
                },
              },
            },
          ],
        });

        // Segunda quincena
        const secondHalf = monthData.secondHalf;
        this.chartOptionsArray.push({
          series: [
            secondHalf.actives['3 dias'],
            secondHalf.pending['3 dias'],
            secondHalf.actives['6 dias'],
            secondHalf.pending['6 dias'],
          ],
          chart: {
            width: 500,
            type: 'pie',
          },
          labels: [
            `Clientes activos 3 días`,
            `Clientes pendientes 3 días`,
            `Clientes activos 6 días`,
            `Clientes pendientes 6 días`,
          ],
          title: {
            text: `Segunda quincena de ${month}`,
          },
          dataLabels: {
            enabled: true,
            formatter: function (val, opts) {
              // Retorna el valor original de la serie en lugar del porcentaje
              return opts.w.globals.series[opts.seriesIndex];
            },
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 310,
                },
                legend: {
                  position: 'bottom',
                },
              },
            },
          ],
        });
      }
    }
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
          totalCollected: summary.firstHalf.totalCollected,
          totalGenerated: summary.firstHalf.totalGenerated,
          pendingGenerated: summary.firstHalf.pendingGenerated,
          bonus: summary.firstHalf.bonus,
        });
        tableData.push({
          date: `${month}`,
          fortNight: `Segunda quincena`,
          totalCollected: summary.secondHalf.totalCollected,
          totalGenerated: summary.secondHalf.totalGenerated,
          pendingGenerated: summary.secondHalf.pendingGenerated,
          bonus: summary.secondHalf.bonus,
        });
      }
    }

    return tableData;
  }

  getTrainerSummary() {
    this._trainerSummary
      .getClientCountsByTrainer(2)
      .pipe(
        tap((clientCounts: ClientCountsResponse) => {
          this.chartsToBuild = clientCounts;
          this.buildCharts();
          this.currentMonth = Object.values(clientCounts.data.attributes)[0];
        }),
        switchMap(() => this._trainerSummary.getClientAccountsByTrainer(2))
      )
      .subscribe((clientAccounts: PaymentSummaryResponse) => {
        const tableData =
          this.transformPaymentSummaryToTableData(clientAccounts);
        this.dataSource.data = tableData;
      });
  }
}
