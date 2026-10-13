import React, { useState, useEffect } from 'react';
import { FiUsers, FiSearch, FiPhone, FiMapPin, FiShoppingBag, FiStar } from 'react-icons/fi';
import customerService from '../../services/customerService';
import { formatPKR, formatPKPhone } from '../../utils/formatters';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import DataTable from '../../components/common/DataTable/DataTable';
import Badge from '../../components/common/Badge/Badge';

export const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await customerService.getCustomers();
      setCustomers(res.customers || []);
    } catch {
      // Fallback demo data
      setCustomers([
        {
          _id: 'c1',
          name: 'Zainab Fatima',
          phone: '03218765432',
          city: 'Lahore',
          address: 'House 42, Block D, Model Town',
          totalOrders: 3,
          deliveredOrders: 3,
          returnedOrders: 0,
          totalSpent: 12450,
          isRepeat: true,
          returnRate: 0,
        },
        {
          _id: 'c2',
          name: 'Hamza Bilal',
          phone: '03009876543',
          city: 'Karachi',
          address: 'Gulshan-e-Iqbal Block 13-D',
          totalOrders: 2,
          deliveredOrders: 2,
          returnedOrders: 0,
          totalSpent: 6400,
          isRepeat: true,
          returnRate: 0,
        },
        {
          _id: 'c3',
          name: 'Maryam Siddiqui',
          phone: '03335551234',
          city: 'Islamabad',
          address: 'Sector F-8/3',
          totalOrders: 1,
          deliveredOrders: 1,
          returnedOrders: 0,
          totalSpent: 5800,
          isRepeat: false,
          returnRate: 0,
        },
        {
          _id: 'c4',
          name: 'Usman Tariq',
          phone: '03452223344',
          city: 'Rawalpindi',
          address: 'Chaklala Scheme 3',
          totalOrders: 1,
          deliveredOrders: 0,
          returnedOrders: 1,
          totalSpent: 0,
          isRepeat: false,
          returnRate: 100,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchesCity = !selectedCity || c.city.toLowerCase() === selectedCity.toLowerCase();
    return matchesSearch && matchesCity;
  });

  const columns = [
    {
      field: 'name',
      title: 'Customer Name (Gahak)',
      sortable: true,
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div>
            <div style={{ fontWeight: 600 }}>{val}</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
              {row.address}
            </div>
          </div>
          {row.isRepeat && (
            <Badge variant="primary">
              <FiStar size={10} /> Repeat Gahak
            </Badge>
          )}
        </div>
      ),
    },
    {
      field: 'phone',
      title: 'Phone (WhatsApp)',
      render: (val) => formatPKPhone(val),
    },
    {
      field: 'city',
      title: 'City',
      sortable: true,
      render: (val) => <strong>{val}</strong>,
    },
    {
      field: 'totalOrders',
      title: 'Total Orders',
      sortable: true,
      align: 'center',
    },
    {
      field: 'totalSpent',
      title: 'Total Spent (LTV)',
      sortable: true,
      render: (val) => (
        <span style={{ fontWeight: 700, color: 'var(--color-brand-secondary)', fontVariantNumeric: 'tabular-nums' }}>
          {formatPKR(val)}
        </span>
      ),
    },
    {
      field: 'returnRate',
      title: 'Return Risk',
      sortable: true,
      render: (val) => (
        <Badge variant={val > 20 ? 'returned' : 'success'}>
          {val}% Returns
        </Badge>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Customers Directory (Gahak)"
        subtitle="Repeat buyers, lifetime value, and return risk monitoring across Pakistani cities."
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Customers' },
        ]}
      />

      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            width: '320px',
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border-default)',
            borderRadius: '8px',
            padding: '0 12px',
          }}
        >
          <FiSearch size={16} style={{ color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Search customer name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              height: '38px',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              paddingLeft: '8px',
              color: 'var(--color-text-primary)',
              fontSize: '13px',
            }}
          />
        </div>

        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          style={{
            height: '38px',
            padding: '0 12px',
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border-default)',
            borderRadius: '8px',
            color: 'var(--color-text-primary)',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          <option value="">All Cities</option>
          <option value="Karachi">Karachi</option>
          <option value="Lahore">Lahore</option>
          <option value="Islamabad">Islamabad</option>
          <option value="Rawalpindi">Rawalpindi</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyField="_id"
        emptyMessage="Koi customer nahi mila."
      />
    </div>
  );
};

export default CustomersPage;
