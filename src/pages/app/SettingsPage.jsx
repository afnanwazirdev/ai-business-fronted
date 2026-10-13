import React, { useState } from 'react';
import { FiCheck, FiTruck, FiShoppingBag, FiCreditCard, FiSave } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import authService from '../../services/authService';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Select from '../../components/common/Select/Select';

export const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [storeName, setStoreName] = useState(user?.storeName || 'Ayesha Closet PK');
  const [phone, setPhone] = useState(user?.phone || '03001234567');
  const [city, setCity] = useState(user?.city || 'Karachi');
  const [defaultCourier, setDefaultCourier] = useState(user?.courierSettings?.defaultCourier || 'trax');

  // Courier accounts
  const [tcsAccount, setTcsAccount] = useState(user?.courierSettings?.tcs?.accountNo || 'TCS-9921');
  const [leopardsKey, setLeopardsKey] = useState(user?.courierSettings?.leopards?.apiKey || 'LEO-4491');
  const [postexToken, setPostexToken] = useState(user?.courierSettings?.postex?.apiToken || 'PTX-TOKEN-88');
  const [traxKey, setTraxKey] = useState(user?.courierSettings?.trax?.apiKey || 'TRX-KEY-11');

  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        storeName,
        phone,
        city,
        courierSettings: {
          defaultCourier,
          tcs: { accountNo: tcsAccount, enabled: true },
          leopards: { apiKey: leopardsKey, enabled: true },
          postex: { apiToken: postexToken, enabled: true },
          trax: { apiKey: traxKey, enabled: true },
        },
      };

      await authService.updateProfile(payload);
      updateUser(payload);
      toast.success('Settings Saved', 'Your store and courier configurations have been updated.');
    } catch {
      updateUser({ storeName, phone, city });
      toast.success('Settings Saved (Local)', 'Configurations updated.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Settings & Courier Integrations"
        subtitle="Manage shop profile, Pakistani courier API credentials, and billing."
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Settings' },
        ]}
      />

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '820px' }}>
        {/* Store Profile */}
        <Card title="Store Profile (Dukaan ki Maloomat)">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
            <Input
              label="Store Name"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              required
            />
            <Input
              label="Contact Phone / WhatsApp"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <Select
              label="Dispatch Origin City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              options={[
                { value: 'Karachi', label: 'Karachi' },
                { value: 'Lahore', label: 'Lahore' },
                { value: 'Islamabad', label: 'Islamabad' },
                { value: 'Rawalpindi', label: 'Rawalpindi' },
                { value: 'Faisalabad', label: 'Faisalabad' },
              ]}
            />
            <Select
              label="Default Courier Service"
              value={defaultCourier}
              onChange={(e) => setDefaultCourier(e.target.value)}
              options={[
                { value: 'trax', label: 'Trax Logistics' },
                { value: 'tcs', label: 'TCS Express' },
                { value: 'leopards', label: 'Leopards Courier' },
                { value: 'postex', label: 'PostEx' },
                { value: 'manual', label: 'Manual Rider' },
              ]}
            />
          </div>
        </Card>

        {/* Courier Credentials (Manual Fields for TCS, Leopards, PostEx, Trax) */}
        <Card
          title="Courier Settings (TCS, Leopards, PostEx, Trax)"
          subtitle="Enter your courier API credentials to generate tracking numbers automatically"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Input
                label="Trax Logistics API Key"
                value={traxKey}
                onChange={(e) => setTraxKey(e.target.value)}
                placeholder="TRX-KEY-..."
              />
              <Input
                label="PostEx Merchant Token"
                value={postexToken}
                onChange={(e) => setPostexToken(e.target.value)}
                placeholder="PTX-TOKEN-..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Input
                label="TCS Account Number"
                value={tcsAccount}
                onChange={(e) => setTcsAccount(e.target.value)}
                placeholder="TCS-..."
              />
              <Input
                label="Leopards Courier API Key"
                value={leopardsKey}
                onChange={(e) => setLeopardsKey(e.target.value)}
                placeholder="LEO-..."
              />
            </div>
          </div>
        </Card>

        {/* Subscription Plan */}
        <Card title="Billing & Subscription Plan">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              background: 'var(--color-bg-elevated)',
              borderRadius: '10px',
              marginTop: '12px',
            }}
          >
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-brand-primary)' }}>
                Growth Plan (Rs 3,499 / Month)
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                Unlimited orders, automatic COD reconciliation, and Claude AI Assistant access.
              </div>
            </div>
            <span
              style={{
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '20px',
                background: 'var(--color-brand-secondary-subtle)',
                color: 'var(--color-brand-secondary)',
                fontWeight: 600,
              }}
            >
              Active Plan
            </span>
          </div>
        </Card>

        <div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            iconLeft={<FiSave />}
          >
            Save All Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
