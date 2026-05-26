import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import Shop from './pages/public/Shop';
import Checkout from './pages/public/Checkout';
import Contact from './pages/public/Contact';
import CustomerLogin from './pages/public/CustomerLogin';
import CustomerRegister from './pages/public/CustomerRegister';
import CustomerAccount from './pages/public/CustomerAccount';
import Blog from './pages/public/Blog';
import FAQ from './pages/public/FAQ';

// Admin Components
import Dashboard from './components/Dashboard';
import NewSaleBill from './components/NewSaleBill';
import Profile from './components/Profile';
import BillDetailWrapper from './components/BillDetailWrapper';
import OnlineOrders from './components/admin/OnlineOrders';
import Inquiries from './components/admin/Inquiries';
import ProductManager from './components/admin/ProductManager';
import InsightManager from './components/admin/InsightManager';
import BillHistory from './components/BillHistory';
import SalesStatisticsView from './components/SalesStatisticsView';
import RecycleBin from './components/RecycleBin';
import Login from './components/Login';
import { TermsView, PrivacyView, RefundView } from './components/LegalPages';

// Optional: Fallback loading component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
    <div className="w-12 h-12 rounded-full border-4 border-[#E8E0D0] border-t-[#10B981] animate-spin"></div>
  </div>
);

const NotFound = () => (
  <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-20 text-center" style={{ background: 'var(--bg-base)' }}>
    <div className="text-8xl mb-6">🍌</div>
    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#10B981] font-display mb-4">404 Error</p>
    <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A0A0A] font-display mb-4 tracking-tight">
      Page Not Found
    </h1>
    <p className="text-[#374151] text-lg mb-10 max-w-md leading-relaxed">
      Looks like this bunch went missing. The page you're looking for doesn't exist or was moved.
    </p>
    <div className="flex flex-col sm:flex-row gap-4">
      <a href="/" className="inline-flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-200 font-display text-base">
        Go Home
      </a>
      <a href="/shop" className="inline-flex items-center justify-center gap-2 border border-[#E8E0D0] text-[#374151] hover:border-[rgba(16,185,129,0.4)] hover:text-[#10B981] font-semibold py-3.5 px-8 rounded-xl transition-all duration-200 font-display text-base">
        Browse Shop
      </a>
    </div>
  </div>
);

// Protected Route Wrapper for Admin
const AdminProtectedRoute = ({ isAdmin, loading, children }) => {
  if (loading) return <LoadingScreen />;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
};

// Protected Route Wrapper for Customers
const CustomerProtectedRoute = ({ isCustomer, loading, children }) => {
  if (loading) return <LoadingScreen />;
  if (!isCustomer) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const { isAdmin, isCustomer, loading } = useAuth();

  // Check for auto-backup
  useEffect(() => {
    if (!isAdmin) return;

    const checkAndTriggerBackup = async () => {
      const currentMonth = new Date().toISOString().substring(0, 7);
      const lastBackupMonth = localStorage.getItem('last_auto_backup_month');

      if (lastBackupMonth !== currentMonth) {
        localStorage.setItem('last_auto_backup_month', currentMonth);
        try {
          const { downloadDatabaseBackup } = await import('./services/backupService.js');
          await downloadDatabaseBackup();
        } catch (e) {
          console.error("Auto backup failed to initialize", e);
        }
      }
    };

    const handleFirstInteraction = () => {
      checkAndTriggerBackup();
      window.removeEventListener('click', handleFirstInteraction, { capture: true });
      window.removeEventListener('touchstart', handleFirstInteraction, { capture: true });
    };

    window.addEventListener('click', handleFirstInteraction, { capture: true, once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { capture: true, once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction, { capture: true });
      window.removeEventListener('touchstart', handleFirstInteraction, { capture: true });
    };
  }, [isAdmin]);

  return (
    <Routes>
      {/* Public Storefront Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Customer Auth Pages */}
        <Route path="/login" element={
          isCustomer ? <Navigate to="/account" replace /> : <CustomerLogin />
        } />
        <Route path="/register" element={
          isCustomer ? <Navigate to="/account" replace /> : <CustomerRegister />
        } />
        
        {/* Customer Dashboard */}
        <Route path="/account" element={
          <CustomerProtectedRoute isCustomer={isCustomer} loading={loading}>
            <CustomerAccount />
          </CustomerProtectedRoute>
        } />
        
        {/* Legal Pages */}
        <Route path="/terms" element={<TermsView />} />
        <Route path="/privacy" element={<PrivacyView />} />
        <Route path="/refund" element={<RefundView />} />
        <Route path="/faq" element={<FAQ />} />
      </Route>

      {/* Admin Login */}
      <Route path="/admin/login" element={
        isAdmin ? <Navigate to="/admin/dashboard" replace /> : <Login />
      } />

      {/* Admin Dashboard Routes */}
      <Route path="/admin" element={
        <AdminProtectedRoute isAdmin={isAdmin} loading={loading}>
          <AdminLayout />
        </AdminProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="new-sale" element={<NewSaleBill />} />
        <Route path="history" element={<BillHistory />} />
        <Route path="online-orders" element={<OnlineOrders />} />
        <Route path="products" element={<ProductManager />} />
        <Route path="inquiries" element={<Inquiries />} />
        <Route path="insights" element={<InsightManager />} />
        <Route path="bill/:id" element={<BillDetailWrapper />} />
        <Route path="sales-stats" element={<SalesStatisticsView />} />
        <Route path="recycle-bin" element={<RecycleBin />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
