import './ConfirmModal.css';

function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = "Eliminar", cancelLabel = "Cancelar" }) {
  if (!open) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="confirm-modal-overlay" onClick={handleOverlayClick}>
      <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="confirm-modal-title">{title}</h3>
        <p className="confirm-modal-message">{message}</p>
        <div className="confirm-modal-actions">
          <button type="button" className="confirm-modal-btn confirm-modal-btn-cancel" onClick={onClose}>
            {cancelLabel}
          </button>
          <button type="button" className="confirm-modal-btn confirm-modal-btn-confirm" onClick={handleConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
