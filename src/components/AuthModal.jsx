import React, { useState } from 'react';
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
  Database,
  Sparkles
} from 'lucide-react';

export const AuthModal = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    loginUser,
    registerUser,
    dbStatus
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
    const res = await loginUser(loginForm.email, loginForm.password);
    setIsLoading(false);
    if (res.success) {
      setModalSuccess(`Logged in as ${res.user.name}!`);
      setTimeout(() => {
        handleClose();
      }, 700);
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
      }, 700);
    } else {
      setModalError(res.error || 'Registration failed.');
    }
  };

  const quickFillAndLogin = async (email, password) => {
    setLoginForm({ email, password });
    setModalError('');
    setModalSuccess('');
    setIsLoading(true);
    const res = await loginUser(email, password);
    setIsLoading(false);
    if (res.success) {
      setModalSuccess(`Logged in as ${res.user.name}!`);
      setTimeout(() => {
        handleClose();
      }, 700);
    } else {
      setModalError(res.error || 'Login failed.');
    }
  };

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
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--primary-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-dark)'
            }}>
              {authModalMode === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                {authModalMode === 'login' ? 'Sign In to Guru Medical' : 'Create New Account'}
              </h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                PostgreSQL Database Authentication
              </div>
            </div>
          </div>

          <button className="btn-icon" onClick={handleClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div style={{
          display: 'flex',
          padding: '0.75rem 1.5rem 0 1.5rem',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <button
            type="button"
            className="btn btn-sm"
            style={{
              flex: 1,
              borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
              borderBottom: authModalMode === 'login' ? '3px solid var(--primary)' : '3px solid transparent',
              background: authModalMode === 'login' ? 'var(--primary-subtle)' : 'transparent',
              color: authModalMode === 'login' ? 'var(--primary-dark)' : 'var(--text-muted)',
              fontWeight: 700
            }}
            onClick={() => setAuthModalMode('login')}
          >
            <LogIn size={14} />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            className="btn btn-sm"
            style={{
              flex: 1,
              borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
              borderBottom: authModalMode === 'register' ? '3px solid var(--primary)' : '3px solid transparent',
              background: authModalMode === 'register' ? 'var(--primary-subtle)' : 'transparent',
              color: authModalMode === 'register' ? 'var(--primary-dark)' : 'var(--text-muted)',
              fontWeight: 700
            }}
            onClick={() => setAuthModalMode('register')}
          >
            <UserPlus size={14} />
            <span>Register</span>
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
              <CheckCircle2 size={16} color="#ef4444" />
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
          {authModalMode === 'login' && (
            <div style={{
              background: 'var(--bg-page)',
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              marginBottom: '1.25rem'
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                ⚡ Quick 1-Click Login (PostgreSQL Seeded Accounts):
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                  onClick={() => quickFillAndLogin('admin@gurumedical.com', 'admin123')}
                >
                  👑 Store Owner (Admin)
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                  onClick={() => quickFillAndLogin('satyam@example.com', 'customer123')}
                >
                  👤 Customer (Satyam)
                </button>
              </div>
            </div>
          )}

          {/* LOGIN FORM */}
          {authModalMode === 'login' ? (
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={14} color="var(--primary)" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="admin@gurumedical.com"
                  value={loginForm.email}
                  onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Lock size={14} color="var(--primary)" />
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
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.75rem' }}
                disabled={isLoading}
              >
                <LogIn size={16} />
                <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
              </button>

              <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Don't have an account?{' '}
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                  onClick={() => setAuthModalMode('register')}
                >
                  Register Now
                </button>
              </div>
            </form>
          ) : (
            /* REGISTER FORM */
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
                  <ShieldCheck size={14} color="var(--primary)" />
                  <span>Account Type / Role</span>
                </label>
                <select
                  className="form-input"
                  value={registerForm.role}
                  onChange={e => setRegisterForm({ ...registerForm, role: e.target.value })}
                >
                  <option value="customer">Customer (Order medicines & prescriptions)</option>
                  <option value="admin">Store Admin (Full inventory control)</option>
                </select>
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
                <span>{isLoading ? 'Creating Account...' : 'Create Account in Postgres'}</span>
              </button>

              <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Already have an account?{' '}
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                  onClick={() => setAuthModalMode('login')}
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
