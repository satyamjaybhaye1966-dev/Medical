import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MedicineCard } from '../components/MedicineCard';
import {
  Search,
  UploadCloud,
  Phone,
  MessageSquare,
  ShieldCheck,
  Truck,
  HeartHandshake,
  Clock,
  ArrowRight,
  Pill,
  Sparkles,
  MapPin,
  CheckCircle2,
  PackageSearch,
  Activity,
  Award,
  LogIn,
  UserPlus,
  User,
  Database
} from 'lucide-react';

export const HomePage = () => {
  const {
    storeDetails,
    medicines,
    setActiveTab,
    setIsPrescriptionModalOpen,
    getWhatsAppOrderUrl,
    currentUser,
    openAuthModal,
    dbStatus
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');

  const popularMedicines = medicines.filter(m => m.popular).slice(0, 6);

  const categories = [
    { name: 'Pain & Fever', count: '15+ items', icon: '⚡' },
    { name: 'Antibiotics', count: '20+ items', icon: '🛡️' },
    { name: 'Cardiac & Blood Pressure', count: '18+ items', icon: '❤️' },
    { name: 'Diabetes Care', count: '14+ items', icon: '🩸' },
    { name: 'Gastro & Acidity', count: '12+ items', icon: '🌿' },
    { name: 'Ayurvedic & Herbal', count: '25+ items', icon: '🍃' },
    { name: 'Vitamins & Supplements', count: '30+ items', icon: '💊' },
    { name: 'First Aid & Wound Care', count: '10+ items', icon: '🩹' }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab('catalog');
    }
  };

  return (
    <div>
      {/* =========================================================================
          HERO SECTION
          ========================================================================= */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.08) 0%, rgba(2, 132, 199, 0.08) 100%)',
        borderBottom: '1px solid var(--border-color)',
        padding: '3.5rem 0 4rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>
            {/* Left Column: Hero Text */}
            <div>
              <div className="section-tag" style={{ marginBottom: '1rem' }}>
                <Sparkles size={14} />
                <span>Trusted Rural Healthcare & 24x7 Pharmacy</span>
              </div>

              <h1 style={{ fontSize: '2.85rem', lineHeight: 1.15, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
                Your Health, Our Priority at <span style={{ color: 'var(--primary)', borderBottom: '3px solid var(--primary)' }}>{storeDetails.name}</span>
              </h1>

              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.75rem' }}>
                {storeDetails.marathiName} – सावखेड तेजन
              </div>

              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
                Providing 100% genuine medicines, emergency life-saving drugs, and free doorstep delivery across <strong>Sawkhed Tejan, Sindkhed Raja, and surrounding villages</strong>. Managed by <strong>{storeDetails.ownerName}</strong>.
              </p>

              {/* Action Buttons with Prominent Login / Register */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => setIsPrescriptionModalOpen(true)}
                >
                  <UploadCloud size={20} />
                  <span>Upload Prescription</span>
                </button>

                <button
                  className="btn btn-secondary btn-lg"
                  onClick={() => setActiveTab('catalog')}
                >
                  <Pill size={20} color="var(--primary)" />
                  <span>Browse Medicines</span>
                </button>

                {/* Direct Login & Register Action Buttons on Home Screen */}
                <button
                  className="btn btn-outline-primary btn-lg"
                  onClick={() => openAuthModal('login')}
                  style={{
                    borderWidth: '2px',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'var(--bg-card)'
                  }}
                >
                  <LogIn size={20} />
                  <span>Sign In</span>
                </button>

                <button
                  className="btn btn-outline-primary btn-lg"
                  onClick={() => openAuthModal('register')}
                  style={{
                    borderWidth: '2px',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'var(--bg-card)'
                  }}
                >
                  <UserPlus size={20} />
                  <span>Register</span>
                </button>
              </div>

              {/* Home Screen User Account Status Banner */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1.5px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '0.85rem 1.25rem',
                marginBottom: '1.5rem',
                maxWidth: '520px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: currentUser.role === 'admin' ? '#2563eb' : 'var(--primary)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1rem'
                  }}>
                    {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Active: {currentUser.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Role: <strong>{currentUser.role === 'admin' ? 'Store Owner / Admin' : 'Customer'}</strong> • {currentUser.phone || '8237729148'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.78rem', padding: '0.3rem 0.6rem' }}
                    onClick={() => setActiveTab('profile')}
                  >
                    <User size={13} />
                    <span>My Account</span>
                  </button>
                </div>
              </div>

              {/* Quick Search Bar */}
              <form onSubmit={handleSearchSubmit} style={{
                position: 'relative',
                maxWidth: '480px',
                boxShadow: 'var(--shadow-md)',
                borderRadius: 'var(--radius-lg)'
              }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search medicine by brand (Dolo, Pan-D) or salt (Paracetamol)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    padding: '0.95rem 1.25rem 0.95rem 2.85rem',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: '0.95rem',
                    border: '1.5px solid var(--border-color)'
                  }}
                />
                <Search
                  size={18}
                  color="var(--text-muted)"
                  style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
                />
              </form>
            </div>

            {/* Right Column: Highlight Card & Emergency SOS */}
            <div>
              <div className="card" style={{
                background: 'var(--bg-card)',
                border: '2px solid var(--primary-glow)',
                boxShadow: 'var(--shadow-xl)',
                position: 'relative'
              }}>
                {/* Emergency Header */}
                <div style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                  color: '#ffffff',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.25rem',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Clock size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>24/7 Emergency Medicine Service</div>
                      <div style={{ fontSize: '0.78rem', opacity: 0.9 }}>Night or Day — Call for urgent medicines</div>
                    </div>
                  </div>
                  <a
                    href={`tel:${storeDetails.contactNumber}`}
                    style={{
                      background: '#ffffff',
                      color: '#b91c1c',
                      padding: '0.4rem 0.85rem',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <Phone size={14} />
                    <span>Call Now</span>
                  </a>
                </div>

                {/* Owner Spotlight */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  paddingBottom: '1.25rem',
                  borderBottom: '1px solid var(--border-color)',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.4rem',
                    flexShrink: 0
                  }}>
                    RM
                  </div>
                  <div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {storeDetails.ownerName}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--primary-dark)', fontWeight: 600 }}>
                      {storeDetails.ownerRole}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Direct Hotline: <strong>+91 {storeDetails.contactNumber}</strong>
                    </div>
                  </div>
                </div>

                {/* Key Pillars */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{
                    background: 'var(--bg-page)',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.82rem'
                  }}>
                    <Truck size={18} color="var(--primary)" />
                    <div>
                      <strong>Free Home Delivery</strong>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Within 2 hrs</div>
                    </div>
                  </div>

                  <div style={{
                    background: 'var(--bg-page)',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.82rem'
                  }}>
                    <ShieldCheck size={18} color="var(--primary)" />
                    <div>
                      <strong>100% Genuine</strong>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>FDA Maharashtra</div>
                    </div>
                  </div>
                </div>

                {/* Quick WhatsApp Chat */}
                <a
                  href={getWhatsAppOrderUrl(`Hello Mr. Rushikesh Mante, I need medical assistance from Guru Medical Store, Sawkhed Tejan.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ width: '100%', backgroundColor: '#15803d' }}
                >
                  <MessageSquare size={18} />
                  <span>Chat with Pharmacist on WhatsApp (8237729148)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CATEGORY EXPLORER
          ========================================================================= */}
      <section style={{ padding: '3.5rem 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">
              <Pill size={14} />
              <span>Medicine Categories</span>
            </span>
            <h2 className="section-title">Explore by Health Requirement</h2>
            <p className="section-desc">
              Discover top-rated prescription and OTC remedies across diverse therapeutic segments.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem'
          }}>
            {categories.map((cat, index) => (
              <div
                key={index}
                className="card card-hoverable"
                onClick={() => setActiveTab('catalog')}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.25rem'
                }}
              >
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--primary-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  flexShrink: 0
                }}>
                  {cat.icon}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.98rem', marginBottom: '0.2rem' }}>{cat.name}</h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{cat.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          POPULAR / FEATURED MEDICINES
          ========================================================================= */}
      <section style={{ padding: '3.5rem 0', background: 'var(--bg-page)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <span className="section-tag">
                <Sparkles size={14} />
                <span>Daily Essentials & Best Prices</span>
              </span>
              <h2 className="section-title" style={{ textAlign: 'left', margin: 0 }}>
                Popular Medicines Available in Store
              </h2>
            </div>

            <button
              className="btn btn-outline-primary"
              onClick={() => setActiveTab('catalog')}
            >
              <span>View All Medicines & Prices</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {popularMedicines.map(med => (
              <MedicineCard
                key={med.id}
                medicine={med}
                onQuickReq={() => setActiveTab('customer-req')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SPECIAL REQUIREMENT PROMO BANNER
          ========================================================================= */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div className="card" style={{
            background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #0369a1 100%)',
            color: '#ffffff',
            padding: '3rem 2.5rem',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 700,
                marginBottom: '1rem',
                backdropFilter: 'blur(4px)'
              }}>
                <PackageSearch size={14} />
                <span>Special Medicine Procurement</span>
              </div>

              <h2 style={{ fontSize: '2.2rem', color: '#ffffff', marginBottom: '1rem', lineHeight: 1.2 }}>
                Cannot Find Your Prescribed Medicine in Local Stores?
              </h2>

              <p style={{ fontSize: '1rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '1.75rem' }}>
                Don't worry! Submit your medicine requirement or prescription. <strong>MR. Rushikesh Suresh Mante</strong> will directly procure rare, chronic, oncology, or veterinary medicines from authorized Jalna & Buldhana distributors within 24 hours.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-lg"
                  onClick={() => setActiveTab('customer-req')}
                  style={{ background: '#ffffff', color: '#047857', fontWeight: 800 }}
                >
                  <PackageSearch size={18} />
                  <span>Submit Customer Requirement</span>
                </button>

                <a
                  href={`tel:${storeDetails.contactNumber}`}
                  className="btn btn-secondary btn-lg"
                  style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.3)' }}
                >
                  <Phone size={18} />
                  <span>Call 8237729148</span>
                </a>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.12)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={20} color="#fef08a" />
                <span>Our Sourcing Guarantee</span>
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="#6ee7b7" />
                  <span>Direct distributor sourcing with proper batch tax invoice</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="#6ee7b7" />
                  <span>Insulin & Cold-chain storage maintained at 2°C - 8°C</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="#6ee7b7" />
                  <span>Doorstep delivery across Sindkhed Raja rural zones</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="#6ee7b7" />
                  <span>WhatsApp live dispatch updates</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          TESTIMONIALS & TRUST
          ========================================================================= */}
      <section style={{ padding: '3.5rem 0', background: 'var(--bg-page)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">
              <HeartHandshake size={14} />
              <span>Village Trust</span>
            </span>
            <h2 className="section-title">What Patients & Villagers Say</h2>
            <p className="section-desc">
              Proudly serving thousands of families in Sawkhed Tejan, Sindkhed Raja, and Buldhana.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            <div className="card">
              <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.95rem' }}>
                "Mr. Rushikesh Mante is always helpful. During my father's cardiac emergency at midnight, he immediately opened the medical store and arranged the injections. Truly a lifesaver in Sawkhed Tejan!"
              </p>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>— Gajanan Patil</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Sawkhed Tejan, Sindkhed Raja</div>
            </div>

            <div className="card">
              <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.95rem' }}>
                "Best medicine rates and very fast WhatsApp order service. I regularly order my mother's blood pressure and diabetes medicines through this portal."
              </p>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>— Sunita Deshmukh</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Sindkhed Raja Town</div>
            </div>

            <div className="card">
              <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.95rem' }}>
                "We get all cattle and veterinary medicines easily. Rushikesh brother also guides on proper dosages for dairy cows."
              </p>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>— Rameshwar Kharat</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Kingaon Jatu Village</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
