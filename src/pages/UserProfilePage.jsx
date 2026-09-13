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
  Database,
  Lock,
  AlertCircle,
  Sparkles,
  Server
} from 'lucide-react';

export const UserProfilePage = () => {
  const {
    currentUser,
    setCurrentUser,
    loginUser,
    registerUser,
    logoutUser,
    updateUserProfile,
    dbStatus,
    orders,
    setActiveInvoiceOrder,
    setIsPrescriptionModalOpen,
    showToast
  } = useStore();

  const [authMode, setAuthMode] = useState(currentUser.isLoggedIn ? 'profile' : 'login'); // 'profile', 'login', 'register'
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

  // Login Form State
  const [loginForm, setLoginForm] = useState({
    email: 'admin@gurumedical.com',
    password: 'admin123'
  });

  // Register Form State
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
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
    showToast('Profile updated in PostgreSQL / Storage successfully!');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setIsLoading(true);
    const result = await loginUser(loginForm.email, loginForm.password);
    setIsLoading(false);
    if (result.success) {
      setAuthSuccess(`Logged in successfully as ${result.user.name}!`);
      setAuthMode('profile');
      setProfileForm({
        name: result.user.name || '',
        phone: result.user.phone || '',
        email: result.user.email || '',
        address: result.user.address || ''
      });
    } else {
      setAuthError(result.error || 'Invalid email or password.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setIsLoading(true);
    const result = await registerUser(registerForm);
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

  const quickDemoLogin = async (email, password) => {
    setLoginForm({ email, password });
    setAuthError('');
    setAuthSuccess('');
    setIsLoading(true);
    const result = await loginUser(email, password);
    setIsLoading(false);
    if (result.success) {
      setAuthSuccess(`Logged in as ${result.user.name}!`);
      setAuthMode('profile');
      setProfileForm({
        name: result.user.name || '',
        phone: result.user.phone || '',
        email: result.user.email || '',
        address: result.user.address || ''
      });
    } else {
      setAuthError(result.error || 'Login failed.');
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      {/* Header */}
      <div className="section-header" style={{ marginBottom: '1.75rem' }}>
        <span className="section-tag">
          <Database size={14} />
          <span>PostgreSQL Auth & User Center</span>
        </span>
        <h1 className="section-title">User Authentication & Account Profile</h1>
        <p className="section-desc">
          Secure user authentication backed by PostgreSQL database. Login, manage credentials, and review orders.
        </p>
      </div>

      {/* Database Connection Banner */}
      <div style={{
        background: dbStatus.connected ? 'rgba(16, 185, 129, 0.08)' : 'rgba(59, 130, 246, 0.08)',
        border: `1.5px solid ${dbStatus.connected ? '#10b981' : '#3b82f6'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Server size={22} color={dbStatus.connected ? '#10b981' : '#3b82f6'} />
            <div>
              <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                {dbStatus.connected ? '🐘 PostgreSQL Database: Connected & Synchronized' : '🐘 PostgreSQL Ready / Local Persistent Storage Active'}
              </strong>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                Database: <code>guru_medical_db</code> • Table: <code>users</code> (Login credentials & Role-based authentication)
              </div>
            </div>
          </div>

          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 700,
            background: dbStatus.connected ? '#10b981' : '#3b82f6',
            color: '#fff'
          }}>
            <CheckCircle2 size={14} />
            <span>{dbStatus.connected ? 'PostgreSQL Active' : 'Fallback Storage Active'}</span>
          </span>
        </div>

        {!dbStatus.connected && (
          <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', borderTop: '1px dashed var(--border-color)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
            💡 <em>To connect your Mac's PostgreSQL instance:</em> Update <code>PGPASSWORD</code> in your root <code>.env</code> file with your PostgreSQL password, then run <code>npm run db:setup</code>.
          </div>
        )}
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
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <button
              className={`btn btn-sm ${authMode === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
              onClick={() => { setAuthMode('profile'); setAuthError(''); setAuthSuccess(''); }}
            >
              <User size={15} />
              <span>Current Profile</span>
            </button>

            <button
              className={`btn btn-sm ${authMode === 'login' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
              onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccess(''); }}
            >
              <LogIn size={15} />
              <span>Sign In</span>
            </button>

            <button
              className={`btn btn-sm ${authMode === 'register' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
              onClick={() => { setAuthMode('register'); setAuthError(''); setAuthSuccess(''); }}
            >
              <UserPlus size={15} />
              <span>Register</span>
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

          {/* 1. SIGN IN FORM */}
          {authMode === 'login' && (
            <div className="card" style={{ padding: '2rem', border: '1.5px solid var(--primary-glow)' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Lock size={18} color="var(--primary)" />
                  <span>Account Login</span>
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Sign in with your email and password credentials.
                </p>
              </div>

              {/* Quick Demo Login Badges */}
              <div style={{ marginBottom: '1.5rem', background: 'var(--bg-page)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  ⚡ Quick Demo Accounts (PostgreSQL Pre-Seeded):
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.78rem' }}
                    onClick={() => quickDemoLogin('admin@gurumedical.com', 'admin123')}
                  >
                    👑 Store Owner (Admin)
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.78rem' }}
                    onClick={() => quickDemoLogin('satyam@example.com', 'customer123')}
                  >
                    👤 Customer (Satyam)
                  </button>
                </div>
              </div>

              <form onSubmit={handleLoginSubmit}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    placeholder="e.g. admin@gurumedical.com"
                    value={loginForm.email}
                    onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    required
                    className="form-input"
                    placeholder="Enter password"
                    value={loginForm.password}
                    onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                  disabled={isLoading}
                >
                  <LogIn size={16} />
                  <span>{isLoading ? 'Signing In...' : 'Sign In to Account'}</span>
                </button>
              </form>
            </div>
          )}

          {/* 2. REGISTRATION FORM */}
          {authMode === 'register' && (
            <div className="card" style={{ padding: '2rem', border: '1.5px solid var(--primary-glow)' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UserPlus size={18} color="var(--primary)" />
                  <span>Create User Account</span>
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Stores your credentials securely in the PostgreSQL <code>users</code> table.
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
                  <label className="form-label">Account Role</label>
                  <select
                    className="form-input"
                    value={registerForm.role}
                    onChange={e => setRegisterForm({ ...registerForm, role: e.target.value })}
                  >
                    <option value="customer">Customer (Order medicines & prescriptions)</option>
                    <option value="admin">Store Admin / Owner (Full inventory control)</option>
                  </select>
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
                  <span>{isLoading ? 'Creating Account in Postgres...' : 'Register User'}</span>
                </button>
              </form>
            </div>
          )}

          {/* 3. PROFILE VIEW & EDIT */}
          {authMode === 'profile' && (
            <div className="card" style={{ padding: '2rem', border: '1.5px solid var(--primary-glow)' }}>
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
                      Save to Database
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
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                      ₹{order.totalAmount.toFixed(2)}
                    </span>

                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setActiveInvoiceOrder(order)}
                    >
                      <FileCheck size={14} />
                      <span>View Bill</span>
                    </button>
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
