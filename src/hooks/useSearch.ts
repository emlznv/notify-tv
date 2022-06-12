import { useEffect, useState } from 'react';
import { IShowResponse } from '../typescript/interfaces';
import * as API from '../api/api';

const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Array<IShowResponse>>([]);

  useEffect(() => {
    if (!searchTerm) { return; }

    const executeSearch = setTimeout(async () => {
      const results = (await API.getShowsBySearch(
        searchTerm,
      )) as IShowResponse[];
      setSearchResults(results);
    }, 600);

    return () => clearTimeout(executeSearch);
  }, [searchTerm, setSearchTerm]);

  return {
    searchTerm,
    searchResults,
    setSearchTerm,
  };
};

export default useSearch;
