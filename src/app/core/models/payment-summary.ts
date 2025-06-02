export interface PaymentSummaryResponse {
  data: PaymentSummaryData;
  meta: any; // Metadata adicional si la necesitas
}

export interface PaymentSummaryData {
  attributes: PaymentSummaryAttributes;
}

export interface PaymentSummaryAttributes {
  [month: string]: MonthlyPaymentSummary; // Cada mes tendrá su propio resumen
}

export interface MonthlyPaymentSummary {
  firstHalf: PaymentPeriodSummary; // Resumen de la primera quincena
  secondHalf: PaymentPeriodSummary; // Resumen de la segunda quincena
}

export interface PaymentPeriodSummary {
  totalClients: number; // Total de clientes en el periodo
  totalCollected: number; // Total recolectado en el periodo
  totalGenerated: number; // Total generado en el periodo
  pendingGenerated: number; // Total generado en estado pending
  pendingCollected: number; // Total recolectado en estado pending
  planCounts: PlanCounts; // Totales de clientes por plan
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
