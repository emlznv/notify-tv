/* eslint-disable no-undef */
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { NotificationDay } from '../../typescript/enums';
import { SettingsButton } from '../SettingsButton/SettingsButton';
import './SettingsMenu.css';

interface IProps {
  onShowSettingsMenu: () => void
}

const SettingsMenu = (props: IProps) => {
  const { onShowSettingsMenu } = props;
  const [chosenDays, setChosenDays] = useState<NotificationDay[]>([]);

  const getNotificationDays = async () => {
    const { notificationDays } = await chrome.storage.local.get('notificationDays');
    setChosenDays(notificationDays);
  };

  const updateNotificationDays = async (day: NotificationDay) => {
    const isDayAdded = chosenDays.find((item) => item === day);
    const updatedDays = isDayAdded ? chosenDays.filter((item) => item !== day) : [...chosenDays, day];
    setChosenDays(updatedDays);
    await chrome.storage.local.set({ notificationDays: updatedDays });
  };

  useEffect(() => {
    getNotificationDays();
  }, []);

  const isDayChecked = (day: NotificationDay) => {
    return !!(chosenDays.find((item) => item === day));
  };

  const items = [
    {
      day: NotificationDay.sameDay,
      text: 'on the same day',
      isChecked: isDayChecked(NotificationDay.sameDay)
    },
    {
      day: NotificationDay.oneDayBefore,
      text: '1 day before',
      isChecked: isDayChecked(NotificationDay.oneDayBefore)
    },
    {
      day: NotificationDay.threeDaysBefore,
      text: '3 days before',
      isChecked: isDayChecked(NotificationDay.threeDaysBefore)
    }
  ];

  return (
    <div className="settings-menu">
      <div className="settings-menu-header">
        <h4 className="settings-menu-title">Receive episode notification</h4>
        <span className="settings-menu-button"><SettingsButton onShowSettingsMenu={onShowSettingsMenu} /></span>
      </div>
      <ul className="settings-menu-list">
        {items.map((item) => (
          <li>
            <button
              className="settings-menu-item"
              type="button"
              onClick={() => updateNotificationDays(item.day)}
            >
              <span className="settings-menu-item-icon-wrapper">
                {item.isChecked
                && (
                <FontAwesomeIcon
                  icon={faCheck}
                  className="settings-menu-item-icon"
                />
                )}
              </span>
              <span>{item.text}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SettingsMenu;
