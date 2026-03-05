import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';

const defaultProps = {
  searchValue: '',
  onValueChange: vi.fn()
};

const renderComponent = (props = {}) => (
  render(<SearchBar {...defaultProps} {...props} />)
);

describe('SearchBar', () => {
  const placeholder = /search for an ongoing show/i;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('it renders the component', () => {
    renderComponent();
    expect(screen.getByText(placeholder)).toBeInTheDocument();
  });
  test('it changes the input search term', async () => {
    renderComponent();
    const input = screen.getByPlaceholderText(placeholder);
    await userEvent.type(input, 'lost');
    expect(defaultProps.onValueChange).toHaveBeenCalledTimes(4);
  });
});
