import { ButtonType } from '../../typescript/enums';

export interface ActionButtonProps {
  isShowAdded: boolean;
  type: ButtonType;
  handleDelete?: (show: boolean) => void;
  handleAdd?: () => void;
}
