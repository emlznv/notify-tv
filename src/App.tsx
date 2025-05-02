import { ReactNode, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import useSearch from './hooks/useSearch';
import useStorage from './hooks/useStorage';
import Navigation from './components/Navigation/Navigation';
import Results from './components/Results/Results';
import SearchBar from './components/SearchBar/SearchBar';
import SettingsMenu from './components/SettingsMenu/SettingsMenu';
import { StorageContext } from './context/storage-context';
import { Section } from './typescript/enums';
import { IStorageContext } from './typescript/interfaces';
import './App.css';
import { ERROR_DISPLAY_TIMEOUT } from './helpers/constants';

const StorageContextProvider = ({ children, storage }: { children: ReactNode[], storage: IStorageContext}) => {
  return (
    <StorageContext.Provider value={storage}>
      {children}
    </StorageContext.Provider>
  );
};

const App = () => {
  const { error, ...storage } = useStorage();
  const { searchResults, searchTerm, isLoading, error: searchError, setSearchTerm, clearSearch } = useSearch();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [activeSection, setActiveSection] = useState(Section.addedShows);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const isSearchSection = activeSection === Section.search;
  const resultsData = isSearchSection ? searchResults : storage.showManager.addedShows;

  useEffect(() => {
    !isSearchSection && clearSearch();
  }, [activeSection]);

  const handleShowSettingsMenu = () => setShowSettingsMenu(!showSettingsMenu);

  useEffect(() => {
    if (error || searchError) {
      const currentError = error || searchError;
      setErrorMsg(currentError);

      const timeout = setTimeout(() => {
        setErrorMsg('');
      }, ERROR_DISPLAY_TIMEOUT);

      return () => clearTimeout(timeout);
    }
  }, [error, searchError]);

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
          fade={showSettingsMenu}
          results={resultsData}
          section={activeSection}
          sortManager={storage.sortManager}
        />
        {showSettingsMenu && <SettingsMenu onShowSettingsMenu={handleShowSettingsMenu} />}
        {errorMsg && (
          <p className="error-msg fade-in-out">
            <FontAwesomeIcon className="error-icon" icon={faCircleExclamation} size="lg" />
            {errorMsg}
          </p>
        )}
      </StorageContextProvider>
    </div>
  );
};

export default App;
