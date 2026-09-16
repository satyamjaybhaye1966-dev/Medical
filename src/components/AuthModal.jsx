import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  LogIn,
  UserPlus,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AuthModal = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    loginAdmin,
    loginUser,
    registerUser
  } = useStore();

  const [loginForm, setLoginForm] = useState({
    email: 'admin@gurumedical.com',
    password: 'admin123'
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
    phone: '',
    address: 'Sawkhed Tejan, Sindkhed Raja'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');

  // Switch default form fields based on mode
  useEffect(() => {
    setModalError('');
    setModalSuccess('');
    if (authModalMode === 'admin-login') {
      setLoginForm({ email: 'admin@gurumedical.com', password: 'admin123' });
    } else if (authModalMode === 'user-login' || authModalMode === 'login') {
      setLoginForm({ email: 'satyam@example.com', password: 'customer123' });
    }
  }, [authModalMode]);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setModalError('');
    setModalSuccess('');
    setIsAuthModalOpen(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');
    setIsLoading(true);

    let res;
    if (authModalMode === 'admin-login') {
      res = await loginAdmin(loginForm.email, loginForm.password);
    } else {
      res = await loginUser(loginForm.email, loginForm.password);
    }

    setIsLoading(false);
    if (res.success) {
      setModalSuccess(`Logged in as ${res.user.name}!`);
      setTimeout(() => {
        handleClose();
      }, 600);
    } else {
      setModalError(res.error || 'Invalid email or password.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');
    setIsLoading(true);
    const res = await registerUser(registerForm);
    setIsLoading(false);
    if (res.success) {
      setModalSuccess(`Account created! Welcome, ${res.user.name}!`);
      setTimeout(() => {
        handleClose();
      }, 600);
    } else {
      setModalError(res.error || 'Registration failed.');
    }
  };

  const quickFillAndLogin = async (email, password, mode) => {
    setLoginForm({ email, password });
    setModalError('');
    setModalSuccess('');
    setIsLoading(true);

    let res;
    if (mode === 'admin-login') {
      res = await loginAdmin(email, password);
    } else {
      res = await loginUser(email, password);
    }

    setIsLoading(false);
    if (res.success) {
      setModalSuccess(`Logged in as ${res.user.name}!`);
      setTimeout(() => {
        handleClose();
      }, 600);
    } else {
      setModalError(res.error || 'Login failed.');
    }
  };

  const isAdminMode = authModalMode === 'admin-login';
  const isRegisterMode = authModalMode === 'user-register' || authModalMode === 'register';

  return (
    <div className="modal-overlay modal-backdrop" onClick={handleClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '480px', width: '90%', borderRadius: 'var(--radius-xl)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: isAdminMode ? 'rgba(245, 158, 11, 0.15)' : 'var(--primary-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isAdminMode ? '#b45309' : 'var(--primary-dark)'
            }}>
              {isAdminMode ? <Lock size={18} /> : isRegisterMode ? <UserPlus size={18} /> : <LogIn size={18} />}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                {isAdminMode ? 'Store Administrator Portal' : isRegisterMode ? 'Create Customer Account' : 'Customer Sign In'}
              </h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {isAdminMode
                  ? 'Authorized Pharmacist & Management Access'
                  : isRegisterMode
                  ? 'Register for fast medicine ordering & bills'
                  : 'Sign in to access your prescriptions and orders'}
              </div>
            </div>
          </div>

          <button className="btn-icon" onClick={handleClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Mode Selector Tabs: Separate User Login, Register, Admin Login */}
        <div style={{
          display: 'flex',
          padding: '0.75rem 1.5rem 0 1.5rem',
          gap: '0.4rem',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <button
            type="button"
            className="btn btn-sm"
            style={{
              flex: 1,
              borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
              borderBottom: (!isAdminMode && !isRegisterMode) ? '3px solid var(--primary)' : '3px solid transparent',
              background: (!isAdminMode && !isRegisterMode) ? 'var(--primary-subtle)' : 'transparent',
              color: (!isAdminMode && !isRegisterMode) ? 'var(--primary-dark)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.78rem'
            }}
            onClick={() => setAuthModalMode('user-login')}
          >
            <User size={13} />
            <span>User Login</span>
          </button>

          <button
            type="button"
            className="btn btn-sm"
            style={{
              flex: 1,
              borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
              borderBottom: isRegisterMode ? '3px solid var(--primary)' : '3px solid transparent',
              background: isRegisterMode ? 'var(--primary-subtle)' : 'transparent',
              color: isRegisterMode ? 'var(--primary-dark)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.78rem'
            }}
            onClick={() => setAuthModalMode('user-register')}
          >
            <UserPlus size={13} />
            <span>Register</span>
          </button>

          <button
            type="button"
            className="btn btn-sm"
            style={{
              flex: 1,
              borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
              borderBottom: isAdminMode ? '3px solid #d97706' : '3px solid transparent',
              background: isAdminMode ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
              color: isAdminMode ? '#b45309' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.78rem'
            }}
            onClick={() => setAuthModalMode('admin-login')}
          >
            <Lock size={13} />
            <span>Admin Portal</span>
          </button>
        </div>

        <div className="modal-body" style={{ padding: '1.5rem' }}>
          {/* Feedback Alerts */}
          {modalError && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #ef4444',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 0.85rem',
              color: '#ef4444',
              fontSize: '0.85rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={16} color="#ef4444" />
              <span>{modalError}</span>
            </div>
          )}

          {modalSuccess && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid #10b981',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 0.85rem',
              color: '#10b981',
              fontSize: '0.85rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span>{modalSuccess}</span>
            </div>
          )}

          {/* Quick Demo Login Badges */}
          {!isRegisterMode && (
            <div style={{
              background: 'var(--bg-page)',
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              marginBottom: '1.25rem'
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                {isAdminMode ? '⚡ Quick Admin Login Credentials:' : '⚡ Quick Customer Login Credentials:'}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {isAdminMode ? (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                    onClick={() => quickFillAndLogin('admin@gurumedical.com', 'admin123', 'admin-login')}
                  >
                    👑 Store Administrator (MR. Rushikesh Mante)
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                    onClick={() => quickFillAndLogin('satyam@example.com', 'customer123', 'user-login')}
                  >
                    👤 Regular Customer (Satyam)
                  </button>
                )}
              </div>
            </div>
          )}

          {/* LOGIN FORM (User Login OR Admin Login) */}
          {!isRegisterMode ? (
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={14} color={isAdminMode ? '#d97706' : 'var(--primary)'} />
                  <span>{isAdminMode ? 'Admin Email Address' : 'User Email Address'}</span>
                </label>
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder={isAdminMode ? 'admin@gurumedical.com' : 'satyam@example.com'}
                  value={loginForm.email}
                  onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Lock size={14} color={isAdminMode ? '#d97706' : 'var(--primary)'} />
                  <span>Password</span>
                </label>
                <input
                  type="password"
                  required
                  className="form-input"
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className={isAdminMode ? 'btn btn-primary' : 'btn btn-primary'}
                style={{
                  width: '100%',
                  marginTop: '0.75rem',
                  background: isAdminMode ? '#d97706' : undefined,
                  borderColor: isAdminMode ? '#b45309' : undefined
                }}
                disabled={isLoading}
              >
                {isAdminMode ? <ShieldCheck size={16} /> : <LogIn size={16} />}
                <span>{isLoading ? 'Signing In...' : isAdminMode ? 'Sign In to Admin Dashboard' : 'Sign In as Customer'}</span>
              </button>

              <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {isAdminMode ? (
                  <span>
                    Need regular shopping?{' '}
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                      onClick={() => setAuthModalMode('user-login')}
                    >
                      Switch to User Login
                    </button>
                  </span>
                ) : (
                  <span>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                      onClick={() => setAuthModalMode('user-register')}
                    >
                      Register Now
                    </button>
                  </span>
                )}
              </div>
            </form>
          ) : (
            /* REGISTER FORM (Regular Customer) */
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={14} color="var(--primary)" />
                  <span>Full Name</span>
                </label>
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
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={14} color="var(--primary)" />
                  <span>Email Address</span>
                </label>
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
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Lock size={14} color="var(--primary)" />
                  <span>Create Password</span>
                </label>
                <input
                  type="password"
                  required
                  className="form-input"
                  placeholder="••••••••"
                  value={registerForm.password}
                  onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Phone size={14} color="var(--primary)" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="e.g. 9822334455"
                  value={registerForm.phone}
                  onChange={e => setRegisterForm({ ...registerForm, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={14} color="var(--primary)" />
                  <span>Delivery Address</span>
                </label>
                <textarea
                  rows={2}
                  className="form-textarea"
                  placeholder="e.g. Sawkhed Tejan, Sindkhed Raja"
                  value={registerForm.address}
                  onChange={e => setRegisterForm({ ...registerForm, address: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.75rem' }}
                disabled={isLoading}
              >
                <UserPlus size={16} />
                <span>{isLoading ? 'Creating Account...' : 'Register Customer Account'}</span>
              </button>

              <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Already have an account?{' '}
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                  onClick={() => setAuthModalMode('user-login')}
                >
                  Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
