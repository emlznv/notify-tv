import { faCircleXmark, faPlusCircle, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonType } from '../../typescript/enums';
import { ActionButtonProps } from './ActionButton.types';
import './ActionButton.css';

const ActionButton = (props: ActionButtonProps) => {
  const { isShowAdded, type, onClick } = props;

  const renderButton = () => {
    switch (type) {
      case ButtonType.add:
        return isShowAdded ? (
          <FontAwesomeIcon
            className="added-button"
            icon={faCircleCheck}
            size="lg"
            data-testid="added-button"
          />
        ) : (
          <FontAwesomeIcon
            className="add-button"
            icon={faPlusCircle}
            onClick={onClick}
            size="lg"
            data-testid="add-button"
          />
        );
      case ButtonType.delete:
        return (
          <FontAwesomeIcon
            className="delete-button"
            onClick={onClick}
            icon={faCircleXmark}
            size="lg"
            data-testid="delete-button"
          />
        );
      default:
        return null;
    }
  };

  return renderButton();
};

export default ActionButton;
