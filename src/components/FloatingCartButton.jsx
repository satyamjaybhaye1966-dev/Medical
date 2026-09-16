import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag } from 'lucide-react';

export const FloatingCartButton = () => {
  const { cartItemCount, cartTotal, setIsCartOpen } = useStore();

  if (cartItemCount === 0) return null;

  return (
    <button
      className="floating-cart-btn no-print"
      onClick={() => setIsCartOpen(true)}
      title="View Shopping Cart"
      aria-label={`View Cart with ${cartItemCount} items`}
    >
      <div className="floating-cart-icon-wrap">
        <ShoppingBag size={20} />
        <span className="floating-cart-badge">{cartItemCount}</span>
      </div>
      <div className="floating-cart-text">
        <span className="floating-cart-label">View Cart</span>
        <span className="floating-cart-price">₹{cartTotal.toFixed(2)}</span>
      </div>
    </button>
  );
};
