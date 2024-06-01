import {
  faCircleExclamation, IconDefinition
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useSort from '../../hooks/useSort';
import { Section } from '../../typescript/enums';
import { IShow } from '../../typescript/interfaces';
import ShowCard from '../ShowCard/ShowCard';
import './Results.css';

interface IProps {
  isLoading: boolean;
  results: IShow[];
  section: Section;
  fade: boolean;
  error: boolean;
}

const NO_SHOWS_ADDED_MSG = 'Add shows to get notified for new episodes.';
const NO_RESULTS_FOUND_MSG = 'No results to show.';
const ERROR_MSG = 'An error occured. Please try again.';

const Results = (props: IProps) => {
  const { results, section, fade, isLoading, error } = props;
  const { sortIcon, sortLabel, sortedData, toggleSortIcon } = useSort(results, section);
  const fadedClass = fade ? 'faded' : '';
  const searchResultsMsg = error ? ERROR_MSG : NO_RESULTS_FOUND_MSG;

  const renderResults = () => {
    if (isLoading) { return <div className="loading-spinner" />; }

    return results.length ? (
      <>
        {section === Section.addedShows && results.length && (
          <div className="sort-heading">
            <FontAwesomeIcon className="sort-button" icon={sortIcon as IconDefinition} onClick={toggleSortIcon} />
            <span className="sort-label">{sortLabel}</span>
          </div>
        )}
        {sortedData.map((item: IShow) => (
          <ShowCard show={item} section={section} />
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
