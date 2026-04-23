import { addDays, differenceInDays, isSameDay } from 'date-fns';
import { DEFAULT_NOTIFICATION_DAYS, UPDATE_DAY_FREQUENCY } from './helpers/constants';
import { formatNotificationMessage, getNotificationDayText } from './helpers/format-helpers';
import { IEpisode, IShow, IShowImage } from './typescript/interfaces';
import * as API from './api/api';
import { NotificationDay, StorageKey } from './typescript/enums';
import { getFromDatabase, saveToDatabase } from './helpers/database-helpers';

const setDefaultNotificationDays = async () => {
  await saveToDatabase({ notificationDays: DEFAULT_NOTIFICATION_DAYS });
};

const createNotification = ({ dayForNotification, data, showName, image }:
  { dayForNotification: number, data: IEpisode, showName: string, image: IShowImage }) => {
  const icon = image?.medium || '../public/logo.png';
  const title = `${showName}: new episode ${getNotificationDayText(dayForNotification)}!`;

  chrome.notifications.create('', {
    title,
    message: formatNotificationMessage(data),
    iconUrl: `${icon}`,
    type: 'basic'
  });
};

const getNotificationDayForEpisode = (notificationDays: NotificationDay[], episodeTimestamp?: string) => {
  if (!episodeTimestamp) { return; }

  const todayDate = new Date();
  const newEpisodeDate = new Date(episodeTimestamp);

  return notificationDays
    .map(Number)
    .find((day) => {
      const notificationDate = addDays(todayDate, day);
      return isSameDay(notificationDate, newEpisodeDate);
    });
};

const shouldUpdateData = (lastUpdated?: string) => {
  if (!lastUpdated) { return true; }
  const todayDate = new Date();
  const lastUpdatedDate = new Date(lastUpdated);

  const differenceDays = differenceInDays(todayDate, lastUpdatedDate);
  return differenceDays >= UPDATE_DAY_FREQUENCY;
};

const updateShow = async (show: IShow) => {
  const updatedShow = await API.getShowByUrl(show._links?.self?.href);
  if (!updatedShow || !updatedShow._links?.nextepisode?.href) return show;

  const updatedNextEpisodeData = await API.getEpisodeByUrl(updatedShow._links.nextepisode.href);
  if (updatedNextEpisodeData) {
    updatedShow.nextEpisodeData = updatedNextEpisodeData;
  }

  return updatedShow;
};

const updateShowsData = async (shows: IShow[]) => {
  const showPromises = shows.map(async (show) => {
    const isEpisodeDateToday = show.nextEpisodeData?.airstamp
      && isSameDay(new Date(), new Date(show.nextEpisodeData.airstamp));

    if (isEpisodeDateToday) return show;

    try {
      return await updateShow(show);
    } catch (err) {
      return show;
    }
  });

  const updatedShows = await Promise.all(showPromises);
  await saveToDatabase({ lastUpdated: new Date().toISOString() });
  return updatedShows;
};

const notifyForShow = (show: IShow, notificationDays: NotificationDay[]) => {
  const dayForNotification = getNotificationDayForEpisode(notificationDays, show.nextEpisodeData?.airstamp);
  if (dayForNotification === undefined || !show.nextEpisodeData) return false;

  createNotification({ dayForNotification, data: show.nextEpisodeData, showName: show.name, image: show.image });
  return true;
};

const notifyForNextEpisode = async () => {
  const { shows, lastUpdated, lastNotified, notificationDays } = await getFromDatabase();

  if (!shows?.length || !shouldUpdateData(lastNotified)) return;

  const upToDateShows = shouldUpdateData(lastUpdated) ? await updateShowsData(shows) : shows;

  const isNotificationSent = upToDateShows
    .some((show: IShow) => notifyForShow(show, notificationDays));

  isNotificationSent && await saveToDatabase({ lastNotified: new Date().toISOString() });
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
  setDefaultNotificationDays();
  await migrateFromChromeStorage();
});
