import { IShow } from '../typescript/interfaces';

export const mockShows: IShow[] = [
  {
    id: 86175,
    name: 'Pluribus',
    language: 'English',
    genres: [
      'Drama',
      'Science-Fiction',
      'Thriller'
    ],
    status: 'Running',
    averageRuntime: 49,
    premiered: '2025-11-07',
    ended: null,
    runtime: null,
    rating: {
      average: 7.9
    },
    webChannel: {
      name: 'Apple TV',
    },
    image: {
      medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/592/1481086.jpg',
      original: 'https://static.tvmaze.com/uploads/images/original_untouched/592/1481086.jpg'
    },
    summary: 'The most miserable person on Earth must save the world from happiness.',
    _links: {
      self: {
        href: 'https://api.tvmaze.com/shows/86175'
      },
      previousepisode: {
        href: 'https://api.tvmaze.com/episodes/3314586',
      }
    }
  },
  {
    id: 38052,
    name: 'Silo',
    language: 'English',
    genres: [
      'Drama',
      'Science-Fiction',
      'Mystery'
    ],
    status: 'Running',
    runtime: null,
    averageRuntime: 50,
    premiered: '2023-05-05',
    ended: null,
    rating: {
      average: 8.1
    },
    webChannel: {
      name: 'Apple TV'
    },
    image: {
      medium: 'https://static.tvmaze.com/uploads/images/medium_portrait/546/1365594.jpg',
      original: 'https://static.tvmaze.com/uploads/images/original_untouched/546/1365594.jpg'
    },
    summary: 'In a ruined and toxic future, thousands live in a giant silo deep underground.',
    _links: {
      self: {
        href: 'https://api.tvmaze.com/shows/38052'
      },
      previousepisode: {
        href: 'https://api.tvmaze.com/episodes/2957765'
      }
    }
  },
];
