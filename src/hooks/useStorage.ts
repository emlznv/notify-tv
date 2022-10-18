/* eslint-disable no-undef */
import { useEffect, useState } from 'react';
import { IShow } from '../typescript/interfaces';

const useStorage = () => {
  const [addedShows, setAddedShows] = useState<Array<IShow>>([]);

  const getAddedShows = async () => {
    const data: { shows?: IShow[] } = await chrome.storage.local.get('shows');
    const result = data.shows || [];
    setAddedShows(result);
  };

  useEffect(() => {
    getAddedShows();
  }, []);

  const addToShows = async (show: IShow) => {
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
    getAddedShows,
    addToShows,
    deleteShow,
    addedShows
  };
};

export default useStorage;
