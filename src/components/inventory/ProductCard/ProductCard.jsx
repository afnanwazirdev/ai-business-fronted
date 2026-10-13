import React from 'react';
import { FiBox, FiPlus, FiMinus, FiClock } from 'react-icons/fi';
import { formatPKR } from '../../../utils/formatters';
import Badge from '../../common/Badge/Badge';
import styles from './ProductCard.module.css';

export const ProductCard = ({
  product,
  viewMode = 'grid', // 'grid' | 'list'
  onStockChange,
  onViewHistory,
}) => {
  const isLowStock = product.totalStock <= product.lowStockThreshold;

  if (viewMode === 'list') {
    return (
      <div className={styles.cardList}>
        <div className={styles.listLeft}>
          <div className={styles.listThumb}>
            {product.images && product.images[0] ? (
              <img src={product.images[0]} alt={product.title} className={styles.productImg} />
            ) : (
              <FiBox />
            )}
          </div>
          <div>
            <div className={styles.category}>{product.category}</div>
            <h4 className={styles.title}>{product.title}</h4>
            {product.hasVariants && (
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                {product.variants?.length} variants
              </span>
            )}
          </div>
        </div>

        <div className={styles.listRight}>
          <div className={styles.price}>{formatPKR(product.basePrice)}</div>

          <div className={styles.stockCount}>
            <Badge
              variant={isLowStock ? 'returned' : 'success'}
              pulse={isLowStock}
              dot={isLowStock}
            >
              {isLowStock ? `Low: ${product.totalStock} bache hain` : `${product.totalStock} in stock`}
            </Badge>

            <div className={styles.stockControls}>
              <button
                type="button"
                className={styles.stockBtn}
                onClick={() => onStockChange && onStockChange(product, -1)}
                title="Decrease 1 piece"
              >
                <FiMinus size={12} />
              </button>
              <button
                type="button"
                className={styles.stockBtn}
                onClick={() => onStockChange && onStockChange(product, 1)}
                title="Add 1 piece"
              >
                <FiPlus size={12} />
              </button>
            </div>
          </div>

          <button
            type="button"
            className={styles.stockBtn}
            onClick={() => onViewHistory && onViewHistory(product)}
            title="View Stock Movement Audit"
          >
            <FiClock size={12} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cardGrid}>
      <div className={styles.imageArea}>
        {product.images && product.images[0] ? (
          <img src={product.images[0]} alt={product.title} className={styles.productImg} />
        ) : (
          <div className={styles.placeholderImg}><FiBox /></div>
        )}
        <div className={styles.badgeOverlay}>
          <Badge
            variant={isLowStock ? 'returned' : 'success'}
            pulse={isLowStock}
            dot={isLowStock}
          >
            {isLowStock ? `Kam Stock: ${product.totalStock}` : `${product.totalStock} in stock`}
          </Badge>
        </div>
      </div>

      <div className={styles.body}>
        <span className={styles.category}>{product.category}</span>
        <h4 className={styles.title}>{product.title}</h4>
        {product.hasVariants && (
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
            Variants: {product.variants?.map((v) => v.title).join(', ')}
          </span>
        )}

        <div className={styles.priceRow}>
          <div>
            <div className={styles.price}>{formatPKR(product.basePrice)}</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
              Cost: {formatPKR(product.baseCostPrice)}
            </div>
          </div>

          <div className={styles.stockControls}>
            <button
              type="button"
              className={styles.stockBtn}
              onClick={() => onStockChange && onStockChange(product, -1)}
              title="Minus 1 piece"
            >
              <FiMinus size={12} />
            </button>
            <span style={{ fontSize: '12px', fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>
              {product.totalStock}
            </span>
            <button
              type="button"
              className={styles.stockBtn}
              onClick={() => onStockChange && onStockChange(product, 1)}
              title="Add 1 piece"
            >
              <FiPlus size={12} />
            </button>
            <button
              type="button"
              className={styles.stockBtn}
              onClick={() => onViewHistory && onViewHistory(product)}
              title="View stock history log"
              style={{ marginLeft: '4px' }}
            >
              <FiClock size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
