import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmationDialog from './ConfirmationDialog';

const defaultProps = {
  isOpen: true,
  text: 'Are you sure?',
  onConfirm: vi.fn(),
  onCancel: vi.fn()
};

const renderComponent = (props = {}) => (
  render(<ConfirmationDialog {...defaultProps} {...props} />)
);

describe('ConfirmationDialog', () => {
  const confirmText = /yes/i;
  const cancelText = /cancel/i;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('it renders the dialog when it`s open', () => {
    renderComponent();
    expect(screen.getByText(defaultProps.text)).toBeInTheDocument();
  });
  test('it doesn`t render the dialog when it`s not open', () => {
    renderComponent({ isOpen: false });
    expect(screen.queryByText(defaultProps.text)).not.toBeInTheDocument();
  });
  test('it calls the confirm callback when the button is clicked', async () => {
    renderComponent();
    await userEvent.click(screen.getByRole('button', { name: confirmText }));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });
  test('it calls the cancel callback when the button is clicked', async () => {
    renderComponent();
    await userEvent.click(screen.getByRole('button', { name: cancelText }));
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });
});
