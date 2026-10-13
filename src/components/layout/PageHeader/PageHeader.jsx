import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import styles from './PageHeader.module.css';

export const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  actions,
  className = '',
}) => {
  return (
    <div className={`${styles.container} ${className}`}>
      {breadcrumbs.length > 0 && (
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.label}>
              {idx > 0 && <span className={styles.separator}><FiChevronRight size={12} /></span>}
              {crumb.to ? (
                <Link to={crumb.to} className={styles.breadcrumbLink}>
                  {crumb.label}
                </Link>
              ) : (
                <span>{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className={styles.mainRow}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
