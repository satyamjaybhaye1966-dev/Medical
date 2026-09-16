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
  LogOut,
  CheckCircle2
} from 'lucide-react';
import { GlobalSearchBar } from './GlobalSearchBar';

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
    logoutUser,
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
            {/* Separated User / Admin Login in Top Ribbon */}
            {!currentUser.isLoggedIn ? (
              <>
                <button
                  onClick={() => openAuthModal('user-login')}
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
                  title="Customer Login / Register"
                >
                  <User size={12} />
                  <span>User Login</span>
                </button>

                <button
                  onClick={() => openAuthModal('admin-login')}
                  style={{
                    background: 'rgba(245, 158, 11, 0.25)',
                    border: '1px solid #fbbf24',
                    borderRadius: 'var(--radius-full)',
                    color: '#fef08a',
                    padding: '0.2rem 0.65rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    cursor: 'pointer'
                  }}
                  title="Store Administrator Portal"
                >
                  <Lock size={12} />
                  <span>Admin Login</span>
                </button>
              </>
            ) : (
              <span style={{ fontSize: '0.76rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>Signed in as: <strong>{currentUser.name}</strong> ({currentUser.role === 'admin' ? 'Admin' : 'User'})</span>
                <button
                  onClick={logoutUser}
                  style={{
                    background: 'rgba(239, 68, 68, 0.3)',
                    border: '1px solid #f87171',
                    borderRadius: 'var(--radius-full)',
                    color: '#fff',
                    padding: '0.15rem 0.5rem',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <LogOut size={11} />
                  <span>Logout</span>
                </button>
              </span>
            )}

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

          {/* Global Universal Search Bar */}
          <GlobalSearchBar />

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

            {/* Admin-only Navigation Controls */}
            {currentUser.role === 'admin' && (
              <>
                <button
                  className={`nav-btn ${activeTab === 'stock' ? 'active' : ''}`}
                  onClick={() => handleNavClick('stock')}
                  style={{ fontWeight: 700, color: 'var(--primary-dark)' }}
                >
                  <ClipboardList size={16} />
                  Stock & Report (Admin)
                </button>

                <button
                  className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
                  onClick={() => handleNavClick('orders')}
                  style={{ fontWeight: 700, color: 'var(--primary-dark)' }}
                >
                  <ShoppingBag size={16} />
                  Orders Management (Admin)
                </button>
              </>
            )}

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
            {!currentUser.isLoggedIn ? (
              /* Not logged in: Separate User & Admin Login */
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => openAuthModal('user-login')}
                  style={{
                    fontSize: '0.8rem',
                    padding: '0.4rem 0.75rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  title="User / Customer Login"
                >
                  <LogIn size={14} />
                  <span>User Login</span>
                </button>

                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => openAuthModal('user-register')}
                  style={{
                    fontSize: '0.8rem',
                    padding: '0.4rem 0.75rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                  title="Register Customer Account"
                >
                  <UserPlus size={14} />
                  <span>Register</span>
                </button>

                <button
                  className="btn btn-sm"
                  onClick={() => openAuthModal('admin-login')}
                  style={{
                    fontSize: '0.8rem',
                    padding: '0.4rem 0.75rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    border: '1.5px solid #d97706',
                    background: 'rgba(245, 158, 11, 0.1)',
                    color: '#b45309',
                    fontWeight: 700
                  }}
                  title="Administrator Portal Sign In"
                >
                  <Lock size={14} />
                  <span>Admin Login</span>
                </button>
              </div>
            ) : currentUser.role === 'admin' ? (
              /* Admin is logged in: Admin Controls */
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleNavClick('stock')}
                  style={{
                    fontSize: '0.8rem',
                    padding: '0.4rem 0.8rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                  title="Go to Admin Dashboard"
                >
                  <ShieldCheck size={14} />
                  <span>Admin Dashboard</span>
                </button>

                <button
                  className="btn btn-sm btn-secondary"
                  onClick={logoutUser}
                  style={{
                    fontSize: '0.8rem',
                    padding: '0.4rem 0.75rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                  title="Log out from Admin account"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              /* User is logged in: Customer Controls */
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => handleNavClick('profile')}
                  style={{
                    fontSize: '0.8rem',
                    padding: '0.4rem 0.8rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                  title="My Profile & Orders"
                >
                  <User size={14} />
                  <span>{currentUser.name ? currentUser.name.split(' ')[0] : 'My Account'}</span>
                </button>

                <button
                  className="btn btn-sm btn-secondary"
                  onClick={logoutUser}
                  style={{
                    fontSize: '0.8rem',
                    padding: '0.4rem 0.75rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                  title="Sign out"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            )}

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
            {!currentUser.isLoggedIn ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => { openAuthModal('user-login'); setMobileMenuOpen(false); }}>
                    <LogIn size={14} /> User Login
                  </button>
                  <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => { openAuthModal('user-register'); setMobileMenuOpen(false); }}>
                    <UserPlus size={14} /> Register
                  </button>
                </div>
                <button
                  className="btn btn-sm"
                  style={{ border: '1.5px solid #d97706', background: 'rgba(245, 158, 11, 0.1)', color: '#b45309', fontWeight: 700 }}
                  onClick={() => { openAuthModal('admin-login'); setMobileMenuOpen(false); }}
                >
                  <Lock size={14} /> Admin Portal Login
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', padding: '0.5rem', background: 'var(--bg-page)', borderRadius: 'var(--radius-md)' }}>
                <span>Logged in: <strong>{currentUser.name}</strong></span>
                <button className="btn btn-sm btn-secondary" onClick={() => { logoutUser(); setMobileMenuOpen(false); }}>
                  <LogOut size={13} /> Logout
                </button>
              </div>
            )}

            <button className="nav-btn" onClick={() => handleNavClick('home')}>Home</button>
            <button className="nav-btn" onClick={() => handleNavClick('catalog')}>Medicines & Prices</button>
            <button className="nav-btn" onClick={() => handleNavClick('customer-req')}>Customer Requirements</button>
            <button className="nav-btn" onClick={() => handleNavClick('services')}>Services</button>
            {currentUser.role === 'admin' && (
              <>
                <button className="nav-btn" onClick={() => handleNavClick('stock')}>Stock & Report (Admin)</button>
                <button className="nav-btn" onClick={() => handleNavClick('orders')}>Daily & Pending Orders (Admin)</button>
              </>
            )}
            <button className="nav-btn" onClick={() => handleNavClick('owner')}>Owner Page</button>
            <button className="nav-btn" onClick={() => handleNavClick('profile')}>User Profile</button>
          </div>
        )}
      </nav>
    </header>
  );
};
