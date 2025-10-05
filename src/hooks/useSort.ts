import { useEffect, useState } from 'react';
import {
  faArrowUpAZ, faArrowDownZA, faArrowUp19, faArrowDown91, IconDefinition
} from '@fortawesome/free-solid-svg-icons';
import { IShow } from '../typescript/interfaces';
import { StorageKey, Section } from '../typescript/enums';
import { getFromDatabase, saveToDatabase } from '../helpers/database-helpers';

const SORT_ICONS: { [key: string]: IconDefinition } = {
  ascName: faArrowUpAZ,
  descName: faArrowDownZA,
  ascNextEpDate: faArrowUp19,
  descNextEpDate: faArrowDown91
};

enum SORT_LABELS {
  Alphabetical = 'Alphabetical order',
  NextEpisode = 'Next episode order'
}

const useSort = (shows: IShow[], section: Section) => {
  const [sortIcon, setSortIcon] = useState<IconDefinition>(SORT_ICONS.ascName);
  const [sortLabel, setSortLabel] = useState<string>(SORT_LABELS.Alphabetical);
  const [sortedShows, setSortedShows] = useState<IShow[]>(shows);

  const setInitialSorting = async () => {
    const { sortType } = await getFromDatabase([StorageKey.sortType]);
    if (sortType) {
      setSortIcon(SORT_ICONS[sortType]);
      setSortLabel(
        sortType === 'ascName' || sortType === 'descName'
          ? SORT_LABELS.Alphabetical
          : SORT_LABELS.NextEpisode
      );
    }
  };

  useEffect(() => {
    setInitialSorting();
  }, []);

  const sortData = (data: IShow[]) => {
    switch (sortIcon) {
      case SORT_ICONS.ascName:
        data.sort((a, b) => (a.name.localeCompare(b.name)));
        break;
      case SORT_ICONS.descName:
        data.sort((a, b) => (b.name.localeCompare(a.name)));
        break;
      case SORT_ICONS.ascNextEpDate:
      case SORT_ICONS.descNextEpDate:
        data.sort((a, b) => {
          const aNextEpisodeDate = a.nextEpisodeData?.airstamp;
          const bNextEpisodeDate = b.nextEpisodeData?.airstamp;

          if (aNextEpisodeDate && bNextEpisodeDate) {
            return (
              sortIcon === SORT_ICONS.ascNextEpDate
                ? new Date(aNextEpisodeDate).getTime() - new Date(bNextEpisodeDate).getTime()
                : new Date(bNextEpisodeDate).getTime() - new Date(aNextEpisodeDate).getTime()
            );
          }

          if (aNextEpisodeDate && !bNextEpisodeDate) return -1;
          if (!aNextEpisodeDate && bNextEpisodeDate) return 1;
          return 0;
        });
        break;
      default:
        break;
    }
    return data;
  };

  const changeSorting = async () => {
    let updatedSortIcon: IconDefinition;

    switch (sortIcon) {
      case SORT_ICONS.ascName:
        updatedSortIcon = SORT_ICONS.descName;
        setSortLabel(SORT_LABELS.Alphabetical);
        break;
      case SORT_ICONS.descName:
        updatedSortIcon = SORT_ICONS.ascNextEpDate;
        setSortLabel(SORT_LABELS.NextEpisode);
        break;
      case SORT_ICONS.ascNextEpDate:
        updatedSortIcon = SORT_ICONS.descNextEpDate;
        setSortLabel(SORT_LABELS.NextEpisode);
        break;
      case SORT_ICONS.descNextEpDate:
      default:
        updatedSortIcon = SORT_ICONS.ascName;
        setSortLabel(SORT_LABELS.Alphabetical);
        break;
    }

    setSortIcon(updatedSortIcon);

    const updatedSortType = Object.keys(SORT_ICONS).find((key) => SORT_ICONS[key] === updatedSortIcon);
    await saveToDatabase({ sortType: updatedSortType });
  };

  useEffect(() => {
    if (section === Section.addedShows) {
      const sorted = sortData([...shows]);
      setSortedShows(sorted);
    } else {
      setSortedShows(shows);
    }
  }, [shows, section, sortIcon]);

  return {
    sortIcon,
    sortLabel,
    sortedShows,
    changeSorting,
  };
};

export default useSort;
