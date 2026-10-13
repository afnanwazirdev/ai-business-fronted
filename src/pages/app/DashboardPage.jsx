import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiDollarSign,
  FiShoppingBag,
  FiClock,
  FiRepeat,
  FiPlus,
  FiArrowRight,
  FiAlertTriangle,
  FiTrendingUp,
  FiCpu,
} from 'react-icons/fi';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';
import gsap from 'gsap';
import reportService from '../../services/reportService';
import { formatPKR, formatDate } from '../../utils/formatters';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import StatCard from '../../components/common/StatCard/StatCard';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import Badge from '../../components/common/Badge/Badge';
import Skeleton from '../../components/common/Skeleton/Skeleton';

export const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await reportService.getDashboardStats();
        setData(res);
      } catch {
        // Fallback demo dataset if offline
        setData({
          stats: {
            todaySales: 15450,
            todayNewOrdersCount: 6,
            salesTrend: 18.5,
            pendingCodAmount: 22800,
            pendingCodOrdersCount: 4,
            returnRate: 4,
            returnedOrdersCount: 1,
            allOrdersCount: 25,
          },
          chartData: [
            { day: 'Mon', sales: 9500, orders: 3 },
            { day: 'Tue', sales: 14200, orders: 5 },
            { day: 'Wed', sales: 11000, orders: 4 },
            { day: 'Thu', sales: 18400, orders: 7 },
            { day: 'Fri', sales: 16500, orders: 6 },
            { day: 'Sat', sales: 24000, orders: 9 },
            { day: 'Sun', sales: 15450, orders: 6 },
          ],
          topProducts: [
            { _id: 'Velvet Embroidered Shawl', totalRevenue: 34800, totalQuantity: 6 },
            { _id: 'Winter Fleece Hoodie', totalRevenue: 28800, totalQuantity: 9 },
            { _id: 'Rose Water Mist', totalRevenue: 17400, totalQuantity: 12 },
            { _id: 'Lawn Kurti 2-Piece', totalRevenue: 14250, totalQuantity: 5 },
          ],
          recentOrders: [
            { _id: '1', orderNumber: 'KB-1004', customerSnapshot: { name: 'Bilal Ahmed', city: 'Multan' }, totalAmount: 3050, status: 'pending', createdAt: new Date() },
            { _id: '2', orderNumber: 'KB-1003', customerSnapshot: { name: 'Maryam Siddiqui', city: 'Islamabad' }, totalAmount: 5050, status: 'confirmed', createdAt: new Date() },
            { _id: '3', orderNumber: 'KB-1002', customerSnapshot: { name: 'Hamza Bilal', city: 'Karachi' }, totalAmount: 6600, status: 'dispatched', createdAt: new Date() },
            { _id: '4', orderNumber: 'KB-1001', customerSnapshot: { name: 'Zainab Fatima', city: 'Lahore' }, totalAmount: 6050, status: 'delivered', createdAt: new Date() },
          ],
          lowStockAlerts: [
            { _id: 'p1', title: 'Premium Velvet Embroidered Shawl', totalStock: 3, lowStockThreshold: 5 },
            { _id: 'p4', title: 'Embroidered Lawn Kurti 2-Piece', totalStock: 2, lowStockThreshold: 5 },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Stagger entrance animation
  useEffect(() => {
    if (!loading && containerRef.current) {
      gsap.fromTo(
        containerRef.current.querySelectorAll('.animate-card'),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, [loading]);

  const stats = data?.stats || {};

  return (
    <div ref={containerRef}>
      <PageHeader
        title="Dashboard (Aaj ka Hisaab)"
        subtitle="Pakistan ke online karobar ki live sales, orders aur COD tracking."
        breadcrumbs={[{ label: 'Home' }, { label: 'Dashboard' }]}
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              variant="secondary"
              iconLeft={<FiCpu />}
              onClick={() => navigate('/assistant')}
            >
              Ask AI Munshi
            </Button>
            <Button
              variant="primary"
              iconLeft={<FiPlus />}
              onClick={() => navigate('/orders?action=new')}
            >
              Naya Order
            </Button>
          </div>
        }
      />

      {/* 4 Animated Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div className="animate-card">
          <StatCard
            title="Aaj ki Sales"
            rawNumber={stats.todaySales || 0}
            prefix="Rs "
            trend={stats.salesTrend || 14.2}
            trendLabel="vs kal"
            icon={<FiDollarSign />}
            iconVariant="primary"
            sparklineData={[8000, 11000, 9500, 14000, 12000, 16000, stats.todaySales || 15450]}
          />
        </div>

        <div className="animate-card">
          <StatCard
            title="Naye Orders (Today)"
            rawNumber={stats.todayNewOrdersCount || 0}
            suffix=" Orders"
            trend={8}
            trendLabel="vs kal"
            icon={<FiShoppingBag />}
            iconVariant="secondary"
            sparklineData={[2, 4, 3, 5, 4, 7, stats.todayNewOrdersCount || 6]}
          />
        </div>

        <div className="animate-card">
          <StatCard
            title="COD Cash Awaiting Delivery"
            rawNumber={stats.pendingCodAmount || 0}
            prefix="Rs "
            trend={0}
            trendLabel={`${stats.pendingCodOrdersCount || 0} parcels in transit`}
            icon={<FiClock />}
            iconVariant="warning"
            sparklineData={[15000, 18000, 16000, 21000, 19000, stats.pendingCodAmount || 22800]}
          />
        </div>

        <div className="animate-card">
          <StatCard
            title="Return Rate"
            rawNumber={stats.returnRate || 0}
            suffix="%"
            trend={-2}
            trendLabel="Industry average: 18%"
            icon={<FiRepeat />}
            iconVariant="danger"
            sparklineData={[12, 10, 8, 7, 5, 4]}
          />
        </div>
      </div>

      {/* Charts Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '20px',
          marginBottom: '24px',
        }}
      >
        {/* 7-Day Revenue Trend (Line / Area) */}
        <div className="animate-card">
          <Card
            title="7-Day Sales Trend (Hafta-war Bikri)"
            subtitle="Daily confirmed and delivered revenue in PKR"
          >
            <div style={{ height: '260px', width: '100%', marginTop: '12px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.chartData || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-brand-primary)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--color-brand-primary)" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="day" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} />
                  <YAxis
                    stroke="var(--color-text-muted)"
                    fontSize={12}
                    tickFormatter={(val) => `Rs ${val / 1000}k`}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--color-bg-surface)',
                      borderColor: 'var(--color-border-default)',
                      borderRadius: '8px',
                      color: 'var(--color-text-primary)',
                      fontSize: '12px',
                    }}
                    formatter={(val) => [formatPKR(val), 'Sales']}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="var(--color-brand-primary)"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#salesGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Top Products Bar Chart */}
        <div className="animate-card">
          <Card
            title="Top Selling Products (Zyada Bikne Wala Maal)"
            subtitle="Best performing inventory items by revenue"
          >
            <div style={{ height: '260px', width: '100%', marginTop: '12px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.topProducts || []} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                  <XAxis
                    type="number"
                    stroke="var(--color-text-muted)"
                    fontSize={11}
                    tickFormatter={(val) => `Rs ${val / 1000}k`}
                  />
                  <YAxis
                    type="category"
                    dataKey="_id"
                    stroke="var(--color-text-muted)"
                    fontSize={11}
                    width={130}
                    tickFormatter={(val) => (val.length > 18 ? val.slice(0, 16) + '...' : val)}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--color-bg-surface)',
                      borderColor: 'var(--color-border-default)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(val) => [formatPKR(val), 'Revenue']}
                  />
                  <Bar dataKey="totalRevenue" fill="var(--color-brand-secondary)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Section: Recent Orders & Low Stock Alerts */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Recent Orders Table */}
        <div className="animate-card">
          <Card
            title="Taza Orders (Recent Orders)"
            subtitle="Last incoming customer parcels"
            action={
              <Button variant="ghost" size="sm" onClick={() => navigate('/orders')} iconRight={<FiArrowRight />}>
                View All
              </Button>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(data?.recentOrders || []).map((o) => (
                <div
                  key={o._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    background: 'var(--color-bg-elevated)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate('/orders')}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-brand-primary)' }}>
                      {o.orderNumber} — {o.customerSnapshot?.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      {o.customerSnapshot?.city} • {formatDate(o.createdAt)}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-brand-secondary)' }}>
                      {formatPKR(o.totalAmount)}
                    </div>
                    <Badge variant={o.status}>{o.status.toUpperCase()}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Low Stock Alerts */}
        <div className="animate-card">
          <Card
            title="Low-Stock Alerts (Stock Kam Hai)"
            subtitle="Products reaching minimum threshold"
            action={
              <Button variant="ghost" size="sm" onClick={() => navigate('/products')} iconRight={<FiArrowRight />}>
                Manage Stock
              </Button>
            }
          >
            {data?.lowStockAlerts?.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                Alhamdulillah! Tamam items ka stock behtar hai.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(data?.lowStockAlerts || []).map((p) => (
                  <div
                    key={p._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      background: 'rgba(239, 68, 68, 0.08)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FiAlertTriangle style={{ color: 'var(--color-status-returned)' }} size={18} />
                      <div>
                        <strong>{p.title}</strong>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                          Alert limit: {p.lowStockThreshold} pieces
                        </div>
                      </div>
                    </div>

                    <Badge variant="returned" pulse>
                      Sirf {p.totalStock} pieces bache
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
