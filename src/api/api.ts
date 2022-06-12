import { ShowStatus } from '../typescript/enums';
import { IShowResponse } from '../typescript/interfaces';

const BASE_URL = 'https://api.tvmaze.com/';

export const getShowsBySearch = (searchTerm: string) => {
  return fetch(`${BASE_URL}search/shows?q=:${searchTerm}`)
    .then((response) => response.json())
    .then((data: IShowResponse[]) => data.filter(
      (item: IShowResponse) => item.show.status.toLowerCase() !== ShowStatus.ended,
    ))
    .catch((err) => new Error(err));
};
