import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { MedicineCard } from '../components/MedicineCard';
import { MEDICINE_CATEGORIES } from '../data/initialData';
import {
  Search,
  Filter,
  Pill,
  PackageSearch,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  ArrowUpDown,
  Grid,
  List
} from 'lucide-react';

export const CatalogPage = () => {
  const { medicines, setActiveTab, setIsPrescriptionModalOpen, addToCart, catalogSearchQuery, setCatalogSearchQuery } = useStore();

  const [search, setSearch] = useState(catalogSearchQuery || '');

  React.useEffect(() => {
    if (catalogSearchQuery !== undefined) {
      setSearch(catalogSearchQuery);
    }
  }, [catalogSearchQuery]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [rxFilter, setRxFilter] = useState('all'); // all, rx, otc
  const [sortBy, setSortBy] = useState('name'); // name, price-asc, price-desc, discount
  const [viewMode, setViewMode] = useState('grid'); // grid, list

  const filteredMedicines = useMemo(() => {
    return medicines
      .filter(med => {
        // Category filter
        if (selectedCategory !== 'All' && med.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }

        // In-stock filter
        if (inStockOnly && med.stock <= 0) {
          return false;
        }

        // Rx filter
        if (rxFilter === 'rx' && !med.prescriptionRequired) return false;
        if (rxFilter === 'otc' && med.prescriptionRequired) return false;

        // Search query
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchName = med.name.toLowerCase().includes(q);
          const matchGeneric = med.genericName.toLowerCase().includes(q);
          const matchCategory = med.category.toLowerCase().includes(q);
          const matchManufacturer = (med.manufacturer || '').toLowerCase().includes(q);
          if (!matchName && !matchGeneric && !matchCategory && !matchManufacturer) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'discount') {
          const discA = a.mrp > a.price ? (a.mrp - a.price) / a.mrp : 0;
          const discB = b.mrp > b.price ? (b.mrp - b.price) / b.mrp : 0;
          return discB - discA;
        }
        return 0;
      });
  }, [medicines, search, selectedCategory, inStockOnly, rxFilter, sortBy]);

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      {/* Header */}
      <div className="section-header" style={{ marginBottom: '2rem' }}>
        <span className="section-tag">
          <Pill size={14} />
          <span>Medicine Catalog & Live Prices</span>
        </span>
        <h1 className="section-title">Genuine Medicines at Village-Friendly Rates</h1>
        <p className="section-desc">
          Compare MRP vs discounted store prices, check real-time stock availability, and order online for instant delivery in Sawkhed Tejan.
        </p>
      </div>

      {/* Main Search & Filters Bar */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <Search
              size={18}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.75rem' }}
              placeholder="Search medicine brand or generic composition..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setCatalogSearchQuery(e.target.value);
              }}
            />
          </div>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowUpDown size={18} color="var(--text-muted)" />
            <select
              className="form-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="name">Sort: Alphabetical (A-Z)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="discount">Highest Discount Savings</option>
            </select>
          </div>

          {/* Rx Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SlidersHorizontal size={18} color="var(--text-muted)" />
            <select
              className="form-select"
              value={rxFilter}
              onChange={e => setRxFilter(e.target.value)}
            >
              <option value="all">All Types (Rx + OTC)</option>
              <option value="otc">OTC Only (No Prescription)</option>
              <option value="rx">Prescription Required (Rx)</option>
            </select>
          </div>

          {/* In-Stock Toggle & View Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={e => setInStockOnly(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
              />
              <span>In-Stock Only</span>
            </label>

            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                className={`btn-icon ${viewMode === 'grid' ? 'btn-primary' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <Grid size={16} />
              </button>
              <button
                className={`btn-icon ${viewMode === 'list' ? 'btn-primary' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          scrollbarWidth: 'thin'
        }}>
          {MEDICINE_CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 600,
                border: '1px solid var(--border-color)',
                background: selectedCategory === category ? 'var(--primary)' : 'var(--bg-card)',
                color: selectedCategory === category ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)'
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          Showing <strong>{filteredMedicines.length}</strong> available medicines
          {selectedCategory !== 'All' && <span> in <strong>{selectedCategory}</strong></span>}
          {search && <span> matching "<strong>{search}</strong>"</span>}
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setIsPrescriptionModalOpen(true)}
        >
          <UploadCloud size={16} color="var(--primary)" />
          <span>Upload Prescription for Quick Order</span>
        </button>
      </div>

      {/* Empty State */}
      {filteredMedicines.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', marginTop: '1rem' }}>
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
            <PackageSearch size={32} />
          </div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Medicine Not Found in Current List</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 1.5rem auto', fontSize: '0.92rem' }}>
            We stock over 2000+ medicines. If you can't find your specific medicine or dosage above, submit a requirement and Mr. Rushikesh Mante will arrange it for you.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            <button
              className="btn btn-primary"
              onClick={() => setActiveTab('customer-req')}
            >
              <PackageSearch size={16} />
              <span>Submit Medicine Requirement</span>
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => { setSearch(''); setSelectedCategory('All'); setInStockOnly(false); }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredMedicines.map(med => (
            <MedicineCard
              key={med.id}
              medicine={med}
              onQuickReq={() => setActiveTab('customer-req')}
            />
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && filteredMedicines.length > 0 && (
        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-card-hover)', borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>Medicine & Salt Composition</th>
                <th style={{ padding: '1rem' }}>Category</th>
                <th style={{ padding: '1rem' }}>Pack Unit</th>
                <th style={{ padding: '1rem' }}>Price / MRP</th>
                <th style={{ padding: '1rem' }}>Stock Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedicines.map(med => (
                <tr key={med.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{med.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{med.genericName}</div>
                    {med.prescriptionRequired && (
                      <span className="badge badge-rx" style={{ fontSize: '0.68rem', marginTop: '0.25rem' }}>Rx</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                    <span className="badge badge-info">{med.category}</span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {med.unit}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.05rem' }}>₹{med.price.toFixed(2)}</div>
                    {med.mrp > med.price && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                        ₹{med.mrp.toFixed(2)}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {med.stock > 0 ? (
                      <span className="badge badge-success">In Stock ({med.stock})</span>
                    ) : (
                      <span className="badge badge-danger">Out of Stock</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => addToCart(med, 1)}
                        disabled={med.stock <= 0}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
