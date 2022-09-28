import { faCircleXmark, faPlusCircle, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useEffect, useMemo, useState } from 'react';
import * as API from '../../api/api';
import { StorageContext } from '../../context/storage-context';
import { ButtonType } from '../../typescript/enums';
import { IEpisode, IShow, IStorageContext } from '../../typescript/interfaces';
import './ActionButton.css';

interface IProps {
  show: IShow;
  type: ButtonType;
  handleDelete?: (show: boolean) => void;
}

const ActionButton = (props: IProps) => {
  const { show, type, handleDelete } = props;
  const [isShowAdded, setIsShowAdded] = useState<boolean>(false);
  const { addedShows, addToShows } = useContext(StorageContext) as IStorageContext;

  useEffect(() => {
    const existingShow = addedShows.find((item: IShow) => item.id === show.id);
    setIsShowAdded(!!existingShow);
  }, []);

  const onDelete = () => {
    handleDelete && handleDelete(true);
  };

  const onAdd = async () => {
    const nextEpisodeUrl = show?._links?.nextepisode?.href;
    const nextEpisodeData: IEpisode = nextEpisodeUrl ? await API.getEpisode(nextEpisodeUrl) : undefined;
    const nextEpisodeDataSuccess = !(nextEpisodeData instanceof Error);
    if (nextEpisodeDataSuccess) { show.nextEpisodeData = nextEpisodeData; }
    setIsShowAdded(true);
    addToShows(show);
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
