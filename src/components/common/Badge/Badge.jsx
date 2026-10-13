import React from 'react';
import styles from './Badge.module.css';

export const Badge = ({
  children,
  variant = 'secondary', // 'pending' | 'confirmed' | 'dispatched' | 'delivered' | 'returned' | 'cancelled' | 'primary' | 'secondary' | 'success'
  dot = true,
  pulse = false,
  className = '',
}) => {
  return (
    <span className={`${styles.badge} ${styles[variant] || styles.secondary} ${className}`}>
      {dot && (
        <span
          className={`${styles.dot} ${pulse ? styles.pulseDot : ''}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
