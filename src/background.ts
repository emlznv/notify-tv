import { DEFAULT_NOTIFICATION_DAYS, UPDATE_DAY_FREQUENCY } from './helpers/constants';
import { addDays, getDaysDifferenceBetweenDates, isEpisodeDateToday } from './helpers/date-helpers';
import { formatNotificationMessage, getNotificationDayText } from './helpers/format-helpers';
import { IEpisode, IShow, IShowImage } from './typescript/interfaces';
import * as API from './api/api';
import { ChromeStorageKeys } from './typescript/enums';

const setDefaultNotificationDays = async () => {
  chrome.storage.local.set({ notificationDays: DEFAULT_NOTIFICATION_DAYS });
};

const createNotification = ({ dayForNotification, data, showName, image }:
  { dayForNotification: number, data: IEpisode, showName: string, image: IShowImage }) => {
  const icon = image?.medium || './public/logo.png';
  const title = `${showName}: new episode ${getNotificationDayText(dayForNotification)}!`;

  chrome.notifications.create('', {
    title,
    message: formatNotificationMessage(data),
    iconUrl: `${icon}`,
    type: 'basic'
  });
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

const shouldUpdateData = (lastUpdated?: string) => {
  if (!lastUpdated) { return true; }
  const todayDate = new Date();
  const lastUpdatedDate = new Date(lastUpdated);

  const differenceDays = getDaysDifferenceBetweenDates(todayDate, lastUpdatedDate);
  return differenceDays >= UPDATE_DAY_FREQUENCY;
};

const updateShowsData = async (shows: IShow[]) => {
  const showPromises = shows.map(async (show) => {
    try {
      if (isEpisodeDateToday(show.nextEpisodeData?.airstamp)) {
        return show;
      }

      const updatedShow = await API.getEpisode(show._links?.self?.href);
      if (updatedShow instanceof Error) {
        return show;
      }

      const updatedNextEpisodeData = await API.getEpisode(updatedShow._links?.nextepisode?.href);
      if (!(updatedNextEpisodeData instanceof Error)) {
        updatedShow.nextEpisodeData = updatedNextEpisodeData;
      }

      chrome.storage.local.set({ lastUpdated: new Date().toISOString() });
      return updatedShow;
    } catch (err) {
      return show;
    }
  });

  return Promise.all(showPromises);
};

const notifyForNextEpisode = async () => {
  let { shows } = await chrome.storage.local.get(ChromeStorageKeys.shows);
  const { lastUpdated } = await chrome.storage.local.get(ChromeStorageKeys.lastUpdated);
  const { lastNotified } = await chrome.storage.local.get(ChromeStorageKeys.lastNotified);
  const { notificationDays } = await chrome.storage.local.get(ChromeStorageKeys.notificationDays);
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
