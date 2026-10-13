import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiUploadCloud } from 'react-icons/fi';
import Modal from '../../common/Modal/Modal';
import Button from '../../common/Button/Button';
import Input from '../../common/Input/Input';
import Select from '../../common/Select/Select';

export const CreateProductModal = ({ isOpen, onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Clothing',
    basePrice: '',
    baseCostPrice: '',
    totalStock: '',
    lowStockThreshold: '5',
    hasVariants: false,
    variants: [],
  });
  const [loading, setLoading] = useState(false);
  const [newVariant, setNewVariant] = useState({ title: '', price: '', stock: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const addVariant = () => {
    if (!newVariant.title || !newVariant.price || !newVariant.stock) return;
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { ...newVariant, price: Number(newVariant.price), stock: Number(newVariant.stock) }],
    }));
    setNewVariant({ title: '', price: '', stock: '' });
  };

  const removeVariant = (idx) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.basePrice) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        basePrice: Number(formData.basePrice),
        baseCostPrice: Number(formData.baseCostPrice) || 0,
        totalStock: formData.hasVariants
          ? formData.variants.reduce((sum, v) => sum + v.stock, 0)
          : Number(formData.totalStock) || 0,
        lowStockThreshold: Number(formData.lowStockThreshold) || 5,
      };

      if (onCreated) {
        await onCreated(payload);
      }
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Naya Product Shamil Karein (Add Product)"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit}>
            Save Product
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <Input
          label="Product Title"
          name="title"
          placeholder="e.g. Velvet Embroidered Shawl, Winter Fleece Hoodie"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={[
              { value: 'Clothing', label: 'Clothing & Apparel' },
              { value: 'Shawls', label: 'Shawls & Wraps' },
              { value: 'Hoodies', label: 'Hoodies & Sweatshirts' },
              { value: 'Skincare', label: 'Skincare & Beauty' },
              { value: 'Jewelry', label: 'Jewelry & Accessories' },
              { value: 'Shoes', label: 'Shoes & Footwear' },
            ]}
          />

          <Input
            label="Selling Price (PKR)"
            type="number"
            name="basePrice"
            placeholder="e.g. 2800"
            prefix="Rs"
            value={formData.basePrice}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <Input
            label="Cost Price (PKR)"
            type="number"
            name="baseCostPrice"
            placeholder="e.g. 1500"
            prefix="Rs"
            value={formData.baseCostPrice}
            onChange={handleChange}
            hint="For profit calculation"
          />

          {!formData.hasVariants && (
            <Input
              label="Current Stock Count"
              type="number"
              name="totalStock"
              placeholder="e.g. 25"
              value={formData.totalStock}
              onChange={handleChange}
              required
            />
          )}

          <Input
            label="Low-Stock Alert Level"
            type="number"
            name="lowStockThreshold"
            placeholder="e.g. 5"
            value={formData.lowStockThreshold}
            onChange={handleChange}
            hint="Alert jab isse kam ho"
          />
        </div>

        {/* Variants Toggle */}
        <div style={{ padding: '12px', background: 'var(--color-bg-elevated)', borderRadius: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>
            <input
              type="checkbox"
              name="hasVariants"
              checked={formData.hasVariants}
              onChange={handleChange}
            />
            <span>Is product ke multiple variants hain (Size, Color)?</span>
          </label>

          {formData.hasVariants && (
            <div style={{ marginTop: '12px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  placeholder="Variant name (e.g. Black / M)"
                  value={newVariant.title}
                  onChange={(e) => setNewVariant({ ...newVariant, title: e.target.value })}
                  style={{ flex: 2, padding: '8px', background: 'var(--color-bg-input)', border: '1px solid var(--color-border-default)', borderRadius: '6px', color: 'var(--color-text-primary)' }}
                />
                <input
                  type="number"
                  placeholder="Price (Rs)"
                  value={newVariant.price}
                  onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
                  style={{ flex: 1, padding: '8px', background: 'var(--color-bg-input)', border: '1px solid var(--color-border-default)', borderRadius: '6px', color: 'var(--color-text-primary)' }}
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={newVariant.stock}
                  onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })}
                  style={{ flex: 1, padding: '8px', background: 'var(--color-bg-input)', border: '1px solid var(--color-border-default)', borderRadius: '6px', color: 'var(--color-text-primary)' }}
                />
                <Button type="button" variant="secondary" size="sm" onClick={addVariant} iconLeft={<FiPlus />}>
                  Add
                </Button>
              </div>

              {formData.variants.map((v, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 12px',
                    background: 'var(--color-bg-card)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: '6px',
                    fontSize: '13px',
                    marginTop: '4px',
                  }}
                >
                  <span><strong>{v.title}</strong> — Rs {v.price} ({v.stock} in stock)</span>
                  <button type="button" onClick={() => removeVariant(idx)} style={{ color: 'var(--color-status-returned)' }}>
                    <FiTrash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default CreateProductModal;
