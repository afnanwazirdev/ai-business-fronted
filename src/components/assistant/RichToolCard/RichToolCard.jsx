import React from 'react';
import { FiDatabase, FiCopy, FiCheck } from 'react-icons/fi';
import { formatPKR } from '../../../utils/formatters';

export const RichToolCard = ({ toolName, result }) => {
  const [copied, setCopied] = React.useState(false);

  if (!result || result.error) return null;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        margin: '10px 0',
        padding: '12px',
        background: 'var(--color-bg-elevated)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: '10px',
        fontSize: '12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--color-brand-primary)',
          fontWeight: 600,
          marginBottom: '8px',
          textTransform: 'uppercase',
          fontSize: '10px',
          letterSpacing: '0.05em',
        }}
      >
        <FiDatabase size={12} />
        <span>Verified Live Database Query: {toolName}</span>
      </div>

      {/* 1. Today Sales Card */}
      {toolName === 'getTodaySales' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div style={{ background: 'var(--color-bg-card)', padding: '8px', borderRadius: '6px' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Today Revenue:</span>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-brand-secondary)' }}>
              {formatPKR(result.totalSalesPKR)}
            </div>
          </div>
          <div style={{ background: 'var(--color-bg-card)', padding: '8px', borderRadius: '6px' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Pending COD:</span>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-status-pending)' }}>
              {formatPKR(result.pendingCodPKR)}
            </div>
          </div>
        </div>
      )}

      {/* 2. Low Stock Card */}
      {toolName === 'getLowStockProducts' && result.items && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {result.items.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '6px 8px',
                background: 'rgba(239, 68, 68, 0.08)',
                borderRadius: '6px',
              }}
            >
              <strong>{item.title}</strong>
              <span style={{ color: 'var(--color-status-returned)', fontWeight: 600 }}>
                {item.currentStock} bache (Threshold: {item.threshold})
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 3. Orders By Status Mini Table */}
      {toolName === 'getOrdersByStatus' && result.orders && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {result.orders.map((o, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '6px 8px',
                background: 'var(--color-bg-card)',
                borderRadius: '6px',
              }}
            >
              <span><strong>{o.orderNumber}</strong> ({o.customerName} - {o.city})</span>
              <strong style={{ color: 'var(--color-brand-secondary)' }}>{formatPKR(o.totalAmountPKR)}</strong>
            </div>
          ))}
        </div>
      )}

      {/* 4. WhatsApp Draft Message */}
      {toolName === 'draftCustomerMessage' && result.draft && (
        <div style={{ background: 'var(--color-bg-card)', padding: '10px', borderRadius: '6px', position: 'relative' }}>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5, paddingRight: '24px' }}>
            {result.draft}
          </div>
          <button
            type="button"
            onClick={() => handleCopy(result.draft)}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'transparent',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
            }}
            title="Copy Message"
          >
            {copied ? <FiCheck size={14} color="var(--color-brand-secondary)" /> : <FiCopy size={14} />}
          </button>
        </div>
      )}
    </div>
  );
};

export default RichToolCard;
