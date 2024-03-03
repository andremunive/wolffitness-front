export interface ClientModel {
  data: Datum[];
  meta: Meta;
}

export interface Datum {
  attributes: Attributes;
  id: number;
}

export interface Attributes {
  createdAt: Date;
  discount?: boolean;
  discountDescription?: null;
  endDate?: Date;
  monthlyPayment?: number;
  name: string;
  plan?: string;
  publishedAt: Date;
  startDate?: Date;
  trainer?: string;
  updatedAt: Date;
  whatsapp: string;

  birthDate?: Date;
  email?: string;
}

export interface Meta {
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
}
