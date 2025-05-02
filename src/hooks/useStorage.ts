import { useEffect, useState } from 'react';
import { IShow } from '../typescript/interfaces';
import { ChromeStorageKeys, Section } from '../typescript/enums';
import { storage } from '../utils/storage';
import useSort from './useSort';

const useStorage = () => {
  const [error, setError] = useState<null | string>(null);
  const [addedShows, setAddedShows] = useState<Array<IShow>>([]);
  const sorting = useSort(addedShows, Section.addedShows);

  const getAddedShows = async () => {
    try {
      const shows = await storage.get<IShow[]>(ChromeStorageKeys.shows);
      if (Array.isArray(shows)) {
        setAddedShows(shows);
      }
    } catch (err) {
      setError('Failed to load shows.');
    }
  };

  useEffect(() => {
    getAddedShows();
  }, []);

  const addShow = async (show: IShow) => {
    if (!show) return;

    try {
      const updatedShows = [...addedShows, show];
      await storage.set({ shows: updatedShows });
      setAddedShows(updatedShows);
    } catch (err) {
      setError('Failed to add show to storage.');
    }
  };

  const deleteShow = async (show: IShow) => {
    if (!show) return;

    try {
      const updatedShows = addedShows.filter((item: IShow) => item.id !== show.id);
      await storage.set({ shows: updatedShows });
      setAddedShows(updatedShows);
    } catch (err) {
      setError('Failed to delete show from storage.');
    }
  };

  return {
    showManager: {
      addedShows: sorting.sortedShows,
      getAddedShows,
      addShow,
      deleteShow,
    },
    sortManager: sorting,
    error
  };
};

export default useStorage;
