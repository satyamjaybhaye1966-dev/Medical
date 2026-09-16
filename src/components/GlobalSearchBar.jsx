import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Search,
  X,
  Pill,
  ShoppingBag,
  FileText,
  HeartHandshake,
  ClipboardList,
  ShieldCheck,
  User,
  Home,
  PackageSearch,
  Truck,
  HeartPulse,
  Activity,
  Clock,
  Phone,
  MessageSquare,
  Moon,
  Sun,
  LogIn,
  UserPlus,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const GlobalSearchBar = () => {
  const {
    medicines,
    setActiveTab,
    setIsCartOpen,
    cartItemCount,
    setIsPrescriptionModalOpen,
    openAuthModal,
    toggleTheme,
    theme,
    addToCart,
    navigateToCatalogWithSearch,
    getWhatsAppOrderUrl,
    storeDetails
  } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  // Keyboard shortcut: Cmd+K / Ctrl+K / / to open, Esc to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target) && !e.target.closest('.global-search-trigger')) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // All Pages / Sections in the store
  const pages = useMemo(() => [
    {
      id: 'page-home',
      title: 'Home Page',
      category: 'Pages',
      subtitle: 'Featured medicines, store overview, quick delivery info',
      icon: Home,
      action: () => { setActiveTab('home'); setIsOpen(false); }
    },
    {
      id: 'page-catalog',
      title: 'Medicines & Prices (Catalog)',
      category: 'Pages',
      subtitle: 'Full pharmacy catalog, live stock availability, discounts',
      icon: PackageSearch,
      action: () => { navigateToCatalogWithSearch(''); setIsOpen(false); }
    },
    {
      id: 'page-customer-req',
      title: 'Customer Requirements Form',
      category: 'Pages',
      subtitle: 'Request rare or unavailable medicines from Mr. Rushikesh Mante',
      icon: HeartHandshake,
      action: () => { setActiveTab('customer-req'); setIsOpen(false); }
    },
    {
      id: 'page-services',
      title: 'Healthcare Services',
      category: 'Pages',
      subtitle: 'Free delivery, emergency hotline, BP/sugar checkup, veterinary care',
      icon: Activity,
      action: () => { setActiveTab('services'); setIsOpen(false); }
    },
    {
      id: 'page-stock',
      title: 'Stock Management & Inventory',
      category: 'Pages',
      subtitle: 'Store stock dashboard, batch tracking, expiry dates, restock',
      icon: ClipboardList,
      action: () => { setActiveTab('stock'); setIsOpen(false); }
    },
    {
      id: 'page-orders',
      title: 'Daily & Pending Orders',
      category: 'Pages',
      subtitle: 'Order management, prescription verification, invoice generator',
      icon: ShoppingBag,
      action: () => { setActiveTab('orders'); setIsOpen(false); }
    },
    {
      id: 'page-owner',
      title: 'Store Owner & Pharmacist Profile',
      category: 'Pages',
      subtitle: 'MR. Rushikesh Suresh Mante credentials, drug license, store address',
      icon: ShieldCheck,
      action: () => { setActiveTab('owner'); setIsOpen(false); }
    },
    {
      id: 'page-profile',
      title: 'User Profile & Order History',
      category: 'Pages',
      subtitle: 'Saved delivery addresses, active orders, account settings',
      icon: User,
      action: () => { setActiveTab('profile'); setIsOpen(false); }
    }
  ], [setActiveTab, navigateToCatalogWithSearch]);

  // Healthcare Services
  const services = useMemo(() => [
    {
      id: 'srv-delivery',
      title: 'Free Village Home Delivery',
      category: 'Services',
      subtitle: 'Fast 2-hour doorstep delivery across Sawkhed Tejan, Sindkhed Raja, Kingaon Jatu',
      icon: Truck,
      action: () => { setActiveTab('services'); setIsOpen(false); }
    },
    {
      id: 'srv-emergency',
      title: '24/7 Emergency Medicine Hotline',
      category: 'Services',
      subtitle: 'Urgent nighttime medicines, nebulizers & emergency drugs (Call 8237729148)',
      icon: HeartPulse,
      action: () => { setActiveTab('services'); setIsOpen(false); }
    },
    {
      id: 'srv-checkup',
      title: 'Free Health Vitals Checkup Counter',
      category: 'Services',
      subtitle: 'Complimentary Blood Pressure (BP), Blood Glucose (Sugar) & Pulse monitoring',
      icon: Activity,
      action: () => { setActiveTab('services'); setIsOpen(false); }
    },
    {
      id: 'srv-veterinary',
      title: 'Veterinary & Livestock Healthcare',
      category: 'Services',
      subtitle: 'High-quality animal healthcare, cattle calcium syrups, dewormers & poultry medicines',
      icon: ShieldCheck,
      action: () => { setActiveTab('services'); setIsOpen(false); }
    },
    {
      id: 'srv-refills',
      title: 'Monthly Chronic Prescription Refills',
      category: 'Services',
      subtitle: 'Automated monthly refills for BP, Diabetes & Arthritis patients with 5% extra discount',
      icon: Clock,
      action: () => { setActiveTab('services'); setIsOpen(false); }
    }
  ], [setActiveTab]);

  // Quick Action Shortcuts
  const quickActions = useMemo(() => [
    {
      id: 'act-cart',
      title: `View Shopping Cart (${cartItemCount} items)`,
      category: 'Actions',
      subtitle: 'Review added medicines, adjust quantities, proceed to checkout',
      icon: ShoppingBag,
      badge: `${cartItemCount} items`,
      action: () => { setIsCartOpen(true); setIsOpen(false); }
    },
    {
      id: 'act-rx',
      title: 'Upload Doctor Prescription (Rx)',
      category: 'Actions',
      subtitle: 'Attach prescription photo or PDF for doctor verification',
      icon: FileText,
      badge: 'Quick Upload',
      action: () => { setIsPrescriptionModalOpen(true); setIsOpen(false); }
    },
    {
      id: 'act-login',
      title: 'Sign In to Account',
      category: 'Actions',
      subtitle: 'Access saved addresses, track orders, and order faster',
      icon: LogIn,
      badge: 'Account',
      action: () => { openAuthModal('login'); setIsOpen(false); }
    },
    {
      id: 'act-register',
      title: 'Register New Account',
      category: 'Actions',
      subtitle: 'Create your village pharmacy account in seconds',
      icon: UserPlus,
      badge: 'New User',
      action: () => { openAuthModal('register'); setIsOpen(false); }
    },
    {
      id: 'act-theme',
      title: `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`,
      category: 'Actions',
      subtitle: `Toggle website visual appearance to ${theme === 'light' ? 'Dark' : 'Light'} theme`,
      icon: theme === 'light' ? Moon : Sun,
      badge: 'Theme',
      action: () => { toggleTheme(); }
    },
    {
      id: 'act-whatsapp',
      title: 'WhatsApp Order to Mr. Rushikesh Mante',
      category: 'Actions',
      subtitle: 'Chat directly on WhatsApp (8237729148) for instant prescription & orders',
      icon: MessageSquare,
      badge: 'WhatsApp',
      action: () => {
        window.open(getWhatsAppOrderUrl('Hello Mr. Rushikesh, I want to order medicines.'), '_blank');
        setIsOpen(false);
      }
    },
    {
      id: 'act-call',
      title: 'Call Pharmacy Hotline: 8237729148',
      category: 'Actions',
      subtitle: 'Speak directly with registered pharmacist MR. Rushikesh Suresh Mante',
      icon: Phone,
      badge: 'Phone Call',
      action: () => {
        window.location.href = `tel:${storeDetails.contactNumber}`;
        setIsOpen(false);
      }
    }
  ], [
    cartItemCount,
    setIsCartOpen,
    setIsPrescriptionModalOpen,
    openAuthModal,
    theme,
    toggleTheme,
    getWhatsAppOrderUrl,
    storeDetails
  ]);

  // Filtered results
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();

    // 1. Medicines
    const matchedMeds = medicines.filter(med => {
      if (!q) return false;
      return (
        med.name.toLowerCase().includes(q) ||
        med.genericName.toLowerCase().includes(q) ||
        med.category.toLowerCase().includes(q) ||
        (med.manufacturer && med.manufacturer.toLowerCase().includes(q)) ||
        (med.description && med.description.toLowerCase().includes(q)) ||
        (med.dosage && med.dosage.toLowerCase().includes(q))
      );
    }).map(med => ({
      ...med,
      itemType: 'medicine'
    }));

    // 2. Pages
    const matchedPages = pages.filter(page => {
      if (!q) return true;
      return (
        page.title.toLowerCase().includes(q) ||
        page.subtitle.toLowerCase().includes(q)
      );
    }).map(page => ({
      ...page,
      itemType: 'page'
    }));

    // 3. Services
    const matchedServices = services.filter(srv => {
      if (!q) return true;
      return (
        srv.title.toLowerCase().includes(q) ||
        srv.subtitle.toLowerCase().includes(q)
      );
    }).map(srv => ({
      ...srv,
      itemType: 'service'
    }));

    // 4. Actions
    const matchedActions = quickActions.filter(act => {
      if (!q) return true;
      return (
        act.title.toLowerCase().includes(q) ||
        act.subtitle.toLowerCase().includes(q)
      );
    }).map(act => ({
      ...act,
      itemType: 'action'
    }));

    return {
      medicines: matchedMeds,
      pages: matchedPages,
      services: matchedServices,
      actions: matchedActions,
      totalCount: matchedMeds.length + matchedPages.length + matchedServices.length + matchedActions.length
    };
  }, [query, medicines, pages, services, quickActions]);

  const handleSelectMedicine = (med) => {
    navigateToCatalogWithSearch(med.name);
    setIsOpen(false);
  };

  const handleAddMedicineToCart = (e, med) => {
    e.stopPropagation();
    addToCart(med, 1);
  };

  return (
    <>
      {/* 1. Navbar Search Trigger Input Button */}
      <div
        className="global-search-trigger"
        onClick={() => setIsOpen(true)}
        title="Search medicines, pages, services, or actions (Ctrl+K)"
      >
        <Search size={16} className="global-search-icon" />
        <span className="global-search-placeholder">
          Search medicines, pages, services...
        </span>
        <kbd className="global-search-kbd">⌘K</kbd>
      </div>

      {/* 2. Global OmniSearch Modal Overlay */}
      {isOpen && (
        <div className="global-search-overlay animate-fade-in">
          <div className="global-search-modal" ref={modalRef}>
            {/* Modal Search Header */}
            <div className="global-search-header">
              <Search size={20} color="var(--primary)" />
              <input
                ref={inputRef}
                type="text"
                className="global-search-input"
                placeholder="Search anything: medicines, pages, services, orders, contact..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              {query && (
                <button
                  className="global-search-clear"
                  onClick={() => setQuery('')}
                  title="Clear query"
                >
                  <X size={16} />
                </button>
              )}
              <button
                className="global-search-close"
                onClick={() => setIsOpen(false)}
                title="Close search (Esc)"
              >
                ESC
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="global-search-filters">
              <button
                className={`search-pill ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                All Results {query ? `(${searchResults.totalCount})` : ''}
              </button>
              <button
                className={`search-pill ${activeCategory === 'medicines' ? 'active' : ''}`}
                onClick={() => setActiveCategory('medicines')}
              >
                💊 Medicines ({searchResults.medicines.length})
              </button>
              <button
                className={`search-pill ${activeCategory === 'pages' ? 'active' : ''}`}
                onClick={() => setActiveCategory('pages')}
              >
                📄 Pages ({searchResults.pages.length})
              </button>
              <button
                className={`search-pill ${activeCategory === 'services' ? 'active' : ''}`}
                onClick={() => setActiveCategory('services')}
              >
                🤝 Services ({searchResults.services.length})
              </button>
              <button
                className={`search-pill ${activeCategory === 'actions' ? 'active' : ''}`}
                onClick={() => setActiveCategory('actions')}
              >
                ⚡ Quick Actions ({searchResults.actions.length})
              </button>
            </div>

            {/* Modal Body / Results List */}
            <div className="global-search-results">
              {/* If no query entered yet, show popular shortcuts */}
              {!query.trim() && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div className="search-group-title">
                    <Sparkles size={14} color="var(--primary)" />
                    <span>Popular Searches & Quick Actions</span>
                  </div>
                  <div className="search-tags-row">
                    {['Dolo 650', 'Upload Prescription', 'View Cart', 'Emergency Hotline', 'Free Delivery', 'Blood Sugar Test', 'Azithromycin', 'Owner Contact'].map((tag, idx) => (
                      <button
                        key={idx}
                        className="search-tag-chip"
                        onClick={() => {
                          if (tag === 'View Cart') {
                            setIsCartOpen(true);
                            setIsOpen(false);
                          } else if (tag === 'Upload Prescription') {
                            setIsPrescriptionModalOpen(true);
                            setIsOpen(false);
                          } else {
                            setQuery(tag);
                          }
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Medicines Results */}
              {(activeCategory === 'all' || activeCategory === 'medicines') && searchResults.medicines.length > 0 && (
                <div className="search-result-group">
                  <div className="search-group-title">
                    <Pill size={14} color="var(--primary)" />
                    <span>Medicines & Health Products ({searchResults.medicines.length})</span>
                  </div>

                  <div className="search-items-list">
                    {searchResults.medicines.slice(0, 8).map(med => {
                      const discount = med.mrp > med.price ? Math.round(((med.mrp - med.price) / med.mrp) * 100) : 0;
                      return (
                        <div
                          key={med.id}
                          className="search-result-item medicine-item"
                          onClick={() => handleSelectMedicine(med)}
                        >
                          <div className="search-item-icon medicine-icon">
                            <Pill size={18} />
                          </div>

                          <div className="search-item-info">
                            <div className="search-item-top">
                              <span className="search-item-title">{med.name}</span>
                              <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                                {med.category}
                              </span>
                              {med.prescriptionRequired && (
                                <span className="badge badge-rx" style={{ fontSize: '0.65rem' }}>
                                  Rx Required
                                </span>
                              )}
                            </div>

                            <div className="search-item-sub">
                              {med.genericName} • {med.unit || '1 Strip'}
                            </div>

                            <div className="search-item-meta">
                              <span className="search-med-price">₹{med.price.toFixed(2)}</span>
                              {med.mrp > med.price && (
                                <span className="search-med-mrp">₹{med.mrp.toFixed(2)}</span>
                              )}
                              {discount > 0 && (
                                <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>
                                  {discount}% OFF
                                </span>
                              )}
                              <span className={`search-med-stock ${med.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                                {med.stock > 0 ? `In Stock (${med.stock})` : 'Out of Stock'}
                              </span>
                            </div>
                          </div>

                          <div className="search-item-actions">
                            <button
                              className="btn btn-sm btn-primary"
                              disabled={med.stock <= 0}
                              onClick={(e) => handleAddMedicineToCart(e, med)}
                              title="Add to Cart directly"
                            >
                              <ShoppingBag size={14} />
                              <span>Add</span>
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => handleSelectMedicine(med)}
                              title="View in Catalog"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Pages Results */}
              {(activeCategory === 'all' || activeCategory === 'pages') && searchResults.pages.length > 0 && (
                <div className="search-result-group">
                  <div className="search-group-title">
                    <FileText size={14} color="var(--primary)" />
                    <span>Website Pages & Sections ({searchResults.pages.length})</span>
                  </div>

                  <div className="search-items-list">
                    {searchResults.pages.map(page => {
                      const IconComponent = page.icon;
                      return (
                        <div
                          key={page.id}
                          className="search-result-item page-item"
                          onClick={page.action}
                        >
                          <div className="search-item-icon page-icon">
                            <IconComponent size={18} />
                          </div>
                          <div className="search-item-info">
                            <div className="search-item-title">{page.title}</div>
                            <div className="search-item-sub">{page.subtitle}</div>
                          </div>
                          <ArrowRight size={16} className="search-item-arrow" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Healthcare Services Results */}
              {(activeCategory === 'all' || activeCategory === 'services') && searchResults.services.length > 0 && (
                <div className="search-result-group">
                  <div className="search-group-title">
                    <HeartHandshake size={14} color="var(--primary)" />
                    <span>Healthcare Services ({searchResults.services.length})</span>
                  </div>

                  <div className="search-items-list">
                    {searchResults.services.map(srv => {
                      const IconComponent = srv.icon;
                      return (
                        <div
                          key={srv.id}
                          className="search-result-item service-item"
                          onClick={srv.action}
                        >
                          <div className="search-item-icon service-icon">
                            <IconComponent size={18} />
                          </div>
                          <div className="search-item-info">
                            <div className="search-item-title">{srv.title}</div>
                            <div className="search-item-sub">{srv.subtitle}</div>
                          </div>
                          <ArrowRight size={16} className="search-item-arrow" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quick Actions Results */}
              {(activeCategory === 'all' || activeCategory === 'actions') && searchResults.actions.length > 0 && (
                <div className="search-result-group">
                  <div className="search-group-title">
                    <Sparkles size={14} color="var(--primary)" />
                    <span>Quick Actions ({searchResults.actions.length})</span>
                  </div>

                  <div className="search-items-list">
                    {searchResults.actions.map(act => {
                      const IconComponent = act.icon;
                      return (
                        <div
                          key={act.id}
                          className="search-result-item action-item"
                          onClick={act.action}
                        >
                          <div className="search-item-icon action-icon">
                            <IconComponent size={18} />
                          </div>
                          <div className="search-item-info">
                            <div className="search-item-title">{act.title}</div>
                            <div className="search-item-sub">{act.subtitle}</div>
                          </div>
                          {act.badge && (
                            <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                              {act.badge}
                            </span>
                          )}
                          <ArrowRight size={16} className="search-item-arrow" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* If query has 0 results */}
              {query.trim() && searchResults.totalCount === 0 && (
                <div className="search-empty-state">
                  <AlertCircle size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
                  <h4>No results found for "{query}"</h4>
                  <p>
                    Can't find the medicine or item you are looking for? You can submit a special requirement directly to Mr. Rushikesh Mante.
                  </p>
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: '1rem' }}
                    onClick={() => {
                      setActiveTab('customer-req');
                      setIsOpen(false);
                    }}
                  >
                    <HeartHandshake size={16} />
                    <span>Submit Medicine Requirement</span>
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="global-search-footer">
              <div className="search-shortcuts-hints">
                <span><kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
                <span><kbd>ESC</kbd> to close</span>
                <span><kbd>⌘K</kbd> / <kbd>Ctrl+K</kbd> to toggle</span>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                Guru Medical Store Portal
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
