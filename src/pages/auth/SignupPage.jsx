import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiShoppingBag, FiMail, FiPhone, FiLock, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import AuthLayout from '../../layouts/AuthLayout';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Select from '../../components/common/Select/Select';

export const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    storeName: '',
    email: '',
    phone: '',
    city: 'Karachi',
    businessType: 'clothing',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Full name is required';
    if (!formData.storeName) newErrors.storeName = 'Store name is required';
    if (!formData.email) newErrors.email = 'Email address is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required (03XX-XXXXXXX)';
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      toast.success('Mubarak ho!', 'Account created successfully.');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Signup Failed', err.message || 'Unable to register account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '6px' }}>
          KarobarAI par Naya Account Banayein
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
          Instagram, Daraz aur WhatsApp sellers ke liye 14-day free trial.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Input
            label="Aapka Naam"
            name="name"
            placeholder="e.g. Ayesha Khan"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            prefix={<FiUser />}
            required
          />
          <Input
            label="Dukaan / Brand Name"
            name="storeName"
            placeholder="e.g. Ayesha Closet"
            value={formData.storeName}
            onChange={handleChange}
            error={errors.storeName}
            prefix={<FiShoppingBag />}
            required
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="e.g. seller@karobar.pk"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          prefix={<FiMail />}
          required
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
          <Input
            label="WhatsApp / Mobile"
            name="phone"
            placeholder="03001234567"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            prefix={<FiPhone />}
            required
          />
          <Select
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            options={[
              { value: 'Karachi', label: 'Karachi' },
              { value: 'Lahore', label: 'Lahore' },
              { value: 'Islamabad', label: 'Islamabad' },
              { value: 'Rawalpindi', label: 'Rawalpindi' },
              { value: 'Faisalabad', label: 'Faisalabad' },
              { value: 'Multan', label: 'Multan' },
              { value: 'Peshawar', label: 'Peshawar' },
            ]}
          />
        </div>

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="At least 6 characters"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          prefix={<FiLock />}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          iconRight={<FiArrowRight />}
          style={{ width: '100%', marginTop: '6px' }}
        >
          Create Seller Account
        </Button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
        Pehle se account hai?{' '}
        <Link to="/login" style={{ color: 'var(--color-brand-primary)', fontWeight: 600 }}>
          Login Karein
        </Link>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;
