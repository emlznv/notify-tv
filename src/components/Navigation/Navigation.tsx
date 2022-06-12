import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

import './Navigation.css';
import { Section } from '../../typescript/enums';

interface IProps {
  activeSection: Section;
  onChangeSection: (section: Section) => void;
}

const Navigation = (props: IProps) => {
  const { activeSection, onChangeSection } = props;

  const getActiveClass = (section: Section) => (activeSection === section ? 'active' : 'not-active');
  const handleSectionChange = (section: Section) => onChangeSection(section);

  return (
    <div className="navigation-wrapper">
      <button
        type="button"
        className={`navigation-button ${getActiveClass(Section.addedShows)}`}
        onClick={() => handleSectionChange(Section.addedShows)}
      >
        <FontAwesomeIcon
          className={`notify-icon ${getActiveClass(Section.addedShows)}`}
          icon={faBell}
          size="sm"
        />
        Notify List
      </button>
      <button
        type="button"
        className={`navigation-button ${getActiveClass(Section.search)}`}
        onClick={() => handleSectionChange(Section.search)}
      >
        Explore
      </button>
    </div>
  );
};

export default Navigation;