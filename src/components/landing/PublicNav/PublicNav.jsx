import React from 'react';
import { Link } from 'react-router-dom';
import { FiSun, FiMoon, FiArrowRight } from 'react-icons/fi';
import { useTheme } from '../../../context/ThemeContext';
import Button from '../../common/Button/Button';

export const PublicNav = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        borderBottom: '1px solid var(--color-border-subtle)',
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
      }}
    >
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'var(--color-brand-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: '18px',
            boxShadow: '0 0 16px var(--color-brand-glow)',
          }}
        >
          K
        </div>
        <span
          style={{
            fontFamily: 'var(--font-family-display)',
            fontWeight: 800,
            fontSize: '18px',
            color: 'var(--color-text-primary)',
          }}
        >
          Karobar<span style={{ color: 'var(--color-brand-primary)' }}>AI</span>
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '28px', fontSize: '14px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
        <a href="#features" style={{ transition: 'color 0.2s' }}>Features</a>
        <a href="#how-it-works" style={{ transition: 'color 0.2s' }}>How It Works</a>
        <Link to="/pricing" style={{ transition: 'color 0.2s' }}>Pricing (PKR)</Link>
        <a href="#reviews" style={{ transition: 'color 0.2s' }}>Reviews</a>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          type="button"
          onClick={(e) => toggleTheme(e)}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: '1px solid var(--color-border-subtle)',
            background: 'var(--color-bg-input)',
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          aria-label="Theme toggle"
        >
          {theme === 'dark' ? <FiSun size={17} /> : <FiMoon size={17} />}
        </button>

        <Link to="/login">
          <Button variant="ghost" size="md">
            Login
          </Button>
        </Link>

        <Link to="/signup">
          <Button variant="primary" size="md" iconRight={<FiArrowRight />}>
            Start Free Trial
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default PublicNav;
