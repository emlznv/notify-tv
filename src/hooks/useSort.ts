/* eslint-disable max-len */
import { useEffect, useState } from 'react';
import {
  faArrowUpAZ, faArrowDownZA, faArrowUp19, faArrowDown91, IconDefinition
} from '@fortawesome/free-solid-svg-icons';
import { IShow } from '../typescript/interfaces';
import { Section } from '../typescript/enums';

const SORT_ICONS = {
  ascName: faArrowUpAZ,
  descName: faArrowDownZA,
  ascNextEpDate: faArrowUp19,
  descNextEpDate: faArrowDown91
};

const useSort = (shows: IShow[], section: Section) => {
  const [sortIcon, setSortIcon] = useState<IconDefinition | null>(SORT_ICONS.ascName);
  const [sortedData, setSortedData] = useState<IShow[]>(shows);

  const sortData = (data: IShow[]) => {
    if (!sortIcon) return data;

    switch (sortIcon) {
      case SORT_ICONS.ascName:
        data.sort((a, b) => (a.name?.localeCompare(b.name)));
        break;
      case SORT_ICONS.descName:
        data.sort((a, b) => (b.name?.localeCompare(a.name)));
        break;
      case SORT_ICONS.ascNextEpDate:
        data.sort((a, b) => {
          const aNextEpisodeDate = a.nextEpisodeData?.airdate;
          const bNextEpisodeDate = b.nextEpisodeData?.airdate;
          if (aNextEpisodeDate && bNextEpisodeDate) {
            return new Date(aNextEpisodeDate).getTime() - new Date(bNextEpisodeDate).getTime();
          } if (aNextEpisodeDate && !bNextEpisodeDate) {
            return -1; // a comes before b
          } if (!aNextEpisodeDate && bNextEpisodeDate) {
            return 1; // b comes before a
          }
          return 0; // both are equal in terms of sorting
        });
        break;
      case SORT_ICONS.descNextEpDate:
        data.sort((a, b) => {
          const aNextEpisodeDate = a.nextEpisodeData?.airdate;
          const bNextEpisodeDate = b.nextEpisodeData?.airdate;
          if (aNextEpisodeDate && bNextEpisodeDate) {
            return new Date(bNextEpisodeDate).getTime() - new Date(aNextEpisodeDate).getTime();
          } if (aNextEpisodeDate && !bNextEpisodeDate) {
            return -1; // a comes before b
          } if (!aNextEpisodeDate && bNextEpisodeDate) {
            return 1; // b comes before a
          }
          return 0; // both are equal in terms of sorting
        });
        break;

      default:
        break;
    }
    return data;
  };

  const toggleSortIcon = () => {
    let updatedSortIcon;
    switch (sortIcon) {
      case SORT_ICONS.ascName:
        updatedSortIcon = SORT_ICONS.descName;
        break;
      case SORT_ICONS.descName:
        updatedSortIcon = SORT_ICONS.ascNextEpDate;
        break;
      case SORT_ICONS.ascNextEpDate:
        updatedSortIcon = SORT_ICONS.descNextEpDate;
        break;
      case SORT_ICONS.descNextEpDate:
      default:
        updatedSortIcon = SORT_ICONS.ascName;
        break;
    }
    setSortIcon(updatedSortIcon);
  };

  useEffect(() => {
    if (section === Section.addedShows) {
      const sorted = sortData([...shows]);
      setSortedData(sorted);
    } else {
      setSortedData(shows);
    }
  }, [shows, section, sortIcon]);

  return {
    sortIcon,
    sortedData,
    toggleSortIcon
  };
};

export default useSort;
