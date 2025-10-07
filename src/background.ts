import { DEFAULT_NOTIFICATION_DAYS, UPDATE_SHOW_DAY_FREQUENCY, NOTIFY_DAY_FREQUENCY } from './helpers/constants';
import { addDays, getDaysDifferenceBetweenDates, isEpisodeDateToday } from './helpers/date-helpers';
import { formatNotificationMessage, getNotificationDayText } from './helpers/format-helpers';
import { IEpisode, IShow, IShowImage } from './typescript/interfaces';
import * as API from './api/api';
import { NotificationDay, StorageKey } from './typescript/enums';
import { getFromDatabase, saveToDatabase } from './helpers/database-helpers';
import { db } from './database/database';

/**
 * Sets the default reminder days in the database.
 */
const setDefaultReminderDays = async () => {
  await saveToDatabase({ notificationDays: DEFAULT_NOTIFICATION_DAYS });
};

/**
 * Sends a Chrome notification for an upcoming TV show episode.
 *
 * @param {Object} params
 * @param {number} params.reminderDay - Number of days until episode airs.
 * @param {IEpisode} params.data - Episode data object.
 * @param {string} params.showName - Name of the show.
 * @param {IShowImage} params.image - Show image object.
 */
const sendNotification = ({ reminderDay, data, showName, image }:
  { reminderDay: number, data: IEpisode, showName: string, image: IShowImage }) => {
  const icon = image?.medium || '../public/logo.png';
  const title = `${showName}: new episode ${getNotificationDayText(reminderDay)}!`;

  chrome.notifications.create('', {
    title,
    message: formatNotificationMessage(data),
    iconUrl: `${icon}`,
    type: 'basic'
  });
};

/**
 * Determines if the user-selected reminder days applies for a given episode.
 *
 * @param {NotificationDay[]} reminderDays - Array of notification offsets in days.
 * @param {string} [episodeTimestamp] - ISO string of the episode's air date.
 * @returns {number | undefined} - Returns the matching reminder day, otherwise undefined.
 */
const findMatchingReminderDay = (reminderDays: NotificationDay[], episodeTimestamp?: string) => {
  if (!episodeTimestamp) { return; }

  const todayDate = new Date();
  const newEpisodeDate = new Date(episodeTimestamp);

  return reminderDays
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

/**
 * Checks if the interval has elapsed since the last recorded date.
 *
 * @param {number} frequencyDays - Frequency in days.
 * @param {string} [lastUpdated] - ISO string of last updated date.
 * @returns {boolean} - True if interval has elapsed or lastUpdated is undefined.
 */
const hasIntervalElapsed = (frequencyDays: number, lastUpdated?: string) => {
  if (!lastUpdated) { return true; }
  const todayDate = new Date();
  const lastUpdatedDate = new Date(lastUpdated);

  const differenceDays = getDaysDifferenceBetweenDates(todayDate, lastUpdatedDate);
  return differenceDays >= frequencyDays;
};

/**
 * Updates show data by fetching the latest episode information from the API.
 *
 * @param {IShow[]} shows - Array of shows to update.
 * @returns {Promise<IShow[]>} - Array of updated shows.
 */
const updateShowsData = async (shows: IShow[]) => {
  const showPromises = shows.map(async (show) => {
    if (isEpisodeDateToday(show.nextEpisodeData?.airstamp)) return show;

    try {
      const updatedShow = await API.getEpisode(show._links?.self?.href);
      const nextEpisodeData = updatedShow._links?.nextepisode?.href;
      if (!updatedShow || !nextEpisodeData) return show;

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

/**
 * Notifies the user for the next episode of each show according to reminder days.
 */
const notifyForNextEpisode = async () => {
  const { shows, lastUpdated, lastNotified, notificationDays } = await getFromDatabase();
  const shouldNotify = hasIntervalElapsed(NOTIFY_DAY_FREQUENCY, lastNotified);
  let isNotificationSent = false;

  if (!shows?.length || !shouldNotify) return;

  const upToDateShows = hasIntervalElapsed(UPDATE_SHOW_DAY_FREQUENCY, lastUpdated)
    ? await updateShowsData(shows)
    : shows;

  await Promise.all(
    upToDateShows.map(async (show: IShow) => {
      const episode = show.nextEpisodeData;
      if (!episode) return;

      const reminderDay = findMatchingReminderDay(notificationDays, episode.airstamp);
      if (reminderDay === undefined) return;

      const alreadyNotified = await db.notifiedEpisodes.get(episode.id);
      if (alreadyNotified) return;

      sendNotification({ reminderDay, data: episode, showName: show.name, image: show.image });
      await db.notifiedEpisodes.put({ episodeId: episode.id, notifiedAt: new Date().toISOString() });
      isNotificationSent = true;
    })
  );

  if (isNotificationSent) {
    await saveToDatabase({ lastNotified: new Date().toISOString() });
  }

  await saveToDatabase({ shows: upToDateShows });
};

/**
 * Migrates old data from Chrome local storage to IndexedDB and clears Chrome storage.
 */
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
  setDefaultReminderDays();
  await migrateFromChromeStorage();
  chrome.alarms.create('notifyCheck', { periodInMinutes: NOTIFY_DAY_FREQUENCY * 24 * 60 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'notifyCheck') {
    notifyForNextEpisode();
  }
});
