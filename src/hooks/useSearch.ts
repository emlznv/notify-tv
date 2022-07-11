import { useEffect, useState } from 'react';
import { IShowResponse } from '../typescript/interfaces';
import * as API from '../api/api';

const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Array<IShowResponse>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!searchTerm) { return; }

    const executeSearch = setTimeout(async () => {
      setIsLoading(true);
      const results = (await API.getShowsBySearch(
        searchTerm,
      )) as IShowResponse[];
      setIsLoading(false);
      setSearchResults(results);
    }, 600);

    return () => clearTimeout(executeSearch);
  }, [searchTerm, setSearchTerm]);

  return {
    isLoading,
    searchTerm,
    searchResults,
    setSearchTerm,
  };
};

export default useSearch;
