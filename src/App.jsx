import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartModal } from './components/CartModal';
import { PrescriptionUploadModal } from './components/PrescriptionUploadModal';
import { InvoiceModal } from './components/InvoiceModal';
import { AuthModal } from './components/AuthModal';
import { FloatingCartButton } from './components/FloatingCartButton';

import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { CustomerReqPage } from './pages/CustomerReqPage';
import { ServicesPage } from './pages/ServicesPage';
import { AdminStockPage } from './pages/AdminStockPage';
import { AdminOrdersPage } from './pages/AdminOrdersPage';
import { OwnerPage } from './pages/OwnerPage';
import { UserProfilePage } from './pages/UserProfilePage';

const AppContent = () => {
  const { activeTab, currentUser, setActiveTab, openAuthModal } = useStore();

  const renderAdminGuard = (pageTitle) => (
    <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1.5px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem 2rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem auto'
        }}>
          <span style={{ fontSize: '1.75rem' }}>🔒</span>
        </div>
        <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          Administrator Privileges Required
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.75rem' }}>
          Access to <strong>{pageTitle}</strong> is restricted strictly to pharmacy management and store administrators.
          Regular customer accounts cannot view or modify medicine inventory.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setActiveTab('catalog')}
          >
            Browse Medicines
          </button>
          <button
            className="btn btn-primary"
            style={{ background: '#d97706', borderColor: '#b45309' }}
            onClick={() => openAuthModal('admin-login')}
          >
            Admin Sign In
          </button>
        </div>
      </div>
    </div>
  );

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'catalog':
        return <CatalogPage />;
      case 'customer-req':
        return <CustomerReqPage />;
      case 'services':
        return <ServicesPage />;
      case 'stock':
        return currentUser.role === 'admin' ? <AdminStockPage /> : renderAdminGuard('Stock & Medicine Inventory');
      case 'orders':
        return currentUser.role === 'admin' ? <AdminOrdersPage /> : renderAdminGuard('Daily & Pending Orders Management');
      case 'owner':
        return <OwnerPage />;
      case 'profile':
        return <UserProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="app-wrapper">
      <Navbar />

      <main className="main-content">
        {renderActivePage()}
      </main>

      <Footer />

      {/* Floating Persistent Quick Cart Button */}
      <FloatingCartButton />

      {/* Global Modals */}
      <CartModal />
      <PrescriptionUploadModal />
      <InvoiceModal />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
