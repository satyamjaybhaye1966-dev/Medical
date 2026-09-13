import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  PackageSearch,
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
  AlertTriangle,
  UploadCloud,
  FileCheck,
  Building,
  UserCheck,
  ShieldCheck,
  Send
} from 'lucide-react';

export const CustomerReqPage = () => {
  const {
    requirements,
    addRequirement,
    storeDetails,
    currentUser,
    getWhatsAppOrderUrl
  } = useStore();

  const [formData, setFormData] = useState({
    customerName: currentUser.name || '',
    phone: currentUser.phone || '',
    address: currentUser.address || 'Sawkhed Tejan',
    medicineName: '',
    quantity: '1 Strip / Bottle',
    urgency: 'High (within 24 hours)',
    doctorName: '',
    notes: ''
  });

  const [submittedReq, setSubmittedReq] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.medicineName.trim() || !formData.phone.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await addRequirement(formData);
      setSubmittedReq(created);
      setFormData({
        customerName: currentUser.name || '',
        phone: currentUser.phone || '',
        address: currentUser.address || 'Sawkhed Tejan',
        medicineName: '',
        quantity: '1 Strip / Bottle',
        urgency: 'High (within 24 hours)',
        doctorName: '',
        notes: ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      {/* Header */}
      <div className="section-header">
        <span className="section-tag">
          <PackageSearch size={14} />
          <span>Special Medicine Procurement</span>
        </span>
        <h1 className="section-title">Customer Medicine Requirement Portal</h1>
        <p className="section-desc">
          Cannot find a rare medicine or specific brand? Request directly to <strong>MR. Rushikesh Suresh Mante</strong>. We source authentic supplies directly from top pharmaceutical hubs in Maharashtra.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2.5rem',
        alignItems: 'start'
      }}>
        {/* Left Column: Requirement Form */}
        <div>
          <div className="card" style={{ border: '2px solid var(--primary-glow)', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <div className="brand-icon-box" style={{ width: '38px', height: '38px' }}>
                <PackageSearch size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Submit New Medicine Request</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Reviewed directly by Pharmacist Mr. Rushikesh Mante
                </span>
              </div>
            </div>

            {submittedReq && (
              <div style={{
                background: 'var(--primary-subtle)',
                border: '1px solid var(--primary)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-dark)', fontWeight: 700, marginBottom: '0.35rem' }}>
                  <CheckCircle2 size={18} />
                  <span>Request #{submittedReq.id} Logged Successfully!</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 0.75rem 0' }}>
                  We are checking availability for <strong>{submittedReq.medicineName}</strong>. You will receive an update at <strong>{submittedReq.phone}</strong>.
                </p>
                <a
                  href={getWhatsAppOrderUrl(`Hello Mr. Rushikesh Mante, I submitted a requirement request #${submittedReq.id} for "${submittedReq.medicineName}". Please let me know when it arrives.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                  style={{ backgroundColor: '#15803d', textDecoration: 'none' }}
                >
                  <MessageSquare size={14} />
                  <span>Track via WhatsApp with Owner</span>
                </a>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Customer Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={formData.customerName}
                    onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="e.g. Vikas Jadhav"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    className="form-input"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit mobile"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Medicine Name & Strength (Mg/Ml) *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.medicineName}
                  onChange={e => setFormData({ ...formData, medicineName: e.target.value })}
                  placeholder="e.g. Ecosprin AV 75/20 Capsules or Novomix Insulin"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Quantity Required</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.quantity}
                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="e.g. 2 strips / 1 bottle"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Urgency Level</label>
                  <select
                    className="form-select"
                    value={formData.urgency}
                    onChange={e => setFormData({ ...formData, urgency: e.target.value })}
                  >
                    <option value="Immediate Emergency">Immediate Emergency (Today)</option>
                    <option value="High (within 24 hours)">High (Within 24 Hours)</option>
                    <option value="Normal (2-3 days)">Normal (2-3 Days)</option>
                    <option value="Monthly Routine">Monthly Routine Refill</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Delivery Village / Area</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Sawkhed Tejan / Sindkhed Raja"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Doctor / Hospital Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.doctorName}
                    onChange={e => setFormData({ ...formData, doctorName: e.target.value })}
                    placeholder="e.g. Dr. Deshmukh"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Additional Instructions</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Mention preferred pharmaceutical brand, substitute preferences, or urgency details..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
              >
                <Send size={18} />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Medicine Requirement'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Live Tracker & Sourcing Steps */}
        <div>
          {/* Tracker Card */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="var(--primary)" />
              <span>Live Requirement Status Tracker</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '420px', overflowY: 'auto' }}>
              {requirements.map(req => (
                <div key={req.id} style={{
                  background: 'var(--bg-page)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                      {req.medicineName}
                    </div>
                    <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                      {req.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    <strong>Requested by:</strong> {req.customerName} ({req.phone}) • {req.address}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                    <span>Qty: <strong>{req.quantity}</strong></span> • <span>Urgency: <strong style={{ color: req.urgency.includes('Emergency') ? 'var(--danger)' : 'inherit' }}>{req.urgency}</strong></span> • <span>Date: {req.date}</span>
                  </div>

                  {req.ownerNotes && (
                    <div style={{
                      background: 'var(--bg-card)',
                      borderLeft: '3px solid var(--primary)',
                      padding: '0.4rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      color: 'var(--primary-dark)'
                    }}>
                      <strong>Pharmacist Update:</strong> {req.ownerNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sourcing Timeline */}
          <div className="card" style={{ background: 'var(--bg-card-hover)' }}>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={18} color="var(--primary)" />
              <span>How We Procure Your Medicines</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              <div><strong>1. Verification:</strong> Pharmacist Mr. Rushikesh checks prescription and active formulation.</div>
              <div><strong>2. Sourcing:</strong> Direct purchase from licensed pharma distribution hubs (Jalna / Buldhana).</div>
              <div><strong>3. Delivery:</strong> Safe storage & doorstep village delivery or store pickup ready within 24 hours.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
