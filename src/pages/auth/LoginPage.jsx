import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import AuthLayout from '../../layouts/AuthLayout';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleDemoFill = () => {
    setEmail('ayesha@karobar.pk');
    setPassword('password123');
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email) newErrors.email = 'Email address is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!', 'Successfully signed in to KarobarAI');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Login Failed', err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
          Apne account mein login karein
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
          Apne orders, stock aur COD cash ko track karein.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Input
          label="Email Address"
          type="email"
          placeholder="e.g. ayesha@karobar.pk"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: '' })); }}
          error={errors.email}
          prefix={<FiMail />}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setErrors((prev) => ({ ...prev, password: '' })); }}
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
          style={{ width: '100%', marginTop: '8px' }}
        >
          Sign In to KarobarAI
        </Button>

        {/* 1-Click Demo Fill for easy testing */}
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={handleDemoFill}
          style={{ width: '100%' }}
        >
          Fill Demo Account (Ayesha Closet PK)
        </Button>
      </form>

      <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
        Naye seller hain?{' '}
        <Link to="/signup" style={{ color: 'var(--color-brand-primary)', fontWeight: 600 }}>
          Naya Account Banayein (Sign Up)
        </Link>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
