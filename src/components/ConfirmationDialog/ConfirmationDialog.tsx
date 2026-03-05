import './ConfirmationDialog.css';
import { ConfirmationDialogProps } from './ConfirmationDialog.types';

const ConfirmationDialog = (props: ConfirmationDialogProps) => {
  const { isOpen, text, onConfirm, onCancel } = props;

  return (isOpen ? (
    <div className="confirmation-dialog">
      <h4 className="dialog-title">{text}</h4>
      <div className="dialog-buttons-wrapper">
        <button
          type="button"
          className="dialog-confirm-button"
          onClick={onConfirm}
        >
          Yes
        </button>
        <button
          type="button"
          className="dialog-cancel-button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  ) : null
  );
};

export default ConfirmationDialog;
