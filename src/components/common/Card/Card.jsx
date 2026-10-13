import React from 'react';
import styles from './Card.module.css';

export const Card = ({
  children,
  title,
  subtitle,
  action,
  hoverable = false,
  glow = false,
  padding = 'md', // 'none' | 'sm' | 'md' | 'lg'
  className = '',
  ...props
}) => {
  return (
    <div
      className={`
        ${styles.card}
        ${styles[`padding-${padding}`]}
        ${hoverable ? styles.cardHover : ''}
        ${glow ? styles.cardGlow : ''}
        ${className}
      `}
      {...props}
    >
      {(title || action) && (
        <div className={styles.header}>
          <div>
            {title && <h3 className={styles.title}>{title}</h3>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {action && <div className={styles.action}>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
