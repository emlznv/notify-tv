import { Section } from '../../typescript/enums';
import { IShow, IShowResponse } from '../../typescript/interfaces';
import ShowCard from '../ShowCard/ShowCard';
import './Results.css';

interface IProps {
  results: IShow[] | IShowResponse[];
  section: Section;
  fade: boolean;
}

const NO_SHOWS_ADDED_MSG = 'Add shows to get notified when there is a new episode.';

const Results = (props: IProps) => {
  const { results, section, fade } = props;
  const fadedClass = fade ? 'faded' : '';
  return (
    <div className={`results-wrapper ${fadedClass}`}>
      {results.length ? (
        results.map((item: IShow | IShowResponse) => (
          <ShowCard data={item} section={section} />
        ))
      ) : (
        <p className={`no-results-msg ${fadedClass}`}>
          {section === Section.addedShows && NO_SHOWS_ADDED_MSG}
        </p>
      )}
    </div>
  );
};

export default Results;
