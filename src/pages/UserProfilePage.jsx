import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  User,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShoppingBag,
  FileCheck,
  Edit2,
  CheckCircle2,
  UploadCloud,
  LogOut,
  KeyRound,
  LogIn,
  UserPlus,
  Lock,
  AlertCircle,
  Sparkles,
  Smartphone,
  LayoutDashboard,
  ArrowRight
} from 'lucide-react';

export const UserProfilePage = () => {
  const {
    currentUser,
    setCurrentUser,
    loginUser,
    loginAdmin,
    registerUser,
    logoutUser,
    updateUserProfile,
    orders,
    setActiveInvoiceOrder,
    setIsPrescriptionModalOpen,
    setActiveTab,
    showToast
  } = useStore();

  const [authMode, setAuthMode] = useState(currentUser.isLoggedIn ? 'profile' : 'user-login'); // 'profile', 'user-login', 'user-register', 'admin-login'
  const [activeSubTab, setActiveSubTab] = useState('orders'); // 'orders', 'prescriptions'
  const [isEditing, setIsEditing] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Profile Edit Form State
  const [profileForm, setProfileForm] = useState({
    name: currentUser.name || '',
    phone: currentUser.phone || '',
    email: currentUser.email || '',
    address: currentUser.address || 'Sawkhed Tejan, Tq. Sindkhed Raja, Dist. Buldhana'
  });

  // User/Customer Login Form State
  const [userLoginForm, setUserLoginForm] = useState({
    email: 'satyam@example.com',
    password: 'customer123'
  });

  // Admin Login Form State
  const [adminLoginForm, setAdminLoginForm] = useState({
    email: 'admin@gurumedical.com',
    password: 'admin123'
  });

  // Customer Register Form State (Strictly role: 'customer')
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: 'Sawkhed Tejan, Sindkhed Raja'
  });

  const userOrders = orders.filter(
    o => o.customerPhone === currentUser.phone || o.customerName === currentUser.name
  );

  const handleProfileSave = async (e) => {
    e.preventDefault();
    await updateUserProfile(profileForm);
    setIsEditing(false);
    showToast('Profile updated successfully!');
  };

  const handleUserLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setIsLoading(true);
    const result = await loginUser(userLoginForm.email, userLoginForm.password);
    setIsLoading(false);
    if (result.success) {
      setAuthSuccess(`Logged in successfully as customer: ${result.user.name}!`);
      setAuthMode('profile');
      setProfileForm({
        name: result.user.name || '',
        phone: result.user.phone || '',
        email: result.user.email || '',
        address: result.user.address || ''
      });
    } else {
      setAuthError(result.error || 'Invalid customer email or password.');
    }
  };

  const handleAdminLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setIsLoading(true);
    const result = await loginAdmin(adminLoginForm.email, adminLoginForm.password);
    setIsLoading(false);
    if (result.success) {
      setAuthSuccess(`Administrator authenticated: ${result.user.name}. Redirecting to Admin Dashboard...`);
      setAuthMode('profile');
      setProfileForm({
        name: result.user.name || '',
        phone: result.user.phone || '',
        email: result.user.email || '',
        address: result.user.address || ''
      });
    } else {
      setAuthError(result.error || 'Admin login failed. Please verify administrator credentials.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setIsLoading(true);
    const result = await registerUser({ ...registerForm, role: 'customer' });
    setIsLoading(false);
    if (result.success) {
      setAuthSuccess(`Account created successfully! Welcome, ${result.user.name}!`);
      setAuthMode('profile');
      setProfileForm({
        name: result.user.name || '',
        phone: result.user.phone || '',
        email: result.user.email || '',
        address: result.user.address || ''
      });
    } else {
      setAuthError(result.error || 'Registration failed. Please check your details.');
    }
  };

  const quickDemoUserLogin = async () => {
    setUserLoginForm({ email: 'satyam@example.com', password: 'customer123' });
    setAuthError('');
    setAuthSuccess('');
    setIsLoading(true);
    const result = await loginUser('satyam@example.com', 'customer123');
    setIsLoading(false);
    if (result.success) {
      setAuthSuccess(`Logged in as Customer: ${result.user.name}!`);
      setAuthMode('profile');
      setProfileForm({
        name: result.user.name || '',
        phone: result.user.phone || '',
        email: result.user.email || '',
        address: result.user.address || ''
      });
    } else {
      setAuthError(result.error || 'Customer login failed.');
    }
  };

  const quickDemoAdminLogin = async () => {
    setAdminLoginForm({ email: 'admin@gurumedical.com', password: 'admin123' });
    setAuthError('');
    setAuthSuccess('');
    setIsLoading(true);
    const result = await loginAdmin('admin@gurumedical.com', 'admin123');
    setIsLoading(false);
    if (result.success) {
      setAuthSuccess(`Logged in as Administrator: ${result.user.name}!`);
      setAuthMode('profile');
      setProfileForm({
        name: result.user.name || '',
        phone: result.user.phone || '',
        email: result.user.email || '',
        address: result.user.address || ''
      });
    } else {
      setAuthError(result.error || 'Admin login failed.');
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      {/* Header */}
      <div className="section-header" style={{ marginBottom: '1.75rem' }}>
        <h1 className="section-title">User Authentication & Account Profile</h1>
        <p className="section-desc">
          Manage your account credentials, view order history, and access saved prescriptions.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2.5rem',
        alignItems: 'start'
      }}>
        {/* Left Column: Auth Card / Profile Card */}
        <div>
          {/* Auth Tab Toggle */}
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <button
              className={`btn btn-sm ${authMode === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1, minWidth: '95px' }}
              onClick={() => { setAuthMode('profile'); setAuthError(''); setAuthSuccess(''); }}
            >
              <User size={14} />
              <span>Profile</span>
            </button>

            <button
              className={`btn btn-sm ${authMode === 'user-login' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1, minWidth: '105px' }}
              onClick={() => { setAuthMode('user-login'); setAuthError(''); setAuthSuccess(''); }}
            >
              <LogIn size={14} />
              <span>User Sign In</span>
            </button>

            <button
              className={`btn btn-sm ${authMode === 'user-register' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1, minWidth: '95px' }}
              onClick={() => { setAuthMode('user-register'); setAuthError(''); setAuthSuccess(''); }}
            >
              <UserPlus size={14} />
              <span>Register</span>
            </button>

            <button
              className={`btn btn-sm ${authMode === 'admin-login' ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                flex: 1,
                minWidth: '110px',
                background: authMode === 'admin-login' ? 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)' : undefined,
                color: authMode === 'admin-login' ? '#fff' : undefined,
                borderColor: authMode === 'admin-login' ? '#1d4ed8' : undefined
              }}
              onClick={() => { setAuthMode('admin-login'); setAuthError(''); setAuthSuccess(''); }}
            >
              <ShieldCheck size={14} />
              <span>Admin Portal</span>
            </button>
          </div>

          {/* Feedback Alerts */}
          {authError && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #ef4444',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              color: '#ef4444',
              fontSize: '0.88rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={16} />
              <span>{authError}</span>
            </div>
          )}

          {authSuccess && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid #10b981',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              color: '#10b981',
              fontSize: '0.88rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <CheckCircle2 size={16} />
              <span>{authSuccess}</span>
            </div>
          )}

          {/* 1. USER / CUSTOMER SIGN IN FORM */}
          {authMode === 'user-login' && (
            <div className="card" style={{ padding: '2rem', border: '1.5px solid var(--primary-glow)' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={18} color="var(--primary)" />
                  <span>Customer Sign In</span>
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Sign in with your customer account to place orders, upload prescriptions, and view bills.
                </p>
              </div>

              {/* Quick Demo Customer Account */}
              <div style={{ marginBottom: '1.5rem', background: 'var(--bg-page)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  ⚡ Quick Demo Customer Account:
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.8rem', width: '100%' }}
                  onClick={quickDemoUserLogin}
                >
                  👤 Login as Customer (Satyam - satyam@example.com)
                </button>
              </div>

              <form onSubmit={handleUserLoginSubmit}>
                <div className="form-group">
                  <label className="form-label">Customer Email Address</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    placeholder="e.g. satyam@example.com"
                    value={userLoginForm.email}
                    onChange={e => setUserLoginForm({ ...userLoginForm, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    required
                    className="form-input"
                    placeholder="Enter customer password"
                    value={userLoginForm.password}
                    onChange={e => setUserLoginForm({ ...userLoginForm, password: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                  disabled={isLoading}
                >
                  <LogIn size={16} />
                  <span>{isLoading ? 'Signing In...' : 'Sign In as Customer'}</span>
                </button>
              </form>
            </div>
          )}

          {/* 2. ADMIN PORTAL SIGN IN FORM */}
          {authMode === 'admin-login' && (
            <div className="card" style={{ padding: '2rem', border: '1.5px solid #2563eb', boxShadow: '0 4px 20px rgba(37, 99, 235, 0.12)' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                  <ShieldCheck size={13} />
                  <span>RESTRICTED ACCESS</span>
                </div>
                <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e40af' }}>
                  <Lock size={18} color="#2563eb" />
                  <span>Admin Portal Sign In</span>
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Restricted to authorized store owners and administrators for inventory and orders management.
                </p>
              </div>

              {/* Quick Demo Admin Account */}
              <div style={{ marginBottom: '1.5rem', background: 'rgba(37, 99, 235, 0.05)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(37, 99, 235, 0.2)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1e40af' }}>
                  👑 Store Owner / Administrator:
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.8rem', width: '100%', borderColor: '#3b82f6', color: '#1d4ed8' }}
                  onClick={quickDemoAdminLogin}
                >
                  ⚡ Fill & Login as Admin (admin@gurumedical.com)
                </button>
              </div>

              <form onSubmit={handleAdminLoginSubmit}>
                <div className="form-group">
                  <label className="form-label">Administrator Email</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    placeholder="e.g. admin@gurumedical.com"
                    value={adminLoginForm.email}
                    onChange={e => setAdminLoginForm({ ...adminLoginForm, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Admin Password</label>
                  <input
                    type="password"
                    required
                    className="form-input"
                    placeholder="Enter admin password"
                    value={adminLoginForm.password}
                    onChange={e => setAdminLoginForm({ ...adminLoginForm, password: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    marginTop: '0.5rem',
                    background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
                    borderColor: '#1d4ed8'
                  }}
                  disabled={isLoading}
                >
                  <ShieldCheck size={16} />
                  <span>{isLoading ? 'Verifying Admin Privileges...' : 'Sign In to Admin Dashboard'}</span>
                </button>
              </form>
            </div>
          )}

          {/* 3. CUSTOMER REGISTRATION FORM */}
          {authMode === 'user-register' && (
            <div className="card" style={{ padding: '2rem', border: '1.5px solid var(--primary-glow)' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UserPlus size={18} color="var(--primary)" />
                  <span>Create Customer Account</span>
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Create an account to order genuine medicines with free delivery in Sawkhed Tejan.
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Ramesh Deshmukh"
                    value={registerForm.name}
                    onChange={e => setRegisterForm({ ...registerForm, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    placeholder="e.g. ramesh@example.com"
                    value={registerForm.email}
                    onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    required
                    className="form-input"
                    placeholder="Create a password"
                    value={registerForm.password}
                    onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="e.g. 9822334455"
                    value={registerForm.phone}
                    onChange={e => setRegisterForm({ ...registerForm, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Delivery Address</label>
                  <textarea
                    rows={2}
                    className="form-textarea"
                    placeholder="e.g. Near Gram Panchayat, Sawkhed Tejan"
                    value={registerForm.address}
                    onChange={e => setRegisterForm({ ...registerForm, address: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                  disabled={isLoading}
                >
                  <UserPlus size={16} />
                  <span>{isLoading ? 'Creating Account...' : 'Register Customer Account'}</span>
                </button>
              </form>
            </div>
          )}

          {/* 4. PROFILE VIEW & EDIT */}
          {authMode === 'profile' && (
            <div className="card" style={{ padding: '2rem', border: '1.5px solid var(--primary-glow)' }}>
              {currentUser.isLoggedIn ? (
                <>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    paddingBottom: '1.5rem',
                    borderBottom: '1px solid var(--border-color)',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: currentUser.role === 'admin'
                        ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                        : 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      fontWeight: 800,
                      marginBottom: '1rem',
                      boxShadow: 'var(--shadow-md)'
                    }}>
                      {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                    </div>

                    <h3 style={{ fontSize: '1.35rem', margin: '0 0 0.25rem 0' }}>{currentUser.name}</h3>

                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: currentUser.role === 'admin' ? 'rgba(37, 99, 235, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                      color: currentUser.role === 'admin' ? '#2563eb' : '#059669',
                      padding: '0.3rem 0.85rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      marginTop: '0.25rem'
                    }}>
                      <ShieldCheck size={14} />
                      <span>{currentUser.role === 'admin' ? 'Store Owner / Admin' : 'Registered Customer'}</span>
                    </div>

                    {currentUser.role === 'admin' && (
                      <button
                        className="btn btn-primary btn-sm"
                        style={{
                          marginTop: '0.85rem',
                          background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
                          borderColor: '#1d4ed8'
                        }}
                        onClick={() => setActiveTab('stock')}
                      >
                        <LayoutDashboard size={14} />
                        <span>Go to Admin Dashboard</span>
                        <ArrowRight size={13} />
                      </button>
                    )}
                  </div>

                  {/* Profile Details or Live Edit Form */}
                  {isEditing ? (
                    <form onSubmit={handleProfileSave}>
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          value={profileForm.name}
                          onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="tel"
                          required
                          className="form-input"
                          value={profileForm.phone}
                          onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                          type="email"
                          className="form-input"
                          value={profileForm.email}
                          onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Default Delivery Address</label>
                        <textarea
                          className="form-textarea"
                          rows={2}
                          value={profileForm.address}
                          onChange={e => setProfileForm({ ...profileForm, address: e.target.value })}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                          Save Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)' }}>
                          <Phone size={16} color="var(--primary)" />
                          <span><strong>Phone:</strong> {currentUser.phone || 'Not set'}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)' }}>
                          <Mail size={16} color="var(--primary)" />
                          <span><strong>Email:</strong> {currentUser.email || 'Not set'}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: 'var(--text-secondary)' }}>
                          <MapPin size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '3px' }} />
                          <span><strong>Address:</strong> {currentUser.address || 'Not set'}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <button
                          className="btn btn-secondary"
                          style={{ width: '100%' }}
                          onClick={() => {
                            setProfileForm({
                              name: currentUser.name || '',
                              phone: currentUser.phone || '',
                              email: currentUser.email || '',
                              address: currentUser.address || ''
                            });
                            setIsEditing(true);
                          }}
                        >
                          <Edit2 size={15} />
                          <span>Edit Profile Credentials</span>
                        </button>

                        <button
                          className="btn btn-outline-danger"
                          style={{ width: '100%', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
                          onClick={logoutUser}
                        >
                          <LogOut size={15} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Guest View */
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <User size={42} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
                  <h3 style={{ marginBottom: '0.5rem' }}>Browsing as Guest</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    Sign in to your customer account or administrator portal to access your account features.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <button
                      className="btn btn-primary"
                      onClick={() => setAuthMode('user-login')}
                    >
                      <LogIn size={15} />
                      <span>Sign In as Customer</span>
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setAuthMode('admin-login')}
                      style={{ border: '1px solid #3b82f6', color: '#1d4ed8' }}
                    >
                      <ShieldCheck size={15} />
                      <span>Admin Portal Login</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Order History & Prescription Archive */}
        <div>
          {/* Subtabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <button
              className={`btn ${activeSubTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveSubTab('orders')}
            >
              <ShoppingBag size={16} />
              <span>My Orders ({userOrders.length})</span>
            </button>

            <button
              className={`btn ${activeSubTab === 'prescriptions' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveSubTab('prescriptions')}
            >
              <FileCheck size={16} />
              <span>Saved Prescriptions</span>
            </button>
          </div>

          {/* Orders Tab Content */}
          {activeSubTab === 'orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {userOrders.map(order => (
                <div key={order.id} className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                        Order #{order.id}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Date: {order.orderDate} • Paid via: {order.paymentMethod}
                      </div>
                    </div>

                    <span className="badge badge-info">{order.status}</span>
                  </div>

                  <div style={{ fontSize: '0.86rem', marginBottom: '0.75rem' }}>
                    <div style={{ color: 'var(--text-secondary)' }}>
                      <strong>Items ({order.items.length}):</strong> {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-color)'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Medicine Bill Total:</div>
                      <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                        ₹{order.totalAmount.toFixed(2)}
                      </span>
                    </div>

                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setActiveInvoiceOrder(order)}
                    >
                      <FileCheck size={14} />
                      <span>View Bill</span>
                    </button>
                  </div>

                  {/* Payment Details strictly below medicine bill total */}
                  <div style={{
                    marginTop: '0.75rem',
                    padding: '0.75rem 1rem',
                    background: 'var(--bg-page)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.82rem'
                  }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Smartphone size={14} color="var(--primary)" />
                      <span>Payment Details</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                      <span>UPI ID: <strong style={{ color: 'var(--text-primary)' }}>8237729148@upi</strong></span>
                      <span>UPI Connected Mobile Number: <strong style={{ color: 'var(--text-primary)' }}>[8237729148]</strong></span>
                    </div>
                  </div>
                </div>
              ))}

              {userOrders.length === 0 && (
                <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <ShoppingBag size={36} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
                  <h4>No orders found for this account</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Place your first online medicine order with free delivery in Sawkhed Tejan.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Prescriptions Tab Content */}
          {activeSubTab === 'prescriptions' && (
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Doctor's Prescriptions</h3>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsPrescriptionModalOpen(true)}
                >
                  <UploadCloud size={15} />
                  <span>Upload New</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{
                  background: 'var(--bg-page)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Dr. Deshmukh (Sindkhed Raja) — Cardiac Rx</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Uploaded on 2026-09-10 • Verified by Pharmacist</div>
                  </div>
                  <span className="badge badge-success">Active & Verified</span>
                </div>

                <div style={{
                  background: 'var(--bg-page)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Dr. Kulkarni — Diabetes Care Refill</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Uploaded on 2026-08-15 • Verified by Pharmacist</div>
                  </div>
                  <span className="badge badge-success">Active & Verified</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
