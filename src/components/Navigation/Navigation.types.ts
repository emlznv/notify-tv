import { Section } from '../../typescript/enums';

export interface NavigationProps {
  activeSection: Section;
  onChangeSection: (section: Section) => void;
  onShowSettingsMenu: () => void
}
