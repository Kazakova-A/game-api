export interface Tables {
  name: string;
  fields: {
    name: string;
    type: string;
    link?: string;
    key?: string;
  }[];
}

export interface PublisherRecord {
  name: string;
  siret: number;
  phone: number;
}

export interface GameRecord {
  title: string;
  price: number;
  publisher: number;
  tags: string;
  releaseDate: number;
}

export interface ResponseObject {
  data?: any;
  datetime: number;
  message: string;
  request: string;
  status: number | string;
}

export interface Pagination {
  currentPage: number;
  limit: number;
  totalPages: number;
}

export interface QueryParams {
  limit?: number | string;
  page?: number | string;
}
