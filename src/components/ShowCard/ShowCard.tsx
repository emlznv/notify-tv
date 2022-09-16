import { useEffect, useState } from 'react';
import './ShowCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faStar, faClock, faChevronDown, faChevronUp, faImage, faFilm, faCalendarCheck
} from '@fortawesome/free-solid-svg-icons';
import { IShow } from '../../typescript/interfaces';
import ActionButton from '../ActionButton/ActionButton';
import {
  formatAvgRuntime, formatGenres, formatPremiere, formatRating, formatSummary, getDaysUntilNewEpisode
} from '../../helpers/format.helpers';
import { ButtonType, Section } from '../../typescript/enums';
import useStorage from '../../hooks/useStorage';
import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog';

const separator = '\u2022';

const ShowCard = ({ data, section }: { data: any; section: Section }) => {
  const show: IShow = data.show || data;
  const { name, image, genres, averageRuntime, rating, premiered, summary } = show;
  const buttonType = section === Section.addedShows ? ButtonType.delete : ButtonType.add;

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
  const { deleteShow } = useStorage(show);

  const [showSummary, setShowSummary] = useState<boolean>(false);
  const handleShowSummary = () => setShowSummary(!showSummary);
  const summaryIcon = showSummary ? faChevronUp : faChevronDown;

  useEffect(() => {
    setShowSummary(false);
    setShowDeleteConfirmation(false);
  }, [section]);

  const getPoster = () => {
    const imageSrc = image?.medium;
    return imageSrc
      ? <img className="show-poster" src={imageSrc} alt="Show Poster" />
      : <FontAwesomeIcon icon={faImage} />;
  };

  const fadedClass = showDeleteConfirmation ? 'faded' : '';
  const newEpisodeDays = (show.nextEpisodeData?.airstamp && getDaysUntilNewEpisode(show.nextEpisodeData.airstamp));
  const network = show.network?.name || show.webChannel?.name;

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
            <h4 className="show-title">{name}</h4>
            <ActionButton show={show} type={buttonType} handleDelete={setShowDeleteConfirmation} />
          </div>
          <p className="show-premiere-genres">
            {formatPremiere(premiered)}
            <span className="show-text-separator">{separator}</span>
            {formatGenres(genres)}
          </p>
          <div className="show-info">
            <span className="show-rating">
              <FontAwesomeIcon
                className="show-rating-icon"
                icon={faStar}
                size="xs"
              />
              {formatRating(rating)}
            </span>
            <span className="show-runtime">
              <FontAwesomeIcon
                className="show-runtime-icon"
                icon={faClock}
                size="xs"
              />
              {formatAvgRuntime(averageRuntime)}
            </span>
            {section === Section.addedShows && newEpisodeDays && (
              <span>
                <FontAwesomeIcon
                  className="show-next-episode-icon"
                  icon={faCalendarCheck}
                  size="xs"
                />
                {newEpisodeDays}
              </span>
            )}
          </div>
          <div className="show-network-summary-wrapper">
            {network && (
              <span className="show-network">
                <FontAwesomeIcon
                  className="show-network-icon"
                  icon={faFilm}
                  size="xs"
                />
                {network}
              </span>
            )}
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
