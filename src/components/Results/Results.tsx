import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Section } from '../../typescript/enums';
import { IShow } from '../../typescript/interfaces';
import ShowCard from '../ShowCard/ShowCard';
import { NO_RESULTS_FOUND_MSG, NO_SHOWS_ADDED_MSG, RESULTS_ERROR_MSG } from '../../helpers/constants';
import { ResultsProps } from './Results.types';
import './Results.css';

const Results = (props: ResultsProps) => {
  const { results, section, fade, isLoading, error, sortManager } = props;
  const fadedClass = fade ? 'faded' : '';
  const searchResultsMsg = error ? RESULTS_ERROR_MSG : NO_RESULTS_FOUND_MSG;

  const renderResults = () => {
    if (isLoading) { return <div data-testid="loader" className="loading-spinner" />; }

    return results.length ? (
      <>
        {section === Section.addedShows && results.length && (
          <div className="sort-heading">
            <FontAwesomeIcon
              data-testid="sort-button"
              className="sort-button"
              icon={sortManager.sortIcon}
              onClick={sortManager.changeSorting}
            />
            <span className="sort-label">{sortManager.sortLabel}</span>
          </div>
        )}
        {results.map((item: IShow) => (
          <ShowCard key={item.id} show={item} section={section} />
        ))}
      </>
    ) : (
      <p className={`no-results-msg ${fadedClass}`}>
        {error && <FontAwesomeIcon className="error-icon" icon={faCircleExclamation} size="lg" />}
        {section === Section.addedShows ? NO_SHOWS_ADDED_MSG : searchResultsMsg}
      </p>
    );
  };

  return (
    <div className={`results-wrapper ${fadedClass}`}>
      {renderResults()}
    </div>
  );
};

export default Results;
