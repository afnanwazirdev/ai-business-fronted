import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheck, FiArrowRight, FiZap } from 'react-icons/fi';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';
import { formatPKR } from '../../utils/formatters';

export const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const isYearly = billingCycle === 'yearly';

  const plans = [
    {
      id: 'starter',
      name: 'Starter Plan',
      tag: 'Naye Online Sellers ke liye',
      monthlyPrice: 1499,
      yearlyPrice: 1199,
      features: [
        'Up to 150 Orders / month',
        'Unlimited Product Inventory & Variants',
        '5-Stage COD Pipeline',
        'One-Click WhatsApp Confirmation Links',
        'Basic AI Munshi Queries (50 msgs/mo)',
        'Email Support',
      ],
      highlight: false,
    },
    {
      id: 'growth',
      name: 'Growth Plan',
      tag: 'Instagram & Daraz Sellers (Most Popular)',
      monthlyPrice: 3499,
      yearlyPrice: 2799,
      features: [
        'Up to 1,000 Orders / month',
        'Trax, TCS, Leopards & PostEx Integrations',
        'Full Claude AI Assistant (Unlimited Urdu/English)',
        'Low Stock Pulse Alerts & History Audit',
        'Repeat Customer & Return Risk Scoring',
        'City-wise Analytics & CSV Export',
        'Priority 24/7 WhatsApp Support',
      ],
      highlight: true,
    },
    {
      id: 'scale',
      name: 'Scale Plan',
      tag: 'High-Volume Pakistani Brands',
      monthlyPrice: 7999,
      yearlyPrice: 6399,
      features: [
        'Unlimited Orders & Stock',
        'Multi-User Team Members & Roles',
        'Dedicated Cloudflare / Couriers Auto-Booking',
        'Custom Claude Assistant Fine-Tuning',
        'Automated Return SMS Triggers',
        'Custom Courier Slips Printing',
        'Dedicated Account Manager in Pakistan',
      ],
      highlight: false,
    },
  ];

  return (
    <div style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--color-brand-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Transparant PKR Pricing
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-family-display)',
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            marginTop: '8px',
            marginBottom: '16px',
          }}
        >
          Apne Karobar Ke Mutabiq Plan Chunein
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '580px', margin: '0 auto', fontSize: '15px' }}>
          Har plan mein 14 din ka free trial shamil hai. Kisi credit card ya advance payment ki zaroorat nahi.
        </p>

        {/* Monthly / Yearly Toggle */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-default)',
            padding: '4px',
            borderRadius: '30px',
            marginTop: '28px',
            gap: '4px',
          }}
        >
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            style={{
              padding: '8px 20px',
              borderRadius: '24px',
              border: 'none',
              background: !isYearly ? 'var(--color-brand-primary)' : 'transparent',
              color: !isYearly ? '#fff' : 'var(--color-text-secondary)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            style={{
              padding: '8px 20px',
              borderRadius: '24px',
              border: 'none',
              background: isYearly ? 'var(--color-brand-primary)' : 'transparent',
              color: isYearly ? '#fff' : 'var(--color-text-secondary)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>Annual (Save 20%)</span>
            <span
              style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '10px',
                background: 'var(--color-brand-secondary)',
                color: '#fff',
              }}
            >
              2 Months Free
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          alignItems: 'stretch',
        }}
      >
        {plans.map((p) => {
          const price = isYearly ? p.yearlyPrice : p.monthlyPrice;
          return (
            <div
              key={p.id}
              style={{
                background: 'var(--color-bg-card)',
                borderRadius: '16px',
                border: p.highlight
                  ? '2px solid var(--color-brand-primary)'
                  : '1px solid var(--color-border-subtle)',
                boxShadow: p.highlight ? 'var(--shadow-glow), var(--shadow-lg)' : 'var(--shadow-sm)',
                padding: '36px 28px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transform: p.highlight ? 'scale(1.02)' : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              {p.highlight && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--color-brand-primary)',
                    color: '#fff',
                    padding: '4px 14px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  Most Popular in Pakistan 🇵🇰
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 800 }}>{p.name}</h3>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  {p.tag}
                </p>
              </div>

              <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-family-display)',
                    fontSize: '36px',
                    fontWeight: 800,
                    color: 'var(--color-brand-secondary)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {formatPKR(price)}
                </span>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
                  / month
                </span>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                {p.features.map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px' }}>
                    <FiCheck
                      size={16}
                      style={{ color: 'var(--color-brand-secondary)', marginTop: '2px', flexShrink: 0 }}
                    />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <Link to="/signup" style={{ width: '100%' }}>
                <Button
                  variant={p.highlight ? 'primary' : 'secondary'}
                  size="lg"
                  style={{ width: '100%' }}
                  iconRight={<FiArrowRight />}
                >
                  Start 14-Day Free Trial
                </Button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PricingPage;
