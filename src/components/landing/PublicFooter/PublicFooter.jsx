import React from 'react';
import { Link } from 'react-router-dom';

export const PublicFooter = () => {
  return (
    <footer
      style={{
        background: 'var(--color-bg-surface)',
        borderTop: '1px solid var(--color-border-subtle)',
        padding: '60px 32px 30px',
        color: 'var(--color-text-secondary)',
        fontSize: '13px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '40px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: 'var(--color-brand-primary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
              }}
            >
              K
            </div>
            <strong style={{ fontSize: '16px', color: 'var(--color-text-primary)' }}>KarobarAI</strong>
          </div>
          <p style={{ lineHeight: 1.6, color: 'var(--color-text-muted)' }}>
            Pakistan's #1 AI-powered operating system for Instagram, Daraz, and WhatsApp online sellers. Manage orders, inventory, and COD cash seamlessly.
          </p>
        </div>

        <div>
          <strong style={{ color: 'var(--color-text-primary)', display: 'block', marginBottom: '12px' }}>Product</strong>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a href="#features">Orders Pipeline</a>
            <a href="#features">Inventory & Stock Alerts</a>
            <a href="#features">Claude AI Assistant</a>
            <Link to="/pricing">Pricing Plans (PKR)</Link>
          </div>
        </div>

        <div>
          <strong style={{ color: 'var(--color-text-primary)', display: 'block', marginBottom: '12px' }}>Couriers</strong>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span>Trax Logistics</span>
            <span>TCS Express</span>
            <span>Leopards Courier</span>
            <span>PostEx</span>
          </div>
        </div>

        <div>
          <strong style={{ color: 'var(--color-text-primary)', display: 'block', marginBottom: '12px' }}>Karobar in Pakistan</strong>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            Karachi • Lahore • Islamabad • Rawalpindi • Faisalabad • Multan • Peshawar
          </p>
          <div style={{ marginTop: '12px', color: 'var(--color-brand-secondary)', fontWeight: 600 }}>
            Made with ❤️ for Pakistani Entrepreneurs 🇵🇰
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          borderTop: '1px solid var(--color-border-subtle)',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>© 2026 KarobarAI Technologies (Pvt) Ltd. All rights reserved.</div>
        <div>Designed with Linear/Vercel level polish.</div>
      </div>
    </footer>
  );
};

export default PublicFooter;
