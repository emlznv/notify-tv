const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const isEpisodeDateToday = (episodeTimestamp: string) => {
  const todayDate = new Date();
  const newEpisodeDate = new Date(episodeTimestamp);
  const isEpisodeToday = todayDate.getDate() === newEpisodeDate.getDate()
    && todayDate.getMonth() === newEpisodeDate.getMonth();
  return isEpisodeToday;
};

export const getDaysUntilNewEpisode = (episodeTimestamp: string) => {
  const todayDate = new Date();
  const newEpisodeDate = new Date(episodeTimestamp);
  const isEpisodeToday = isEpisodeDateToday(episodeTimestamp);

  if (isEpisodeToday) { return 'Today'; }

  const differenceMs = newEpisodeDate.getTime() - todayDate.getTime();
  const differenceDays = differenceMs / (1000 * 3600 * 24);
  const shouldRoundUp = addDays(todayDate, Math.ceil(differenceDays)).getDate() === newEpisodeDate.getDate();
  const differenceDaysRounded = shouldRoundUp ? Math.ceil(differenceDays) : Math.floor(differenceDays);

  return `${differenceDaysRounded} ${differenceDaysRounded > 1 ? 'days' : 'day'}`;
};

export const isEpisodeDateValid = (episodeTimestamp: string) => {
  const todayDate = new Date();
  const episodeDate = new Date(episodeTimestamp);
  const isEpisodeInFuture = episodeDate > todayDate;
  const isEpisodeToday = isEpisodeDateToday(episodeTimestamp);
  return isEpisodeInFuture || isEpisodeToday;
};
