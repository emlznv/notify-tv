import { useContext, useEffect, useRef, useState } from 'react';
import './ShowCard.css';
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

const SEPARATOR = '\u2022';

interface IProps {
  show: IShow
  section: Section
}

const ShowCard = (props: IProps) => {
  const { section, show } = props;
  const { name, image, genres, averageRuntime, rating, premiered, summary } = show;
  const buttonType = section === Section.addedShows ? ButtonType.delete : ButtonType.add;

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
  const { deleteShow } = useContext(StorageContext) as IStorageContext;

  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [isSummaryRefAvailable, setIsSummaryRefAvailable] = useState<boolean>(false);
  const summaryRef = useRef<HTMLParagraphElement | null>(null);

  const scrollSummaryIntoView = () => {
    const isElementHidden = summaryRef?.current
      && summaryRef.current.getBoundingClientRect().bottom > window.innerHeight;
    if (isElementHidden) {
      summaryRef?.current?.scrollIntoView({ block: 'end', inline: 'nearest', behavior: 'smooth' });
    }
  };

  const handleCurrentSummaryRef = (el: HTMLParagraphElement | null) => {
    summaryRef.current = el;
    setIsSummaryRefAvailable(!!el);
  };

  useEffect(() => {
    isSummaryRefAvailable && scrollSummaryIntoView();
  }, [isSummaryRefAvailable]);

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
      : (
        <div className="show-poster no-image">
          <FontAwesomeIcon icon={faFilm} size="2x" color="var(--color-highlight-dark)" />
        </div>
      );
  };

  const fadedClass = showDeleteConfirmation ? 'faded' : '';
  const showEnded = show.status.toLowerCase() === ShowStatus.ended;

  const nextEpisodeAirstamp = show.nextEpisodeData?.airstamp;
  const newEpisodeDays = nextEpisodeAirstamp && isEpisodeDateValid(nextEpisodeAirstamp)
    && getDaysUntilNewEpisode(nextEpisodeAirstamp);
  const network = show.network?.name || show.webChannel?.name;

  const onConfirmDelete = () => {
    deleteShow(show);
    setShowDeleteConfirmation(false);
  };

  return (
    show && (
      <div className="show-card">
        <div className={`show-poster-wrapper ${fadedClass}`}>
          {showEnded && <span className="show-status">Ended</span>}
          {getPoster()}
        </div>
        <div className={`show-details ${fadedClass}`}>
          <div className="show-heading">
            <h4 title={name} className="show-title">{name}</h4>
            <ActionButton show={show} type={buttonType} handleDelete={setShowDeleteConfirmation} />
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
              className="show-summary-button"
              icon={summaryIcon}
              size="lg"
              onClick={handleShowSummary}
            />
          </div>
          {showSummary && (
            <p className="show-summary" ref={(el) => handleCurrentSummaryRef(el)}>
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
