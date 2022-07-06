import { useState } from 'react';
import './ShowCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faStar, faClock, faChevronDown, faChevronUp, faImage } from '@fortawesome/free-solid-svg-icons';
import { IShow } from '../../typescript/interfaces';
import ActionButton from '../ActionButton/ActionButton';
import {
  formatAvgRuntime, formatGenres, formatPremiere, formatRating, formatSummary
} from '../../helpers/format.helpers';
import { ButtonType, Section } from '../../typescript/enums';
import useStorage from '../../hooks/useStorage';
import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog';

const ShowCard = ({ data, section }: { data: any; section: Section }) => {
  const show: IShow = data.show || data;
  const { name, image, genres, averageRuntime, rating, premiered, summary } = show;
  const buttonType = section === Section.addedShows ? ButtonType.delete : ButtonType.add;

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
  const { deleteShow } = useStorage(show);

  const [showSummary, setShowSummary] = useState<boolean>(false);
  const handleShowSummary = () => setShowSummary(!showSummary);
  const summaryIcon = showSummary ? faChevronUp : faChevronDown;

  const getPoster = () => {
    const imageSrc = image?.medium;
    return imageSrc
      ? <img className="show-poster" src={imageSrc} alt="Show Poster" />
      : <FontAwesomeIcon icon={faImage} />;
  };

  const fadedClass = showDeleteConfirmation ? 'faded' : '';

  const onConfirmDelete = () => {
    deleteShow();
    setShowDeleteConfirmation(false);
  };

  return (
    show && (
      <div className="show-card">
        <div className={`show-poster-wrapper ${fadedClass}`}>
          {getPoster()}
        </div>
        <div className={`show-details ${fadedClass}`}>
          <div className="show-heading">
            <h4 className="show-title">
              {name}
              <span className="premiere-date">{formatPremiere(premiered)}</span>
            </h4>
            <ActionButton show={show} type={buttonType} handleDelete={setShowDeleteConfirmation} />
          </div>
          <div className="show-info">
            <span className="show-rating">
              <FontAwesomeIcon
                className="show-rating-icon"
                icon={faStar}
                size="xs"
              />
              {formatRating(rating)}
            </span>
            <span>
              <FontAwesomeIcon
                className="show-runtime-icon"
                icon={faClock}
                size="xs"
              />
              {formatAvgRuntime(averageRuntime)}
            </span>
          </div>
          <div className="show-genres-wrapper">
            <p>{formatGenres(genres)}</p>
            <FontAwesomeIcon
              className="show-summary-button"
              icon={summaryIcon}
              size="lg"
              onClick={handleShowSummary}
            />
          </div>
          {showSummary && (
            <p className="show-summary">{formatSummary(summary)}</p>
          )}
        </div>
        <ConfirmationDialog
          isOpen={showDeleteConfirmation}
          text="Remove from notification list?"
          onCancel={() => setShowDeleteConfirmation(false)}
          onConfirm={onConfirmDelete}
        />
      </div>
    )
  );
};

export default ShowCard;
