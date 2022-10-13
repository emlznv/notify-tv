import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import './SearchBar.css';

interface IProps {
  searchValue: string;
  onValueChange: (value: string) => void;
}

const SearchBar = (props: IProps) => {
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
