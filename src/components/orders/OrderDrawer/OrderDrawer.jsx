import React, { useState } from 'react';
import {
  FiUser,
  FiPhone,
  FiMapPin,
  FiShoppingBag,
  FiTruck,
  FiCheckCircle,
  FiSend,
  FiClock,
  FiExternalLink,
} from 'react-icons/fi';
import { formatPKR, formatDateTime, formatPKPhone } from '../../../utils/formatters';
import { generateWhatsAppLink } from '../../../utils/whatsapp';
import Drawer from '../../common/Drawer/Drawer';
import Button from '../../common/Button/Button';
import Badge from '../../common/Badge/Badge';

export const OrderDrawer = ({
  order,
  isOpen,
  onClose,
  onStatusChange,
}) => {
  const [courierName, setCourierName] = useState('trax');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!order) return null;

  const handleAdvanceStatus = async (nextStatus) => {
    setIsUpdating(true);
    try {
      if (onStatusChange) {
        await onStatusChange(order._id, nextStatus, {
          name: courierName || order.courier?.name,
          trackingNumber: trackingNumber || order.courier?.trackingNumber,
        });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const whatsappConfirmationUrl = generateWhatsAppLink(order, 'confirmation', 'Ayesha Closet PK');
  const whatsappDispatchedUrl = generateWhatsAppLink(order, 'dispatched', 'Ayesha Closet PK');

  const pipelineStages = ['pending', 'confirmed', 'dispatched', 'delivered'];
  const currentIndex = pipelineStages.indexOf(order.status);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Order ${order.orderNumber}`}
      size="md"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Status Pipeline Visual Indicator */}
        <div style={{ background: 'var(--color-bg-elevated)', padding: '14px', borderRadius: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
              Order Pipeline Status
            </span>
            <Badge variant={order.status}>{order.status.toUpperCase()}</Badge>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {pipelineStages.map((st, idx) => {
              const isPassed = currentIndex >= idx;
              const isCurrent = order.status === st;
              return (
                <div key={st} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div
                    style={{
                      height: '4px',
                      borderRadius: '2px',
                      background: isPassed
                        ? 'var(--color-brand-primary)'
                        : 'var(--color-border-default)',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '10px',
                      textTransform: 'capitalize',
                      color: isCurrent
                        ? 'var(--color-brand-primary)'
                        : isPassed
                        ? 'var(--color-text-primary)'
                        : 'var(--color-text-muted)',
                      fontWeight: isCurrent ? 700 : 400,
                    }}
                  >
                    {st}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Action Buttons for Status Advancement */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {order.status === 'pending' && (
            <Button
              variant="primary"
              size="sm"
              loading={isUpdating}
              iconLeft={<FiCheckCircle />}
              onClick={() => handleAdvanceStatus('confirmed')}
            >
              Confirm Order
            </Button>
          )}

          {order.status === 'confirmed' && (
            <Button
              variant="primary"
              size="sm"
              loading={isUpdating}
              iconLeft={<FiTruck />}
              onClick={() => handleAdvanceStatus('dispatched')}
            >
              Mark Dispatched
            </Button>
          )}

          {order.status === 'dispatched' && (
            <Button
              variant="emerald"
              size="sm"
              loading={isUpdating}
              iconLeft={<FiCheckCircle />}
              onClick={() => handleAdvanceStatus('delivered')}
            >
              Mark Delivered (COD Collected)
            </Button>
          )}

          {order.status !== 'returned' && order.status !== 'cancelled' && (
            <Button
              variant="danger"
              size="sm"
              loading={isUpdating}
              onClick={() => handleAdvanceStatus('returned')}
            >
              Mark Returned
            </Button>
          )}
        </div>

        {/* WhatsApp 1-Click Message Action Button */}
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '10px',
            padding: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--color-brand-secondary)' }}>
              WhatsApp Customer Link
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              Pre-filled Roman Urdu message with COD total & items
            </div>
          </div>

          <a
            href={order.status === 'dispatched' ? whatsappDispatchedUrl : whatsappConfirmationUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              background: '#25D366',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <FiSend size={14} />
            Send WhatsApp
          </a>
        </div>

        {/* Customer Information Card */}
        <div style={{ border: '1px solid var(--color-border-subtle)', borderRadius: '10px', padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
              Customer Details
            </span>
            {order.customer?.isRepeat && (
              <Badge variant="primary">Repeat Gahak 🌟</Badge>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiUser style={{ color: 'var(--color-text-muted)' }} />
              <strong>{order.customerSnapshot?.name}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiPhone style={{ color: 'var(--color-text-muted)' }} />
              <span>{formatPKPhone(order.customerSnapshot?.phone)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <FiMapPin style={{ color: 'var(--color-text-muted)', marginTop: '3px' }} />
              <span>{order.customerSnapshot?.address}, <strong>{order.customerSnapshot?.city}</strong></span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div style={{ border: '1px solid var(--color-border-subtle)', borderRadius: '10px', padding: '14px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '10px' }}>
            Order Items (Maal)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(order.items || []).map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{item.productTitle}</div>
                  {item.variantTitle && (
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      Variant: {item.variantTitle}
                    </div>
                  )}
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                    {item.quantity} × {formatPKR(item.unitPrice)}
                  </div>
                </div>
                <div style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {formatPKR(item.totalPrice)}
                </div>
              </div>
            ))}

            <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '10px', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                <span>Subtotal</span>
                <span>{formatPKR(order.subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                <span>Delivery Charges</span>
                <span>{formatPKR(order.deliveryCharges)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '15px', color: 'var(--color-brand-secondary)', paddingTop: '4px' }}>
                <span>Cash on Delivery (COD Total)</span>
                <span>{formatPKR(order.codAmount || order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Courier Details */}
        <div style={{ border: '1px solid var(--color-border-subtle)', borderRadius: '10px', padding: '14px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '10px' }}>
            Courier Information (TCS / PostEx / Leopards / Trax)
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Courier:</span>
              <div style={{ fontWeight: 600, textTransform: 'uppercase' }}>
                {order.courier?.name || 'Manual'}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Tracking #:</span>
              <div style={{ fontWeight: 600 }}>
                {order.courier?.trackingNumber || 'Not booked yet'}
              </div>
            </div>
          </div>
        </div>

        {/* Status History Audit Trail */}
        {order.statusHistory?.length > 0 && (
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Status History Timeline
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {order.statusHistory.map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  <FiClock size={12} />
                  <span>
                    <strong>{h.status.toUpperCase()}</strong>: {h.note || 'Updated'} — {formatDateTime(h.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default OrderDrawer;
