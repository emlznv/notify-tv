import { useEffect, useState } from 'react';
import { IShow, IShowResponse } from '../typescript/interfaces';
import * as API from '../api/api';
import { SEARCH_TIMEOUT } from '../helpers/constants';

const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Array<IShow>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (!searchTerm) { return; }

    const executeSearch = setTimeout(async () => {
      setIsLoading(true);
      setError(false);
      try {
        const results = await API.getShowsBySearch(searchTerm);
        setSearchResults(results);
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }, SEARCH_TIMEOUT);

    return () => clearTimeout(executeSearch);
  }, [searchTerm, setSearchTerm]);

  const clearSearch = () => {
    setError(false);
    setSearchTerm('');
    setSearchResults([]);
  };

  return {
    isLoading,
    searchTerm,
    searchResults,
    error,
    setSearchTerm,
    clearSearch
  };
};

export default useSearch;
