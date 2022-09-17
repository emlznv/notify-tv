import { createContext } from 'react';
import { IStorageContext } from '../typescript/interfaces';

export const StorageContext = createContext<IStorageContext | null>(null);
