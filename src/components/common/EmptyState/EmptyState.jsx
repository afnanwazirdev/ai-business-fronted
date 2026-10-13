import React from 'react';
import { FiInbox } from 'react-icons/fi';
import styles from './EmptyState.module.css';

export const EmptyState = ({
  icon,
  title = 'No items found',
  description = 'There are no records to display at this moment.',
  action,
  className = '',
}) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.iconWrapper}>
        {icon || <FiInbox />}
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
};

export default EmptyState;
