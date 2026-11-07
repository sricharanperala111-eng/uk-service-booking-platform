import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import {
  PoundSterling,
  CalendarCheck,
  Users,
  Wrench,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Loader2
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getDashboard();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const res = await api.bookings.updateStatus(bookingId, newStatus);
      if (res.success) {
        loadStats();
      }
    } catch (err) {
      alert(err.message || 'Failed to transition booking status.');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}>
        <Loader2 size={36} className="spin" style={{ margin: '0 auto 1rem' }} />
        <p>Loading administrative dashboard...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="container" style={{ padding: '4rem 0' }}>
        <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <AlertCircle size={20} /> {error || 'Failed to load dashboard.'}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0 6rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase' }}>
              Platform Operations
            </span>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)' }}>
              Administrator Dashboard
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/admin/manage-services" className="btn btn-outline">
              <Wrench size={16} /> Manage Services
            </Link>
            <Link to="/admin/manage-bookings" className="btn btn-primary">
              <CalendarCheck size={16} /> All Bookings
            </Link>
          </div>
        </div>

        {/* Top KPI Metric Cards */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon-wrap" style={{ background: '#ecfdf5', color: '#047857' }}>
              <PoundSterling size={26} />
            </div>
            <div>
              <div className="metric-value">£{Number(stats.totalRevenue).toFixed(2)}</div>
              <div className="metric-label">Confirmed Revenue</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-wrap" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
              <CalendarCheck size={26} />
            </div>
            <div>
              <div className="metric-value">{stats.totalBookings}</div>
              <div className="metric-label">Total Bookings</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-wrap" style={{ background: '#f5f3ff', color: '#6d28d9' }}>
              <Users size={26} />
            </div>
            <div>
              <div className="metric-value">{stats.totalCustomers}</div>
              <div className="metric-label">Active Customers</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-wrap" style={{ background: '#fffbeb', color: '#b45309' }}>
              <Clock size={26} />
            </div>
            <div>
              <div className="metric-value">{stats.pendingBookings + stats.inProgressBookings}</div>
              <div className="metric-label">Active Operations</div>
            </div>
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2.5rem'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--primary)' }}>
            Order Pipeline & Status Breakdown
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>CONFIRMED</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.25rem' }}>{stats.confirmedBookings}</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>IN PROGRESS</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--info)', marginTop: '0.25rem' }}>{stats.inProgressBookings}</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>COMPLETED</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#334155', marginTop: '0.25rem' }}>{stats.completedBookings}</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>CANCELLED</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--danger)', marginTop: '0.25rem' }}>{stats.cancelledBookings}</div>
            </div>
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>
                Recent Service Orders
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Latest bookings placed across all UK territories
              </p>
            </div>
            <Link to="/admin/manage-bookings" className="btn btn-outline btn-sm">
              View All Orders <ArrowRight size={14} />
            </Link>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Date & Time</th>
                  <th>Postcode</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentBookings.map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 700 }}>#{b.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.customerName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.customerEmail}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.serviceName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>{b.serviceCategory}</div>
                    </td>
                    <td>
                      <div>{b.bookingDate}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {b.startTime.substring(0, 5)} - {b.endTime.substring(0, 5)}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{b.servicePostcode}</td>
                    <td style={{ fontWeight: 800, color: 'var(--primary)' }}>
                      £{Number(b.totalPrice).toFixed(2)}
                    </td>
                    <td>
                      <StatusBadge status={b.status} />
                    </td>
                    <td>
                      {b.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleStatusChange(b.id, 'IN_PROGRESS')}
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.75rem' }}
                        >
                          Dispatch / In Progress
                        </button>
                      )}
                      {b.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => handleStatusChange(b.id, 'COMPLETED')}
                          className="btn btn-primary btn-sm"
                          style={{ fontSize: '0.75rem', background: 'var(--success)' }}
                        >
                          Mark Completed
                        </button>
                      )}
                      {(b.status === 'COMPLETED' || b.status === 'CANCELLED') && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                          Final State
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
