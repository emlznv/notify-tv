import './ConfirmationDialog.css';

interface IProps {
  isOpen: boolean;
  text: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog = (props: IProps) => {
  const { isOpen, text, onConfirm, onCancel } = props;

  return (isOpen ? (
    <div className="confirmation-dialog">
      <h4>{text}</h4>
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
