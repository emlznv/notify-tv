/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */

const updateDayFrequency = 1;

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

const createNotification = ({ data, showName, image }) => {
  const icon = image?.medium || './logo512.png';
  const title = `${showName}: new episode today!`;

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

const checkEpisodeWithinRange = (episodeTimestamp, dayRange) => {
  if (!episodeTimestamp) { return; }

  const todayDate = new Date();
  const newEpisodeDate = new Date(episodeTimestamp);

  const differenceDays = getDaysDifferenceBetweenDates(newEpisodeDate, todayDate);
  return differenceDays <= dayRange;
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

  if (!shows?.length) { return; }

  shows.forEach(async (show) => {
    show = shouldUpdateData(lastUpdated) ? await getDataByUrl(show._links?.self?.href) : show;
    show.nextEpisodeData = shouldUpdateData(lastUpdated)
      ? await getDataByUrl(show._links?.nextepisode?.href) : show.nextEpisodeData;

    const upcomingEpisode = show.nextEpisodeData;
    const isWithinRange = checkEpisodeWithinRange(upcomingEpisode?.airstamp, notificationDayRange);

    if (!isWithinRange) { return; }
    createNotification({ data: upcomingEpisode, showName: show.name, image: show.image });
  });
  chrome.storage.local.set({ shows });
};

chrome.runtime.onStartup.addListener(() => {
  notifyForNextEpisode();
});
