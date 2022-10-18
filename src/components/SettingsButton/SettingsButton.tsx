import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './SettingsButton.css';

interface IProps {
  onShowSettingsMenu: () => void
}

export const SettingsButton = (props: IProps) => {
  const { onShowSettingsMenu } = props;
  return (
    <FontAwesomeIcon
      className="settings-button"
      icon={faEllipsisVertical}
      onClick={onShowSettingsMenu}
    />
  );
};
