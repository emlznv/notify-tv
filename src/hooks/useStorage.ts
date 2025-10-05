import { useEffect, useState } from 'react';
import { IShow } from '../typescript/interfaces';
import useSort from './useSort';
import { Section, StorageKey } from '../typescript/enums';
import { getFromDatabase, saveToDatabase } from '../helpers/database-helpers';

const useStorage = () => {
  const [addedShows, setAddedShows] = useState<IShow[]>([]);
  const sorting = useSort(addedShows, Section.addedShows);

  const getAddedShows = async () => {
    const { shows } = await getFromDatabase([StorageKey.shows]);
    setAddedShows(shows || []);
  };

  useEffect(() => {
    getAddedShows();
  }, []);

  const addShow = async (show: IShow) => {
    if (!show) return;

    const updatedShows = [...addedShows, show];
    await saveToDatabase({ shows: updatedShows });
    setAddedShows(updatedShows);
  };

  const deleteShow = async (show: IShow) => {
    if (!show) return;

    const updatedShows = addedShows.filter((item) => item.id !== show.id);
    await saveToDatabase({ shows: updatedShows });
    setAddedShows(updatedShows);
  };

  return {
    showManager: {
      addedShows: sorting.sortedShows,
      getAddedShows,
      addShow,
      deleteShow,
    },
    sortManager: sorting,
  };
};

export default useStorage;
