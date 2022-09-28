/* eslint-disable no-await-in-loop */
/* eslint-disable no-undef */

const updateDayFrequency = 0.5;
const defaultNotificationDays = ['0', '1'];

const formatSeasonOrEpisode = (value) => {
  if (!value) { return; }
  return value.toString().length === 1 ? `0${value}` : value;
};

const formatMessage = (episode) => {
  if (!episode) { return ''; }
  const { name, season, number } = episode;
  const seasonAndEpisode = `(S${formatSeasonOrEpisode(season)} E${formatSeasonOrEpisode(number)})`;
  return `${name} ${seasonAndEpisode}`;
};

const getNotificationDayText = (day) => {
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

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const setDefaultNotificationDays = async () => {
  chrome.storage.local.set({ notificationDays: defaultNotificationDays });
};

const createNotification = ({ dayForNotification, data, showName, image }) => {
  const icon = image?.medium || './logo512.png';
  const title = `${showName}: new episode ${getNotificationDayText(dayForNotification)}!`;

  chrome.notifications.create('', {
    title,
    message: formatMessage(data, false),
    iconUrl: `${icon}`,
    type: 'basic'
  });
};

const getDaysDifferenceBetweenDates = (futureDate, pastDate) => {
  const differenceMs = futureDate.getTime() - pastDate.getTime();
  return differenceMs / (1000 * 3600 * 24);
};

const getNotificationDayForEpisode = (episodeTimestamp, notificationDays) => {
  if (!episodeTimestamp) { return; }

  let notificationDay;
  const todayDate = new Date();
  const newEpisodeDate = new Date(episodeTimestamp);

  notificationDays.map((day) => Number(day)).forEach((day) => {
    const notificationDate = addDays(todayDate, day);
    if (notificationDate.getDate() === newEpisodeDate.getDate()) { notificationDay = day; }
  });

  return notificationDay;
};

const getDataByUrl = (url) => {
  if (!url) { return; }
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      chrome.storage.local.set({ lastUpdated: new Date().toISOString() });
      return data;
    })
    .catch((error) => new Error(error));
};

const shouldUpdateData = (lastUpdated) => {
  if (!lastUpdated) { return true; }
  const todayDate = new Date();
  const lastUpdatedDate = new Date(lastUpdated);

  const differenceDays = getDaysDifferenceBetweenDates(todayDate, lastUpdatedDate);
  return differenceDays >= updateDayFrequency;
};

const notifyForNextEpisode = async () => {
  const { shows } = await chrome.storage.local.get('shows');
  const { lastUpdated } = await chrome.storage.local.get('lastUpdated');
  const { lastNotified } = await chrome.storage.local.get('lastNotified');
  const { notificationDays } = await chrome.storage.local.get('notificationDays');

  if (!shows?.length || !shouldUpdateData(lastNotified)) { return; }

  for (const show of shows) {
    if (shouldUpdateData(lastUpdated)) {
      const index = shows.indexOf(show);
      const updatedShow = await getDataByUrl(show._links?.self?.href);
      const updatedShowSuccess = !(updatedShow instanceof Error);
      if (updatedShowSuccess) {
        shows[index] = updatedShow;
        const updatedNextEpisodeData = await getDataByUrl(updatedShow._links?.nextepisode?.href);
        if (!(updatedNextEpisodeData instanceof Error)) { shows[index].nextEpisodeData = updatedNextEpisodeData; }
      }
    }

    const dayForNotification = getNotificationDayForEpisode(show.nextEpisodeData?.airstamp, notificationDays);

    if (dayForNotification !== undefined) {
      createNotification({ dayForNotification, data: show.nextEpisodeData, showName: show.name, image: show.image });
      chrome.storage.local.set({ lastNotified: new Date().toISOString() });
    }
  }
  chrome.storage.local.set({ shows });
};

chrome.runtime.onStartup.addListener(() => {
  notifyForNextEpisode();
});

chrome.runtime.onInstalled.addListener(() => {
  setDefaultNotificationDays();
});
