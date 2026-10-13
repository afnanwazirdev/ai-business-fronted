import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AuthLayout.module.css';

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.formWrapper}>
          <Link to="/" className={styles.brandLink}>
            <div className={styles.logoIcon}>K</div>
            <span className={styles.brandName}>
              Karobar<span style={{ color: 'var(--color-brand-primary)' }}>AI</span>
            </span>
          </Link>

          {children}
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.auroraGlow} />

        <div className={styles.showcaseCard}>
          <div className={styles.pillRow}>
            <span className={styles.pill}>Dukaan OS 🇵🇰</span>
            <span className={styles.pill} style={{ color: 'var(--color-brand-secondary)', background: 'var(--color-brand-secondary-subtle)' }}>
              COD Tracking
            </span>
          </div>

          <h2 className={styles.featureTitle}>
            Pakistan ke Online Sellers ka All-in-One Platform
          </h2>

          <p className={styles.featureDesc}>
            Orders, low-stock alerts, customer return rates aur Cash on Delivery ka hisaab aik jagah. Roman Urdu mein AI Munshi se live jawab payein.
          </p>

          <div className={styles.miniStatGrid}>
            <div className={styles.statItem}>
              <div className={styles.statNum}>99.2%</div>
              <div className={styles.statLabel}>COD Reconciliation</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNum}>-34%</div>
              <div className={styles.statLabel}>Order Return Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
