import { useContext, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar, faClock, faChevronDown, faChevronUp, faFilm, faCalendarCheck
} from '@fortawesome/free-solid-svg-icons';
import { IShow, IStorageContext } from '../../typescript/interfaces';
import ActionButton from '../ActionButton/ActionButton';
import {
  formatAvgRuntime, formatGenres, formatPremiere, formatRating, formatSummary
} from '../../helpers/format-helpers';
import { ButtonType, Section, ShowStatus } from '../../typescript/enums';
import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog';
import { StorageContext } from '../../context/storage-context';
import { getDaysUntilNewEpisode, isEpisodeDateValid } from '../../helpers/date-helpers';
import { SEPARATOR } from '../../helpers/constants';
import { ShowProps } from './ShowCard.types';
import './ShowCard.css';

const ShowCard = (props: ShowProps) => {
  const { section, show } = props;
  const { name, image, genres, averageRuntime, rating, premiered, summary } = show;

  const { showManager } = useContext(StorageContext) as IStorageContext;
  const buttonType = section === Section.addedShows ? ButtonType.delete : ButtonType.add;
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
  const [isShowAdded, setIsShowAdded] = useState(showManager.addedShows.some((item: IShow) => item.id === show.id));

  const [showSummary, setShowSummary] = useState<boolean>(false);
  const summaryRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (showSummary) {
      summaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [showSummary]);

  useEffect(() => {
    setShowSummary(false);
    setShowDeleteConfirmation(false);
  }, [section]);

  const fadedClass = showDeleteConfirmation ? 'faded' : '';
  const showEnded = show.status.toLowerCase() === ShowStatus.ended;
  const nextEpisodeAirstamp = show.nextEpisodeData?.airstamp;
  const newEpisodeDays = nextEpisodeAirstamp && isEpisodeDateValid(nextEpisodeAirstamp)
    && getDaysUntilNewEpisode(nextEpisodeAirstamp);
  const network = show.network?.name || show.webChannel?.name;

  const onConfirmDelete = () => {
    showManager.deleteShow(show);
    setShowDeleteConfirmation(false);
  };

  const onAddShow = () => {
    showManager.addShow(show);
    setIsShowAdded(true);
  };

  const handleShowAction = () => {
    if (buttonType === ButtonType.delete) {
      setShowDeleteConfirmation(true);
    } else if (!isShowAdded) {
      onAddShow();
    }
  };

  return (
    show && (
      <div className="show-card">
        <div className={`show-poster-wrapper ${fadedClass}`}>
          {showEnded && <span className="show-status">Ended</span>}
          {image?.medium ? <img className="show-poster" src={image.medium} alt="Show Poster" />
            : (
              <div className="show-poster no-image">
                <FontAwesomeIcon icon={faFilm} size="2x" color="var(--color-highlight-dark)" />
              </div>
            )}
        </div>
        <div className={`show-details ${fadedClass}`}>
          <div className="show-heading">
            <h4 title={name} className="show-title">{name}</h4>
            <ActionButton
              isShowAdded={isShowAdded}
              type={buttonType}
              onClick={handleShowAction}
            />
          </div>
          <p className="show-premiere-genres">
            {formatPremiere(premiered)}
            <span className="show-text-separator">{SEPARATOR}</span>
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
              data-testid="show-summary-button"
              className="show-summary-button"
              icon={showSummary ? faChevronUp : faChevronDown}
              size="lg"
              onClick={() => setShowSummary(!showSummary)}
            />
          </div>
          {showSummary && (
            <p className="show-summary" ref={summaryRef}>
              {formatSummary(summary)}
            </p>
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
