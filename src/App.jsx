import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartModal } from './components/CartModal';
import { PrescriptionUploadModal } from './components/PrescriptionUploadModal';
import { InvoiceModal } from './components/InvoiceModal';
import { AuthModal } from './components/AuthModal';

import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { CustomerReqPage } from './pages/CustomerReqPage';
import { ServicesPage } from './pages/ServicesPage';
import { AdminStockPage } from './pages/AdminStockPage';
import { AdminOrdersPage } from './pages/AdminOrdersPage';
import { OwnerPage } from './pages/OwnerPage';
import { UserProfilePage } from './pages/UserProfilePage';

const AppContent = () => {
  const { activeTab } = useStore();

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
        return <AdminStockPage />;
      case 'orders':
        return <AdminOrdersPage />;
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
