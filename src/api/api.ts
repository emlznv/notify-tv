import { isSameDay } from 'date-fns';
import { ShowStatus } from '../typescript/enums';
import { IEpisode, IShow, IShowResponse } from '../typescript/interfaces';

const BASE_URL = 'https://api.tvmaze.com/';

export const getShowsBySearch = async (searchTerm: string) => {
  const response = await fetch(`${BASE_URL}search/shows?q=${searchTerm}`);
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  const data: IShowResponse[] = await response.json();
  return data
    .filter((item) => item.show.status.toLowerCase() !== ShowStatus.ended)
    .map((item) => item.show);
};

export const getEpisodeByUrl = async (url: string): Promise<IEpisode> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  return response.json();
};

export const getShowByUrl = async (url: string): Promise<IShow> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  return response.json();
};

export const getEpisodeData = async (show: IShow): Promise<IEpisode | null> => {
  const nextUrl = show._links?.nextepisode?.href;
  const prevUrl = show._links?.previousepisode?.href;

  if (!nextUrl && !prevUrl) return null;

  try {
    const [next, previous] = await Promise.all([
      nextUrl ? getEpisodeByUrl(nextUrl) : null,
      prevUrl ? getEpisodeByUrl(prevUrl) : null,
    ]);

    if (previous?.airstamp && isSameDay(new Date(), new Date(previous.airstamp))) {
      return previous;
    }

    return next;
  } catch {
    return null;
  }
};
