import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { faArrowUpAZ } from '@fortawesome/free-solid-svg-icons';
import ShowCard from './ShowCard';
import { Section } from '../../typescript/enums';
import { StorageContext } from '../../context/storage-context';
import { mockShows } from '../../tests/mocks';

const defaultProps = {
  section: Section.addedShows,
  show: mockShows[0]
};

const renderWithContext = (props = {}, contextOverrides = {}) => {
  const sortManager = { sortIcon: faArrowUpAZ, sortLabel: 'Alphabetical order', changeSorting: vi.fn() };
  const showManager = { addedShows: mockShows, addShow: vi.fn(), deleteShow: vi.fn() };

  return {
    ...render(
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      <StorageContext.Provider value={{ showManager, sortManager, ...contextOverrides }}>
        <ShowCard {...defaultProps} {...props} />
      </StorageContext.Provider>
    ),
    showManager,
  };
};

describe('ShowCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('it renders the show title, poster, genres, rating, runtime, network', () => {
    renderWithContext();
    expect(screen.getByText(mockShows[0].name)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /show poster/i })).toHaveAttribute('src', mockShows[0].image.medium);
    expect(screen.getByText(mockShows[0].rating.average!)).toBeInTheDocument();
    mockShows[0].genres.slice(0, 2).forEach((genre) => {
      expect(screen.getByText(new RegExp(genre, 'i'))).toBeInTheDocument();
    });
    expect(screen.getByText(new RegExp(String(mockShows[0].rating.average), 'i'))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(String(mockShows[0].averageRuntime), 'i'))).toBeInTheDocument();
    const networkName = mockShows[0].network?.name || mockShows[0].webChannel?.name;
    expect(screen.getByText(new RegExp(networkName!, 'i'))).toBeInTheDocument();
  });

  test('it expands/collapses the summary on button click', async () => {
    renderWithContext();
    const button = screen.getByTestId('show-summary-button');
    expect(screen.queryByText(mockShows[0].summary)).not.toBeInTheDocument();
    await userEvent.click(button);
    expect(screen.getByText(mockShows[0].summary)).toBeInTheDocument();
    await userEvent.click(button);
    expect(screen.queryByText(mockShows[0].summary)).not.toBeInTheDocument();
  });
  test('renders fallback poster if no image', () => {
    const showWithoutImage = { ...mockShows[0], image: null };
    renderWithContext({ show: showWithoutImage });
    expect(screen.queryByRole('img', { name: /show poster/i })).not.toBeInTheDocument();
  });
});
