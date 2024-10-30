import { Component, Input, OnInit } from '@angular/core';
import { Datum } from 'src/app/core/models/client.model';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
})
export class ProgressComponent implements OnInit {
  @Input() clients: Datum[] = [];
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  currentMonth = this.currentDate.getMonth();
  currentDay = this.currentDate.getDate();

  ngOnInit(): void {}

  get currentMonthSixDaysClients(): number {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // Enero es 0, Febrero es 1, etc.

    return this.clients?.filter((client) => {
      const startDate = new Date(client?.attributes.startDate);
      const startYear = startDate.getFullYear();
      const startMonth = startDate.getMonth();

      return (
        startYear === currentYear &&
        startMonth === currentMonth &&
        client.attributes.plan == '6 dias a la semana'
      );
    }).length;
  }

  get currentMonthThreeDaysClients(): number {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // Enero es 0, Febrero es 1, etc.

    return this.clients?.filter((client) => {
      const startDate = new Date(client?.attributes.startDate);
      const startYear = startDate.getFullYear();
      const startMonth = startDate.getMonth();

      return (
        startYear === currentYear &&
        startMonth === currentMonth &&
        client.attributes.plan == '3 dias a la semana'
      );
    }).length;
  }

  get currentMonthThreeDaysClientsPayment(): number {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // Enero es 0, Febrero es 1, etc.

    const filteredClients = this.clients?.filter((client) => {
      const startDate = new Date(client?.attributes.startDate);
      const startYear = startDate.getFullYear();
      const startMonth = startDate.getMonth();

      return (
        startYear === currentYear &&
        startMonth === currentMonth &&
        client.attributes.plan == '3 dias a la semana'
      );
    });
    let payment = 0;
    filteredClients?.forEach((client) => {
      payment = payment + client.attributes.monthlyPayment;
    });
    return payment;
  }

  get currentMonthSixDaysClientsPayment(): number {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // Enero es 0, Febrero es 1, etc.

    const filteredClients = this.clients?.filter((client) => {
      const startDate = new Date(client?.attributes.startDate);
      const startYear = startDate.getFullYear();
      const startMonth = startDate.getMonth();

      return (
        startYear === currentYear &&
        startMonth === currentMonth &&
        client.attributes.plan == '6 dias a la semana'
      );
    });
    let payment = 0;
    filteredClients?.forEach((client) => {
      payment = payment + client.attributes.monthlyPayment;
    });
    return payment;
  }

  fortnightClientsPerDays(
    fortnight: number,
    plan: string,
    hasPaid?: boolean
  ): number {
    let startOfFortnight: Date;
    let endOfFortnight: Date;
    if (fortnight == 1) {
      // Primera quincena del mes
      startOfFortnight = new Date(this.currentYear, this.currentMonth, 1);
      endOfFortnight = new Date(
        this.currentYear,
        this.currentMonth,
        15,
        23,
        59,
        59
      ); // Final del 15 de mes
    } else if (fortnight == 2) {
      // Segunda quincena del mes
      startOfFortnight = new Date(this.currentYear, this.currentMonth, 16);
      endOfFortnight = new Date(
        this.currentYear,
        this.currentMonth + 1,
        0,
        23,
        59,
        59
      );
    }

    if (hasPaid == false) {
      return this.clients?.filter((client) => {
        const startDate = new Date(client.attributes.startDate);
        startDate.setDate(startDate.getDate() + 1);
        return (
          startDate >= startOfFortnight &&
          startDate <= endOfFortnight &&
          client.attributes.plan == `${plan} dias a la semana` &&
          client.attributes.hasPaid == false
        );
      }).length;
    }
    return this.clients?.filter((client) => {
      const startDate = new Date(client.attributes.startDate);
      startDate.setDate(startDate.getDate() + 1);
      return (
        startDate >= startOfFortnight &&
        startDate <= endOfFortnight &&
        client.attributes.plan == `${plan} dias a la semana`
      );
    }).length;
  }

  fortnightClientsPaymentPerDays(
    fortnight: number,
    plan: string,
    hasPaid?: boolean
  ): number {
    let startOfFortnight: Date;
    let endOfFortnight: Date;

    if (fortnight == 1) {
      // Primera quincena del mes
      startOfFortnight = new Date(this.currentYear, this.currentMonth, 1);
      endOfFortnight = new Date(
        this.currentYear,
        this.currentMonth,
        15,
        23,
        59,
        59
      ); // Final del 15 de mes
    } else if (fortnight == 2) {
      // Segunda quincena del mes
      startOfFortnight = new Date(this.currentYear, this.currentMonth, 16);
      endOfFortnight = new Date(
        this.currentYear,
        this.currentMonth + 1,
        0,
        23,
        59,
        59
      );
    }
    let filteredClients;
    if (hasPaid == false) {
      filteredClients = this.clients?.filter((client) => {
        const startDate = new Date(client.attributes.startDate);
        startDate.setDate(startDate.getDate() + 1);
        return (
          startDate >= startOfFortnight &&
          startDate <= endOfFortnight &&
          client.attributes.plan == `${plan} dias a la semana` &&
          client.attributes.hasPaid == false
        );
      });
    } else {
      filteredClients = this.clients?.filter((client) => {
        const startDate = new Date(client.attributes.startDate);
        startDate.setDate(startDate.getDate() + 1);
        return (
          startDate >= startOfFortnight &&
          startDate <= endOfFortnight &&
          client.attributes.plan == `${plan} dias a la semana`
        );
      });
    }

    let payment = 0;
    filteredClients?.forEach((client) => {
      payment = payment + client.attributes.monthlyPayment;
    });
    return payment;
  }

  get bono(): number {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // Enero es 0, Febrero es 1, etc.
    const filteredClients = this.clients?.filter((client) => {
      const startDate = new Date(client?.attributes.startDate);
      const startYear = startDate.getFullYear();
      const startMonth = startDate.getMonth();

      return (
        startYear === currentYear &&
        startMonth === currentMonth &&
        client.attributes.plan == '6 dias a la semana'
      );
    });

    if (filteredClients?.length > 7) {
      const bonusClients = filteredClients?.slice(7);
      let bonusToPay = 0;
      bonusClients.forEach((client) => {
        const payment = client.attributes.hasPaid
          ? client.attributes.monthlyPayment - 40000
          : 0;
        bonusToPay = bonusToPay + payment;
      });
      return bonusToPay;
    }
    return 0;
  }
}
