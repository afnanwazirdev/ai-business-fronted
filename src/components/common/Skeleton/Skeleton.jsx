import React from 'react';
import styles from './Skeleton.module.css';

export const Skeleton = ({
  width = '100%',
  height = '20px',
  borderRadius,
  className = '',
  style = {},
}) => {
  return (
    <div
      className={`${styles.skeleton} ${className}`}
      style={{
        width,
        height,
        borderRadius: borderRadius || undefined,
        ...style,
      }}
      aria-hidden="true"
    />
  );
};

export default Skeleton;
