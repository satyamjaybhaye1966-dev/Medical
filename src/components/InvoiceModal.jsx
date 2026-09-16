import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Printer, Pill, MapPin, Phone, ShieldCheck, CheckCircle2, QrCode, Smartphone, Copy, Check } from 'lucide-react';

export const InvoiceModal = () => {
  const { activeInvoiceOrder, setActiveInvoiceOrder, storeDetails } = useStore();
  const [copiedField, setCopiedField] = useState(null);

  if (!activeInvoiceOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  const calculateSubtotal = () => {
    return activeInvoiceOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleCopy = (text, field) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setActiveInvoiceOrder(null)}>
      <div className="modal-content" style={{ maxWidth: '750px', background: '#fff', color: '#0f172a' }} onClick={e => e.stopPropagation()}>
        {/* Actions bar (hidden in print) */}
        <div className="modal-header no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Printer size={18} color="var(--primary)" />
            <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Tax Invoice & Retail Bill</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-primary btn-sm" onClick={handlePrint}>
              <Printer size={15} />
              <span>Print Invoice</span>
            </button>
            <button className="btn-icon" onClick={() => setActiveInvoiceOrder(null)}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="modal-body invoice-printable" style={{ padding: '2rem' }}>
          {/* Header */}
          <div style={{
            borderBottom: '2px solid #059669',
            paddingBottom: '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1.5rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: '#059669',
                  color: '#fff',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Pill size={18} />
                </div>
                <h1 style={{ fontSize: '1.45rem', color: '#047857', margin: 0 }}>
                  {storeDetails.name}
                </h1>
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>
                {storeDetails.marathiName}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.4 }}>
                <div><strong>Address:</strong> {storeDetails.address}</div>
                <div><strong>Proprietor:</strong> {storeDetails.ownerName} | <strong>Phone:</strong> +91 {storeDetails.contactNumber}</div>
              </div>
            </div>

            <div style={{ textAlign: 'right', fontSize: '0.82rem', color: '#334155' }}>
              <div style={{ background: '#ecfdf5', color: '#047857', padding: '0.3rem 0.6rem', borderRadius: '4px', fontWeight: 800, display: 'inline-block', marginBottom: '0.4rem' }}>
                RETAIL CASH MEMO / INVOICE
              </div>
              <div><strong>DL No:</strong> {storeDetails.drugLicenseNo}</div>
              <div><strong>GSTIN:</strong> {storeDetails.gstNumber}</div>
            </div>
          </div>

          {/* Invoice Meta details */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            padding: '1rem 0',
            borderBottom: '1px solid #e2e8f0',
            fontSize: '0.86rem'
          }}>
            <div>
              <div style={{ color: '#64748b', fontSize: '0.78rem' }}>BILLED TO:</div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>{activeInvoiceOrder.customerName}</div>
              <div><strong>Contact:</strong> {activeInvoiceOrder.customerPhone}</div>
              <div><strong>Address:</strong> {activeInvoiceOrder.deliveryAddress}</div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div><strong>Invoice No:</strong> #{activeInvoiceOrder.id}</div>
              <div><strong>Date & Time:</strong> {activeInvoiceOrder.orderDate}</div>
              <div><strong>Payment Mode:</strong> {activeInvoiceOrder.paymentMethod}</div>
              <div><strong>Order Status:</strong> <span style={{ color: '#059669', fontWeight: 700 }}>{activeInvoiceOrder.status}</span></div>
            </div>
          </div>

          {/* Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.25rem 0', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                <th style={{ padding: '0.6rem 0.5rem' }}>#</th>
                <th style={{ padding: '0.6rem 0.5rem' }}>Medicine Description</th>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>Unit Rate (₹)</th>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {activeInvoiceOrder.items.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.6rem 0.5rem', color: '#64748b' }}>{idx + 1}</td>
                  <td style={{ padding: '0.6rem 0.5rem', fontWeight: 600 }}>{item.name}</td>
                  <td style={{ padding: '0.6rem 0.5rem', textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>₹{item.price.toFixed(2)}</td>
                  <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right', fontWeight: 700 }}>₹{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total calculation */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <div style={{ width: '260px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0' }}>
                <span style={{ color: '#64748b' }}>Subtotal:</span>
                <span style={{ fontWeight: 600 }}>₹{calculateSubtotal().toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0' }}>
                <span style={{ color: '#64748b' }}>Delivery Charges:</span>
                <span style={{ color: '#059669', fontWeight: 700 }}>FREE</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.5rem 0',
                borderTop: '2px solid #0f172a',
                fontSize: '1.1rem',
                fontWeight: 800,
                color: '#047857'
              }}>
                <span>Net Payable:</span>
                <span>₹{activeInvoiceOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* UPI Payment Details Section - Appears ONLY after medicine bill total amount */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem 1.25rem',
            background: '#f8fafc',
            border: '1.5px solid #e2e8f0',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem',
              borderBottom: '1px solid #e2e8f0',
              paddingBottom: '0.6rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: '#047857',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <QrCode size={16} />
                </div>
                <div>
                  <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>
                    Payment Details
                  </span>
                  <span style={{ fontSize: '0.76rem', color: '#64748b', marginLeft: '0.5rem' }}>
                    (Pay via GPay, PhonePe, Paytm, BHIM)
                  </span>
                </div>
              </div>

              <span style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                background: '#ecfdf5',
                color: '#047857',
                padding: '0.2rem 0.55rem',
                borderRadius: '4px',
                border: '1px solid #a7f3d0'
              }}>
                Direct Pharmacist UPI
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '0.75rem',
              fontSize: '0.86rem'
            }}>
              <div style={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '0.65rem 0.85rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                    UPI ID
                  </div>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem' }}>
                    8237729148@upi
                  </div>
                </div>
                <button
                  type="button"
                  className="no-print"
                  onClick={() => handleCopy('8237729148@upi', 'upi')}
                  style={{
                    border: 'none',
                    background: copiedField === 'upi' ? '#ecfdf5' : '#f1f5f9',
                    color: copiedField === 'upi' ? '#047857' : '#475569',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                  title="Copy UPI ID"
                >
                  {copiedField === 'upi' ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedField === 'upi' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div style={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '0.65rem 0.85rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                    UPI Connected Mobile Number
                  </div>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem' }}>
                    [8237729148]
                  </div>
                </div>
                <button
                  type="button"
                  className="no-print"
                  onClick={() => handleCopy('8237729148', 'phone')}
                  style={{
                    border: 'none',
                    background: copiedField === 'phone' ? '#ecfdf5' : '#f1f5f9',
                    color: copiedField === 'phone' ? '#047857' : '#475569',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                  title="Copy Mobile Number"
                >
                  {copiedField === 'phone' ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedField === 'phone' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div style={{
              fontSize: '0.78rem',
              color: '#475569',
              lineHeight: 1.4,
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              marginTop: '0.1rem',
              paddingTop: '0.4rem',
              borderTop: '1px dashed #e2e8f0'
            }}>
              <Smartphone size={14} style={{ color: '#047857', flexShrink: 0 }} />
              <span>
                <strong>UPI Connected Mobile Number: [8237729148]</strong> — Pay the exact total amount (<strong>₹{activeInvoiceOrder.totalAmount.toFixed(2)}</strong>) directly using any UPI app to confirm medicine dispatch.
              </span>
            </div>
          </div>

          {/* Footer declaration */}
          <div style={{
            marginTop: '2rem',
            paddingTop: '1rem',
            borderTop: '1px dashed #cbd5e1',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontSize: '0.78rem',
            color: '#64748b'
          }}>
            <div>
              <div>• Consult registered medical practitioner before taking prescribed medicines.</div>
              <div>• Goods once sold cannot be returned without original batch verification.</div>
              <div>• For 24x7 emergency refill or queries, contact MR. Rushikesh Mante: <strong>8237729148</strong>.</div>
            </div>
            <div style={{ textAlign: 'center', minWidth: '160px' }}>
              <div style={{ height: '35px' }}></div>
              <div style={{ borderTop: '1px solid #94a3b8', paddingTop: '0.25rem', fontWeight: 700, color: '#0f172a' }}>
                For Guru Medical Stores
              </div>
              <div style={{ fontSize: '0.72rem' }}>Authorized Signatory</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
