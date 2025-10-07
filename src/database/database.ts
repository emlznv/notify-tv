import Dexie from 'dexie';
import { IShow } from '../typescript/interfaces';
import { StorageKey } from '../typescript/enums';

interface ConfigItem {
  key: StorageKey;
  value: any;
}

interface NotifiedEpisode {
  episodeId: number;
  notifiedAt: string;
}

export class NotifyTVDB extends Dexie {
  shows!: Dexie.Table<IShow, number>;

  config!: Dexie.Table<ConfigItem, StorageKey>;

  notifiedEpisodes!: Dexie.Table<NotifiedEpisode, number>;

  constructor() {
    super('NotifyTVDB');
    this.version(1).stores({
      shows: 'id',
      config: 'key',
      notifiedEpisodes: 'episodeId'
    });
  }
}

export const db = new NotifyTVDB();
