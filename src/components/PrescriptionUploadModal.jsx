import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, UploadCloud, FileCheck, MessageSquare, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const PrescriptionUploadModal = () => {
  const {
    isPrescriptionModalOpen,
    setIsPrescriptionModalOpen,
    storeDetails,
    getWhatsAppOrderUrl,
    showToast
  } = useStore();

  const [prescriptionData, setPrescriptionData] = useState({
    patientName: '',
    phone: '',
    address: 'Sawkhed Tejan',
    doctorName: '',
    notes: '',
    fileSelected: null,
    fileName: ''
  });

  const [uploadedSuccess, setUploadedSuccess] = useState(false);

  if (!isPrescriptionModalOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPrescriptionData({
        ...prescriptionData,
        fileSelected: file,
        fileName: file.name
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUploadedSuccess(true);
    showToast('Prescription uploaded! Mr. Rushikesh Mante will review and confirm your medicine package.');
  };

  const handleClose = () => {
    setIsPrescriptionModalOpen(false);
    setUploadedSuccess(false);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" style={{ maxWidth: '560px' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="brand-icon-box" style={{ width: '34px', height: '34px' }}>
              <UploadCloud size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Upload Doctor's Prescription</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Direct review by Pharmacist {storeDetails.ownerName}
              </span>
            </div>
          </div>
          <button className="btn-icon" onClick={handleClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {uploadedSuccess ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'var(--primary-subtle)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}>
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>
                Prescription Received!
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                Thank you, <strong>{prescriptionData.patientName || 'Patient'}</strong>! We have logged your prescription file. Pharmacist <strong>{storeDetails.ownerName}</strong> is verifying the medicines and will call you at <strong>{prescriptionData.phone}</strong> for rapid delivery.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <a
                  href={getWhatsAppOrderUrl(`Hello Mr. Rushikesh Mante, I uploaded a prescription for ${prescriptionData.patientName} (${prescriptionData.phone}) at ${prescriptionData.address}. Please verify and send invoice.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-lg"
                  style={{ backgroundColor: '#15803d', textDecoration: 'none' }}
                >
                  <MessageSquare size={18} />
                  <span>Send File Copy via WhatsApp (8237729148)</span>
                </a>

                <button className="btn btn-secondary" onClick={handleClose}>
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Info banner */}
              <div style={{
                background: 'var(--primary-subtle)',
                border: '1px solid var(--primary-glow)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontSize: '0.82rem',
                color: 'var(--primary-dark)',
                marginBottom: '1.25rem'
              }}>
                <ShieldCheck size={18} style={{ flexShrink: 0 }} />
                <span>100% Genuine FDA compliant dispensing from {storeDetails.name}, Sawkhed Tejan.</span>
              </div>

              {/* Upload Box */}
              <div style={{
                border: '2px dashed var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                textAlign: 'center',
                background: 'var(--bg-card-hover)',
                cursor: 'pointer',
                marginBottom: '1.25rem',
                position: 'relative'
              }}>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  required
                  onChange={handleFileChange}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0,
                    cursor: 'pointer',
                    width: '100%',
                    height: '100%'
                  }}
                />
                <UploadCloud size={36} color="var(--primary)" style={{ margin: '0 auto 0.5rem auto' }} />
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  {prescriptionData.fileName ? `✓ Selected: ${prescriptionData.fileName}` : 'Click or Drag & Drop Prescription Image / PDF'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Clear photo of doctor's handwritten or printed prescription (JPG, PNG, PDF max 10MB)
                </div>
              </div>

              {/* Patient Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Patient Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={prescriptionData.patientName}
                    onChange={e => setPrescriptionData({ ...prescriptionData, patientName: e.target.value })}
                    placeholder="e.g. Rameshwar Patil"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    className="form-input"
                    value={prescriptionData.phone}
                    onChange={e => setPrescriptionData({ ...prescriptionData, phone: e.target.value })}
                    placeholder="10-digit phone"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Village / Location</label>
                  <input
                    type="text"
                    className="form-input"
                    value={prescriptionData.address}
                    onChange={e => setPrescriptionData({ ...prescriptionData, address: e.target.value })}
                    placeholder="Sawkhed Tejan"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Doctor / Clinic Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={prescriptionData.doctorName}
                    onChange={e => setPrescriptionData({ ...prescriptionData, doctorName: e.target.value })}
                    placeholder="e.g. Dr. Deshmukh"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Special Instructions (Days of dosage, specific brand, etc.)</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={prescriptionData.notes}
                  onChange={e => setPrescriptionData({ ...prescriptionData, notes: e.target.value })}
                  placeholder="Need for 15 days, deliver in morning..."
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                Submit Prescription for Verification
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
