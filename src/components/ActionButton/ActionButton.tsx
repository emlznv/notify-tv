import { faCircleXmark, faPlusCircle, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useStorage from '../../hooks/useStorage';
import { ButtonType } from '../../typescript/enums';
import { IShow } from '../../typescript/interfaces';
import './ActionButton.css';

interface IProps {
  show: IShow;
  type: ButtonType;
  handleDelete?: (show: boolean) => void;
}

const ActionButton = (props: IProps) => {
  const { show, type, handleDelete } = props;
  const { addToShows, isShowAdded } = useStorage(show);

  const onDelete = () => {
    handleDelete && handleDelete(true);
  };

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
            onClick={addToShows}
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
