import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Phone,
  MessageSquare,
  MapPin,
  Printer,
  FileText,
  Search,
  Filter,
  DollarSign,
  Package,
  ShieldCheck
} from 'lucide-react';

export const AdminOrdersPage = () => {
  const {
    orders,
    updateOrderStatus,
    setActiveInvoiceOrder,
    storeDetails,
    getWhatsAppOrderUrl
  } = useStore();

  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Analytics
  const totalOrdersCount = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending');
  const packedOrders = orders.filter(o => o.status === 'Packed');
  const outForDeliveryOrders = orders.filter(o => o.status === 'Out for Delivery');
  const deliveredOrders = orders.filter(o => o.status === 'Delivered');

  const totalRevenue = orders
    .filter(o => o.status === 'Delivered')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const pendingRevenue = orders
    .filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'All' && order.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        order.id.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.customerPhone.toLowerCase().includes(q) ||
        order.deliveryAddress.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="badge badge-warning" style={{ fontWeight: 800 }}><Clock size={12} /> Pending</span>;
      case 'Packed':
        return <span className="badge badge-info" style={{ fontWeight: 800 }}><Package size={12} /> Packed</span>;
      case 'Out for Delivery':
        return <span className="badge badge-info" style={{ background: '#e0f2fe', color: '#0369a1', fontWeight: 800 }}><Truck size={12} /> Out for Delivery</span>;
      case 'Delivered':
        return <span className="badge badge-success" style={{ fontWeight: 800 }}><CheckCircle2 size={12} /> Delivered</span>;
      case 'Cancelled':
        return <span className="badge badge-danger" style={{ fontWeight: 800 }}><XCircle size={12} /> Cancelled</span>;
      default:
        return <span className="badge badge-info">{status}</span>;
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
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
            <ShoppingBag size={14} />
            <span>Order Fulfillment Center</span>
          </span>
          <h1 className="section-title" style={{ textAlign: 'left', margin: 0 }}>
            Daily Orders & Pending Orders
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0 0', fontSize: '0.92rem' }}>
            Manage online orders, track delivery dispatches, and print retail cash bills.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary no-print" onClick={() => window.print()}>
            <Printer size={16} />
            <span>Print Orders Summary</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {/* Pending Orders */}
        <div
          className="card"
          style={{ padding: '1.25rem', cursor: 'pointer', border: pendingOrders.length > 0 ? '1.5px solid #f59e0b' : '1px solid var(--border-color)' }}
          onClick={() => setStatusFilter('Pending')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#b45309' }}>PENDING ORDERS</span>
            <Clock size={18} color="#d97706" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#d97706' }}>{pendingOrders.length}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Awaiting packing</div>
        </div>

        {/* Packed Orders */}
        <div
          className="card"
          style={{ padding: '1.25rem', cursor: 'pointer' }}
          onClick={() => setStatusFilter('Packed')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>PACKED ORDERS</span>
            <Package size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>{packedOrders.length}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Ready for dispatch</div>
        </div>

        {/* Out for Delivery */}
        <div
          className="card"
          style={{ padding: '1.25rem', cursor: 'pointer' }}
          onClick={() => setStatusFilter('Out for Delivery')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0369a1' }}>OUT FOR DELIVERY</span>
            <Truck size={18} color="#0284c7" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0284c7' }}>{outForDeliveryOrders.length}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>In transit to customer</div>
        </div>

        {/* Delivered / Completed Revenue */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-dark)' }}>COLLECTED REVENUE</span>
            <CheckCircle2 size={18} color="var(--success)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-dark)' }}>₹{totalRevenue.toFixed(2)}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{deliveredOrders.length} completed orders</div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="card no-print" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Status Filters */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['All', 'Pending', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: '0.45rem 0.95rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  border: '1px solid var(--border-color)',
                  background: statusFilter === status ? 'var(--primary)' : 'var(--bg-card)',
                  color: statusFilter === status ? '#ffffff' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <Search
              size={16}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.25rem', padding: '0.5rem 0.75rem 0.5rem 2.25rem', fontSize: '0.85rem' }}
              placeholder="Search order ID, name, phone..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredOrders.map(order => (
          <div key={order.id} className="card" style={{ padding: '1.5rem', borderLeft: `5px solid ${order.status === 'Pending' ? '#f59e0b' : order.status === 'Delivered' ? 'var(--success)' : 'var(--primary)'}` }}>
            {/* Top row */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '1rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid var(--border-color)',
              marginBottom: '1rem'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                  <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-primary)' }}>
                    Order #{order.id}
                  </h3>
                  {getStatusBadge(order.status)}
                  {order.prescriptionRequired && (
                    <span className="badge badge-rx" style={{ fontSize: '0.68rem' }}>Rx Verified</span>
                  )}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Placed on: <strong>{order.orderDate}</strong> • Mode: <strong>{order.paymentMethod}</strong>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                  ₹{order.totalAmount.toFixed(2)}
                </div>
                <button
                  className="btn btn-secondary btn-sm no-print"
                  onClick={() => setActiveInvoiceOrder(order)}
                >
                  <FileText size={14} />
                  <span>View & Print Invoice</span>
                </button>
              </div>
            </div>

            {/* Middle: Customer Details & Ordered Items */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
              marginBottom: '1.25rem'
            }}>
              {/* Customer Info */}
              <div style={{
                background: 'var(--bg-page)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem'
              }}>
                <div style={{ fontWeight: 800, fontSize: '0.98rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                  {order.customerName}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  <Phone size={14} color="var(--primary)" />
                  <span>{order.customerPhone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                  <MapPin size={14} color="var(--primary)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span>{order.deliveryAddress}</span>
                </div>
                {order.notes && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    Note: "{order.notes}"
                  </div>
                )}
              </div>

              {/* Items list */}
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  ORDERED MEDICINES ({order.items.length}):
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.86rem',
                      padding: '0.3rem 0',
                      borderBottom: '1px dashed var(--border-color)'
                    }}>
                      <span>{item.quantity}x {item.name}</span>
                      <span style={{ fontWeight: 700 }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border-color)'
            }} className="no-print">
              {/* Status Update Quick Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Update Status:</span>

                {order.status === 'Pending' && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleStatusChange(order.id, 'Packed')}
                  >
                    <Package size={14} />
                    <span>Mark Packed</span>
                  </button>
                )}

                {order.status === 'Packed' && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleStatusChange(order.id, 'Out for Delivery')}
                  >
                    <Truck size={14} />
                    <span>Dispatch for Delivery</span>
                  </button>
                )}

                {order.status === 'Out for Delivery' && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleStatusChange(order.id, 'Delivered')}
                  >
                    <CheckCircle2 size={14} />
                    <span>Mark as Delivered & Paid</span>
                  </button>
                )}

                {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                  <button
                    className="btn btn-icon btn-sm"
                    style={{ color: 'var(--danger)' }}
                    onClick={() => {
                      if (window.confirm('Cancel this order?')) {
                        handleStatusChange(order.id, 'Cancelled');
                      }
                    }}
                    title="Cancel Order"
                  >
                    <XCircle size={16} />
                  </button>
                )}
              </div>

              {/* Customer Direct WhatsApp Communication */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <a
                  href={`tel:${order.customerPhone}`}
                  className="btn btn-secondary btn-sm"
                >
                  <Phone size={14} />
                  <span>Call Customer</span>
                </a>

                <a
                  href={`https://wa.me/91${order.customerPhone}?text=${encodeURIComponent(`Hello ${order.customerName}, this is Pharmacist Rushikesh Mante from Guru Medical Store, Sawkhed Tejan. Regarding your Order #${order.id} (Status: ${order.status}), our delivery partner is on the way.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                  style={{ backgroundColor: '#15803d' }}
                >
                  <MessageSquare size={14} />
                  <span>WhatsApp Customer</span>
                </a>
              </div>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <ShoppingBag size={36} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
            <h4>No Orders Found</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No orders currently match the selected status filter "{statusFilter}".
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
