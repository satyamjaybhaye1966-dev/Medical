import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import confetti from 'canvas-confetti';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ShieldAlert,
  CheckCircle2,
  Truck,
  CreditCard,
  MessageSquare,
  QrCode,
  FileCheck
} from 'lucide-react';

export const CartModal = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartRequiresPrescription,
    placeOrder,
    currentUser,
    storeDetails,
    getWhatsAppOrderUrl,
    setActiveInvoiceOrder
  } = useStore();

  const [deliveryDetails, setDeliveryDetails] = useState({
    name: currentUser.name || '',
    phone: currentUser.phone || '',
    address: currentUser.address || 'Sawkhed Tejan, Tq. Sindkhed Raja',
    village: 'Sawkhed Tejan',
    paymentMethod: 'Cash on Delivery',
    notes: '',
    prescriptionUploaded: true
  });

  const [orderPlaced, setOrderPlaced] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCartOpen) return null;

  const totalMRP = cart.reduce((sum, item) => sum + (item.mrp * item.quantity), 0);
  const totalSavings = Math.max(0, totalMRP - cartTotal);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    try {
      const created = await placeOrder({
        customerName: deliveryDetails.name,
        customerPhone: deliveryDetails.phone,
        deliveryAddress: `${deliveryDetails.address} (${deliveryDetails.village})`,
        paymentMethod: deliveryDetails.paymentMethod,
        notes: deliveryDetails.notes,
        prescriptionUploaded: deliveryDetails.prescriptionUploaded
      });

      // Fire confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setOrderPlaced(created);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCartOpen(false);
    setOrderPlaced(null);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="brand-icon-box" style={{ width: '34px', height: '34px' }}>
              <ShoppingBag size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
                {orderPlaced ? 'Order Confirmed!' : 'Your Medicine Cart'}
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {orderPlaced ? `Invoice #${orderPlaced.id}` : `${cart.length} unique medicines added`}
              </span>
            </div>
          </div>
          <button className="btn-icon" onClick={handleClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {orderPlaced ? (
            /* Order Success View */
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--primary-subtle)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}>
                <CheckCircle2 size={36} />
              </div>

              <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>
                Order Placed Successfully!
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                Thank you, <strong>{orderPlaced.customerName}</strong>! Your order <strong>#{orderPlaced.id}</strong> has been received by <strong>MR. Rushikesh Suresh Mante</strong>.
              </p>

              <div style={{
                background: 'var(--bg-page)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                textAlign: 'left',
                border: '1px solid var(--border-color)',
                marginBottom: '1.5rem',
                fontSize: '0.9rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Total Bill Amount:</span>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-dark)' }}>₹{orderPlaced.totalAmount.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Payment Mode:</span>
                  <span style={{ fontWeight: 600 }}>{orderPlaced.paymentMethod}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Delivery Address:</span>
                  <span style={{ fontWeight: 600 }}>{orderPlaced.deliveryAddress}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Estimated Delivery:</span>
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Within 2 Hours in Sawkhed Tejan</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <a
                  href={getWhatsAppOrderUrl(`Hello Mr. Rushikesh Mante, I placed Order #${orderPlaced.id} for ₹${orderPlaced.totalAmount.toFixed(2)} to ${orderPlaced.deliveryAddress}. Please confirm delivery.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-lg"
                  style={{ backgroundColor: '#15803d', textDecoration: 'none' }}
                >
                  <MessageSquare size={18} />
                  <span>Notify Mr. Rushikesh on WhatsApp</span>
                </a>

                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setActiveInvoiceOrder(orderPlaced);
                    handleClose();
                  }}
                >
                  <FileCheck size={16} />
                  <span>View Printable Bill / Receipt</span>
                </button>
              </div>
            </div>
          ) : cart.length === 0 ? (
            /* Empty Cart View */
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--bg-card-hover)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                color: 'var(--text-muted)'
              }}>
                <ShoppingBag size={28} />
              </div>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Your Cart is Empty</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Browse our wide selection of genuine medicines and healthcare products with fast delivery in Sawkhed Tejan.
              </p>
              <button className="btn btn-primary" onClick={handleClose}>
                Browse Medicine Catalog
              </button>
            </div>
          ) : (
            /* Cart Items & Checkout Form */
            <form onSubmit={handleSubmitOrder}>
              {/* Prescription Alert if required */}
              {cartRequiresPrescription && (
                <div style={{
                  background: 'var(--danger-subtle)',
                  border: '1px solid #fecaca',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1.25rem',
                  fontSize: '0.85rem',
                  color: '#991b1b'
                }}>
                  <ShieldAlert size={20} style={{ flexShrink: 0 }} />
                  <div>
                    <strong>Doctor's Prescription Required:</strong> One or more items in your cart requires a valid prescription as per FDA guidelines. Please show prescription on delivery or WhatsApp to <strong>8237729148</strong>.
                  </div>
                </div>
              )}

              {/* Items List */}
              <div style={{ maxHeight: '220px', overflowY: 'auto', marginBottom: '1.25rem', paddingRight: '0.25rem' }}>
                {cart.map(item => (
                  <div key={item.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 0',
                    borderBottom: '1px solid var(--border-color)',
                    gap: '0.75rem'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        ₹{item.price.toFixed(2)} × {item.quantity} = <strong>₹{(item.price * item.quantity).toFixed(2)}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'var(--bg-page)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          style={{ background: 'none', border: 'none', padding: '0.2rem 0.4rem', cursor: 'pointer' }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, padding: '0 0.3rem' }}>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          style={{ background: 'none', border: 'none', padding: '0.2rem 0.4rem', cursor: 'pointer' }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="btn-icon"
                        style={{ padding: '0.35rem', color: 'var(--danger)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Summary Breakdown */}
              <div style={{
                background: 'var(--bg-card-hover)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                marginBottom: '1.25rem',
                fontSize: '0.88rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Items Total (MRP):</span>
                  <span>₹{totalMRP.toFixed(2)}</span>
                </div>
                {totalSavings > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', color: 'var(--primary-dark)', fontWeight: 600 }}>
                    <span>Store Discount Savings:</span>
                    <span>- ₹{totalSavings.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Delivery Fee:</span>
                  <span style={{ color: 'var(--success)', fontWeight: 700 }}>FREE (Sawkhed Tejan)</span>
                </div>
                <div style={{
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '0.5rem',
                  marginTop: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 800,
                  fontSize: '1.15rem'
                }}>
                  <span>Final Payable Amount:</span>
                  <span style={{ color: 'var(--primary-dark)' }}>₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Delivery Details Form */}
              <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Truck size={16} color="var(--primary)" />
                <span>Delivery & Contact Details</span>
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={deliveryDetails.name}
                    onChange={e => setDeliveryDetails({ ...deliveryDetails, name: e.target.value })}
                    placeholder="e.g. Ramesh Patil"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    className="form-input"
                    value={deliveryDetails.phone}
                    onChange={e => setDeliveryDetails({ ...deliveryDetails, phone: e.target.value })}
                    placeholder="10-digit mobile"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Village / Area</label>
                <select
                  className="form-select"
                  value={deliveryDetails.village}
                  onChange={e => setDeliveryDetails({ ...deliveryDetails, village: e.target.value })}
                >
                  <option value="Sawkhed Tejan">Sawkhed Tejan (Local Store)</option>
                  <option value="Sindkhed Raja Town">Sindkhed Raja Town</option>
                  <option value="Kingaon Jatu">Kingaon Jatu</option>
                  <option value="Dhotra">Dhotra</option>
                  <option value="Sakhar Kherda Road">Sakhar Kherda Road</option>
                  <option value="Self Pickup at Store">Self Pickup at Store Counter</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">House / Landmark / Galli Address</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={deliveryDetails.address}
                  onChange={e => setDeliveryDetails({ ...deliveryDetails, address: e.target.value })}
                  placeholder="e.g. Near ZP School, Main Galli"
                />
              </div>

              {/* Payment Method Selector */}
              <div className="form-group">
                <label className="form-label">Payment Mode</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                  {['Cash on Delivery', 'UPI / QR Scan', 'Pay at Store'].map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setDeliveryDetails({ ...deliveryDetails, paymentMethod: method })}
                      style={{
                        padding: '0.6rem 0.4rem',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        borderRadius: 'var(--radius-md)',
                        border: `1.5px solid ${deliveryDetails.paymentMethod === method ? 'var(--primary)' : 'var(--border-color)'}`,
                        background: deliveryDetails.paymentMethod === method ? 'var(--primary-subtle)' : 'var(--bg-card)',
                        color: deliveryDetails.paymentMethod === method ? 'var(--primary-dark)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={clearCart}
                  style={{ flex: '0 0 auto' }}
                >
                  Clear Cart
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-lg"
                  style={{ flex: 1 }}
                >
                  {isSubmitting ? 'Placing Order...' : `Confirm Order (₹${cartTotal.toFixed(2)})`}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
