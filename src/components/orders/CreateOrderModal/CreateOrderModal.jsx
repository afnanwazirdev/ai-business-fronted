import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { FiUser, FiPhone, FiMapPin, FiShoppingBag, FiTruck, FiPlus, FiTrash2, FiCheck } from 'react-icons/fi';
import Modal from '../../common/Modal/Modal';
import Button from '../../common/Button/Button';
import Input from '../../common/Input/Input';
import Select from '../../common/Select/Select';
import productService from '../../../services/productService';
import { formatPKR } from '../../../utils/formatters';

export const CreateOrderModal = ({ isOpen, onClose, onCreated }) => {
  const [step, setStep] = useState(1); // 1: Customer -> 2: Items -> 3: Shipping/Review
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    city: 'Karachi',
    address: '',
    whatsapp: '',
  });

  const [selectedItems, setSelectedItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    productId: '',
    variantId: '',
    quantity: 1,
  });

  const [deliveryCharges, setDeliveryCharges] = useState(200);
  const [discount, setDiscount] = useState(0);
  const [salesChannel, setSalesChannel] = useState('instagram');
  const [courier, setCourier] = useState('trax');
  const [notes, setNotes] = useState('');

  // Load products for dropdown
  useEffect(() => {
    if (isOpen) {
      const loadProds = async () => {
        try {
          const res = await productService.getProducts();
          setProductsList(res.products || []);
        } catch {
          setProductsList([
            { _id: 'p1', title: 'Premium Velvet Embroidered Shawl', basePrice: 5800, totalStock: 3 },
            { _id: 'p2', title: 'Oversized Fleece Winter Hoodie', basePrice: 3200, totalStock: 28 },
            { _id: 'p3', title: 'Pure Organic Rose Water Mist (200ml)', basePrice: 1450, totalStock: 42 },
          ]);
        }
      };
      loadProds();
    }
  }, [isOpen]);

  const handleAddItem = () => {
    if (!currentItem.productId) return;
    const prod = productsList.find((p) => p._id === currentItem.productId);
    if (!prod) return;

    let variantTitle = '';
    let unitPrice = prod.basePrice;

    if (currentItem.variantId && prod.variants?.length) {
      const v = prod.variants.find((v) => v._id === currentItem.variantId);
      if (v) {
        variantTitle = v.title;
        unitPrice = v.price;
      }
    }

    const qty = Number(currentItem.quantity) || 1;
    setSelectedItems((prev) => [
      ...prev,
      {
        product: prod._id,
        variantId: currentItem.variantId || undefined,
        productTitle: prod.title,
        variantTitle,
        unitPrice,
        quantity: qty,
        totalPrice: unitPrice * qty,
      },
    ]);

    setCurrentItem({ productId: '', variantId: '', quantity: 1 });
  };

  const handleRemoveItem = (index) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = selectedItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalAmount = Math.max(0, subtotal + Number(deliveryCharges) - Number(discount));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        customer,
        items: selectedItems,
        deliveryCharges: Number(deliveryCharges),
        discount: Number(discount),
        paymentMethod: 'cod',
        salesChannel,
        courier: { name: courier },
        notes,
      };

      if (onCreated) {
        await onCreated(payload);
      }

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }

      onClose();
    } finally {
      setLoading(false);
    }
  };

  const selectedProduct = productsList.find((p) => p._id === currentItem.productId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Naya Order Banayein (Create Order)"
      size="lg"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          {step > 1 ? (
            <Button variant="ghost" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          ) : (
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          )}

          {step < 3 ? (
            <Button
              variant="primary"
              onClick={() => {
                if (step === 1 && (!customer.name || !customer.phone || !customer.address)) return;
                if (step === 2 && selectedItems.length === 0) return;
                setStep(step + 1);
              }}
              disabled={
                (step === 1 && (!customer.name || !customer.phone || !customer.address)) ||
                (step === 2 && selectedItems.length === 0)
              }
            >
              Continue ➔
            </Button>
          ) : (
            <Button variant="emerald" loading={loading} onClick={handleSubmit} iconLeft={<FiCheck />}>
              Create Order ({formatPKR(totalAmount)} COD)
            </Button>
          )}
        </div>
      }
    >
      {/* Step Indicator */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[
          { num: 1, title: '1. Customer Info' },
          { num: 2, title: '2. Select Items' },
          { num: 3, title: '3. Shipping & COD' },
        ].map((s) => (
          <div
            key={s.num}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '6px',
              background: step === s.num ? 'var(--color-brand-primary-subtle)' : 'var(--color-bg-elevated)',
              border: step === s.num ? '1px solid var(--color-brand-primary)' : '1px solid var(--color-border-subtle)',
              color: step === s.num ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
              fontSize: '12px',
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            {s.title}
          </div>
        ))}
      </div>

      {/* STEP 1: Customer Details */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input
              label="Customer Full Name (Gahak ka Naam)"
              placeholder="e.g. Zainab Fatima"
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              prefix={<FiUser />}
              required
            />
            <Input
              label="Phone Number (03XX-XXXXXXX)"
              placeholder="03218765432"
              value={customer.phone}
              onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
              prefix={<FiPhone />}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
            <Select
              label="City"
              value={customer.city}
              onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
              options={[
                { value: 'Karachi', label: 'Karachi' },
                { value: 'Lahore', label: 'Lahore' },
                { value: 'Islamabad', label: 'Islamabad' },
                { value: 'Rawalpindi', label: 'Rawalpindi' },
                { value: 'Faisalabad', label: 'Faisalabad' },
                { value: 'Multan', label: 'Multan' },
                { value: 'Peshawar', label: 'Peshawar' },
                { value: 'Sialkot', label: 'Sialkot' },
                { value: 'Gujranwala', label: 'Gujranwala' },
                { value: 'Quetta', label: 'Quetta' },
              ]}
              required
            />
            <Input
              label="Delivery Address (Ghar / Street ka Pata)"
              placeholder="e.g. House 42, Block D, Model Town"
              value={customer.address}
              onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
              prefix={<FiMapPin />}
              required
            />
          </div>
        </div>
      )}

      {/* STEP 2: Items Selection */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: 'var(--color-bg-elevated)', padding: '12px', borderRadius: '8px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
              Product Shamil Karein
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 80px auto', gap: '8px', alignItems: 'flex-end' }}>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Select Product
                </label>
                <select
                  value={currentItem.productId}
                  onChange={(e) => setCurrentItem({ ...currentItem, productId: e.target.value, variantId: '' })}
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '0 8px',
                    background: 'var(--color-bg-input)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: '6px',
                    color: 'var(--color-text-primary)',
                    fontSize: '13px',
                  }}
                >
                  <option value="">Choose product...</option>
                  {productsList.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.title} — {formatPKR(p.basePrice)} ({p.totalStock} in stock)
                    </option>
                  ))}
                </select>
              </div>

              {selectedProduct?.hasVariants && (
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Variant
                  </label>
                  <select
                    value={currentItem.variantId}
                    onChange={(e) => setCurrentItem({ ...currentItem, variantId: e.target.value })}
                    style={{
                      width: '100%',
                      height: '38px',
                      padding: '0 8px',
                      background: 'var(--color-bg-input)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: '6px',
                      color: 'var(--color-text-primary)',
                      fontSize: '13px',
                    }}
                  >
                    <option value="">Default</option>
                    {selectedProduct.variants?.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.title} ({formatPKR(v.price)})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Qty
                </label>
                <input
                  type="number"
                  min="1"
                  value={currentItem.quantity}
                  onChange={(e) => setCurrentItem({ ...currentItem, quantity: e.target.value })}
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '0 8px',
                    background: 'var(--color-bg-input)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: '6px',
                    color: 'var(--color-text-primary)',
                    fontSize: '13px',
                  }}
                />
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={handleAddItem}
                disabled={!currentItem.productId}
                iconLeft={<FiPlus />}
              >
                Add
              </Button>
            </div>
          </div>

          {/* List of Added Items */}
          {selectedItems.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>
              Koi item shamil nahi kiya gaya. Upar se product select karke "Add" karein.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedItems.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: 'var(--color-bg-card)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: '8px',
                    fontSize: '13px',
                  }}
                >
                  <div>
                    <strong>{item.productTitle}</strong>
                    {item.variantTitle && (
                      <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginLeft: '6px' }}>
                        ({item.variantTitle})
                      </span>
                    )}
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      {item.quantity} × {formatPKR(item.unitPrice)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontWeight: 600 }}>{formatPKR(item.totalPrice)}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      style={{ color: 'var(--color-status-returned)' }}
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              <div style={{ textAlign: 'right', fontWeight: 600, fontSize: '14px', paddingTop: '8px' }}>
                Subtotal: {formatPKR(subtotal)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 3: Shipping & COD Review */}
      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input
              label="Delivery Charges (PKR)"
              type="number"
              value={deliveryCharges}
              onChange={(e) => setDeliveryCharges(e.target.value)}
              prefix="Rs"
            />
            <Input
              label="Discount (PKR)"
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              prefix="Rs"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Select
              label="Sales Channel"
              value={salesChannel}
              onChange={(e) => setSalesChannel(e.target.value)}
              options={[
                { value: 'instagram', label: 'Instagram DM' },
                { value: 'whatsapp', label: 'WhatsApp' },
                { value: 'facebook', label: 'Facebook Page' },
                { value: 'daraz', label: 'Daraz' },
                { value: 'website', label: 'Website' },
              ]}
            />
            <Select
              label="Courier"
              value={courier}
              onChange={(e) => setCourier(e.target.value)}
              options={[
                { value: 'trax', label: 'Trax Logistics' },
                { value: 'tcs', label: 'TCS Express' },
                { value: 'leopards', label: 'Leopards Courier' },
                { value: 'postex', label: 'PostEx' },
                { value: 'manual', label: 'Rider / Manual' },
              ]}
            />
          </div>

          {/* Final Summary Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(16, 185, 129, 0.08))',
              border: '1px solid var(--color-brand-primary-border)',
              borderRadius: '10px',
              padding: '16px',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-brand-primary)', marginBottom: '8px' }}>
              Final COD Hisaab Summary
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
              <span>Customer:</span>
              <strong>{customer.name} ({customer.city})</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
              <span>Items:</span>
              <span>{selectedItems.length} items ({formatPKR(subtotal)})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
              <span>Delivery:</span>
              <span>{formatPKR(deliveryCharges)}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '16px',
                fontWeight: 700,
                color: 'var(--color-brand-secondary)',
                borderTop: '1px solid var(--color-border-subtle)',
                paddingTop: '8px',
                marginTop: '6px',
              }}
            >
              <span>Cash on Delivery Amount:</span>
              <span>{formatPKR(totalAmount)}</span>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default CreateOrderModal;
