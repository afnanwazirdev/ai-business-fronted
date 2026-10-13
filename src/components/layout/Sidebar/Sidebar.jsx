import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  FiLayout,
  FiShoppingBag,
  FiBox,
  FiUsers,
  FiPieChart,
  FiCpu,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
  FiZap,
} from 'react-icons/fi';
import styles from './Sidebar.module.css';

export const Sidebar = ({ isCollapsed, onToggle }) => {
  const navigate = useNavigate();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', romanLabel: 'Hisaab', icon: <FiLayout /> },
    { to: '/orders', label: 'Orders', romanLabel: 'Orders (COD)', icon: <FiShoppingBag /> },
    { to: '/products', label: 'Inventory', romanLabel: 'Maal / Stock', icon: <FiBox /> },
    { to: '/customers', label: 'Customers', romanLabel: 'Gahak', icon: <FiUsers /> },
    { to: '/reports', label: 'Reports', romanLabel: 'Munafa & Sales', icon: <FiPieChart /> },
    { to: '/assistant', label: 'AI Assistant', romanLabel: 'Munshi AI', icon: <FiCpu />, highlight: true },
    { to: '/settings', label: 'Settings', romanLabel: 'TCS / Couriers', icon: <FiSettings /> },
  ];

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`} aria-label="Main Navigation">
      <div className={styles.brandRow}>
        <Link to="/dashboard" className={styles.brandLink}>
          <div className={styles.logoIcon}>K</div>
          {!isCollapsed && (
            <div className={styles.brandText}>
              <span className={styles.brandName}>Karobar<span style={{ color: 'var(--color-brand-primary)' }}>AI</span></span>
              <span className={styles.brandTag}>Dukaan OS 🇵🇰</span>
            </div>
          )}
        </Link>
        <button
          type="button"
          className={styles.toggleBtn}
          onClick={onToggle}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
        </button>
      </div>

      <nav className={styles.navSection}>
        {!isCollapsed && <span className={styles.sectionLabel}>Management</span>}
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
            }
            title={isCollapsed ? `${item.label} (${item.romanLabel})` : undefined}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {!isCollapsed && (
              <>
                <span className={styles.navLabel}>{item.label}</span>
                {item.highlight && <span className={styles.badge}>Live</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {!isCollapsed && (
        <div className={styles.footerSection}>
          <div className={styles.assistantBanner} onClick={() => navigate('/assistant')}>
            <FiZap className={styles.aiIcon} />
            <div className={styles.aiText}>
              <strong>Claude Assistant</strong>
              <div>Urdu & Roman Urdu Support</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
