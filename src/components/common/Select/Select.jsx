import React from 'react';
import { FiChevronDown } from 'react-icons/fi';
import styles from './Select.module.css';

export const Select = React.forwardRef(({
  label,
  error,
  options = [],
  placeholder = 'Select option...',
  required = false,
  className = '',
  id,
  children,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {label && (
        <div className={styles.labelRow}>
          <label htmlFor={selectId} className={styles.label}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        </div>
      )}

      <div className={`${styles.selectContainer} ${error ? styles.hasError : ''}`}>
        <select ref={ref} id={selectId} className={styles.select} {...props}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.length > 0
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <span className={styles.arrowIcon}>
          <FiChevronDown size={16} />
        </span>
      </div>

      {error && <span className={styles.errorText} role="alert">{error}</span>}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
