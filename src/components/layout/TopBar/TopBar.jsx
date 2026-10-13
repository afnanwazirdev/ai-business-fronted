import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiBell, FiMoon, FiSun, FiUser, FiLogOut, FiSettings, FiCheck } from 'react-icons/fi';
import { useTheme } from '../../../context/ThemeContext';
import { useCommand } from '../../../context/CommandContext';
import styles from './TopBar.module.css';

export const TopBar = ({ user, onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  const { open: openCommand } = useCommand();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const storeInitial = user?.storeName ? user.storeName.charAt(0).toUpperCase() : 'S';

  return (
    <header className={styles.topBar}>
      <div className={styles.leftSection}>
        <button
          type="button"
          className={styles.searchTrigger}
          onClick={openCommand}
          aria-label="Open command palette"
        >
          <FiSearch size={16} />
          <span>Quick search or command...</span>
          <kbd className={styles.kbd}>Ctrl K</kbd>
        </button>
      </div>

      <div className={styles.rightSection}>
        {/* Animated circular reveal theme toggle */}
        <button
          type="button"
          className={styles.iconBtn}
          onClick={(e) => toggleTheme(e)}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => setNotifOpen(!notifOpen)}
            aria-label="Notifications"
          >
            <FiBell size={18} />
            <span className={styles.badgeDot} />
          </button>
          {notifOpen && (
            <div className={styles.menuDropdown} style={{ width: '280px', right: 0 }}>
              <div style={{ padding: '8px 12px', fontWeight: 600, borderBottom: '1px solid var(--color-border-subtle)', fontSize: '13px' }}>
                Notifications
              </div>
              <div style={{ padding: '10px 12px', fontSize: '12px', display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--color-status-pending)' }}>⚠️</span>
                <div>
                  <strong>Low Stock Alert</strong>
                  <div style={{ color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    Velvet Shawl (Maroon) has only 2 pieces left.
                  </div>
                </div>
              </div>
              <div style={{ padding: '10px 12px', fontSize: '12px', display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--color-brand-secondary)' }}>📦</span>
                <div>
                  <strong>New COD Order #KB-1048</strong>
                  <div style={{ color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    From Karachi (Rs 3,450)
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User profile dropdown */}
        <div style={{ position: 'relative' }} ref={profileRef}>
          <div
            className={styles.profileTrigger}
            onClick={() => setProfileOpen(!profileOpen)}
            role="button"
            tabIndex={0}
          >
            <div className={styles.avatar}>{storeInitial}</div>
            <div className={styles.storeInfo}>
              <span className={styles.storeName}>{user?.storeName || 'Ayesha Closet'}</span>
              <span className={styles.storePlan}>Starter Plan 🇵🇰</span>
            </div>
          </div>

          {profileOpen && (
            <div className={styles.menuDropdown}>
              <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                <div style={{ fontWeight: 600, fontSize: '13px' }}>{user?.name || 'Seller'}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{user?.email || 'seller@karobar.pk'}</div>
              </div>
              <a href="/settings" className={styles.menuItem}>
                <FiSettings size={14} />
                <span>Store Settings</span>
              </a>
              <div
                className={`${styles.menuItem} ${styles.menuDanger}`}
                onClick={() => {
                  setProfileOpen(false);
                  if (onLogout) onLogout();
                }}
              >
                <FiLogOut size={14} />
                <span>Sign Out</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
