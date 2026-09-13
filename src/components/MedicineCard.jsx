import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Check, AlertCircle, Plus, Minus, MessageSquare, Info, ShieldAlert } from 'lucide-react';

export const MedicineCard = ({ medicine, onQuickReq }) => {
  const { addToCart, getWhatsAppOrderUrl } = useStore();
  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const discountPercent = medicine.mrp > medicine.price
    ? Math.round(((medicine.mrp - medicine.price) / medicine.mrp) * 100)
    : 0;

  const isOutOfStock = medicine.stock <= 0;
  const isLowStock = medicine.stock > 0 && medicine.stock <= 15;

  const handleAddToCart = () => {
    addToCart(medicine, qty);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="card card-hoverable" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      height: '100%',
      padding: '1.25rem'
    }}>
      {/* Top Badges Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
          {medicine.category}
        </span>

        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {medicine.prescriptionRequired ? (
            <span className="badge badge-rx" title="Valid Doctor Prescription Required">
              Rx Required
            </span>
          ) : (
            <span className="badge badge-otc" title="Over-the-counter medicine">
              OTC Safe
            </span>
          )}

          {discountPercent > 0 && (
            <span className="badge badge-warning" style={{ fontWeight: 800 }}>
              {discountPercent}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Medicine Title & Generic Salt */}
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>
          {medicine.name}
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontStyle: 'italic' }}>
          {medicine.genericName}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <span style={{ fontWeight: 600 }}>Pack:</span> {medicine.unit}
          <span>•</span>
          <span style={{ fontWeight: 600 }}>By:</span> {medicine.manufacturer}
        </div>
      </div>

      {/* Availability Status */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem 0.75rem',
        background: 'var(--bg-card-hover)',
        borderRadius: 'var(--radius-sm)',
        marginBottom: '1rem',
        fontSize: '0.82rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {isOutOfStock ? (
            <>
              <AlertCircle size={15} color="var(--danger)" />
              <span style={{ color: 'var(--danger)', fontWeight: 700 }}>Out of Stock</span>
            </>
          ) : isLowStock ? (
            <>
              <AlertCircle size={15} color="#d97706" />
              <span style={{ color: '#d97706', fontWeight: 700 }}>Only {medicine.stock} left in store</span>
            </>
          ) : (
            <>
              <Check size={15} color="var(--success)" />
              <span style={{ color: 'var(--primary-dark)', fontWeight: 700 }}>Available ({medicine.stock} Units)</span>
            </>
          )}
        </div>

        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Exp: {medicine.expiryDate ? medicine.expiryDate.substring(0, 7) : '2027'}
        </span>
      </div>

      {/* Pricing & Add to Cart Section */}
      <div style={{ marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            ₹{medicine.price.toFixed(2)}
          </span>
          {medicine.mrp > medicine.price && (
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
              ₹{medicine.mrp.toFixed(2)}
            </span>
          )}
        </div>

        {/* Action Row */}
        {isOutOfStock ? (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-outline-primary"
              style={{ width: '100%', fontSize: '0.85rem' }}
              onClick={() => onQuickReq && onQuickReq(medicine.name)}
            >
              Request Mr. Rushikesh to Procure
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {/* Quantity Selector */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '0.2rem'
            }}>
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                style={{ background: 'none', border: 'none', padding: '0.3rem 0.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <Minus size={14} />
              </button>
              <span style={{ padding: '0 0.5rem', fontWeight: 700, fontSize: '0.9rem' }}>{qty}</span>
              <button
                onClick={() => setQty(Math.min(medicine.stock, qty + 1))}
                style={{ background: 'none', border: 'none', padding: '0.3rem 0.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Add to Cart button */}
            <button
              className={`btn ${isAdded ? 'btn-secondary' : 'btn-primary'}`}
              style={{ flex: 1 }}
              onClick={handleAddToCart}
            >
              {isAdded ? (
                <>
                  <Check size={16} color="var(--success)" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={16} />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Direct WhatsApp Quick Order */}
        <div style={{ marginTop: '0.65rem', textAlign: 'center' }}>
          <a
            href={getWhatsAppOrderUrl(`Hello Mr. Rushikesh Mante, I want to order ${medicine.name} (${qty} pack) from your Sawkhed Tejan store.`)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '0.78rem',
              color: '#16a34a',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontWeight: 600
            }}
          >
            <MessageSquare size={13} />
            <span>Order directly on WhatsApp (8237729148)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
