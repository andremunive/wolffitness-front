import { Component, OnInit, TemplateRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CookieStorageService } from 'src/app/services/cookie-storage.service';
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
import { PaymentSummaryResponse } from 'src/app/core/models/payment-summary';
import { ClientsSummary, YearData } from 'src/app/core/models/clients-summary';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

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
  PrimaryWhite = '#ffffff';
  SecondaryGrey = '#ccc';
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = this.PrimaryWhite;
  public secondaryColour = this.SecondaryGrey;
  public loadingTemplate!: TemplateRef<any>;
  trainerName = '';
  dataSource = new MatTableDataSource<any>([]);
  currentMonth: MonthlyClientSummary;
  currentClients: YearData;

  public chartOptionsArray: Partial<ChartOptions>[] = [];
  data: PaymentSummaryResponse;
  chartsToBuild: ClientCountsResponse;
  charts: ClientsSummary;
  panelOpenState = false;
  loading = false;

  summaryColumns: string[] = [
    'fecha',
    'quincena',
    'reportadoQuincenaActual',
    'pendientePorReportar',
    'reportadoQuincenaPasada',
    'totalReportado',
    'bono',
    'ingreso',
  ];

  constructor(
    private _cookies: CookieStorageService,
    private _trainerSummary: TrainerSummaryService
  ) {}

  ngOnInit(): void {
    this.getClientsSummary();
    this.trainerName = this._cookies.getCookie('user.name');
  }

  buildCharts() {
    const attributes = this.charts.data.attributes;
    for (const month in attributes) {
      if (attributes.hasOwnProperty(month)) {
        // Primera quincena
        const monthData = attributes[month];
        const firstHalf = monthData.firstHalf;
        this.chartOptionsArray.push({
          series: [
            firstHalf.threeDaysPlanTotalPayments,
            firstHalf.threeDaysPlanTotalPending,
            firstHalf.sixDaysPlanTotalPayments,
            firstHalf.sixDaysPlanTotalPending,
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
            secondHalf.threeDaysPlanTotalPayments,
            secondHalf.threeDaysPlanTotalPending,
            secondHalf.sixDaysPlanTotalPayments,
            secondHalf.sixDaysPlanTotalPending,
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

  getClientsSummary() {
    this.loading = true;
    this._trainerSummary
      .getClientsSummary(2)
      .subscribe((summary: ClientsSummary) => {
        this.charts = summary;
        this.buildCharts();
        this.currentClients = Object.values(summary.data.attributes)[0];
        this.dataSource.data = this.transformSummaryToTableData(summary);
        this.loading = false;
      });
  }

  transformSummaryToTableData(payment: ClientsSummary) {
    const tableData: any[] = [];

    const attributes = payment.data.attributes;

    for (const month in attributes) {
      if (attributes.hasOwnProperty(month)) {
        const summary = attributes[month];
        tableData.push({
          fecha: `${month}`,
          quincena: `Primera`,
          reportadoQuincenaActual: `${summary.firstHalf.fortNightIncome}`,
          pendientePorReportar: `${summary.firstHalf.pendinIncome}`,
          reportadoQuincenaPasada: `${summary.firstHalf.incomeFromLastFortNight}`,
          totalReportado: `${summary.firstHalf.grossIncome}`,
          bono: `0`,
          ingreso: `${summary.firstHalf.trainerIncome}`,
        });
        tableData.push({
          fecha: `${month}`,
          quincena: `Segunda`,
          reportadoQuincenaActual: `${summary.secondHalf.fortNightIncome}`,
          pendientePorReportar: `${summary.secondHalf.pendinIncome}`,
          reportadoQuincenaPasada: `${summary.secondHalf.incomeFromLastFortNight}`,
          totalReportado: `${summary.secondHalf.grossIncome}`,
          bono: `${summary.secondHalf.monthBonus}`,
          ingreso: `${summary.secondHalf.trainerIncome}`,
        });
      }
    }

    return tableData;
  }
}
