import Dexie from 'dexie';
import { IShow } from '../typescript/interfaces';
import { StorageKey } from '../typescript/enums';

interface ConfigItem {
  key: StorageKey;
  value: any;
}

export class NotifyTVDB extends Dexie {
  shows!: Dexie.Table<IShow, number>;

  config!: Dexie.Table<ConfigItem, StorageKey>;

  constructor() {
    super('NotifyTVDB');
    this.version(1).stores({
      shows: 'id',
      config: 'key'
    });
  }
}

export const db = new NotifyTVDB();
