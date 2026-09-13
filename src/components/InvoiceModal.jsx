import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Printer, Pill, MapPin, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const InvoiceModal = () => {
  const { activeInvoiceOrder, setActiveInvoiceOrder, storeDetails } = useStore();

  if (!activeInvoiceOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  const calculateSubtotal = () => {
    return activeInvoiceOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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
