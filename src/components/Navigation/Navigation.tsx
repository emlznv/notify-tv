import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

import './Navigation.css';
import { Section } from '../../typescript/enums';
import { SettingsButton } from '../SettingsButton/SettingsButton';

interface IProps {
  activeSection: Section;
  onChangeSection: (section: Section) => void;
  onShowSettingsMenu: () => void
}

const Navigation = (props: IProps) => {
  const { activeSection, onChangeSection, onShowSettingsMenu } = props;

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
        My List
      </button>
      <button
        type="button"
        className={`navigation-button ${getActiveClass(Section.search)}`}
        onClick={() => handleSectionChange(Section.search)}
      >
        Explore
      </button>
      <SettingsButton onShowSettingsMenu={onShowSettingsMenu} />
    </div>
  );
};

export default Navigation;
