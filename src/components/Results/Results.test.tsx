import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { faArrowUpAZ } from '@fortawesome/free-solid-svg-icons';
import Results from './Results';
import { Section } from '../../typescript/enums';
import { mockShows } from '../../tests/mocks';
import { IShow } from '../../typescript/interfaces';
import { NO_RESULTS_FOUND_MSG, NO_SHOWS_ADDED_MSG, RESULTS_ERROR_MSG } from '../../helpers/constants';

const defaultProps = {
  isLoading: false,
  results: mockShows,
  section: Section.search,
  fade: false,
  error: false,
  sortManager: {
    sortIcon: faArrowUpAZ,
    sortLabel: 'Alphabetical order',
    changeSorting: vi.fn(),
  },
};

const renderComponent = (props = {}) => (
  render(<Results {...defaultProps} {...props} />)
);

vi.mock('../ShowCard/ShowCard', () => ({
  default: ({ show }: { show: IShow }) => (
    <div data-testid="mock-show-card">
      <span>{show.name}</span>
      <span>{show.premiered}</span>
      <span>{show.averageRuntime}</span>
      <span>{show.network?.name || show.webChannel?.name}</span>
      <span>{show.genres.join(', ')}</span>
    </div>
  )
}));

describe('Results', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test('it renders the component with show cards', () => {
    renderComponent();
    mockShows.forEach((show) => {
      expect(screen.getByText(show.name)).toBeInTheDocument();
      expect(screen.getByText(show.premiered)).toBeInTheDocument();
      expect(screen.getByText(show.genres.join(', '))).toBeInTheDocument();
      expect(screen.getByText(show.averageRuntime)).toBeInTheDocument();
    });
  });
  test('it renders loading spinner when loading', () => {
    renderComponent({ isLoading: true });
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });
  test('it renders no search results message', () => {
    renderComponent({ results: [] });
    expect(screen.getByText(NO_RESULTS_FOUND_MSG)).toBeInTheDocument();
  });
  test('it renders no added shows message', () => {
    renderComponent({ section: Section.addedShows, results: [] });
    expect(screen.getByText(NO_SHOWS_ADDED_MSG)).toBeInTheDocument();
  });
  test('it renders error message when there is an error', () => {
    renderComponent({ results: [], error: true });
    expect(screen.getByText(RESULTS_ERROR_MSG)).toBeInTheDocument();
  });
  test('it renders sort heading and calls changeSorting when clicked', async () => {
    const user = userEvent.setup();
    renderComponent({ section: Section.addedShows });
    const sortButton = screen.getByTestId('sort-button');
    await user.click(sortButton);
    expect(defaultProps.sortManager.changeSorting).toHaveBeenCalled();
    expect(screen.getByText(defaultProps.sortManager.sortLabel)).toBeInTheDocument();
  });
});
