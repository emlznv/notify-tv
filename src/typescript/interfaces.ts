import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export interface IShowImage {
  medium?: string;
  original?: string;
}

interface Link {
  href: string;
}

interface Links {
  self: Link;
  nextepisode?: Link;
  previousepisode?: Link;
}

export interface IEpisode {
  id: number;
  name: string;
  season: number;
  number: number;
  airdate: string;
  airtime: string;
  airstamp: string;
  rating: { average?: number };
  runtime: number;
  image: IShowImage;
  summary: string;
  url: string;
  _links: Links & {
    show: Links & { name: string }
  };
  nextEpisodeData?: IEpisode;
}

export interface IShow {
  id: number;
  averageRuntime: number;
  ended: string | null;
  genres: Array<string>;
  image: IShowImage;
  language: string;
  name: string;
  premiered: string;
  rating: { average?: number };
  runtime: number | null;
  status: string;
  summary: string;
  webChannel?: { name: string };
  network?: { name: string };
  _links: Links;
  nextEpisodeData?: IEpisode;
}

export interface IShowResponse {
  score: number;
  show: IShow;
}

export interface IShowManager {
  addedShows: IShow[]
  addShow: (show: IShow) => void
  deleteShow: (show: IShow) => void
}

export interface ISortManager {
  sortIcon: IconDefinition;
  sortLabel: string;
  changeSorting: () => void;
}

export interface IStorageContext {
  showManager: IShowManager;
  sortManager: ISortManager;
}
