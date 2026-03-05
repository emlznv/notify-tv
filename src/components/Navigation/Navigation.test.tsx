import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navigation from './Navigation';
import { Section } from '../../typescript/enums';

const defaultProps = {
  activeSection: Section.search,
  onChangeSection: vi.fn(),
  onShowSettingsMenu: vi.fn()
};

const renderComponent = (props = {}) => (
  render(<Navigation {...defaultProps} {...props} />)
);

describe('Navigation', () => {
  const showsSectionText = /my list/i;
  const searchSectionText = /explore/i;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('it renders the component', () => {
    renderComponent();
    expect(screen.getByText(showsSectionText)).toBeInTheDocument();
    expect(screen.getByText(searchSectionText)).toBeInTheDocument();
  });
  test('it navigates to Search section on click', async () => {
    renderComponent({ section: Section.addedShows });
    await userEvent.click(screen.getByRole('button', { name: searchSectionText }));
    expect(defaultProps.onChangeSection).toHaveBeenCalledWith(Section.search);
    expect(screen.queryByText(searchSectionText)).toBeInTheDocument();
  });
  test('it navigates to Shows section on click', async () => {
    renderComponent();
    await userEvent.click(screen.getByRole('button', { name: showsSectionText }));
    expect(defaultProps.onChangeSection).toHaveBeenCalledWith(Section.addedShows);
    expect(screen.queryByText(showsSectionText)).toBeInTheDocument();
  });
});
