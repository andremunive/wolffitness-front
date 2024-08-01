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
  get activesClients(): number {
    return this.clients?.filter((client) => {
      const endDate = new Date(client.attributes.endDate);
      return endDate >= this.currentDate;
    }).length;
  }
  get inactivesClients(): number {
    return this.clients?.filter((client) => {
      const endDate = new Date(client.attributes.endDate);
      return endDate < this.currentDate;
    }).length;
  }

  get notPendingClients(): number {
    return this.clients?.filter((client) => {
      return client.attributes.hasPaid;
    }).length;
  }
  get pendingClients(): number {
    return this.clients?.filter((client) => {
      return !client.attributes.hasPaid;
    }).length;
  }

  get threeDaysClients(): number {
    return this.clients?.filter((client) => {
      return client.attributes.plan == '3 dias a la semana';
    }).length;
  }
  get sixDaysClients(): number {
    return this.clients?.filter((client) => {
      return client.attributes.plan == '6 dias a la semana';
    }).length;
  }

  get currentFortnightClients(): number {
    // Determinar los límites de la quincena actual
    let startOfFortnight: Date;
    let endOfFortnight: Date;

    if (this.currentDay <= 15) {
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
    } else {
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

    return this.clients?.filter((client) => {
      const startDate = new Date(client.attributes.startDate);
      return startDate >= startOfFortnight && startDate <= endOfFortnight;
    }).length;
  }

  get currentFortnightSixDaysClients(): number {
    // Determinar los límites de la quincena actual
    let startOfFortnight: Date;
    let endOfFortnight: Date;

    if (this.currentDay <= 15) {
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
    } else {
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

    return this.clients?.filter((client) => {
      const startDate = new Date(client.attributes.startDate);
      return (
        startDate >= startOfFortnight &&
        startDate <= endOfFortnight &&
        client.attributes.plan == '6 dias a la semana'
      );
    }).length;
  }

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

  get currentFortnightThreeDaysClients(): number {
    // Determinar los límites de la quincena actual
    let startOfFortnight: Date;
    let endOfFortnight: Date;

    if (this.currentDay <= 15) {
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
    } else {
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

    return this.clients?.filter((client) => {
      const startDate = new Date(client.attributes.startDate);
      return (
        startDate >= startOfFortnight &&
        startDate <= endOfFortnight &&
        client.attributes.plan == '3 dias a la semana'
      );
    }).length;
  }
  get currentFortnightThreeDaysClientsPayment(): number {
    // Determinar los límites de la quincena actual
    let startOfFortnight: Date;
    let endOfFortnight: Date;

    if (this.currentDay <= 15) {
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
    } else {
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

    const filteredClients = this.clients?.filter((client) => {
      const startDate = new Date(client.attributes.startDate);
      return (
        startDate >= startOfFortnight &&
        startDate <= endOfFortnight &&
        client.attributes.plan == '3 dias a la semana'
      );
    });

    let payment = 0;
    filteredClients?.forEach((client) => {
      payment = payment + client.attributes.monthlyPayment;
    });
    return payment;
  }

  get currentFortnightSixDaysClientsPayment(): number {
    // Determinar los límites de la quincena actual
    let startOfFortnight: Date;
    let endOfFortnight: Date;

    if (this.currentDay <= 15) {
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
    } else {
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

    const filteredClients = this.clients?.filter((client) => {
      const startDate = new Date(client.attributes.startDate);
      return (
        startDate >= startOfFortnight &&
        startDate <= endOfFortnight &&
        client.attributes.plan == '6 dias a la semana'
      );
    });
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
        const payment = client.attributes.monthlyPayment - 40000;
        bonusToPay = bonusToPay + payment;
      });
      return bonusToPay;
    }
    return 0;
  }
}
