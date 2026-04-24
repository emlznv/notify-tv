import { addDays, isSameDay } from 'date-fns';
import { DEFAULT_NOTIFICATION_DAYS } from './helpers/constants';
import { formatNotificationMessage, getNotificationDayText } from './helpers/format-helpers';
import { IEpisode, IShow, IShowImage } from './typescript/interfaces';
import * as API from './api/api';
import { NotificationDay, StorageKey } from './typescript/enums';
import { getFromDatabase, saveToDatabase } from './helpers/database-helpers';

const NOTIFICATION_ALARM = 'check-notifications';
const UPDATE_ALARM = 'update-shows';

const setDefaultNotificationDays = async () => {
  await saveToDatabase({ notificationDays: DEFAULT_NOTIFICATION_DAYS });
};

const createNotification = ({ notificationDay, data, showName, image }:
  { notificationDay: NotificationDay, data: IEpisode, showName: string, image: IShowImage }) => {
  const icon = image?.medium || '../public/logo.png';
  const title = `${showName}: new episode ${getNotificationDayText(notificationDay)}!`;
  const key = `${showName}-${data.id}-${notificationDay}`;

  chrome.notifications.create(
    key,
    {
      title,
      message: formatNotificationMessage(data),
      iconUrl: `${icon}`,
      type: 'basic'
    }
  );
};

const findNotificationEpisodeMatch = (notificationDays: NotificationDay[], episodeTimestamp?: string) => {
  if (!episodeTimestamp) return;

  const todayDate = new Date();
  const newEpisodeDate = new Date(episodeTimestamp);

  return notificationDays
    .find((day) => {
      const notificationDate = addDays(todayDate, Number(day));
      return isSameDay(notificationDate, newEpisodeDate);
    });
};

const fetchShowData = async (show: IShow) => {
  const updatedShow = await API.getShowByUrl(show._links?.self?.href);
  if (!updatedShow || !updatedShow._links?.nextepisode?.href) return show;

  const updatedNextEpisodeData = await API.getEpisodeByUrl(updatedShow._links.nextepisode.href);
  if (updatedNextEpisodeData) {
    updatedShow.nextEpisodeData = updatedNextEpisodeData;
  }

  return updatedShow;
};

const updateShowData = async (shows: IShow[]) => {
  const showPromises = shows.map(async (show) => {
    const isEpisodeDateToday = show.nextEpisodeData?.airstamp
      && isSameDay(new Date(), new Date(show.nextEpisodeData.airstamp));

    if (isEpisodeDateToday) return show;

    try {
      return await fetchShowData(show);
    } catch (err) {
      return show;
    }
  });

  return Promise.all(showPromises);
};

const updateStaleShowData = async () => {
  const { shows } = await getFromDatabase();
  if (!shows?.length) return [];

  const updatedShows = await updateShowData(shows);
  await saveToDatabase({ shows: updatedShows });
};

const handleEpisodeNotifications = async () => {
  const { shows, notificationDays } = await getFromDatabase();
  let isNotificationSent = false;

  shows.forEach((show: IShow) => {
    const notificationDay = findNotificationEpisodeMatch(notificationDays, show.nextEpisodeData?.airstamp);
    if (notificationDay === undefined || !show.nextEpisodeData) return;

    createNotification({ notificationDay, data: show.nextEpisodeData, showName: show.name, image: show.image });
    isNotificationSent = true;
  });

  isNotificationSent && await saveToDatabase({ lastNotified: new Date().toISOString() });
};

const migrateFromChromeStorage = async () => {
  const oldData = await chrome.storage.local.get([
    StorageKey.shows,
    StorageKey.notificationDays,
    StorageKey.sortType,
    StorageKey.lastNotified
  ]);

  if (Object.keys(oldData).length > 0) {
    await saveToDatabase(oldData);
    await chrome.storage.local.clear();
  }
};

const createAlarms = () => {
  chrome.alarms.get(NOTIFICATION_ALARM, (alarm) => {
    if (!alarm) {
      chrome.alarms.create(NOTIFICATION_ALARM, {
        delayInMinutes: 1,
        periodInMinutes: 60 * 6 // run every 6 hours
      });
    }
  });

  chrome.alarms.get(UPDATE_ALARM, (alarm) => {
    if (!alarm) {
      chrome.alarms.create(UPDATE_ALARM, {
        delayInMinutes: 1,
        periodInMinutes: 60 * 12 // run every 12 hours
      });
    }
  });
};

chrome.alarms.onAlarm.addListener((alarm) => {
  switch (alarm.name) {
    case NOTIFICATION_ALARM:
      handleEpisodeNotifications();
      break;
    case UPDATE_ALARM:
      updateStaleShowData();
      break;
    default:
      break;
  }
});

chrome.runtime.onStartup.addListener(() => {
  createAlarms();
});

chrome.runtime.onInstalled.addListener(async () => {
  await setDefaultNotificationDays();
  await migrateFromChromeStorage();
  createAlarms();
});
