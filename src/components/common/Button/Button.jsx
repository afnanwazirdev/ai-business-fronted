import React from 'react';
import styles from './Button.module.css';

export const Button = React.forwardRef(({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'danger' | 'emerald'
  size = 'md',         // 'sm' | 'md' | 'lg'
  iconOnly = false,
  loading = false,
  disabled = false,
  iconLeft,
  iconRight,
  className = '',
  type = 'button',
  ...props
}, ref) => {
  const classes = [
    styles.btn,
    styles[variant],
    styles[`size-${size}`],
    iconOnly ? styles.iconOnly : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        iconLeft && <span className={styles.icon}>{iconLeft}</span>
      )}
      {children}
      {!loading && iconRight && <span className={styles.icon}>{iconRight}</span>}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
