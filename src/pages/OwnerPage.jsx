import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShieldCheck,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Award,
  CheckCircle2,
  Mail,
  Building,
  GraduationCap,
  Calendar,
  Send,
  Navigation
} from 'lucide-react';

export const OwnerPage = () => {
  const { storeDetails, getWhatsAppOrderUrl, showToast } = useStore();

  const [messageForm, setMessageForm] = useState({
    name: '',
    phone: '',
    subject: 'Consultation Inquiry',
    message: ''
  });
  const [messageSent, setMessageSent] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    setMessageSent(true);
    showToast(`Message sent to ${storeDetails.ownerName}!`);
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      {/* Header */}
      <div className="section-header">
        <span className="section-tag">
          <ShieldCheck size={14} />
          <span>Proprietor & Registered Pharmacist</span>
        </span>
        <h1 className="section-title">Meet the Store Owner</h1>
        <p className="section-desc">
          Professional pharmaceutical leadership serving the healthcare needs of Sawkhed Tejan, Sindkhed Raja, and Buldhana district.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2.5rem',
        alignItems: 'start'
      }}>
        {/* Left Column: Owner Profile Card & Bio */}
        <div>
          <div className="card" style={{
            border: '2px solid var(--primary-glow)',
            boxShadow: 'var(--shadow-xl)',
            padding: '2rem'
          }}>
            {/* Avatar & Header */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '1.75rem',
              marginBottom: '1.75rem'
            }}>
              <div style={{
                width: '110px',
                height: '110px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                fontWeight: 800,
                boxShadow: '0 8px 24px var(--primary-glow)',
                marginBottom: '1rem',
                border: '4px solid var(--bg-card)'
              }}>
                RM
              </div>

              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                {storeDetails.ownerName}
              </h2>

              <div style={{
                background: 'var(--primary-subtle)',
                color: 'var(--primary-dark)',
                padding: '0.3rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginBottom: '0.75rem'
              }}>
                {storeDetails.ownerRole}
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
                Proprietor of <strong>{storeDetails.name}</strong> ({storeDetails.marathiName}), Sawkhed Tejan.
              </p>
            </div>

            {/* Quick Action Contact Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.75rem' }}>
              <a
                href={`tel:${storeDetails.contactNumber}`}
                className="btn btn-primary"
                style={{ textDecoration: 'none' }}
              >
                <Phone size={16} />
                <span>Call 8237729148</span>
              </a>

              <a
                href={getWhatsAppOrderUrl(`Hello Mr. Rushikesh Mante, I am contacting you regarding Guru Medical Store.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ color: '#16a34a', borderColor: '#16a34a', textDecoration: 'none' }}
              >
                <MessageSquare size={16} />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Bio & Story */}
            <div style={{ marginBottom: '1.75rem' }}>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                About the Founder & Mission
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                <strong>MR. Rushikesh Suresh Mante</strong> established <strong>{storeDetails.name}</strong> with the vision of bridging the gap between rural healthcare needs and modern pharmaceutical availability.
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                With a deep focus on patient safety, genuine medicines, proper cold-chain maintenance for insulin and vaccines, and 24/7 emergency availability, Mr. Rushikesh is dedicated to serving the entire Sawkhed Tejan, Sindkhed Raja, and neighboring Buldhana region.
              </p>
            </div>

            {/* Qualifications & Credentials */}
            <div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                Professional Credentials & Registration
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  <GraduationCap size={16} color="var(--primary)" />
                  <span><strong>Qualifications:</strong> Diploma & Degree in Pharmacy (D.Pharm / B.Pharm)</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  <ShieldCheck size={16} color="var(--primary)" />
                  <span><strong>Registration:</strong> Registered Pharmacist, Maharashtra State Pharmacy Council (MSPC)</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  <Building size={16} color="var(--primary)" />
                  <span><strong>Drug License (20B / 21B):</strong> {storeDetails.drugLicenseNo}</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  <Award size={16} color="var(--primary)" />
                  <span><strong>GSTIN:</strong> {storeDetails.gstNumber}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Store Location, Timings, & Consultation Form */}
        <div>
          {/* Location & Operating Hours Card */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} color="var(--primary)" />
              <span>Store Location & Hours</span>
            </h3>

            <div style={{
              background: 'var(--bg-page)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              border: '1px solid var(--border-color)',
              marginBottom: '1.25rem',
              fontSize: '0.9rem'
            }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <strong>Full Address:</strong>
                <div style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  {storeDetails.address}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                  Landmark: {storeDetails.landmark}
                </div>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <strong>Operating Timings:</strong>
                <div style={{ color: 'var(--primary-dark)', fontWeight: 700, marginTop: '0.2rem' }}>
                  {storeDetails.timings}
                </div>
              </div>

              <div>
                <strong>Areas Covered with Doorstep Delivery:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.4rem' }}>
                  {storeDetails.surroundingAreasServed.map((area, i) => (
                    <span key={i} className="badge badge-info" style={{ fontSize: '0.75rem' }}>
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Map visual card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.15) 0%, rgba(2, 132, 199, 0.15) 100%)',
              border: '1px solid var(--primary-glow)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              textAlign: 'center'
            }}>
              <Navigation size={28} color="var(--primary)" style={{ margin: '0 auto 0.5rem auto' }} />
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                Visiting Sawkhed Tejan Store Counter?
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Located at Main Road, near Gram Panchayat. Easily accessible from Sindkhed Raja, Kingaon Jatu, and Dhotra.
              </p>
              <a
                href="https://maps.google.com/?q=Sawkhed+Tejan+Sindkhed+Raja+Buldhana"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary btn-sm"
              >
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>

          {/* Direct Message / Consultation Form */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={18} color="var(--primary)" />
              <span>Direct Message to Pharmacist Rushikesh Mante</span>
            </h3>

            {messageSent ? (
              <div style={{
                background: 'var(--primary-subtle)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center'
              }}>
                <CheckCircle2 size={32} color="var(--primary)" style={{ margin: '0 auto 0.5rem auto' }} />
                <div style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>Message Sent Successfully!</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                  Mr. Rushikesh will respond via WhatsApp or Call on your mobile number.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Your Name *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={messageForm.name}
                      onChange={e => setMessageForm({ ...messageForm, name: e.target.value })}
                      placeholder="e.g. Anand Shinde"
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      className="form-input"
                      value={messageForm.phone}
                      onChange={e => setMessageForm({ ...messageForm, phone: e.target.value })}
                      placeholder="10-digit mobile"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <select
                    className="form-select"
                    value={messageForm.subject}
                    onChange={e => setMessageForm({ ...messageForm, subject: e.target.value })}
                  >
                    <option value="Consultation Inquiry">Medicine Consultation / Dosage Advice</option>
                    <option value="Bulk Order for Clinic / Camp">Bulk Order / Health Camp Request</option>
                    <option value="Veterinary Medicine Inquiry">Veterinary / Livestock Medicine</option>
                    <option value="General Feedback">Store Feedback / Query</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Message Details</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    required
                    value={messageForm.message}
                    onChange={e => setMessageForm({ ...messageForm, message: e.target.value })}
                    placeholder="Write your query or medicine question here..."
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                  <Send size={16} />
                  <span>Send Direct Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
