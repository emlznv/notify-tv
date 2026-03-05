import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SettingsButtonProps } from './SettingsButton.types';
import './SettingsButton.css';

export const SettingsButton = (props: SettingsButtonProps) => {
  const { onShowSettingsMenu } = props;
  return (
    <FontAwesomeIcon
      className="settings-button"
      icon={faEllipsisVertical}
      onClick={onShowSettingsMenu}
    />
  );
};
