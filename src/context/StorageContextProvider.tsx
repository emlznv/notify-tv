import { createContext, ReactNode } from 'react';
import { IStorageContext } from '../typescript/interfaces';

export const StorageContext = createContext<IStorageContext | null>(null);

export const StorageContextProvider = ({ children, storage }: { children: ReactNode[], storage: IStorageContext}) => {
  return (
    <StorageContext.Provider value={storage}>
      {children}
    </StorageContext.Provider>
  );
};
