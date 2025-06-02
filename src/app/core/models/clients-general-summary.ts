export interface ClientGeneralSummary {
  data: {
    attributes: Record<string, TrainerData>; // Clave dinámica para cada entrenador
  };
  meta: Record<string, any>; // Meta puede tener cualquier estructura
}

export interface TrainerData {
  [yearMonth: string]: YearMonthData; // Clave dinámica para cada combinación año-mes (e.g., "2025-1", "2024-12")
}

export interface YearMonthData {
  firstHalf: FortnightData;
  secondHalf: FortnightData;
}

export interface FortnightData {
  fortNight: string; // Ejemplo: "Primera" o "Segunda"
  sixDaysPlanTotalPayments: number;
  sixDaysPlanTotalPending: number;
  threeDaysPlanTotalPayments: number;
  threeDaysPlanTotalPending: number;
  fortNightIncome: number;
  pendinIncome: number;
  incomeFromLastFortNight: number;
  grossIncome: number;
  trainerIncome: number;
}
