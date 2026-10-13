import React from 'react';
import styles from './Input.module.css';

export const Input = React.forwardRef(({
  label,
  error,
  hint,
  required = false,
  prefix,
  suffix,
  className = '',
  id,
  type = 'text',
  disabled = false,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {label && (
        <div className={styles.labelRow}>
          <label htmlFor={inputId} className={styles.label}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        </div>
      )}

      <div className={`
        ${styles.inputContainer} 
        ${error ? styles.hasError : ''} 
        ${disabled ? styles.disabled : ''}
      `}>
        {prefix && <span className={styles.prefix}>{prefix}</span>}
        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          className={styles.input}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>

      {error && (
        <span id={`${inputId}-error`} className={styles.errorText} role="alert">
          {error}
        </span>
      )}

      {!error && hint && (
        <span className={styles.hintText}>{hint}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
