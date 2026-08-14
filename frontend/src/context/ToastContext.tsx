'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { FiCheckCircle, FiInfo, FiAlertCircle } from 'react-icons/fi';
import styles from '../components/Toast.module.css';

export type ToastType = 'success' | 'info' | 'warning';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
  action?: ToastAction;
}

interface ToastContextType {
  showToast: (
    title: string,
    message?: string,
    type?: ToastType,
    action?: ToastAction
  ) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (
      title: string,
      message?: string,
      type: ToastType = 'success',
      action?: ToastAction
    ) => {
      const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
      const newToast: ToastMessage = { id, title, message, type, action };
      setToasts((prev) => [...prev, newToast]);

      // Auto dismiss after 6 seconds if there is an action button, otherwise 4 seconds
      const timeoutDuration = action ? 6000 : 4000;
      setTimeout(() => {
        removeToast(id);
      }, timeoutDuration);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className={styles.toastContainer}>
        {toasts.map((toast) => {
          let typeClass = styles.toastSuccess;
          let IconComponent = FiCheckCircle;
          let iconColor = '#10b981';

          if (toast.type === 'info') {
            typeClass = styles.toastInfo;
            IconComponent = FiInfo;
            iconColor = '#64C4FF';
          } else if (toast.type === 'warning') {
            typeClass = styles.toastWarning;
            IconComponent = FiAlertCircle;
            iconColor = '#f59e0b';
          }

          return (
            <div key={toast.id} className={`${styles.toast} ${typeClass}`}>
              <div className={styles.toastIcon} style={{ color: iconColor }}>
                <IconComponent size={20} />
              </div>
              <div className={styles.toastContent}>
                <div className={styles.toastTitle}>{toast.title}</div>
                {toast.message && <div className={styles.toastMsg}>{toast.message}</div>}
                {toast.action && (
                  <button
                    className={styles.toastActionBtn}
                    onClick={() => {
                      toast.action?.onClick();
                      removeToast(toast.id);
                    }}
                  >
                    {toast.action.label}
                  </button>
                )}
              </div>
              <button
                className={styles.closeBtn}
                onClick={() => removeToast(toast.id)}
                aria-label="Close notification"
              >
                <RxCross2 size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
