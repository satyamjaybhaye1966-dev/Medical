import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Check, AlertCircle, Plus, Minus, MessageSquare, Info, ShieldAlert, Bot } from 'lucide-react';

export const MedicineCard = ({ medicine, onQuickReq }) => {
  const { addToCart, getWhatsAppOrderUrl, openChatbot } = useStore();
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
    <div className="card card-hoverable medicine-card-responsive" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      height: '100%',
      padding: '1.1rem'
    }}>
      {/* Top Badges Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
          {medicine.category}
        </span>

        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
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
        <h3 style={{ fontSize: '1.05rem', marginBottom: '0.35rem', color: 'var(--text-primary)', lineHeight: 1.3, wordBreak: 'break-word' }}>
          {medicine.name}
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontStyle: 'italic', wordBreak: 'break-word' }}>
          {medicine.genericName}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
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
        padding: '0.45rem 0.65rem',
        background: 'var(--bg-card-hover)',
        borderRadius: 'var(--radius-sm)',
        marginBottom: '1rem',
        fontSize: '0.8rem',
        flexWrap: 'wrap',
        gap: '0.35rem'
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
              <span style={{ color: '#d97706', fontWeight: 700 }}>Only {medicine.stock} left</span>
            </>
          ) : (
            <>
              <Check size={15} color="var(--success)" />
              <span style={{ color: 'var(--primary-dark)', fontWeight: 700 }}>In Stock ({medicine.stock})</span>
            </>
          )}
        </div>

        <span style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
          Exp: {medicine.expiryDate ? medicine.expiryDate.substring(0, 7) : '2027'}
        </span>
      </div>

      {/* Pricing & Add to Cart Section */}
      <div style={{ marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.85rem' }}>
          <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            ₹{medicine.price.toFixed(2)}
          </span>
          {medicine.mrp > medicine.price && (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
              ₹{medicine.mrp.toFixed(2)}
            </span>
          )}
        </div>

        {/* Action Row */}
        {isOutOfStock ? (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-outline-primary"
              style={{ width: '100%', fontSize: '0.82rem', padding: '0.5rem' }}
              onClick={() => onQuickReq && onQuickReq(medicine.name)}
            >
              Request Mr. Rushikesh to Procure
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {/* Quantity Selector */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '0.15rem'
            }}>
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                style={{ background: 'none', border: 'none', padding: '0.25rem 0.45rem', cursor: 'pointer', color: 'var(--text-secondary)' }}
                aria-label="Decrease quantity"
              >
                <Minus size={13} />
              </button>
              <span style={{ padding: '0 0.4rem', fontWeight: 700, fontSize: '0.86rem' }}>{qty}</span>
              <button
                onClick={() => setQty(Math.min(medicine.stock, qty + 1))}
                style={{ background: 'none', border: 'none', padding: '0.25rem 0.45rem', cursor: 'pointer', color: 'var(--text-secondary)' }}
                aria-label="Increase quantity"
              >
                <Plus size={13} />
              </button>
            </div>

            {/* Add to Cart button */}
            <button
              className={`btn ${isAdded ? 'btn-secondary' : 'btn-primary'}`}
              style={{ flex: '1 1 110px', fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
              onClick={handleAddToCart}
            >
              {isAdded ? (
                <>
                  <Check size={15} color="var(--success)" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={15} />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Direct WhatsApp Quick Order & Ask HealthBot */}
        <div style={{ marginTop: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => openChatbot(`Tell me about ${medicine.name}: uses, dosage, and precautions.`)}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.2rem 0.4rem',
              cursor: 'pointer',
              fontSize: '0.74rem',
              color: 'var(--primary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontWeight: 600,
              textAlign: 'center'
            }}
            title="Ask AI Pharmacist about dosage, side effects, and uses"
          >
            <Bot size={13} />
            <span>Ask HealthBot about dosage & uses</span>
          </button>

          <a
            href={getWhatsAppOrderUrl(`Hello Mr. Rushikesh Mante, I want to order ${medicine.name} (${qty} pack) from your Sawkhed Tejan store.`)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '0.75rem',
              color: '#16a34a',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontWeight: 600,
              textAlign: 'center'
            }}
          >
            <MessageSquare size={13} />
            <span>Order on WhatsApp (8237729148)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
