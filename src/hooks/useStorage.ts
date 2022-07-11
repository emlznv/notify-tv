/* eslint-disable no-undef */
import { useEffect, useState } from 'react';
import { IShow } from '../typescript/interfaces';

const useStorage = (show?: IShow) => {
  const [addedShows, setAddedShows] = useState<Array<IShow>>([]);
  const [isShowAdded, setIsShowAdded] = useState<boolean>(false);

  const getAddedShows = async () => {
    const data: { shows?: IShow[] } = await chrome.storage.local.get('shows');
    const result = data.shows || [];
    setAddedShows(result);
  };

  const isShowAddedCheck = async () => {
    const existingShow = show && addedShows.find((item: IShow) => item.id === show.id);
    setIsShowAdded(!!existingShow);
  };

  useEffect(() => {
    getAddedShows();
  }, [addedShows]);

  useEffect(() => {
    show && isShowAddedCheck();
  }, [show, addedShows]);

  const addToShows = async () => {
    if (!show) { return; }

    const updatedShows = [...addedShows, show];
    chrome.storage.local.set({ shows: updatedShows }, () => {});
    setIsShowAdded(true);
    setAddedShows(updatedShows);
  };

  const deleteShow = async () => {
    if (!show) { return; }

    const updatedShows = addedShows.filter((item: IShow) => item.id !== show.id);
    chrome.storage.local.set({ shows: updatedShows }, () => {});
    setIsShowAdded(false);
    setAddedShows(updatedShows);
  };

  return {
    getAddedShows,
    addToShows,
    deleteShow,
    addedShows,
    isShowAdded,
  };
};

export default useStorage;
