import { Section } from '../../typescript/enums';
import { IShow, IShowResponse } from '../../typescript/interfaces';
import ShowCard from '../ShowCard/ShowCard';
import './Results.css';

interface IProps {
  isLoading: boolean;
  results: IShow[] | IShowResponse[];
  section: Section;
  fade: boolean;
}

const NO_SHOWS_ADDED_MSG = 'Add shows to get notified for new episodes.';
const NO_RESULTS_FOUND_MSG = 'No results to show.';

const Results = (props: IProps) => {
  const { results, section, fade, isLoading } = props;
  const fadedClass = fade ? 'faded' : '';

  const renderResults = () => {
    if (isLoading) { return <div className="loading-spinner" />; }

    return results.length ? (
      results.map((item: IShow | IShowResponse) => (
        <ShowCard data={item} section={section} />
      ))
    ) : (
      <p className={`no-results-msg ${fadedClass}`}>
        {section === Section.addedShows ? NO_SHOWS_ADDED_MSG : NO_RESULTS_FOUND_MSG}
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
