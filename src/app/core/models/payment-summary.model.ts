export interface AllPaymentSummaryResponse {
  data: AllPaymentSummaryData; // Resumen por entrenador
  meta: any;
}

export interface AllPaymentSummaryData {
  attributes: PaymentSummaryByTrainer;
}

export interface PaymentSummaryByTrainer {
  [trainer: string]: PaymentSummaryAttributes | TrainerErrorSummary; // Cada entrenador tiene su resumen o un mensaje de error
}

export interface PaymentSummaryResponse {
  data: PaymentSummaryData;
  meta: any;
}

export interface PaymentSummaryData {
  attributes: PaymentSummaryAttributes;
}

export interface PaymentSummaryAttributes {
  [month: string]: MonthlyPaymentSummary; // Representa cada mes con su resumen
}

export interface MonthlyPaymentSummary {
  firstHalf: PaymentPeriodSummary; // Resumen de la primera quincena
  secondHalf: PaymentPeriodSummary; // Resumen de la segunda quincena
}

export interface PaymentPeriodSummary {
  totalClients: number; // Total de clientes en el periodo
  totalCollected: number; // Total de dinero recolectado en el periodo
  totalGenerated: number;
  planCounts: PlanCounts; // Totales de clientes por plan
  bonus: number;
}

export interface PlanCounts {
  pending: {
    '3 dias': number;
    '6 dias': number;
  };
  actives: {
    '3 dias': number;
    '6 dias': number;
  };
}

export interface TrainerErrorSummary {
  message: string; // Mensaje de error si el entrenador no tiene clientes o registros
}
