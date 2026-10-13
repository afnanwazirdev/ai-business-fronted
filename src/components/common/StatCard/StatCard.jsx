import React, { useRef, useEffect } from 'react';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';
import { countUp } from '../../../animations/countUp';
import styles from './StatCard.module.css';

export const StatCard = ({
  title,
  value,
  rawNumber,
  prefix = '',
  suffix = '',
  trend = 0, // e.g. +14.2
  trendLabel = 'vs yesterday',
  icon,
  iconVariant = 'primary', // 'primary' | 'secondary' | 'warning' | 'danger'
  sparklineData = [10, 15, 12, 18, 24, 20, 28],
  className = '',
}) => {
  const valueRef = useRef(null);

  useEffect(() => {
    if (rawNumber !== undefined && valueRef.current) {
      countUp(valueRef.current, rawNumber, { prefix, suffix });
    }
  }, [rawNumber, prefix, suffix]);

  // Generate SVG sparkline path
  const min = Math.min(...sparklineData);
  const max = Math.max(...sparklineData);
  const range = max - min || 1;
  const width = 72;
  const height = 24;
  const points = sparklineData.map((d, i) => {
    const x = (i / (sparklineData.length - 1)) * width;
    const y = height - ((d - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });
  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

  const strokeColor =
    trend > 0 ? 'var(--color-brand-secondary)' : trend < 0 ? 'var(--color-status-returned)' : 'var(--color-brand-primary)';

  return (
    <div className={`${styles.statCard} ${className}`}>
      <div className={styles.topRow}>
        <span className={styles.title}>{title}</span>
        {icon && (
          <div className={`${styles.iconWrapper} ${styles[`icon${iconVariant.charAt(0).toUpperCase() + iconVariant.slice(1)}`]}`}>
            {icon}
          </div>
        )}
      </div>

      <div className={styles.valueRow}>
        <div ref={valueRef} className={styles.value}>
          {value || `${prefix}${rawNumber ?? 0}${suffix}`}
        </div>

        {sparklineData && sparklineData.length > 1 && (
          <svg className={styles.sparklineSvg} viewBox={`0 0 ${width} ${height}`}>
            <path d={areaD} fill={strokeColor} className={styles.sparklineArea} />
            <path d={pathD} stroke={strokeColor} className={styles.sparklinePath} />
          </svg>
        )}
      </div>

      <div className={styles.topRow}>
        {trend !== 0 && (
          <span
            className={`
              ${styles.trendBadge}
              ${trend > 0 ? styles.trendUp : trend < 0 ? styles.trendDown : styles.trendNeutral}
            `}
          >
            {trend > 0 ? <FiTrendingUp size={12} /> : trend < 0 ? <FiTrendingDown size={12} /> : <FiMinus size={12} />}
            {trend > 0 ? `+${trend}%` : `${trend}%`}
          </span>
        )}
        <span className={styles.subtext}>{trendLabel}</span>
      </div>
    </div>
  );
};

export default StatCard;
