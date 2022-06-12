import { useEffect, useState } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Results from './components/Results/Results';
import SearchBar from './components/SearchBar/SearchBar';
import useSearch from './hooks/useSearch';
import useStorage from './hooks/useStorage';
import { Section } from './typescript/enums';

const App = () => {
  const [activeSection, setActiveSection] = useState(Section.addedShows);
  const { addedShows, getAddedShows } = useStorage();
  const { searchResults, searchTerm, setSearchTerm } = useSearch();

  const isSearchSection = activeSection === Section.search;
  const resultsData = isSearchSection ? searchResults : addedShows;

  useEffect(() => {
    getAddedShows();
  }, [addedShows, getAddedShows]);

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
      <Results results={resultsData} section={activeSection} />
    </div>
  );
};

export default App;
