export interface ConfirmationDialogProps {
  isOpen: boolean;
  text: string;
  onConfirm: () => void;
  onCancel: () => void;
}
