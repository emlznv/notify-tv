import { DEFAULT_NOTIFICATION_DAYS, UPDATE_DAY_FREQUENCY } from './helpers/constants';
import { addDays, getDaysDifferenceBetweenDates, isEpisodeDateToday } from './helpers/date-helpers';
import { formatNotificationMessage, getNotificationDayText } from './helpers/format-helpers';
import { IEpisode, IShow, IShowImage } from './typescript/interfaces';
import * as API from './api/api';
import { StorageKey } from './typescript/enums';
import { getFromDatabase, saveToDatabase } from './helpers/database-helpers';

const setDefaultNotificationDays = async () => {
  await saveToDatabase({ notificationDays: DEFAULT_NOTIFICATION_DAYS });
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

  const todayDate = new Date();
  const newEpisodeDate = new Date(episodeTimestamp);

  return notificationDays
    .map(Number)
    .find((day) => {
      const notificationDate = addDays(todayDate, day);
      return (
        notificationDate.getDate() === newEpisodeDate.getDate()
      && notificationDate.getMonth() === newEpisodeDate.getMonth()
      && notificationDate.getFullYear() === newEpisodeDate.getFullYear()
      );
    });
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
    if (isEpisodeDateToday(show.nextEpisodeData?.airstamp)) {
      return show;
    }

    try {
      const updatedShow = await API.getEpisode(show._links?.self?.href);
      if (!updatedShow || !updatedShow._links?.nextepisode?.href) {
        return show;
      }

      try {
        const updatedNextEpisodeData = await API.getEpisode(updatedShow._links.nextepisode.href);
        if (updatedNextEpisodeData) {
          updatedShow.nextEpisodeData = updatedNextEpisodeData;
        }
      } catch (err) { return show; }

      return updatedShow;
    } catch (err) {
      return show;
    }
  });

  const updatedShows = await Promise.all(showPromises);
  await saveToDatabase({ lastUpdated: new Date().toISOString() });
  return updatedShows;
};

const notifyForNextEpisode = async () => {
  const { shows, lastUpdated, lastNotified, notificationDays } = await getFromDatabase();
  const shouldNotify = shouldUpdateData(lastNotified);
  let isNotificationSent = false;

  if (!shows?.length || !shouldNotify) return;

  const upToDateShows = shouldUpdateData(lastUpdated)
    ? await updateShowsData(shows)
    : shows;

  upToDateShows.forEach((show: IShow) => {
    const dayForNotification = getNotificationDayForEpisode(notificationDays, show.nextEpisodeData?.airstamp);

    if (dayForNotification !== undefined && show.nextEpisodeData) {
      createNotification({ dayForNotification, data: show.nextEpisodeData, showName: show.name, image: show.image });
      isNotificationSent = true;
    }
  });

  if (isNotificationSent) {
    await saveToDatabase({ lastNotified: new Date().toISOString() });
  }

  await saveToDatabase({ shows: upToDateShows });
};

const migrateFromChromeStorage = async () => {
  const oldData = await chrome.storage.local.get([
    StorageKey.shows,
    StorageKey.notificationDays,
    StorageKey.sortType,
    StorageKey.lastUpdated,
    StorageKey.lastNotified
  ]);

  if (Object.keys(oldData).length > 0) {
    await saveToDatabase(oldData);
    await chrome.storage.local.clear();
  }
};

chrome.runtime.onStartup.addListener(() => {
  notifyForNextEpisode();
});

chrome.runtime.onInstalled.addListener(async () => {
  await migrateFromChromeStorage();
  setDefaultNotificationDays();
});
