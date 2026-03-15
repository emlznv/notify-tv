import { faCircleXmark, faPlusCircle, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonType } from '../../typescript/enums';
import { ActionButtonProps } from './ActionButton.types';
import './ActionButton.css';

const ActionButton = (props: ActionButtonProps) => {
  const { isShowAdded, type, handleDelete, handleAdd } = props;

  const onDelete = () => handleDelete && handleDelete(true);
  const onAdd = () => handleAdd && handleAdd();

  const renderButton = () => {
    switch (type) {
      case ButtonType.add:
        return isShowAdded ? (
          <FontAwesomeIcon
            className="added-button"
            icon={faCircleCheck}
            size="lg"
          />
        ) : (
          <FontAwesomeIcon
            className="add-button"
            icon={faPlusCircle}
            onClick={onAdd}
            size="lg"
          />
        );
      case ButtonType.delete:
        return (
          <FontAwesomeIcon
            className="delete-button"
            onClick={onDelete}
            icon={faCircleXmark}
            size="lg"
          />
        );
      default:
        return null;
    }
  };

  return renderButton();
};

export default ActionButton;
