const NO_RESULT_TEXT = 'n/a';
const NO_SUMMARY_TEXT = 'No overview available.';

export const formatPremiere = (value?: string) => {
  return value ? `${value.substring(0, 4)}` : NO_RESULT_TEXT;
};

export const formatRating = (rating: { average?: number }) => {
  if (!rating.average) {
    return NO_RESULT_TEXT;
  }
  const isInteger = Number.isInteger(rating.average);
  return rating.average && isInteger ? `${rating.average}.0` : rating.average;
};

export const formatGenres = (genres?: string[]) => {
  return genres?.length
    ? genres.slice(0, 2).join(', ')
    : NO_RESULT_TEXT.toUpperCase();
};

export const formatAvgRuntime = (avgRuntime?: number) => {
  return avgRuntime ? `${avgRuntime}m` : NO_RESULT_TEXT;
};

export const parseHtmlString = (htmlString: string): string => {
  const divContainer = document.createElement('div');
  divContainer.innerHTML = htmlString;
  return divContainer.textContent || divContainer.innerText || '';
};

export const formatSummary = (summaryHtmlString?: string) => {
  if (!summaryHtmlString) { return NO_SUMMARY_TEXT; }

  const summary = parseHtmlString(summaryHtmlString);
  const shortenedSummary = summary.split('. ').slice(0, 3).join('. ');
  const endsWithDot = shortenedSummary[shortenedSummary.length - 1] === '.';
  return endsWithDot ? shortenedSummary : `${shortenedSummary}.`;
};

export const getDaysUntilNewEpisode = (episodeTimestamp: string) => {
  const todayDate = new Date();
  const newEpisodeDate = new Date(episodeTimestamp);

  const differenceMs = newEpisodeDate.getTime() - todayDate.getTime();
  const differenceDays = Math.round(differenceMs / (1000 * 3600 * 24));

  if (todayDate.getDate() === newEpisodeDate.getDate()) { return 'Today'; }
  return `${differenceDays} ${differenceDays > 1 ? 'days' : 'day'}`;
};
