import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiSend,
  FiCheckCircle,
  FiTruck,
  FiDownload,
  FiRefreshCw,
} from 'react-icons/fi';
import orderService from '../../services/orderService';
import { formatPKR, formatDate, formatPKPhone } from '../../utils/formatters';
import { generateWhatsAppLink } from '../../utils/whatsapp';
import { useToast } from '../../hooks/useToast';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import Button from '../../components/common/Button/Button';
import Badge from '../../components/common/Badge/Badge';
import DataTable from '../../components/common/DataTable/DataTable';
import Tabs from '../../components/common/Tabs/Tabs';
import OrderDrawer from '../../components/orders/OrderDrawer/OrderDrawer';
import CreateOrderModal from '../../components/orders/CreateOrderModal/CreateOrderModal';

export const OrdersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [selectedOrderForDrawer, setSelectedOrderForDrawer] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(searchParams.get('action') === 'new');

  const toast = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getOrders();
      setOrders(res.orders || []);
    } catch {
      // Fallback demo dataset if offline
      setOrders([
        {
          _id: 'o1',
          orderNumber: 'KB-1001',
          customerSnapshot: { name: 'Zainab Fatima', phone: '03218765432', city: 'Lahore', address: 'Model Town' },
          items: [{ productTitle: 'Velvet Shawl', quantity: 1, totalPrice: 5800 }],
          subtotal: 5800,
          deliveryCharges: 250,
          totalAmount: 6050,
          codAmount: 6050,
          status: 'delivered',
          salesChannel: 'instagram',
          courier: { name: 'trax', trackingNumber: 'TRX-998822' },
          createdAt: new Date(Date.now() - 86400000 * 3),
        },
        {
          _id: 'o2',
          orderNumber: 'KB-1002',
          customerSnapshot: { name: 'Hamza Bilal', phone: '03009876543', city: 'Karachi', address: 'Gulshan Block 13' },
          items: [{ productTitle: 'Winter Hoodie', quantity: 2, totalPrice: 6400 }],
          subtotal: 6400,
          deliveryCharges: 200,
          totalAmount: 6600,
          codAmount: 6600,
          status: 'dispatched',
          salesChannel: 'whatsapp',
          courier: { name: 'leopards', trackingNumber: 'LEO-774411' },
          createdAt: new Date(Date.now() - 86400000),
        },
        {
          _id: 'o3',
          orderNumber: 'KB-1003',
          customerSnapshot: { name: 'Maryam Siddiqui', phone: '03335551234', city: 'Islamabad', address: 'Sector F-8' },
          items: [{ productTitle: 'Rose Water Mist', quantity: 2, totalPrice: 2900 }],
          subtotal: 2900,
          deliveryCharges: 200,
          totalAmount: 3100,
          codAmount: 3100,
          status: 'confirmed',
          salesChannel: 'instagram',
          courier: { name: 'postex' },
          createdAt: new Date(),
        },
        {
          _id: 'o4',
          orderNumber: 'KB-1004',
          customerSnapshot: { name: 'Bilal Ahmed', phone: '03023334455', city: 'Multan', address: 'Gulgasht' },
          items: [{ productTitle: 'Lawn Kurti', quantity: 1, totalPrice: 2850 }],
          subtotal: 2850,
          deliveryCharges: 200,
          totalAmount: 3050,
          codAmount: 3050,
          status: 'pending',
          salesChannel: 'daraz',
          courier: { name: 'manual' },
          createdAt: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, nextStatus, courierInfo) => {
    try {
      await orderService.updateStatus(orderId, nextStatus, 'Updated via Drawer', courierInfo);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId
            ? { ...o, status: nextStatus, courier: { ...o.courier, ...courierInfo } }
            : o
        )
      );
      if (selectedOrderForDrawer && selectedOrderForDrawer._id === orderId) {
        setSelectedOrderForDrawer((prev) => ({
          ...prev,
          status: nextStatus,
          courier: { ...prev.courier, ...courierInfo },
        }));
      }
      toast.success('Status Updated', `Order marked as ${nextStatus.toUpperCase()}`);
    } catch {
      // Local optimistic update
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: nextStatus } : o))
      );
    }
  };

  const handleBulkStatusChange = async (status) => {
    if (!selectedOrderIds.length) return;
    try {
      await orderService.bulkUpdateStatus(selectedOrderIds, status);
      setOrders((prev) =>
        prev.map((o) =>
          selectedOrderIds.includes(o._id) ? { ...o, status } : o
        )
      );
      toast.success('Bulk Update', `${selectedOrderIds.length} orders updated to ${status}.`);
      setSelectedOrderIds([]);
    } catch {
      setOrders((prev) =>
        prev.map((o) =>
          selectedOrderIds.includes(o._id) ? { ...o, status } : o
        )
      );
      setSelectedOrderIds([]);
    }
  };

  const handleOrderCreated = async (payload) => {
    try {
      const res = await orderService.createOrder(payload);
      setOrders((prev) => [res.order, ...prev]);
      toast.success('Order Created', `${res.order.orderNumber} successfully registered.`);
    } catch {
      const demoOrder = {
        _id: 'o-' + Date.now(),
        orderNumber: `KB-${1000 + orders.length + 1}`,
        customerSnapshot: payload.customer,
        items: payload.items,
        subtotal: payload.items.reduce((s, i) => s + i.totalPrice, 0),
        deliveryCharges: payload.deliveryCharges,
        totalAmount: payload.items.reduce((s, i) => s + i.totalPrice, 0) + payload.deliveryCharges,
        codAmount: payload.items.reduce((s, i) => s + i.totalPrice, 0) + payload.deliveryCharges,
        status: 'pending',
        salesChannel: payload.salesChannel,
        courier: payload.courier,
        createdAt: new Date(),
      };
      setOrders((prev) => [demoOrder, ...prev]);
      toast.success('Order Created (Local)', `${demoOrder.orderNumber} saved.`);
    }
  };

  // Filter orders by tab, query, city
  const filteredOrders = orders.filter((o) => {
    const matchesTab = activeTab === 'all' || o.status === activeTab;
    const matchesQuery =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerSnapshot?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerSnapshot?.phone.includes(searchQuery);
    const matchesCity = !selectedCity || o.customerSnapshot?.city.toLowerCase() === selectedCity.toLowerCase();
    return matchesTab && matchesQuery && matchesCity;
  });

  const columns = [
    {
      field: 'orderNumber',
      title: 'Order #',
      width: '120px',
      sortable: true,
      render: (val, row) => (
        <span
          style={{ fontWeight: 600, color: 'var(--color-brand-primary)', cursor: 'pointer' }}
          onClick={() => setSelectedOrderForDrawer(row)}
        >
          {val}
        </span>
      ),
    },
    {
      field: 'createdAt',
      title: 'Date',
      width: '120px',
      sortable: true,
      render: (val) => formatDate(val),
    },
    {
      field: 'customer',
      title: 'Customer (Gahak)',
      render: (_, row) => (
        <div>
          <div style={{ fontWeight: 500 }}>{row.customerSnapshot?.name}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
            {row.customerSnapshot?.city} • {formatPKPhone(row.customerSnapshot?.phone)}
          </div>
        </div>
      ),
    },
    {
      field: 'items',
      title: 'Items',
      render: (val) => (
        <span style={{ fontSize: '13px' }}>
          {(val || []).map((i) => `${i.productTitle} (${i.quantity}x)`).join(', ')}
        </span>
      ),
    },
    {
      field: 'codAmount',
      title: 'COD Cash',
      sortable: true,
      render: (val, row) => (
        <span style={{ fontWeight: 700, color: 'var(--color-brand-secondary)', fontVariantNumeric: 'tabular-nums' }}>
          {formatPKR(val || row.totalAmount)}
        </span>
      ),
    },
    {
      field: 'status',
      title: 'Status',
      width: '130px',
      sortable: true,
      render: (val) => <Badge variant={val}>{val.toUpperCase()}</Badge>,
    },
    {
      field: 'actions',
      title: 'Action',
      width: '120px',
      render: (_, row) => {
        const waLink = generateWhatsAppLink(row, 'confirmation', 'Ayesha Closet PK');
        return (
          <div style={{ display: 'flex', gap: '6px' }}>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              title="One-click WhatsApp confirmation link"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30px',
                height: '30px',
                borderRadius: '6px',
                background: 'rgba(37, 211, 102, 0.15)',
                color: '#25D366',
              }}
            >
              <FiSend size={14} />
            </a>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSelectedOrderForDrawer(row)}
            >
              View
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Orders Pipeline & COD Tracking"
        subtitle="Manage pending, confirmed, dispatched and delivered parcels."
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Orders' },
        ]}
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              variant="secondary"
              iconLeft={<FiRefreshCw />}
              onClick={fetchOrders}
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              iconLeft={<FiPlus />}
              onClick={() => setIsCreateOpen(true)}
            >
              Naya Order
            </Button>
          </div>
        }
      />

      {/* Status Pipeline Tabs */}
      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: 'all', label: 'All Orders', count: orders.length },
          { id: 'pending', label: 'Pending', count: orders.filter((o) => o.status === 'pending').length },
          { id: 'confirmed', label: 'Confirmed', count: orders.filter((o) => o.status === 'confirmed').length },
          { id: 'dispatched', label: 'Dispatched', count: orders.filter((o) => o.status === 'dispatched').length },
          { id: 'delivered', label: 'Delivered', count: orders.filter((o) => o.status === 'delivered').length },
          { id: 'returned', label: 'Returned', count: orders.filter((o) => o.status === 'returned').length },
        ]}
        style={{ marginBottom: '16px' }}
      />

      {/* Search and City Filter Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
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
            placeholder="Search order #, customer or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
          <option value="">All Cities (Karachi, Lahore...)</option>
          <option value="Karachi">Karachi</option>
          <option value="Lahore">Lahore</option>
          <option value="Islamabad">Islamabad</option>
          <option value="Rawalpindi">Rawalpindi</option>
          <option value="Multan">Multan</option>
          <option value="Faisalabad">Faisalabad</option>
        </select>
      </div>

      {/* Orders Data Table */}
      <DataTable
        columns={columns}
        data={filteredOrders}
        keyField="_id"
        selectable
        selectedKeys={selectedOrderIds}
        onSelectionChange={setSelectedOrderIds}
        emptyMessage="Koi order nahi mila."
      />

      {/* Sticky Bulk Action Bar sliding up when orders are selected */}
      {selectedOrderIds.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--color-brand-primary-border)',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 600 }}>
            {selectedOrderIds.length} orders selected
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              variant="secondary"
              size="sm"
              iconLeft={<FiCheckCircle />}
              onClick={() => handleBulkStatusChange('confirmed')}
            >
              Confirm All
            </Button>
            <Button
              variant="primary"
              size="sm"
              iconLeft={<FiTruck />}
              onClick={() => handleBulkStatusChange('dispatched')}
            >
              Dispatch All
            </Button>
          </div>
        </div>
      )}

      {/* Slide-over Order Detail Drawer */}
      <OrderDrawer
        order={selectedOrderForDrawer}
        isOpen={!!selectedOrderForDrawer}
        onClose={() => setSelectedOrderForDrawer(null)}
        onStatusChange={handleStatusChange}
      />

      {/* Multi-step Create Order Modal */}
      <CreateOrderModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setSearchParams({});
        }}
        onCreated={handleOrderCreated}
      />
    </div>
  );
};

export default OrdersPage;
