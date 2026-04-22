import { differenceInDays, isSameDay, isAfter, isToday, startOfDay } from 'date-fns';

export const isEpisodeDateToday = (episodeTimestamp?: string) => {
  return !!episodeTimestamp && isSameDay(new Date(), new Date(episodeTimestamp));
};

export const isEpisodeDateValid = (episodeTimestamp: string) => {
  const episode = new Date(episodeTimestamp);
  return isToday(episode) || isAfter(episode, startOfDay(new Date()));
};

export const getDaysUntilNewEpisode = (episodeTimestamp: string) => {
  const days = differenceInDays(new Date(episodeTimestamp), new Date());

  if (days === 0) return 'Today';

  return `${days} ${days === 1 ? 'day' : 'days'}`;
};
