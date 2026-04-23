import { useEffect, useState } from 'react';
import useSearch from './hooks/useSearch';
import useStorage from './hooks/useStorage';
import Navigation from './components/Navigation/Navigation';
import Results from './components/Results/Results';
import SearchBar from './components/SearchBar/SearchBar';
import SettingsMenu from './components/SettingsMenu/SettingsMenu';
import { StorageContextProvider } from './context/StorageContextProvider';
import { Section } from './typescript/enums';
import './App.css';

const App = () => {
  const storage = useStorage();
  const { searchResults, searchTerm, isLoading, error, setSearchTerm, clearSearch } = useSearch();

  const [activeSection, setActiveSection] = useState(Section.addedShows);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const isSearchSection = activeSection === Section.search;
  const resultsData = isSearchSection ? searchResults : storage.showManager.addedShows;

  useEffect(() => {
    !isSearchSection && clearSearch();
  }, [activeSection]);

  const handleShowSettingsMenu = () => setShowSettingsMenu(!showSettingsMenu);

  return (
    <div className="app">
      <StorageContextProvider storage={storage}>
        <Navigation
          activeSection={activeSection}
          onChangeSection={setActiveSection}
          onShowSettingsMenu={handleShowSettingsMenu}
        />
        {isSearchSection && <SearchBar searchValue={searchTerm} onValueChange={setSearchTerm} />}
        <Results
          isLoading={isLoading}
          error={error}
          fade={showSettingsMenu}
          results={resultsData}
          section={activeSection}
          sortManager={storage.sortManager}
        />
        {showSettingsMenu && <SettingsMenu onShowSettingsMenu={handleShowSettingsMenu} />}
      </StorageContextProvider>
    </div>
  );
};

export default App;
