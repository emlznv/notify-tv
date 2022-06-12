import { useState } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import { Section } from './typescript/enums';

const App = () => {
  const [activeSection, setActiveSection] = useState(Section.addedShows);

  return (
    <div className="app">
      <Navigation
        activeSection={activeSection}
        onChangeSection={setActiveSection}
      />
    </div>
  );
};

export default App;
