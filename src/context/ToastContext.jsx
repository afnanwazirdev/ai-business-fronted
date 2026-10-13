import React, { createContext, useContext, useState, useCallback } from 'react';
import { FiCheckCircle, FiAlertCircle, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';
import styles from '../components/common/Toast/Toast.module.css';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ title, message, type = 'info', duration = 4000 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newToast = { id, title, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  const toast = {
    success: (title, message, duration) => addToast({ title, message, type: 'success', duration }),
    error: (title, message, duration) => addToast({ title, message, type: 'error', duration }),
    warning: (title, message, duration) => addToast({ title, message, type: 'warning', duration }),
    info: (title, message, duration) => addToast({ title, message, type: 'info', duration }),
    remove: removeToast,
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <FiCheckCircle />;
      case 'error': return <FiAlertCircle />;
      case 'warning': return <FiAlertTriangle />;
      default: return <FiInfo />;
    }
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className={styles.toastContainer} aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`${styles.toast} ${styles[t.type]}`} role="status">
            <span className={styles.icon}>{getIcon(t.type)}</span>
            <div className={styles.content}>
              {t.title && <div className={styles.title}>{t.title}</div>}
              {t.message && <div className={styles.message}>{t.message}</div>}
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => removeToast(t.id)}
              aria-label="Close notification"
            >
              <FiX size={14} />
            </button>
            {t.duration > 0 && (
              <span
                className={styles.progressBar}
                style={{ animationDuration: `${t.duration}ms` }}
              />
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;
