export interface ClientCountsResponse {
  data: ClientCountsData; // Los datos principales
  meta: any; // Metadatos adicionales (si los hay)
}

export interface ClientCountsData {
  attributes: ClientCountsAttributes; // Atributos del resumen
}

export interface ClientCountsAttributes {
  [month: string]: MonthlyClientSummary; // Resumen de cada mes, indexado por año-mes (e.g., "2024-12")
}

export interface MonthlyClientSummary {
  firstHalf: ClientPlanCounts; // Resumen de la primera quincena
  secondHalf: ClientPlanCounts; // Resumen de la segunda quincena
}

export interface ClientPlanCounts {
  pending: PlanCounts; // Totales de clientes pendientes
  actives: PlanCounts; // Totales de clientes activos
}

export interface PlanCounts {
  '3 dias': number; // Total de clientes con plan de 3 días
  '6 dias': number; // Total de clientes con plan de 6 días
}
