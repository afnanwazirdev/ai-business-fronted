import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import PublicLayout from './layouts/PublicLayout';
import AppShell from './components/layout/AppShell/AppShell';
import ChatWidget from './components/assistant/ChatWidget/ChatWidget';
import Skeleton from './components/common/Skeleton/Skeleton';

// Code-split pages with React.lazy
const LandingPage = lazy(() => import('./pages/public/LandingPage'));
const PricingPage = lazy(() => import('./pages/public/PricingPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const SignupPage = lazy(() => import('./pages/auth/SignupPage'));
const DashboardPage = lazy(() => import('./pages/app/DashboardPage'));
const OrdersPage = lazy(() => import('./pages/app/OrdersPage'));
const ProductsPage = lazy(() => import('./pages/app/ProductsPage'));
const CustomersPage = lazy(() => import('./pages/app/CustomersPage'));
const ReportsPage = lazy(() => import('./pages/app/ReportsPage'));
const AssistantPage = lazy(() => import('./pages/app/AssistantPage'));
const SettingsPage = lazy(() => import('./pages/app/SettingsPage'));

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: '60px', maxWidth: '800px', margin: '0 auto' }}>
        <Skeleton height="40px" style={{ marginBottom: '20px' }} />
        <Skeleton height="200px" style={{ marginBottom: '20px' }} />
        <Skeleton height="200px" />
      </div>
    );
  }

  // Allow access for authenticated sellers or demo fallback
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const App = () => {
  const { user, logout } = useAuth();

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Suspense
        fallback={
          <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
            <Skeleton height="48px" style={{ marginBottom: '24px' }} />
            <Skeleton height="300px" />
          </div>
        }
      >
        <Routes>
          {/* Public Landing & Pricing */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <LandingPage />
              </PublicLayout>
            }
          />
          <Route
            path="/pricing"
            element={
              <PublicLayout>
                <PricingPage />
              </PublicLayout>
            }
          />

          {/* Authentication Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Authenticated Application Shell Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppShell user={user} onLogout={logout}>
                  <DashboardPage />
                  <ChatWidget />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <AppShell user={user} onLogout={logout}>
                  <OrdersPage />
                  <ChatWidget />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <AppShell user={user} onLogout={logout}>
                  <ProductsPage />
                  <ChatWidget />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <AppShell user={user} onLogout={logout}>
                  <CustomersPage />
                  <ChatWidget />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <AppShell user={user} onLogout={logout}>
                  <ReportsPage />
                  <ChatWidget />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/assistant"
            element={
              <ProtectedRoute>
                <AppShell user={user} onLogout={logout}>
                  <AssistantPage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AppShell user={user} onLogout={logout}>
                  <SettingsPage />
                  <ChatWidget />
                </AppShell>
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
