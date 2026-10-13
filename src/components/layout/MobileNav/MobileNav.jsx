import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiLayout, FiShoppingBag, FiBox, FiUsers, FiCpu } from 'react-icons/fi';
import styles from './MobileNav.module.css';

export const MobileNav = () => {
  const items = [
    { to: '/dashboard', label: 'Hisaab', icon: <FiLayout /> },
    { to: '/orders', label: 'Orders', icon: <FiShoppingBag /> },
    { to: '/products', label: 'Stock', icon: <FiBox /> },
    { to: '/customers', label: 'Gahak', icon: <FiUsers /> },
    { to: '/assistant', label: 'AI Munshi', icon: <FiCpu /> },
  ];

  return (
    <nav className={styles.mobileBar} aria-label="Mobile Navigation">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
          }
        >
          <span className={styles.icon}>{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileNav;
