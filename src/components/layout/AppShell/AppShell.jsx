import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import TopBar from '../TopBar/TopBar';
import MobileNav from '../MobileNav/MobileNav';
import CommandPalette from '../CommandPalette/CommandPalette';
import styles from './AppShell.module.css';

export const AppShell = ({ children, user, onLogout }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className={styles.layout}>
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div className={styles.mainWrapper}>
        <TopBar user={user} onLogout={onLogout} />
        <main className={styles.content}>{children}</main>
      </div>

      <MobileNav />
      <CommandPalette />
    </div>
  );
};

export default AppShell;
