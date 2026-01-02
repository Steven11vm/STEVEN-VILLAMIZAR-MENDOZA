'use client';

import { useEffect, useState } from 'react';
import { IoCheckmarkCircle, IoAlertCircle, IoInformationCircle, IoClose } from 'react-icons/io5';
import styles from './Alert.module.css';

interface AlertProps {
  type?: 'success' | 'error' | 'info';
  message: string;
  onClose?: () => void;
  duration?: number;
}

export default function Alert({
  type = 'info',
  message,
  onClose,
  duration = 4000,
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setIsVisible(false);
          onClose?.();
        }, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  if (!isVisible) return null;

  const icons = {
    success: <IoCheckmarkCircle size={22} />,
    error: <IoAlertCircle size={22} />,
    info: <IoInformationCircle size={22} />,
  };

  return (
    <div className={`${styles.alert} ${styles[type]} ${isExiting ? styles.exiting : styles.entering}`}>
      <div className={styles.iconContainer}>
        <div className={styles.icon}>{icons[type]}</div>
      </div>
      <div className={styles.content}>
        <p className={styles.message}>{message}</p>
      </div>
      {onClose && (
        <button 
          className={styles.closeButton} 
          onClick={handleClose} 
          aria-label="Cerrar"
          type="button"
        >
          <IoClose size={18} />
        </button>
      )}
    </div>
  );
}

