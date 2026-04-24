import { db } from '../database/database';
import { StorageKey } from '../typescript/enums';
import { IShow } from '../typescript/interfaces';

export const saveToDatabase = async (data: {
  shows?: IShow[];
  notificationDays?: string[];
  sortType?: string;
  lastNotified?: string;
}) => {
  if (data.shows) {
    await db.shows.clear();
    await db.shows.bulkAdd(data.shows);
  }

  const configs = Object.entries(data)
    .filter(([key]) => key !== StorageKey.shows)
    .map(([key, value]) => ({
      key: key as StorageKey,
      value,
    }));

  if (configs.length) {
    await db.config.bulkPut(configs);
  }
};

export const getFromDatabase = async (keys?: StorageKey[]) => {
  const configItems = await db.config.toArray();
  const config = Object.fromEntries(configItems.map((i) => [i.key, i.value]));
  const shows = await db.shows.toArray();

  if (keys) {
    const result: Record<string, any> = {};
    keys.forEach((k) => {
      if (k === StorageKey.shows) result[k] = shows;
      else result[k] = config[k];
    });
    return result;
  }

  return { ...config, shows };
};
