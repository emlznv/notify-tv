import { useState } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import SearchBar from './components/SearchBar/SearchBar';
import useSearch from './hooks/useSearch';
import { Section } from './typescript/enums';

const App = () => {
  const [activeSection, setActiveSection] = useState(Section.addedShows);
  const { searchResults, searchTerm, setSearchTerm } = useSearch();

  const isSearchSection = activeSection === Section.search;

  return (
    <div className="app">
      <Navigation
        activeSection={activeSection}
        onChangeSection={setActiveSection}
      />
      <div className="search-bar-wrapper">
        {isSearchSection && (
          <SearchBar searchValue={searchTerm} onValueChange={setSearchTerm} />
        )}
      </div>
    </div>
  );
};

export default App;
