export interface IShow {
  id: number;
  averageRuntime: number;
  ended: string;
  genres: Array<string>;
  image: {
    medium?: string;
    original?: string;
  };
  language: string;
  name: string;
  premiered: string;
  rating: { average?: number };
  runtime: number;
  status: string;
  summary: string;
}

export interface IShowResponse {
  score: number;
  show: IShow;
}
