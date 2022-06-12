import './ShowCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faStar, faClock } from '@fortawesome/free-solid-svg-icons';
import { IShow, IShowResponse } from '../../typescript/interfaces';
import ActionButton from '../ActionButton/ActionButton';
import { formatAvgRuntime, formatGenres, formatPremiere, formatRating } from '../../helpers/format.helpers';
import { ButtonType, Section } from '../../typescript/enums';

const ShowCard = ({ data, section }: { data: any; section: Section }) => {
  const show: IShow = data.show || data;
  const { name, image, genres, averageRuntime, rating, premiered } = show;
  const buttonType = section === Section.addedShows ? ButtonType.delete : ButtonType.add;

  return (
    show && (
      <div className="show-card">
        <div className="show-poster-wrapper">
          <img
            className="show-poster"
            src={image?.original || image?.medium}
            alt="Show Poster"
          />
        </div>
        <div className="show-details">
          <div className="show-heading">
            <h4 className="show-title">
              {name}
              <span className="premiere-date">{formatPremiere(premiered)}</span>
            </h4>
            <ActionButton show={show} type={buttonType} />
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
          <p>{formatGenres(genres)}</p>
        </div>
      </div>
    )
  );
};

export default ShowCard;
