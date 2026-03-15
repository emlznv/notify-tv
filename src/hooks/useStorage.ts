import { useEffect, useState } from 'react';
import * as API from '../api/api';
import { IShow, IEpisode } from '../typescript/interfaces';
import useSort from './useSort';
import { Section, StorageKey } from '../typescript/enums';
import { getFromDatabase, saveToDatabase } from '../helpers/database-helpers';
import { isEpisodeDateToday } from '../helpers/date-helpers';

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

  const getEpisodeData = (previousEp?: IEpisode, nextEp?: IEpisode) => {
    if (previousEp && !(previousEp instanceof Error) && isEpisodeDateToday(previousEp.airstamp)) {
      return previousEp;
    }

    return nextEp instanceof Error ? undefined : nextEp;
  };

  const fetchEpisodeData = async (show: IShow) => {
    const nextUrl = show._links?.nextepisode?.href;
    const prevUrl = show._links?.previousepisode?.href;

    try {
      const [next, previous] = await Promise.all([
        nextUrl ? API.getEpisode(nextUrl) : undefined,
        prevUrl ? API.getEpisode(prevUrl) : undefined,
      ]);

      return getEpisodeData(previous, next);
    } catch {
      return undefined;
    }
  };

  const addShow = async (show: IShow) => {
    if (!show || addedShows.some((s) => s.id === show.id)) return;

    const episodeData = await fetchEpisodeData(show);

    const showToSave = episodeData
      ? { ...show, nextEpisodeData: episodeData }
      : show;

    const updatedShows = [...addedShows, showToSave];

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
