import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { MEDICINE_CATEGORIES } from '../data/initialData';
import {
  ClipboardList,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  Trash2,
  Printer,
  FileSpreadsheet,
  TrendingDown,
  Layers,
  Calendar,
  X,
  ShieldAlert,
  ArrowUpDown
} from 'lucide-react';

export const AdminStockPage = () => {
  const { medicines, saveMedicine, deleteMedicine, storeDetails } = useStore();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockStatusFilter, setStockStatusFilter] = useState('all'); // all, low, out, expiring, adequate
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    genericName: '',
    category: 'Pain & Fever',
    price: '',
    mrp: '',
    stock: '',
    unit: '10 Tablets / Strip',
    manufacturer: '',
    prescriptionRequired: false,
    batchNo: '',
    expiryDate: '2027-12-31',
    description: '',
    dosage: ''
  });

  // Calculate KPIs
  const totalSKUs = medicines.length;
  const totalUnits = medicines.reduce((sum, m) => sum + (Number(m.stock) || 0), 0);
  const totalValuation = medicines.reduce((sum, m) => sum + ((Number(m.stock) || 0) * (Number(m.price) || 0)), 0);
  const lowStockList = medicines.filter(m => Number(m.stock) > 0 && Number(m.stock) <= 15);
  const outOfStockList = medicines.filter(m => Number(m.stock) <= 0);

  // Expiring check
  const now = new Date();
  const expiringSoonList = medicines.filter(m => {
    if (!m.expiryDate) return false;
    const exp = new Date(m.expiryDate);
    const diffDays = (exp - now) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 180;
  });

  // Filtered List for Table
  const filteredMedicines = useMemo(() => {
    return medicines.filter(med => {
      if (categoryFilter !== 'All' && med.category.toLowerCase() !== categoryFilter.toLowerCase()) {
        return false;
      }

      if (stockStatusFilter === 'low' && (med.stock <= 0 || med.stock > 15)) return false;
      if (stockStatusFilter === 'out' && med.stock > 0) return false;
      if (stockStatusFilter === 'adequate' && med.stock <= 15) return false;
      if (stockStatusFilter === 'expiring') {
        if (!med.expiryDate) return false;
        const exp = new Date(med.expiryDate);
        const diffDays = (exp - now) / (1000 * 60 * 60 * 24);
        if (diffDays < 0 || diffDays > 180) return false;
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          med.name.toLowerCase().includes(q) ||
          med.genericName.toLowerCase().includes(q) ||
          (med.batchNo || '').toLowerCase().includes(q) ||
          (med.manufacturer || '').toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [medicines, search, categoryFilter, stockStatusFilter]);

  const handleOpenAdd = () => {
    setFormData({
      id: '',
      name: '',
      genericName: '',
      category: 'Pain & Fever',
      price: '',
      mrp: '',
      stock: '50',
      unit: '10 Tablets / Strip',
      manufacturer: 'Cipla Ltd',
      prescriptionRequired: false,
      batchNo: `BT-${Math.floor(1000 + Math.random() * 9000)}`,
      expiryDate: '2027-12-31',
      description: '',
      dosage: ''
    });
    setEditingMedicine(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (med) => {
    setFormData({
      id: med.id,
      name: med.name,
      genericName: med.genericName,
      category: med.category,
      price: med.price,
      mrp: med.mrp,
      stock: med.stock,
      unit: med.unit,
      manufacturer: med.manufacturer,
      prescriptionRequired: med.prescriptionRequired,
      batchNo: med.batchNo,
      expiryDate: med.expiryDate,
      description: med.description || '',
      dosage: med.dosage || ''
    });
    setEditingMedicine(med);
    setIsAddModalOpen(true);
  };

  const handleSaveSubmit = (e) => {
    e.preventDefault();
    saveMedicine({
      ...formData,
      price: Number(formData.price),
      mrp: Number(formData.mrp) || Number(formData.price),
      stock: Number(formData.stock)
    });
    setIsAddModalOpen(false);
  };

  const handleQuickStockUpdate = (med, delta) => {
    const newStock = Math.max(0, med.stock + delta);
    saveMedicine({ ...med, stock: newStock });
  };

  const handlePrintStockReport = () => {
    window.print();
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <span className="section-tag">
            <ClipboardList size={14} />
            <span>Real-Time Inventory</span>
          </span>
          <h1 className="section-title" style={{ textAlign: 'left', margin: 0 }}>
            Medicine Stock Page & Inventory Report
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0 0', fontSize: '0.92rem' }}>
            Store: <strong>{storeDetails.name}</strong> • Sawkhed Tejan • Owner: <strong>{storeDetails.ownerName}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary no-print" onClick={handlePrintStockReport}>
            <Printer size={16} />
            <span>Print Stock Report</span>
          </button>

          <button className="btn btn-primary no-print" onClick={handleOpenAdd}>
            <Plus size={18} />
            <span>Add New Medicine</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Dashboard Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {/* Total SKUs */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>TOTAL MEDICINE SKUs</span>
            <Layers size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>{totalSKUs}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Registered formulations</div>
        </div>

        {/* Total Stock Units */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>TOTAL INVENTORY UNITS</span>
            <CheckCircle2 size={18} color="var(--success)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-dark)' }}>{totalUnits}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Units in store storage</div>
        </div>

        {/* Valuation */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>INVENTORY VALUATION</span>
            <span style={{ color: 'var(--secondary-dark)', fontWeight: 800 }}>₹</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>₹{totalValuation.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Current asset value</div>
        </div>

        {/* Low Stock Warning */}
        <div
          className="card"
          style={{ padding: '1.25rem', cursor: 'pointer', border: lowStockList.length > 0 ? '1px solid #f59e0b' : '1px solid var(--border-color)' }}
          onClick={() => setStockStatusFilter('low')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#b45309' }}>LOW STOCK (≤15)</span>
            <AlertTriangle size={18} color="#d97706" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#d97706' }}>{lowStockList.length}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Reorder needed soon</div>
        </div>

        {/* Out of Stock */}
        <div
          className="card"
          style={{ padding: '1.25rem', cursor: 'pointer', border: outOfStockList.length > 0 ? '1px solid #ef4444' : '1px solid var(--border-color)' }}
          onClick={() => setStockStatusFilter('out')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--danger)' }}>OUT OF STOCK</span>
            <TrendingDown size={18} color="var(--danger)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--danger)' }}>{outOfStockList.length}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Needs immediate supplier PO</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card no-print" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          alignItems: 'center'
        }}>
          {/* Search */}
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
              placeholder="Search by name, composition, batch..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Category */}
          <div>
            <select
              className="form-select"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
            >
              {MEDICINE_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Stock Status Selector */}
          <div>
            <select
              className="form-select"
              value={stockStatusFilter}
              onChange={e => setStockStatusFilter(e.target.value)}
            >
              <option value="all">All Stock Statuses</option>
              <option value="adequate">Adequate Stock (&gt;15)</option>
              <option value="low">Low Stock Alerts (1-15)</option>
              <option value="out">Out of Stock (0)</option>
              <option value="expiring">Expiring within 6 Months</option>
            </select>
          </div>

          {/* Reset button */}
          <div>
            <button
              className="btn btn-secondary"
              style={{ width: '100%' }}
              onClick={() => { setSearch(''); setCategoryFilter('All'); setStockStatusFilter('all'); }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Stock Table */}
      <div className="card" style={{ padding: 0, overflowX: 'auto', marginBottom: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-card-hover)', borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Medicine & Salt</th>
              <th style={{ padding: '0.85rem 1rem' }}>Category</th>
              <th style={{ padding: '0.85rem 1rem' }}>Batch & Expiry</th>
              <th style={{ padding: '0.85rem 1rem' }}>Unit Rate / MRP</th>
              <th style={{ padding: '0.85rem 1rem' }}>Current Stock</th>
              <th style={{ padding: '0.85rem 1rem' }}>Inventory Value</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }} className="no-print">Quick Update / Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicines.map(med => {
              const isOut = med.stock <= 0;
              const isLow = med.stock > 0 && med.stock <= 15;
              const medValuation = (med.stock || 0) * (med.price || 0);

              return (
                <tr key={med.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{med.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{med.genericName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{med.manufacturer} • {med.unit}</div>
                  </td>

                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className="badge badge-info">{med.category}</span>
                  </td>

                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem' }}>
                    <div><strong>Batch:</strong> {med.batchNo || 'DL-N/A'}</div>
                    <div style={{ color: 'var(--text-muted)' }}><strong>Exp:</strong> {med.expiryDate || '2027'}</div>
                  </td>

                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontWeight: 800 }}>₹{med.price.toFixed(2)}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MRP: ₹{med.mrp.toFixed(2)}</div>
                  </td>

                  <td style={{ padding: '0.85rem 1rem' }}>
                    {isOut ? (
                      <span className="badge badge-danger">0 (Out of Stock)</span>
                    ) : isLow ? (
                      <span className="badge badge-warning">{med.stock} Units (Low)</span>
                    ) : (
                      <span className="badge badge-success">{med.stock} Units</span>
                    )}
                  </td>

                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>
                    ₹{medValuation.toFixed(2)}
                  </td>

                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }} className="no-print">
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      {/* Quick + / - buttons */}
                      <button
                        className="btn-icon"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', fontWeight: 800 }}
                        onClick={() => handleQuickStockUpdate(med, -5)}
                        title="Deduct 5 units"
                      >
                        -5
                      </button>
                      <button
                        className="btn-icon"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)' }}
                        onClick={() => handleQuickStockUpdate(med, +10)}
                        title="Add 10 units"
                      >
                        +10
                      </button>

                      {/* Edit */}
                      <button
                        className="btn-icon"
                        onClick={() => handleOpenEdit(med)}
                        title="Edit Medicine Details"
                      >
                        <Edit2 size={14} />
                      </button>

                      {/* Delete */}
                      <button
                        className="btn-icon"
                        style={{ color: 'var(--danger)' }}
                        onClick={() => {
                          if (window.confirm(`Delete ${med.name} from inventory?`)) {
                            deleteMedicine(med.id);
                          }
                        }}
                        title="Delete Medicine"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Medicine Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
                {editingMedicine ? `Edit Medicine: ${editingMedicine.name}` : 'Add New Medicine to Stock'}
              </h3>
              <button className="btn-icon" onClick={() => setIsAddModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Brand / Product Name *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Dolo 650mg"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Generic Salt Composition *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={formData.genericName}
                      onChange={e => setFormData({ ...formData, genericName: e.target.value })}
                      placeholder="e.g. Paracetamol 650mg"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                    >
                      {MEDICINE_CATEGORIES.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Pack Unit</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.unit}
                      onChange={e => setFormData({ ...formData, unit: e.target.value })}
                      placeholder="e.g. 15 Tablets / Strip"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Discount Price (₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="form-input"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: e.target.value })}
                      placeholder="30.50"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">MRP (₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="form-input"
                      value={formData.mrp}
                      onChange={e => setFormData({ ...formData, mrp: e.target.value })}
                      placeholder="34.00"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      className="form-input"
                      value={formData.stock}
                      onChange={e => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="50"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Manufacturer</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.manufacturer}
                      onChange={e => setFormData({ ...formData, manufacturer: e.target.value })}
                      placeholder="e.g. Cipla Ltd"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Batch No</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.batchNo}
                      onChange={e => setFormData({ ...formData, batchNo: e.target.value })}
                      placeholder="DL-8921"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Expiry Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.expiryDate}
                      onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <input
                    type="checkbox"
                    id="rxCheck"
                    checked={formData.prescriptionRequired}
                    onChange={e => setFormData({ ...formData, prescriptionRequired: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                  />
                  <label htmlFor="rxCheck" style={{ fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                    Prescription Required (Schedule H / H1 Drug)
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingMedicine ? 'Update Stock Details' : 'Add Medicine to Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
