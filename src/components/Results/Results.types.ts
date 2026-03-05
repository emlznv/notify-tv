import { IShow, ISortManager } from '../../typescript/interfaces';
import { Section } from '../../typescript/enums';

export interface ResultsProps {
  isLoading: boolean;
  results: IShow[];
  section: Section;
  fade: boolean;
  error: boolean;
  sortManager: ISortManager
}
