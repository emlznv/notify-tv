import { useEffect, useState } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Results from './components/Results/Results';
import SearchBar from './components/SearchBar/SearchBar';
import SettingsMenu from './components/SettingsMenu/SettingsMenu';
import useSearch from './hooks/useSearch';
import useStorage from './hooks/useStorage';
import { Section } from './typescript/enums';

const App = () => {
  const [activeSection, setActiveSection] = useState(Section.addedShows);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const { addedShows, getAddedShows } = useStorage();
  const { searchResults, searchTerm, isLoading, setSearchTerm } = useSearch();

  const isSearchSection = activeSection === Section.search;
  const resultsData = isSearchSection ? searchResults : addedShows;

  useEffect(() => {
    getAddedShows();
  }, [addedShows, getAddedShows]);

  const handleShowSettingsMenu = () => setShowSettingsMenu(!showSettingsMenu);

  return (
    <div className="app">
      <Navigation
        activeSection={activeSection}
        onChangeSection={setActiveSection}
        onShowSettingsMenu={handleShowSettingsMenu}
      />
      {isSearchSection && <SearchBar searchValue={searchTerm} onValueChange={setSearchTerm} />}
      <Results isLoading={isLoading} fade={showSettingsMenu} results={resultsData} section={activeSection} />
      {showSettingsMenu && <SettingsMenu />}
    </div>
  );
};

export default App;
