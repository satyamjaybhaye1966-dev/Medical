import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Phone,
  MessageSquare,
  ShoppingBag,
  Sun,
  Moon,
  Pill,
  PackageSearch,
  ClipboardList,
  HeartHandshake,
  User,
  ShieldCheck,
  Menu,
  X,
  MapPin,
  Clock,
  LogIn,
  UserPlus,
  Lock,
  CheckCircle2
} from 'lucide-react';

export const Navbar = () => {
  const {
    storeDetails,
    theme,
    toggleTheme,
    activeTab,
    setActiveTab,
    cartItemCount,
    setIsCartOpen,
    currentUser,
    setCurrentUser,
    getWhatsAppOrderUrl,
    openAuthModal,
    dbStatus
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tabKey) => {
    setActiveTab(tabKey);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleAdminRole = () => {
    setCurrentUser(prev => ({
      ...prev,
      role: prev.role === 'admin' ? 'customer' : 'admin',
      name: prev.role === 'admin' ? 'Satyam Jaybhaye' : 'MR. Rushikesh Suresh Mante'
    }));
  };

  return (
    <header className="navbar-container">
      {/* Top Notification / Emergency Ribbon */}
      <div className="top-notice-bar">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={15} color="#fef08a" />
              <span>Sawkhed Tejan, Tq. Sindkhed Raja, Dist. Buldhana</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: 0.9 }}>
              <Clock size={15} />
              <span>7:30 AM – 10:30 PM (24/7 Emergency Delivery)</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            {/* Quick Login / Register Shortcut in Top Bar */}
            <button
              onClick={() => openAuthModal('login')}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                borderRadius: 'var(--radius-full)',
                color: '#ffffff',
                padding: '0.2rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer'
              }}
            >
              <LogIn size={12} />
              <span>Login / Register</span>
            </button>

            <a
              href={`tel:${storeDetails.contactNumber}`}
              className="notice-contact-badge"
              style={{ textDecoration: 'none', color: '#fff' }}
            >
              <Phone size={13} />
              <span>Call: <strong>8237729148</strong></span>
            </a>
            <a
              href={getWhatsAppOrderUrl('Hello Mr. Rushikesh Mante, I want to order medicines.')}
              target="_blank"
              rel="noopener noreferrer"
              className="notice-contact-badge"
              style={{ backgroundColor: '#15803d', textDecoration: 'none', color: '#fff' }}
            >
              <MessageSquare size={13} />
              <span>WhatsApp Order</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar">
        <div className="container nav-inner">
          {/* Logo / Brand */}
          <div className="brand-logo" onClick={() => handleNavClick('home')}>
            <div className="brand-icon-box">
              <Pill size={24} />
            </div>
            <div>
              <div className="brand-title">
                {storeDetails.name.split(' ')[0]} <span style={{ color: 'var(--primary)' }}>{storeDetails.name.split(' ').slice(1).join(' ')}</span>
              </div>
              <div className="brand-subtitle">{storeDetails.marathiName} • सावखेड तेजन</div>
            </div>
          </div>

          {/* Nav Links */}
          <div className="nav-links">
            <button
              className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => handleNavClick('home')}
            >
              Home
            </button>

            <button
              className={`nav-btn ${activeTab === 'catalog' ? 'active' : ''}`}
              onClick={() => handleNavClick('catalog')}
            >
              <PackageSearch size={16} />
              Medicines & Prices
            </button>

            <button
              className={`nav-btn ${activeTab === 'customer-req' ? 'active' : ''}`}
              onClick={() => handleNavClick('customer-req')}
            >
              <HeartHandshake size={16} />
              Customer Requirements
            </button>

            <button
              className={`nav-btn ${activeTab === 'services' ? 'active' : ''}`}
              onClick={() => handleNavClick('services')}
            >
              Services
            </button>

            <button
              className={`nav-btn ${activeTab === 'stock' ? 'active' : ''}`}
              onClick={() => handleNavClick('stock')}
            >
              <ClipboardList size={16} />
              Stock & Report
            </button>

            <button
              className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => handleNavClick('orders')}
            >
              <ShoppingBag size={16} />
              Daily & Pending Orders
            </button>

            <button
              className={`nav-btn ${activeTab === 'owner' ? 'active' : ''}`}
              onClick={() => handleNavClick('owner')}
            >
              <ShieldCheck size={16} />
              Owner Page
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="nav-actions">
            {/* Direct Login & Register Action Buttons */}
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => openAuthModal('login')}
                style={{
                  fontSize: '0.8rem',
                  padding: '0.4rem 0.8rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
                title="Sign in with Email & Password"
              >
                <LogIn size={14} />
                <span>Sign In</span>
              </button>

              <button
                className="btn btn-sm btn-secondary"
                onClick={() => openAuthModal('register')}
                style={{
                  fontSize: '0.8rem',
                  padding: '0.4rem 0.8rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
                title="Create a New Account"
              >
                <UserPlus size={14} />
                <span>Register</span>
              </button>
            </div>

            {/* Quick Role Switcher Button */}
            <button
              className="btn btn-secondary btn-sm"
              onClick={toggleAdminRole}
              title="Switch view between Customer and Store Owner mode"
              style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
            >
              <ShieldCheck size={14} color={currentUser.role === 'admin' ? 'var(--primary)' : 'var(--text-muted)'} />
              <span>{currentUser.role === 'admin' ? 'Owner Mode' : 'Customer'}</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              className="btn-icon"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Profile Tab Button */}
            <button
              className={`btn-icon ${activeTab === 'profile' ? 'btn-primary' : ''}`}
              onClick={() => handleNavClick('profile')}
              title="User Account & Prescriptions"
            >
              <User size={18} />
            </button>

            {/* Shopping Cart Button */}
            <button
              className="cart-trigger-btn"
              onClick={() => setIsCartOpen(true)}
              aria-label="View Shopping Cart"
            >
              <ShoppingBag size={18} />
              <span className="cart-badge">{cartItemCount}</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              className="btn-icon"
              style={{ display: 'none' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div style={{
            background: 'var(--bg-card)',
            borderTop: '1px solid var(--border-color)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => { openAuthModal('login'); setMobileMenuOpen(false); }}>
                <LogIn size={14} /> Sign In
              </button>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => { openAuthModal('register'); setMobileMenuOpen(false); }}>
                <UserPlus size={14} /> Register
              </button>
            </div>
            <button className="nav-btn" onClick={() => handleNavClick('home')}>Home</button>
            <button className="nav-btn" onClick={() => handleNavClick('catalog')}>Medicines & Prices</button>
            <button className="nav-btn" onClick={() => handleNavClick('customer-req')}>Customer Requirements</button>
            <button className="nav-btn" onClick={() => handleNavClick('services')}>Services</button>
            <button className="nav-btn" onClick={() => handleNavClick('stock')}>Stock & Report</button>
            <button className="nav-btn" onClick={() => handleNavClick('orders')}>Daily & Pending Orders</button>
            <button className="nav-btn" onClick={() => handleNavClick('owner')}>Owner Page</button>
            <button className="nav-btn" onClick={() => handleNavClick('profile')}>User Profile</button>
          </div>
        )}
      </nav>
    </header>
  );
};
