import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Section } from '../../typescript/enums';
import { IShow, ISortManager } from '../../typescript/interfaces';
import ShowCard from '../ShowCard/ShowCard';
import './Results.css';
import { NO_RESULTS_FOUND_MSG, NO_SHOWS_ADDED_MSG } from '../../helpers/constants';

interface IProps {
  isLoading: boolean;
  results: IShow[];
  section: Section;
  fade: boolean;
  sortManager: ISortManager
}

const Results = (props: IProps) => {
  const { results, section, fade, isLoading, sortManager } = props;
  const fadedClass = fade ? 'faded' : '';

  if (isLoading) { return <div className="loading-spinner" />; }

  return (
    <div className={`results-wrapper ${fadedClass}`}>
      {results.length ? (
        <>
          {section === Section.addedShows && results.length && (
          <div className="sort-heading">
            <FontAwesomeIcon className="sort-button" icon={sortManager.sortIcon} onClick={sortManager.changeSorting} />
            <span className="sort-label">{sortManager.sortLabel}</span>
          </div>
          )}
          {results.map((item: IShow) => (
            <ShowCard show={item} section={section} />
          ))}
        </>
      ) : (
        <p className={`no-results-msg ${fadedClass}`}>
          {section === Section.addedShows ? NO_SHOWS_ADDED_MSG : NO_RESULTS_FOUND_MSG}
        </p>
      )}
    </div>
  );
};

export default Results;
