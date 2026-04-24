import { NotificationDay } from '../typescript/enums';
import { IEpisode } from '../typescript/interfaces';
import { NO_INFO_TEXT, NO_SUMMARY_TEXT } from './constants';

export const formatPremiere = (value?: string) => {
  return value ? `${value.substring(0, 4)}` : NO_INFO_TEXT;
};

export const formatRating = (rating: { average?: number }) => {
  if (!rating.average) {
    return NO_INFO_TEXT;
  }
  const isInteger = Number.isInteger(rating.average);
  return rating.average && isInteger ? `${rating.average}.0` : rating.average;
};

export const formatGenres = (genres?: string[]) => {
  return genres?.length
    ? genres.slice(0, 2).join(', ')
    : NO_INFO_TEXT;
};

export const formatAvgRuntime = (avgRuntime?: number) => {
  return avgRuntime ? `${avgRuntime}m` : NO_INFO_TEXT;
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

export const formatSeasonOrEpisodeNumber = (value: number) => {
  if (!value) { return; }
  return value.toString().length === 1 ? `0${value}` : value;
};

export const formatNotificationMessage = (episode: IEpisode) => {
  if (!episode) { return ''; }
  const { name, season, number } = episode;
  const seasonAndEpisode = `(S${formatSeasonOrEpisodeNumber(season)} E${formatSeasonOrEpisodeNumber(number)})`;
  return `${name} ${seasonAndEpisode}`;
};

export const getNotificationDayText = (day: NotificationDay) => {
  switch (day) {
    case NotificationDay.sameDay:
      return 'today';
    case NotificationDay.oneDayBefore:
      return 'tomorrow';
    case NotificationDay.threeDaysBefore:
      return 'in 3 days';
    default:
      break;
  }
};
