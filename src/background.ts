import { addDays, isEpisodeDateToday } from './helpers/date-helpers';
import { NotificationDay } from './typescript/enums';
import { IEpisode, IShow, IShowImage } from './typescript/interfaces';

const updateDayFrequency = 0.5;
const defaultNotificationDays: NotificationDay[] = [NotificationDay.sameDay];

const formatSeasonOrEpisode = (value: number) => {
  if (!value) { return; }
  return value.toString().length === 1 ? `0${value}` : value;
};

const formatMessage = (episode: IEpisode) => {
  if (!episode) { return ''; }
  const { name, season, number } = episode;
  const seasonAndEpisode = `(S${formatSeasonOrEpisode(season)} E${formatSeasonOrEpisode(number)})`;
  return `${name} ${seasonAndEpisode}`;
};

const getNotificationDayText = (day: number) => {
  switch (day) {
    case 0:
      return 'today';
    case 1:
      return 'tomorrow';
    case 3:
      return 'in 3 days';
    default:
      break;
  }
};

const setDefaultNotificationDays = async () => {
  chrome.storage.local.set({ notificationDays: defaultNotificationDays });
};

const createNotification = ({ dayForNotification, data, showName, image }:
  { dayForNotification: number, data: IEpisode, showName: string, image: IShowImage }) => {
  const icon = image?.medium || './logo.png';
  const title = `${showName}: new episode ${getNotificationDayText(dayForNotification)}!`;

  chrome.notifications.create('', {
    title,
    message: formatMessage(data),
    iconUrl: `${icon}`,
    type: 'basic'
  });
};

const getDaysDifferenceBetweenDates = (futureDate: Date, pastDate: Date) => {
  const differenceMs = futureDate.getTime() - pastDate.getTime();
  return differenceMs / (1000 * 3600 * 24);
};

const getNotificationDayForEpisode = (notificationDays: string[], episodeTimestamp?: string) => {
  if (!episodeTimestamp) { return; }

  let notificationDay;
  const todayDate = new Date();
  const newEpisodeDate = new Date(episodeTimestamp);

  notificationDays.map((day) => Number(day)).forEach((day) => {
    const notificationDate = addDays(todayDate, day);
    const datesMatch = notificationDate.getDate() === newEpisodeDate.getDate()
      && notificationDate.getMonth() === newEpisodeDate.getMonth();

    if (datesMatch) { notificationDay = day; }
  });

  return notificationDay;
};

const getDataByUrl = (url: string) => {
  if (!url) { return; }
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      chrome.storage.local.set({ lastUpdated: new Date().toISOString() });
      return data;
    })
    .catch((error) => new Error(error));
};

const shouldUpdateData = (lastUpdated: string) => {
  if (!lastUpdated) { return true; }
  const todayDate = new Date();
  const lastUpdatedDate = new Date(lastUpdated);

  const differenceDays = getDaysDifferenceBetweenDates(todayDate, lastUpdatedDate);
  return differenceDays >= updateDayFrequency;
};

const updateShowsData = async (shows: IShow[]) => {
  const showPromises = shows.map(async (show) => {
    try {
      if (isEpisodeDateToday(show.nextEpisodeData?.airstamp)) {
        return show;
      }

      const updatedShow = await getDataByUrl(show._links?.self?.href);
      if (updatedShow instanceof Error) {
        return show;
      }

      const updatedNextEpisodeData = await getDataByUrl(updatedShow._links?.nextepisode?.href);
      if (!(updatedNextEpisodeData instanceof Error)) {
        updatedShow.nextEpisodeData = updatedNextEpisodeData;
      }
      return updatedShow;
    } catch (err) {
      return show;
    }
  });

  return Promise.all(showPromises);
};

const notifyForNextEpisode = async () => {
  let { shows } = await chrome.storage.local.get('shows');
  const { lastUpdated } = await chrome.storage.local.get('lastUpdated');
  const { lastNotified } = await chrome.storage.local.get('lastNotified');
  const { notificationDays } = await chrome.storage.local.get('notificationDays');
  const shouldNotify = shouldUpdateData(lastNotified);

  if (!shows?.length || !shouldNotify) { return; }
  shows = shouldUpdateData(lastUpdated) ? await updateShowsData(shows) : shows;

  shows.forEach((show: IShow) => {
    const dayForNotification = getNotificationDayForEpisode(notificationDays, show.nextEpisodeData?.airstamp);

    if (dayForNotification !== undefined && show.nextEpisodeData) {
      createNotification({ dayForNotification, data: show.nextEpisodeData, showName: show.name, image: show.image });
      chrome.storage.local.set({ lastNotified: new Date().toISOString() });
    }
  });
  chrome.storage.local.set({ shows });
};

chrome.runtime.onStartup.addListener(() => {
  notifyForNextEpisode();
});

chrome.runtime.onInstalled.addListener(() => {
  setDefaultNotificationDays();
});
