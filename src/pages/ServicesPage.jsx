import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { STORE_SERVICES } from '../data/initialData';
import {
  HeartHandshake,
  Truck,
  PackageSearch,
  HeartPulse,
  Activity,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MessageSquare,
  Calendar,
  Send
} from 'lucide-react';

export const ServicesPage = () => {
  const { storeDetails, getWhatsAppOrderUrl, showToast } = useStore();

  const [selectedService, setSelectedService] = useState(null);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    phone: '',
    serviceName: '',
    date: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Truck': return <Truck size={28} color="var(--primary)" />;
      case 'PackageSearch': return <PackageSearch size={28} color="var(--secondary)" />;
      case 'HeartPulse': return <HeartPulse size={28} color="var(--danger)" />;
      case 'Activity': return <Activity size={28} color="var(--primary)" />;
      case 'Clock': return <Clock size={28} color="var(--accent)" />;
      case 'ShieldCheck': return <ShieldCheck size={28} color="var(--primary)" />;
      default: return <HeartHandshake size={28} color="var(--primary)" />;
    }
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Service inquiry sent to Mr. Rushikesh Mante!');
    setTimeout(() => {
      setSelectedService(null);
      setSubmitted(false);
    }, 2500);
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      {/* Section Header */}
      <div className="section-header">
        <span className="section-tag">
          <HeartHandshake size={14} />
          <span>Patient-Centric Care</span>
        </span>
        <h1 className="section-title">Healthcare & Pharmacy Services</h1>
        <p className="section-desc">
          Beyond standard medicine dispensing, <strong>{storeDetails.name}</strong> provides specialized healthcare solutions for families, elders, and farmers across Sawkhed Tejan & Sindkhed Raja.
        </p>
      </div>

      {/* Services Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        marginBottom: '3.5rem'
      }}>
        {STORE_SERVICES.map(service => (
          <div key={service.id} className="card card-hoverable" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '1.75rem'
          }}>
            <div>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--primary-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                {getIcon(service.icon)}
              </div>

              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem', color: 'var(--text-primary)' }}>
                {service.title}
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {service.description}
              </p>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  KEY HIGHLIGHTS:
                </div>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {service.features.map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={14} color="var(--primary)" style={{ flexShrink: 0 }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button
                className="btn btn-outline-primary btn-sm"
                style={{ flex: 1 }}
                onClick={() => {
                  setSelectedService(service);
                  setInquiryForm({ ...inquiryForm, serviceName: service.title });
                }}
              >
                Inquire / Book
              </button>

              <a
                href={getWhatsAppOrderUrl(`Hello Mr. Rushikesh Mante, I am interested in your service: "${service.title}" at Sawkhed Tejan.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ color: '#16a34a' }}
                title="Inquire on WhatsApp"
              >
                <MessageSquare size={15} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Service Callout Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: '#ffffff',
        padding: '2.5rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid #334155',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '2rem'
      }}>
        <div>
          <span className="badge badge-danger" style={{ marginBottom: '0.75rem', fontWeight: 800 }}>
            EMERGENCY ASSISTANCE 24/7
          </span>
          <h2 style={{ fontSize: '1.8rem', color: '#ffffff', marginBottom: '0.5rem' }}>
            Need Immediate Nighttime Medicines or First Aid?
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '600px', fontSize: '0.95rem', margin: 0 }}>
            Our store is dedicated to village emergency care. Call <strong>MR. Rushikesh Suresh Mante</strong> directly on <strong>8237729148</strong> for urgent anti-venom, inhalers, oxygen cylinders, or pediatric fever emergencies.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a
            href={`tel:${storeDetails.contactNumber}`}
            className="btn btn-danger btn-lg"
          >
            <Phone size={20} />
            <span>Call +91 {storeDetails.contactNumber}</span>
          </a>
        </div>
      </div>

      {/* Service Inquiry Modal */}
      {selectedService && (
        <div className="modal-overlay" onClick={() => setSelectedService(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Book / Inquire: {selectedService.title}</h3>
              <button className="btn-icon" onClick={() => setSelectedService(null)}>✕</button>
            </div>
            <div className="modal-body">
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <CheckCircle2 size={40} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
                  <h4>Inquiry Sent!</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Mr. Rushikesh Mante will contact you shortly to confirm your service request.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={inquiryForm.name}
                      onChange={e => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      className="form-input"
                      value={inquiryForm.phone}
                      onChange={e => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                      placeholder="10-digit mobile"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Preferred Date / Time</label>
                    <input
                      type="date"
                      className="form-input"
                      value={inquiryForm.date}
                      onChange={e => setInquiryForm({ ...inquiryForm, date: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message / Details</label>
                    <textarea
                      className="form-textarea"
                      rows={2}
                      value={inquiryForm.message}
                      onChange={e => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                      placeholder="e.g. Need BP and blood sugar check at home for elderly patient..."
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                    Confirm Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
