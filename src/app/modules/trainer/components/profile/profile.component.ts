import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  MonthlyPaymentSummary,
  PaymentSummaryData,
  PaymentSummaryResponse,
} from 'src/app/core/models/payment-summary.model';
import { CookieStorageService } from 'src/app/services/cookie-storage.service';
import { PaymentService } from 'src/app/services/payment.service';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexTitleSubtitle,
} from 'ng-apexcharts';

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
  dataSource = new MatTableDataSource<PaymentSummaryData>([]);
  currentMonth: MonthlyPaymentSummary;

  public chartOptionsArray: Partial<ChartOptions>[] = [];
  data: PaymentSummaryResponse;
  panelOpenState = false;

  displayedColumns: string[] = [
    'date',
    'fortNight',
    'reported',
    'bonus',
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
        this.data = response;
        this.buildCharts();
      });
  }

  buildCharts() {
    const attributes = this.data.data.attributes;
    for (const month in attributes) {
      if (attributes.hasOwnProperty(month)) {
        // Primera quincena
        const monthData = attributes[month];
        const firstHalf = monthData.firstHalf;
        this.chartOptionsArray.push({
          series: [
            firstHalf.planCounts.actives['3 dias'],
            firstHalf.planCounts.pending['3 dias'],
            firstHalf.planCounts.actives['6 dias'],
            firstHalf.planCounts.pending['6 dias'],
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
            secondHalf.planCounts.actives['3 dias'],
            secondHalf.planCounts.pending['3 dias'],
            secondHalf.planCounts.actives['6 dias'],
            secondHalf.planCounts.pending['6 dias'],
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
          threeDaysActives: `${summary.firstHalf.planCounts.actives['3 dias']}`,
          threeDaysPending: `${summary.firstHalf.planCounts.pending['3 dias']}`,
          sixDaysActives: `${summary.firstHalf.planCounts.actives['6 dias']}`,
          sixDaysPending: `${summary.firstHalf.planCounts.pending['6 dias']}`,
          totalCollected: summary.firstHalf.totalCollected,
          totalGenerated: summary.firstHalf.totalGenerated,
          bonus: summary.firstHalf.bonus,
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
          bonus: summary.secondHalf.bonus,
        });
      }
    }

    return tableData;
  }
}
