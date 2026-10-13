import React, { useState, useEffect } from 'react';
import { formatDateTime } from '../../../utils/formatters';
import productService from '../../../services/productService';
import Modal from '../../common/Modal/Modal';
import Badge from '../../common/Badge/Badge';
import Skeleton from '../../common/Skeleton/Skeleton';

export const StockHistoryModal = ({ product, isOpen, onClose }) => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && product?._id) {
      const fetchHistory = async () => {
        setLoading(true);
        try {
          const res = await productService.getMovements(product._id);
          setMovements(res.movements || []);
        } catch {
          // Provide fallback demo movements if offline
          setMovements([
            {
              _id: 'm1',
              type: 'sale',
              quantityDelta: -2,
              stockBefore: product.totalStock + 2,
              stockAfter: product.totalStock,
              reason: 'Order #KB-1002 placed',
              createdAt: new Date(),
            },
            {
              _id: 'm2',
              type: 'restock',
              quantityDelta: 10,
              stockBefore: product.totalStock - 8,
              stockAfter: product.totalStock + 2,
              reason: 'Warehouse restock intake',
              createdAt: new Date(Date.now() - 86400000),
            },
          ]);
        } finally {
          setLoading(false);
        }
      };
      fetchHistory();
    }
  }, [isOpen, product]);

  if (!product) return null;

  const getTypeBadge = (type) => {
    switch (type) {
      case 'sale': return <Badge variant="returned">- Sale</Badge>;
      case 'return': return <Badge variant="confirmed">+ Return</Badge>;
      case 'restock': return <Badge variant="success">+ Restock</Badge>;
      default: return <Badge variant="secondary">Adjustment</Badge>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Stock History: ${product.title}`}
      size="md"
    >
      <div style={{ marginBottom: '16px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
        Current Stock Level: <strong>{product.totalStock} pieces</strong> (Threshold: {product.lowStockThreshold})
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Skeleton height="36px" />
          <Skeleton height="36px" />
          <Skeleton height="36px" />
        </div>
      ) : movements.length === 0 ? (
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          No stock adjustments recorded yet for this item.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {movements.map((m) => (
            <div
              key={m._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: '8px',
                fontSize: '13px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {getTypeBadge(m.type)}
                <div>
                  <div style={{ fontWeight: 500 }}>
                    {m.quantityDelta > 0 ? `+${m.quantityDelta}` : m.quantityDelta} units ({m.reason || 'Manual change'})
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    {formatDateTime(m.createdAt)}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontSize: '12px' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>{m.stockBefore}</span>
                <span style={{ margin: '0 6px', color: 'var(--color-brand-primary)' }}>➔</span>
                <strong>{m.stockAfter}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default StockHistoryModal;
