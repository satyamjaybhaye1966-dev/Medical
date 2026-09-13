import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORE_DETAILS, INITIAL_MEDICINES, INITIAL_ORDERS, INITIAL_REQUIREMENTS } from '../data/initialData';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // Theme State
  const [theme, setTheme] = useState(() => localStorage.getItem('mante_theme') || 'light');

  // Navigation / Active View
  const [activeTab, setActiveTab] = useState('home'); // home, catalog, customer-req, stock, orders, services, owner, profile

  // Data States
  const [medicines, setMedicines] = useState(() => {
    const saved = localStorage.getItem('mante_medicines');
    return saved ? JSON.parse(saved) : INITIAL_MEDICINES;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('mante_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [requirements, setRequirements] = useState(() => {
    const saved = localStorage.getItem('mante_requirements');
    return saved ? JSON.parse(saved) : INITIAL_REQUIREMENTS;
  });

  // Cart State
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('mante_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Active User Profile
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('mante_user');
    return saved ? JSON.parse(saved) : {
      id: 'user-cust-1',
      name: 'Satyam Jaybhaye',
      phone: '8237729148',
      email: 'satyam@example.com',
      address: 'Sawkhed Tejan, Tq. Sindkhed Raja, Dist. Buldhana',
      role: 'customer', // 'customer' or 'admin' (Mr. Rushikesh Mante)
      isLoggedIn: true
    };
  });

  // DB Connection Status
  const [dbStatus, setDbStatus] = useState({ connected: false, checking: true });

  // Modals
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState(null);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // Quick Toast Alerts
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('mante_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('mante_medicines', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('mante_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('mante_requirements', JSON.stringify(requirements));
  }, [requirements]);

  useEffect(() => {
    localStorage.setItem('mante_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('mante_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Attempt backend API sync on mount
  useEffect(() => {
    const syncBackend = async () => {
      try {
        const resMeds = await fetch('/api/medicines');
        if (resMeds.ok) {
          const data = await resMeds.json();
          if (data && data.length > 0) setMedicines(data);
        }

        const resOrders = await fetch('/api/orders');
        if (resOrders.ok) {
          const data = await resOrders.json();
          if (data && data.length > 0) setOrders(data);
        }

        const resReqs = await fetch('/api/requirements');
        if (resReqs.ok) {
          const data = await resReqs.json();
          if (data && data.length > 0) setRequirements(data);
        }

        const resDb = await fetch('/api/db-status');
        if (resDb.ok) {
          const dbData = await resDb.json();
          setDbStatus({
            connected: Boolean(dbData.postgres?.connected),
            config: dbData.postgres?.config,
            checking: false
          });
        }
      } catch {
        setDbStatus({ connected: false, checking: false });
      }
    };
    syncBackend();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Cart Functions
  const addToCart = (medicine, quantity = 1) => {
    if (medicine.stock <= 0) {
      showToast(`${medicine.name} is currently Out of Stock!`, 'warning');
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === medicine.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, medicine.stock);
        showToast(`Updated ${medicine.name} quantity in cart (${newQty})`);
        return prev.map(item => item.id === medicine.id ? { ...item, quantity: newQty } : item);
      } else {
        showToast(`Added ${medicine.name} to Cart`);
        return [...prev, { ...medicine, quantity: Math.min(quantity, medicine.stock) }];
      }
    });
  };

  const updateCartQuantity = (medicineId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(medicineId);
      return;
    }
    const med = medicines.find(m => m.id === medicineId);
    const validQty = med ? Math.min(newQuantity, med.stock) : newQuantity;
    setCart(prev => prev.map(item => item.id === medicineId ? { ...item, quantity: validQty } : item));
  };

  const removeFromCart = (medicineId) => {
    setCart(prev => prev.filter(item => item.id !== medicineId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartRequiresPrescription = cart.some(item => item.prescriptionRequired);

  // Order Placement
  const placeOrder = async (orderDetails) => {
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);

    const newOrder = {
      id: orderId,
      customerName: orderDetails.customerName || currentUser.name || 'Valued Customer',
      customerPhone: orderDetails.customerPhone || currentUser.phone || '8237729148',
      deliveryAddress: orderDetails.deliveryAddress || currentUser.address || 'Sawkhed Tejan',
      orderDate: dateStr,
      status: 'Pending',
      paymentMethod: orderDetails.paymentMethod || 'Cash on Delivery',
      totalAmount: cartTotal,
      items: [...cart],
      prescriptionRequired: cartRequiresPrescription,
      prescriptionVerified: Boolean(orderDetails.prescriptionUploaded),
      notes: orderDetails.notes || ''
    };

    // Deduct stock
    setMedicines(prevMeds => {
      return prevMeds.map(med => {
        const cartItem = cart.find(c => c.id === med.id);
        if (cartItem) {
          return { ...med, stock: Math.max(0, med.stock - cartItem.quantity) };
        }
        return med;
      });
    });

    // Add to orders
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setIsCartOpen(false);
    showToast(`🎉 Order #${orderId} Placed Successfully!`, 'success');

    // Try backend sync
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
    } catch {
      // Offline mode
    }

    return newOrder;
  };

  // Update Order Status (Admin/Staff)
  const updateOrderStatus = async (orderId, newStatus, notes = '') => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus, notes: notes || order.notes };
      }
      return order;
    }));
    showToast(`Order #${orderId} status updated to ${newStatus}`);

    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes })
      });
    } catch {
      // Offline mode
    }
  };

  // Add / Update Stock
  const saveMedicine = async (medicineData) => {
    let updated;
    if (medicineData.id) {
      // Edit existing
      updated = medicines.map(m => m.id === medicineData.id ? { ...m, ...medicineData } : m);
      setMedicines(updated);
      showToast(`Updated medicine ${medicineData.name}`);
      try {
        await fetch(`/api/medicines/${medicineData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(medicineData)
        });
      } catch {}
    } else {
      // Add new
      const newMed = {
        ...medicineData,
        id: `med-${Date.now()}`,
        batchNo: medicineData.batchNo || `BT-${Math.floor(1000 + Math.random() * 9000)}`,
        expiryDate: medicineData.expiryDate || '2027-12-31'
      };
      setMedicines(prev => [newMed, ...prev]);
      showToast(`Added new medicine: ${newMed.name}`);
      try {
        await fetch('/api/medicines', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMed)
        });
      } catch {}
    }
  };

  const deleteMedicine = async (id) => {
    setMedicines(prev => prev.filter(m => m.id !== id));
    showToast('Medicine removed from inventory', 'info');
    try {
      await fetch(`/api/medicines/${id}`, { method: 'DELETE' });
    } catch {}
  };

  // Customer Requirement submit
  const addRequirement = async (reqData) => {
    const newReq = {
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      customerName: reqData.customerName || currentUser.name || 'Anonymous',
      phone: reqData.phone || currentUser.phone || '8237729148',
      address: reqData.address || currentUser.address || 'Sawkhed Tejan',
      medicineName: reqData.medicineName,
      quantity: reqData.quantity || '1 pack',
      urgency: reqData.urgency || 'Normal',
      doctorName: reqData.doctorName || 'Not specified',
      status: 'Pending Review',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      ownerNotes: 'Request received. Mr. Rushikesh Mante is checking distributor stock.'
    };

    setRequirements(prev => [newReq, ...prev]);
    showToast('Medicine requirement request submitted to Mr. Rushikesh Mante!', 'success');

    try {
      await fetch('/api/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReq)
      });
    } catch {}
    return newReq;
  };

  const updateRequirementStatus = async (id, status, ownerNotes) => {
    setRequirements(prev => prev.map(r => r.id === id ? { ...r, status, ownerNotes: ownerNotes || r.ownerNotes } : r));
    showToast(`Requirement #${id} updated`);
    try {
      await fetch(`/api/requirements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, ownerNotes })
      });
    } catch {}
  };

  // Direct WhatsApp helper
  const getWhatsAppOrderUrl = (customText = '') => {
    const text = customText || `Hello Mr. Rushikesh Mante, I would like to inquire about medicines from Mante Medical Store, Sawkhed Tejan.`;
    return `https://wa.me/${STORE_DETAILS.whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  // Auth Operations
  const loginUser = async (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();

    // 1. Try Backend API
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        const authenticatedUser = { ...data.user, isLoggedIn: true };
        setCurrentUser(authenticatedUser);
        localStorage.setItem('mante_user', JSON.stringify(authenticatedUser));
        showToast(`Welcome back, ${authenticatedUser.name}!`, 'success');
        return { success: true, user: authenticatedUser };
      } else if (res.status === 401 || res.status === 400 || res.status === 409) {
        showToast(data.error || 'Invalid email or password', 'error');
        return { success: false, error: data.error || 'Invalid credentials' };
      }
    } catch {
      // Backend unreachable, continue to offline fallback
    }

    // 2. Offline / LocalStorage fallback
    const defaultAccounts = [
      {
        id: 'user-admin-1',
        name: 'MR. Rushikesh Suresh Mante',
        email: 'admin@gurumedical.com',
        password: 'admin123',
        role: 'admin',
        phone: '8237729148',
        address: 'Guru Medical Store, Sawkhed Tejan, Sindkhed Raja, Buldhana'
      },
      {
        id: 'user-cust-1',
        name: 'Satyam Jaybhaye',
        email: 'satyam@example.com',
        password: 'customer123',
        role: 'customer',
        phone: '8237729148',
        address: 'Sawkhed Tejan, Tq. Sindkhed Raja, Dist. Buldhana'
      }
    ];

    const localUsers = JSON.parse(localStorage.getItem('mante_registered_users') || '[]');
    const allUsers = [...defaultAccounts, ...localUsers];
    const match = allUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (match) {
      if (match.password === password || match.passwordHash === password) {
        const { password: _, passwordHash: __, ...safeUser } = match;
        const authenticatedUser = { ...safeUser, isLoggedIn: true };
        setCurrentUser(authenticatedUser);
        localStorage.setItem('mante_user', JSON.stringify(authenticatedUser));
        showToast(`Welcome back, ${authenticatedUser.name}!`, 'success');
        return { success: true, user: authenticatedUser };
      } else {
        showToast('Invalid email or password.', 'error');
        return { success: false, error: 'Invalid email or password.' };
      }
    }

    showToast('Account not found with this email.', 'error');
    return { success: false, error: 'Account not found with this email.' };
  };

  const registerUser = async (userData) => {
    const cleanEmail = (userData.email || '').trim().toLowerCase();

    // 1. Try Backend API
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, email: cleanEmail })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        const registeredUser = { ...data.user, isLoggedIn: true };
        setCurrentUser(registeredUser);
        localStorage.setItem('mante_user', JSON.stringify(registeredUser));
        showToast(`Account created successfully for ${registeredUser.name}!`, 'success');
        return { success: true, user: registeredUser };
      } else if (res.status === 409 || res.status === 400) {
        showToast(data.error || 'Registration error', 'error');
        return { success: false, error: data.error };
      }
    } catch {
      // Backend unreachable, continue to offline fallback
    }

    // 2. Offline / LocalStorage fallback
    const localUsers = JSON.parse(localStorage.getItem('mante_registered_users') || '[]');
    if (localUsers.some(u => u.email.toLowerCase() === cleanEmail) || cleanEmail === 'admin@gurumedical.com' || cleanEmail === 'satyam@example.com') {
      showToast('An account with this email already exists.', 'error');
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: userData.name || 'Customer',
      email: cleanEmail,
      password: userData.password,
      role: userData.role || 'customer',
      phone: userData.phone || '',
      address: userData.address || 'Sawkhed Tejan',
      createdAt: new Date().toISOString()
    };

    localUsers.push(newUser);
    localStorage.setItem('mante_registered_users', JSON.stringify(localUsers));

    const { password: _, ...safeUser } = newUser;
    const registeredUser = { ...safeUser, isLoggedIn: true };
    setCurrentUser(registeredUser);
    localStorage.setItem('mante_user', JSON.stringify(registeredUser));
    showToast(`Account created successfully for ${registeredUser.name}!`, 'success');
    return { success: true, user: registeredUser };
  };

  const logoutUser = () => {
    const guestUser = {
      name: 'Guest User',
      phone: '',
      email: '',
      address: '',
      role: 'customer',
      isLoggedIn: false
    };
    setCurrentUser(guestUser);
    showToast('You have been logged out.');
  };

  const updateUserProfile = async (profileData) => {
    const updated = { ...currentUser, ...profileData };
    setCurrentUser(updated);
    showToast('Profile credentials updated successfully!');

    try {
      await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch {}
  };

  return (
    <StoreContext.Provider value={{
      storeDetails: STORE_DETAILS,
      theme,
      toggleTheme,
      activeTab,
      setActiveTab,
      medicines,
      saveMedicine,
      deleteMedicine,
      cart,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      cartTotal,
      cartItemCount,
      cartRequiresPrescription,
      isCartOpen,
      setIsCartOpen,
      orders,
      placeOrder,
      updateOrderStatus,
      requirements,
      addRequirement,
      updateRequirementStatus,
      currentUser,
      setCurrentUser,
      loginUser,
      registerUser,
      logoutUser,
      updateUserProfile,
      dbStatus,
      activeInvoiceOrder,
      setActiveInvoiceOrder,
      isPrescriptionModalOpen,
      setIsPrescriptionModalOpen,
      isAuthModalOpen,
      setIsAuthModalOpen,
      authModalMode,
      setAuthModalMode,
      openAuthModal,
      showToast,
      getWhatsAppOrderUrl
    }}>
      {children}

      {/* Global Toast Render */}
      <div className="toast-container no-print">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span>{toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}</span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
