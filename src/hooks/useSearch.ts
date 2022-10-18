import { useEffect, useState } from 'react';
import { IShowResponse } from '../typescript/interfaces';
import * as API from '../api/api';

const SEARCH_TIMEOUT = 600;

const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Array<IShowResponse>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (!searchTerm) { return; }

    const executeSearch = setTimeout(async () => {
      setIsLoading(true);
      const response: IShowResponse[] | Error = await API.getShowsBySearch(searchTerm);
      const hasError = response instanceof Error;

      setIsLoading(false);
      setError(hasError);
      !hasError && setSearchResults(response as IShowResponse[]);
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
