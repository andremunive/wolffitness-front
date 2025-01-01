export interface ClientModel {
  data: data;
  meta: Meta;
}

export interface ClientModelSearch {
  data: Datum[];
  meta: Meta;
}

export interface SingleCLient {
  data: Datum;
  meta: Meta;
}

export interface data {
  data: Datum[];
  meta: any;
}
export interface Datum {
  attributes: Attributes;
  id: number;
}

export interface Attributes {
  createdAt: Date;
  endDate?: Date;
  monthlyPayment?: number;
  name: string;
  plan?: string;
  publishedAt: Date;
  trainer?: string;
  updatedAt: Date;
  whatsapp: string;
  hasPaid: boolean;
  gender: string;
  birthDate?: Date;
  status?: string;
  discountReason?: string;
  discountAmount?: number;
  discount?: boolean;
  visible?: boolean;
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
