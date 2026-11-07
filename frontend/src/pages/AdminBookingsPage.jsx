import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { Search, Calendar, MapPin, Receipt, AlertCircle, Loader2 } from 'lucide-react';

export const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getBookings();
      if (res.success && res.data) {
        setBookings(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const res = await api.bookings.updateStatus(bookingId, newStatus);
      if (res.success) {
        setActionSuccessMsg(`Booking #${bookingId} transitioned to ${newStatus}.`);
        fetchBookings();
      }
    } catch (err) {
      alert(err.message || 'Status transition failed.');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = !statusFilter || b.status === statusFilter;
    const matchesSearch =
      !search ||
      b.id.toString().includes(search) ||
      b.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      b.serviceName?.toLowerCase().includes(search.toLowerCase()) ||
      b.servicePostcode?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div style={{ padding: '3rem 0 6rem' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)' }}>
            All Customer Bookings
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Comprehensive order management with state machine lifecycle validation.
          </p>
        </div>

        {actionSuccessMsg && (
          <div style={{
            background: 'var(--success-light)',
            color: 'var(--success)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            border: '1px solid #a7f3d0'
          }}>
            {actionSuccessMsg}
          </div>
        )}

        {/* Filter bar */}
        <div style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by customer, service, postcode or order #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ minWidth: 180 }}>
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="PENDING">PENDING</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
        </div>

        {/* Bookings Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
            <Loader2 size={32} className="spin" style={{ margin: '0 auto 1rem' }} />
            <p>Loading all orders...</p>
          </div>
        ) : error ? (
          <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
            <AlertCircle size={20} /> {error}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer Info</th>
                  <th>Service Requested</th>
                  <th>Appointment</th>
                  <th>Location</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Workflow Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 800 }}>#{b.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.customerName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.customerEmail}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{b.customerPhone}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.serviceName}</div>
                      <span className="category-tag" style={{ position: 'static', fontSize: '0.65rem' }}>
                        {b.serviceCategory}
                      </span>
                    </td>
                    <td>
                      <div>{b.bookingDate}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {b.startTime.substring(0, 5)} - {b.endTime.substring(0, 5)}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>{b.serviceAddress}</div>
                      <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--primary)' }}>{b.servicePostcode}</div>
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1rem' }}>
                      £{Number(b.totalPrice).toFixed(2)}
                    </td>
                    <td>
                      <StatusBadge status={b.status} />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {b.status === 'PENDING' && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'CONFIRMED')}
                            className="btn btn-outline btn-sm"
                            style={{ fontSize: '0.75rem' }}
                          >
                            Confirm
                          </button>
                        )}
                        {b.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'IN_PROGRESS')}
                            className="btn btn-outline btn-sm"
                            style={{ fontSize: '0.75rem' }}
                          >
                            Dispatch
                          </button>
                        )}
                        {b.status === 'IN_PROGRESS' && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'COMPLETED')}
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: '0.75rem', background: 'var(--success)' }}
                          >
                            Complete
                          </button>
                        )}
                        {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'CANCELLED')}
                            className="btn btn-danger btn-sm"
                            style={{ fontSize: '0.75rem' }}
                          >
                            Cancel
                          </button>
                        )}
                        {(b.status === 'COMPLETED' || b.status === 'CANCELLED') && (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
                            Archived
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
