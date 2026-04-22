import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, test } from 'vitest';
import ActionButton from './ActionButton';
import { ButtonType } from '../../typescript/enums';

const defaultProps = {
  type: ButtonType.add,
  isShowAdded: false,
  text: 'Are you sure?',
  onClick: vi.fn(),
};

const renderComponent = (props = {}) => (
  render(<ActionButton {...defaultProps} {...props} />)
);

describe('ActionButton', () => {
  const addButtonTestId = 'add-button';
  const addedButtonTestId = 'added-button';
  const deleteButtonTestId = 'delete-button';

  test('it renders the add icon when a show hasn`t been added', () => {
    renderComponent();
    expect(screen.getByTestId(addButtonTestId)).toBeInTheDocument();
    expect(screen.queryByTestId(addedButtonTestId)).not.toBeInTheDocument();
  });
  test('it renders the added icon when a show has been added', () => {
    renderComponent({ isShowAdded: true });
    expect(screen.getByTestId(addedButtonTestId)).toBeInTheDocument();
    expect(screen.queryByTestId(addButtonTestId)).not.toBeInTheDocument();
  });
  test('it calls onClick when the add button is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByTestId(addButtonTestId));
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });
  test('it renders delete icon', () => {
    renderComponent({ type: ButtonType.delete });
    expect(screen.getByTestId(deleteButtonTestId)).toBeInTheDocument();
  });
  test('it calls onClick when the delete button is clicked', () => {
    renderComponent({ type: ButtonType.delete });
    fireEvent.click(screen.getByTestId(deleteButtonTestId));
    expect(defaultProps.onClick).toHaveBeenCalled();
  });
});
