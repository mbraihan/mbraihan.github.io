import { useState, useEffect } from 'react';

// Toast hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'error', duration = 4000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };

    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.map(toast =>
      toast.id === id ? { ...toast, exiting: true } : toast
    ));

    // Remove from DOM after animation
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 300);
  };

  const showError = (message) => showToast(message, 'error');
  const showSuccess = (message) => showToast(message, 'success');

  return {
    toasts,
    showError,
    showSuccess,
    removeToast
  };
}

// Toast Container Component
export function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

// Individual Toast Component
function Toast({ toast, onRemove }) {
  useEffect(() => {
    // Add progress bar animation
    const progressElement = document.querySelector(`[data-toast-id="${toast.id}"] .toast-progress`);
    if (progressElement) {
      progressElement.style.animationDuration = `${toast.duration}ms`;
    }
  }, [toast.id, toast.duration]);

  return (
    <div
      className={`toast ${toast.type} ${toast.exiting ? 'exit' : ''}`}
      data-toast-id={toast.id}
    >
      <span className="toast-message">{toast.message}</span>
      <button
        className="toast-close"
        onClick={() => onRemove(toast.id)}
        aria-label="Close notification"
      >
        ×
      </button>
      <div className="toast-progress"></div>
    </div>
  );
}