import { isEpisodeDateToday } from '../helpers/date-helpers';
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

export const getEpisode = async (endpoint: string): Promise<IEpisode> => {
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  return response.json();
};

export const getEpisodeData = async (show: IShow): Promise<IEpisode | null> => {
  const nextUrl = show._links?.nextepisode?.href;
  const prevUrl = show._links?.previousepisode?.href;

  if (!nextUrl && !prevUrl) return null;

  try {
    const [next, previous] = await Promise.all([
      nextUrl ? getEpisode(nextUrl) : null,
      prevUrl ? getEpisode(prevUrl) : null,
    ]);

    if (previous && isEpisodeDateToday(previous.airstamp)) {
      return previous;
    }

    return next;
  } catch {
    return null;
  }
};
