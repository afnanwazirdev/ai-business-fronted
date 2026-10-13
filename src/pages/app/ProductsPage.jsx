import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiGrid, FiList, FiSearch, FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import productService from '../../services/productService';
import { useToast } from '../../hooks/useToast';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import Button from '../../components/common/Button/Button';
import ProductCard from '../../components/inventory/ProductCard/ProductCard';
import StockHistoryModal from '../../components/inventory/StockHistoryModal/StockHistoryModal';
import CreateProductModal from '../../components/inventory/CreateProductModal/CreateProductModal';
import Skeleton from '../../components/common/Skeleton/Skeleton';

// Register GSAP Flip plugin
gsap.registerPlugin(Flip);

export const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProductForHistory, setSelectedProductForHistory] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const containerRef = useRef(null);
  const toast = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productService.getProducts();
      setProducts(res.products || []);
    } catch {
      // Fallback demo data if offline
      setProducts([
        {
          _id: 'p1',
          title: 'Premium Velvet Embroidered Shawl',
          category: 'Shawls',
          basePrice: 5800,
          baseCostPrice: 3200,
          totalStock: 3,
          lowStockThreshold: 5,
          hasVariants: true,
          variants: [{ title: 'Maroon', stock: 1, price: 5800 }, { title: 'Emerald', stock: 2, price: 5800 }],
        },
        {
          _id: 'p2',
          title: 'Oversized Fleece Winter Hoodie',
          category: 'Hoodies',
          basePrice: 3200,
          baseCostPrice: 1600,
          totalStock: 28,
          lowStockThreshold: 8,
          hasVariants: true,
          variants: [{ title: 'Black / M', stock: 10, price: 3200 }],
        },
        {
          _id: 'p3',
          title: 'Pure Organic Rose Water Mist (200ml)',
          category: 'Skincare',
          basePrice: 1450,
          baseCostPrice: 650,
          totalStock: 42,
          lowStockThreshold: 10,
          hasVariants: false,
        },
        {
          _id: 'p4',
          title: 'Embroidered Lawn Kurti 2-Piece',
          category: 'Clothing',
          basePrice: 2850,
          baseCostPrice: 1400,
          totalStock: 2,
          lowStockThreshold: 5,
          hasVariants: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // GSAP Flip transition for Grid/List layout toggle
  const handleViewToggle = (newMode) => {
    if (newMode === viewMode) return;
    const state = Flip.getState(containerRef.current ? containerRef.current.children : []);
    setViewMode(newMode);
    setTimeout(() => {
      Flip.from(state, {
        duration: 0.35,
        ease: 'power2.inOut',
        stagger: 0.02,
        absolute: true,
      });
    }, 10);
  };

  const handleStockChange = async (product, delta) => {
    try {
      await productService.adjustStock(product._id, delta, 'Quick adjustment from stock page');
      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id
            ? { ...p, totalStock: Math.max(0, p.totalStock + delta) }
            : p
        )
      );
      toast.success('Stock Updated', `${product.title}: now ${Math.max(0, product.totalStock + delta)} units`);
    } catch {
      // Local optimistic update
      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id
            ? { ...p, totalStock: Math.max(0, p.totalStock + delta) }
            : p
        )
      );
    }
  };

  const handleProductCreated = async (payload) => {
    try {
      const res = await productService.createProduct(payload);
      setProducts((prev) => [res.product, ...prev]);
      toast.success('Product Added', `${payload.title} has been added to inventory.`);
    } catch {
      const local = { ...payload, _id: 'p-' + Date.now() };
      setProducts((prev) => [local, ...prev]);
      toast.success('Product Added (Local)', `${payload.title} created.`);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const lowStockCount = products.filter((p) => p.totalStock <= p.lowStockThreshold).length;

  return (
    <div>
      <PageHeader
        title="Products & Inventory (Maal / Stock)"
        subtitle="Manage stock levels, variants, and low-inventory alerts."
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Inventory' },
        ]}
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              variant="secondary"
              iconLeft={<FiRefreshCw />}
              onClick={fetchProducts}
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              iconLeft={<FiPlus />}
              onClick={() => setIsCreateOpen(true)}
            >
              Naya Product Shamil Karein
            </Button>
          </div>
        }
      />

      {/* Low Stock Warning Banner if any items low */}
      {lowStockCount > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--color-status-returned-bg)',
            border: '1px solid var(--color-status-returned-border)',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '20px',
            color: 'var(--color-status-returned)',
            fontSize: '13px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiAlertTriangle size={18} />
            <span>
              <strong>Stock Kam Hai!</strong> {lowStockCount} items apne alert threshold se neeche hain. Delivery ruk sakti hai.
            </span>
          </div>
        </div>
      )}

      {/* Filter and View Mode Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, maxWidth: '480px' }}>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border-default)',
              borderRadius: '8px',
              padding: '0 12px',
            }}
          >
            <FiSearch size={16} style={{ color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              placeholder="Search product name..."
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
                fontSize: '14px',
              }}
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
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
            <option value="all">All Categories</option>
            <option value="Shawls">Shawls</option>
            <option value="Hoodies">Hoodies</option>
            <option value="Skincare">Skincare</option>
            <option value="Clothing">Clothing</option>
          </select>
        </div>

        {/* GSAP Flip Grid / List Toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--color-bg-subtle)',
            padding: '3px',
            borderRadius: '8px',
            border: '1px solid var(--color-border-subtle)',
          }}
        >
          <button
            type="button"
            onClick={() => handleViewToggle('grid')}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 500,
              background: viewMode === 'grid' ? 'var(--color-bg-card)' : 'transparent',
              color: viewMode === 'grid' ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
              boxShadow: viewMode === 'grid' ? 'var(--shadow-sm)' : 'none',
            }}
          >
            <FiGrid size={14} />
            <span>Grid</span>
          </button>
          <button
            type="button"
            onClick={() => handleViewToggle('list')}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 500,
              background: viewMode === 'list' ? 'var(--color-bg-card)' : 'transparent',
              color: viewMode === 'list' ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
              boxShadow: viewMode === 'list' ? 'var(--shadow-sm)' : 'none',
            }}
          >
            <FiList size={14} />
            <span>List</span>
          </button>
        </div>
      </div>

      {/* Product Items Display Container */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
          <Skeleton height="260px" borderRadius="12px" />
          <Skeleton height="260px" borderRadius="12px" />
          <Skeleton height="260px" borderRadius="12px" />
          <Skeleton height="260px" borderRadius="12px" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div
          style={{
            padding: '48px',
            textAlign: 'center',
            background: 'var(--color-bg-card)',
            borderRadius: '12px',
            border: '1px solid var(--color-border-subtle)',
            color: 'var(--color-text-muted)',
          }}
        >
          Koi product nahi mila matching "{searchQuery}".
        </div>
      ) : (
        <div
          ref={containerRef}
          style={{
            display: viewMode === 'grid' ? 'grid' : 'flex',
            flexDirection: 'column',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '16px',
          }}
        >
          {filteredProducts.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              viewMode={viewMode}
              onStockChange={handleStockChange}
              onViewHistory={(prod) => setSelectedProductForHistory(prod)}
            />
          ))}
        </div>
      )}

      {/* Stock History Audit Modal */}
      <StockHistoryModal
        product={selectedProductForHistory}
        isOpen={!!selectedProductForHistory}
        onClose={() => setSelectedProductForHistory(null)}
      />

      {/* Create Product Modal */}
      <CreateProductModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={handleProductCreated}
      />
    </div>
  );
};

export default ProductsPage;
