import { useEffect, useState } from 'react';
import { IShow } from '../typescript/interfaces';
import useSort from './useSort';
import { Section } from '../typescript/enums';

const useStorage = () => {
  const [addedShows, setAddedShows] = useState<Array<IShow>>([]);
  const sorting = useSort(addedShows, Section.addedShows);

  const getAddedShows = async () => {
    const data: { shows?: IShow[] } = await chrome.storage.local.get('shows');
    const result = data.shows || [];
    setAddedShows(result);
  };

  useEffect(() => {
    getAddedShows();
  }, []);

  const addShow = async (show: IShow) => {
    if (!show) { return; }

    const updatedShows = [...addedShows, show];
    chrome.storage.local.set({ shows: updatedShows });
    setAddedShows(updatedShows);
  };

  const deleteShow = async (show: IShow) => {
    if (!show) { return; }

    const updatedShows = addedShows.filter((item: IShow) => item.id !== show.id);
    chrome.storage.local.set({ shows: updatedShows });
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
