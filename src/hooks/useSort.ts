/* eslint-disable no-undef */
import { useEffect, useState } from 'react';
import {
  faArrowUpAZ, faArrowDownZA, faArrowUp19, faArrowDown91, IconDefinition
} from '@fortawesome/free-solid-svg-icons';
import { IShow } from '../typescript/interfaces';
import { Section } from '../typescript/enums';

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
  const [sortIcon, setSortIcon] = useState<IconDefinition | null>(SORT_ICONS.ascName);
  const [sortLabel, setSortLabel] = useState<string>(SORT_LABELS.Alphabetical);
  const [sortedData, setSortedData] = useState<IShow[]>(shows);

  useEffect(() => {
    chrome.storage.local.get('sortType', (result) => {
      const savedSortType = result.sortType;
      if (savedSortType) {
        setSortIcon(SORT_ICONS[savedSortType]);
        setSortLabel(
          savedSortType === 'ascName' || savedSortType === 'descName'
            ? SORT_LABELS.Alphabetical : SORT_LABELS.NextEpisode
        );
      }
    });
  }, []);

  const sortData = (data: IShow[]) => {
    if (!sortIcon) return data;

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
          const aNextEpisodeDate = a.nextEpisodeData?.airdate;
          const bNextEpisodeDate = b.nextEpisodeData?.airdate;

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

  const toggleSortIcon = () => {
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
    chrome.storage.local.set({ sortType: updatedSortType });
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
    sortLabel,
    sortedData,
    toggleSortIcon
  };
};

export default useSort;
