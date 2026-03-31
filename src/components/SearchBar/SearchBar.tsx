import React from 'react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SearchBarProps } from './SearchBar.types';
import './SearchBar.css';

const SearchBar = (props: SearchBarProps) => {
  const { searchValue, onValueChange } = props;
  return (
    <div className="search-bar">
      <input
        className="search-input"
        onChange={(e: React.FormEvent<HTMLInputElement>) => onValueChange(e.currentTarget.value)}
        placeholder="Search for an ongoing show"
        value={searchValue}
        autoFocus
      />
      <FontAwesomeIcon className="search-icon" icon={faSearch} size="sm" />
    </div>
  );
};

export default SearchBar;
