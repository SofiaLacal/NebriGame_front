import { CheckCircle, XCircle, X } from 'lucide-react';
import useToastStore from '../../stores/toastStore';
import './Toast.css';

function ToastItem({ id, type, message }) {
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div className={`toast-item toast-${type}`} role="alert">
      {type === 'success' && <CheckCircle size={20} className="toast-icon" />}
      {type === 'error' && <XCircle size={20} className="toast-icon" />}
      <span className="toast-message">{message}</span>
      <button
        type="button"
        className="toast-close"
        onClick={() => removeToast(id)}
        aria-label="Cerrar"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((t) => (
        <ToastItem key={t.id} id={t.id} type={t.type} message={t.message} />
      ))}
    </div>
  );
}
