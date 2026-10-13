import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiShoppingBag,
  FiBox,
  FiUsers,
  FiBarChart2,
  FiMessageSquare,
  FiSettings,
  FiPlusCircle,
  FiArrowRight,
} from 'react-icons/fi';
import { useCommand } from '../../../context/CommandContext';
import styles from './CommandPalette.module.css';

export const CommandPalette = () => {
  const { isOpen, close } = useCommand();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const commands = [
    {
      group: 'Quick Actions',
      items: [
        { id: 'new-order', title: 'Naya Order Banayein', desc: 'Create a new COD order', icon: <FiPlusCircle />, action: () => { navigate('/orders?action=new'); close(); } },
        { id: 'ai-sales', title: 'AI Assistant se Hisaab Poochein', desc: 'Ask about today sales in Urdu/Roman Urdu', icon: <FiMessageSquare />, action: () => { navigate('/assistant'); close(); } },
      ],
    },
    {
      group: 'Navigation',
      items: [
        { id: 'nav-dashboard', title: 'Dashboard (Hisaab-Kitaab)', desc: 'View sales, charts, and alerts', icon: <FiBarChart2 />, action: () => { navigate('/dashboard'); close(); } },
        { id: 'nav-orders', title: 'Orders Pipeline', desc: 'Manage pending, confirmed, dispatched orders', icon: <FiShoppingBag />, action: () => { navigate('/orders'); close(); } },
        { id: 'nav-products', title: 'Products & Stock (Maal)', desc: 'View inventory and low-stock items', icon: <FiBox />, action: () => { navigate('/products'); close(); } },
        { id: 'nav-customers', title: 'Customers Directory (Gahak)', desc: 'Customer history and repeat buyers', icon: <FiUsers />, action: () => { navigate('/customers'); close(); } },
        { id: 'nav-reports', title: 'Reports & Analytics', desc: 'Sales, city-wise stats and CSV export', icon: <FiBarChart2 />, action: () => { navigate('/reports'); close(); } },
        { id: 'nav-settings', title: 'Settings & Couriers', desc: 'Configure TCS, Leopards, PostEx, Trax', icon: <FiSettings />, action: () => { navigate('/settings'); close(); } },
      ],
    },
  ];

  // Flattened filtered items
  const filteredCommands = commands.map((g) => ({
    ...g,
    items: g.items.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.desc.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter((g) => g.items.length > 0);

  const flatItems = filteredCommands.flatMap((g) => g.items);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (flatItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + flatItems.length) % (flatItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flatItems[selectedIndex]) {
        flatItems[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  let currentItemIndex = 0;

  return (
    <div className={styles.overlay} onClick={close}>
      <div
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.searchHeader}>
          <FiSearch size={20} />
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder="Search orders, products, customers or actions..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <kbd className={styles.kbd}>ESC</kbd>
        </div>

        <div className={styles.list}>
          {filteredCommands.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              No matching commands found.
            </div>
          ) : (
            filteredCommands.map((group) => (
              <div key={group.group}>
                <div className={styles.groupTitle}>{group.group}</div>
                {group.items.map((item) => {
                  const isSelected = currentItemIndex === selectedIndex;
                  const itemIdx = currentItemIndex;
                  currentItemIndex++;

                  return (
                    <div
                      key={item.id}
                      className={`${styles.item} ${isSelected ? styles.itemSelected : ''}`}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(itemIdx)}
                    >
                      <div className={styles.itemLeft}>
                        <span className={styles.itemIcon}>{item.icon}</span>
                        <div>
                          <div className={styles.itemTitle}>{item.title}</div>
                          <div className={styles.itemDesc}>{item.desc}</div>
                        </div>
                      </div>
                      <FiArrowRight size={14} style={{ opacity: isSelected ? 1 : 0 }} />
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className={styles.footer}>
          <span>Navigate with <kbd className={styles.kbd}>↑</kbd> <kbd className={styles.kbd}>↓</kbd></span>
          <span>Select with <kbd className={styles.kbd}>↵ Enter</kbd></span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
