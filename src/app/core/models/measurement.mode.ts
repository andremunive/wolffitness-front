export interface BodyMeasurementResponse {
  data: BodyMeasurementRecord[]; // Array de registros de medidas corporales
  meta: any; // Información adicional
}

export interface BodyMeasurementRecord {
  id: number; // ID del registro de medidas corporales
  attributes: BodyMeasurementAttributes; // Atributos del registro
}

export interface BodyMeasurementAttributes {
  date: string; // Fecha del registro (ISO string)
  weight: number; // Peso (en kg)
  abdomen: number; // Medida del abdomen
  bodyFatPercentage: string; // Porcentaje de grasa corporal
  chest: number; // Medida del pecho
  glutes: number; // Medida de los glúteos
  height: number; // Altura (en cm)
  leftArm: number; // Medida del brazo izquierdo
  leftCalf: number; // Medida del gemelo izquierdo
  leftThigh: number; // Medida del muslo izquierdo
  rightArm: number; // Medida del brazo derecho
  rightCalf: number; // Medida del gemelo derecho
  rightThigh: number; // Medida del muslo derecho
  createdAt: string; // Fecha de creación (ISO string)
  updatedAt: string; // Fecha de última actualización (ISO string)
  publishedAt: string; // Fecha de publicación (ISO string)
}
