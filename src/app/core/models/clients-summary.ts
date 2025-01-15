export interface ClientsSummary {
  data: {
    attributes: Record<string, YearData>; // Claves dinámicas como "2025-1" y "2024-12"
  };
  meta: Record<string, any>; // Meta puede ser de cualquier estructura
}

export interface YearData {
  firstHalf: FortnightData; // Datos de la primera quincena
  secondHalf: FortnightData; // Datos de la segunda quincena
}

export interface FortnightData {
  fortNight: string; // Nombre de la quincena, por ejemplo: "Primera" o "Segunda"
  sixDaysPlanTotalPayments: number; // Pagos totales en el plan de 6 días
  sixDaysPlanTotalPending: number; // Pendientes en el plan de 6 días
  threeDaysPlanTotalPayments: number; // Pagos totales en el plan de 3 días
  threeDaysPlanTotalPending: number; // Pendientes en el plan de 3 días
  fortNightIncome: number; // Ingresos de la quincena
  pendinIncome: number; // Ingresos pendientes
  incomeFromLastFortNight: number; // Ingresos de la quincena pasada
  grossIncome: number; // Ingreso bruto
  trainerIncome: number; // Ingreso del entrenador
  monthBonus: number; // Bono mensual
}
