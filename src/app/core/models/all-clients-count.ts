export interface AllTrainersClientSummaryResponse {
  data: AllTrainersClientSummaryData;
  meta: any; // Metadata adicional si la necesitas
}

export interface AllTrainersClientSummaryData {
  attributes: AllTrainnersClientSummaryAttributes;
}

export interface AllTrainnersClientSummaryAttributes {
  [trainerName: string]: TrainerClientSummary | TrainerErrorSummary; // Cada entrenador tiene su resumen o un mensaje de error
}

export interface TrainerClientSummary {
  [month: string]: MonthlyClientSummary; // Resumen por mes
}

export interface TrainerErrorSummary {
  message: string; // Mensaje de error si no hay datos para el entrenador
}

export interface MonthlyClientSummary {
  firstHalf: PlanCounts; // Resumen de la primera quincena
  secondHalf: PlanCounts; // Resumen de la segunda quincena
}

export interface PlanCounts {
  pending: {
    '3 dias': number; // Clientes pendientes en plan "3 días"
    '6 dias': number; // Clientes pendientes en plan "6 días"
  };
  actives: {
    '3 dias': number; // Clientes activos en plan "3 días"
    '6 dias': number; // Clientes activos en plan "6 días"
  };
}
