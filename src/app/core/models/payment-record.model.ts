export interface PaymentRecordResponse {
  data: PaymentRecord[]; // Array de registros de pago
  meta: any; // Información adicional
}

export interface PaymentRecord {
  id: number; // ID del registro de pago
  attributes: Attributes; // Atributos del registro
}

export interface Attributes {
  createdAt: string; // Fecha de creación (ISO string)
  updatedAt: string; // Fecha de actualización (ISO string)
  publishedAt: string; // Fecha de publicación (ISO string)
  paymentDate: string; // Fecha de pago (ISO string)
  dueDate: string; // Fecha de vencimiento (ISO string)
  amount: string; // Cantidad pagada
  discountAmount: string; // Monto del descuento (vacío si no hay descuento)
  discountReason: string; // Razón del descuento
  hasDiscounted: boolean; // Si se aplicó un descuento
  plan: string; // Plan asociado al pago
  status: string; // Estado del pago (e.g., "paid", "pending")
}
