import { ReactNode, useEffect, useState } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Results from './components/Results/Results';
import SearchBar from './components/SearchBar/SearchBar';
import SettingsMenu from './components/SettingsMenu/SettingsMenu';
import { StorageContext } from './context/storage-context';
import useSearch from './hooks/useSearch';
import useStorage from './hooks/useStorage';
import { Section } from './typescript/enums';
import { IStorageContext } from './typescript/interfaces';

const StorageContextProvider = ({ children, storage }: { children: ReactNode[], storage: IStorageContext}) => {
  return (
    <StorageContext.Provider value={storage}>
      {children}
    </StorageContext.Provider>
  );
};

const App = () => {
  const storage = useStorage();
  const { searchResults, searchTerm, isLoading, setSearchTerm, clearSearch } = useSearch();

  const [activeSection, setActiveSection] = useState(Section.addedShows);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const isSearchSection = activeSection === Section.search;
  const resultsData = isSearchSection ? searchResults : storage.addedShows;

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
        <Results isLoading={isLoading} fade={showSettingsMenu} results={resultsData} section={activeSection} />
        {showSettingsMenu && <SettingsMenu />}
      </StorageContextProvider>
    </div>
  );
};

export default App;
