export interface IEpisode {
  id: number;
  name: string;
  season: number;
  number: number;
  airdate: string;
  airtime: string;
  airstamp: string;
  rating: { average?: number };
  image: {
    medium?: string;
    original?: string;
  };
  summary: string;
}

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
  webChannel?: { name: string };
  network?: { name: string };
  _links: {
    self: { href: string };
    nextepisode: { href: string };
  }
  nextEpisodeData?: IEpisode;
}

export interface IShowResponse {
  score: number;
  show: IShow;
}

export interface IStorageContext {
  addedShows: IShow[]
  addToShows: (show: IShow) => void
  deleteShow: (show: IShow) => void
}
