import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Pill,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  ShieldCheck,
  Heart,
  FileText,
  Mail
} from 'lucide-react';

export const Footer = () => {
  const { storeDetails, setActiveTab, getWhatsAppOrderUrl } = useStore();

  return (
    <footer className="footer" style={{
      backgroundColor: 'var(--bg-card)',
      borderTop: '1px solid var(--border-color)',
      padding: '3.5rem 0 1.5rem 0',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem'
        }}>
          {/* Col 1: Store & Owner Bio */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="brand-icon-box" style={{ width: '38px', height: '38px' }}>
                <Pill size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{storeDetails.name}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{storeDetails.marathiName}</span>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              {storeDetails.tagline}. Dedicated to providing genuine, affordable medicines, rapid rural delivery, and expert pharmaceutical care.
            </p>
            <div style={{
              background: 'var(--primary-subtle)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--primary-glow)'
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
                Proprietor: {storeDetails.ownerName}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {storeDetails.ownerRole}
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Quick Navigation</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li>
                <button
                  onClick={() => { setActiveTab('catalog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem', padding: 0 }}
                >
                  → Medicine Prices & Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('customer-req'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem', padding: 0 }}
                >
                  → Submit Customer Requirement
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('stock'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem', padding: 0 }}
                >
                  → Live Stock & Inventory Report
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('orders'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem', padding: 0 }}
                >
                  → View Daily & Pending Orders
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('owner'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem', padding: 0 }}
                >
                  → Owner Profile & Licenses
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Timings */}
          <div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Store Contact & Timings</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <MapPin size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{storeDetails.address}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Phone size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>Call: <a href={`tel:${storeDetails.contactNumber}`} style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>+91 {storeDetails.contactNumber}</a></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <MessageSquare size={18} color="#16a34a" style={{ flexShrink: 0 }} />
                <span>WhatsApp: <a href={getWhatsAppOrderUrl()} target="_blank" rel="noopener noreferrer" style={{ color: '#16a34a', fontWeight: 700, textDecoration: 'none' }}>+91 {storeDetails.contactNumber}</a></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Clock size={18} color="var(--accent)" style={{ flexShrink: 0 }} />
                <span>{storeDetails.timings}</span>
              </div>
            </div>
          </div>

          {/* Col 4: Verified Compliance */}
          <div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Compliance & License</h4>
            <div style={{
              background: 'var(--bg-card-hover)',
              padding: '1.2rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              fontSize: '0.82rem',
              color: 'var(--text-secondary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-dark)', fontWeight: 700, marginBottom: '0.4rem' }}>
                <ShieldCheck size={16} />
                <span>FDA Maharashtra Approved</span>
              </div>
              <p style={{ margin: '0 0 0.4rem 0' }}><strong>DL No:</strong> {storeDetails.drugLicenseNo}</p>
              <p style={{ margin: '0 0 0.6rem 0' }}><strong>GSTIN:</strong> {storeDetails.gstNumber}</p>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Prescriptions required for Schedule H & H1 medications. All sales comply with Drugs & Cosmetics Act.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.85rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} <strong>{storeDetails.name}</strong>. Owned & Managed by <strong>{storeDetails.ownerName}</strong>. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span>Serving Sawkhed Tejan & Sindkhed Raja with</span>
            <Heart size={14} color="var(--danger)" fill="var(--danger)" />
          </div>
        </div>
      </div>
    </footer>
  );
};
