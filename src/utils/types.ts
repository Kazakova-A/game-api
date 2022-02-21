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
