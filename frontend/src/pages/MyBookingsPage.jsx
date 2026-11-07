import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { ReviewModal } from '../components/ReviewModal';
import { Calendar, Clock, MapPin, Receipt, Star, AlertTriangle, Loader2, ArrowRight } from 'lucide-react';

export const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.bookings.getMyBookings();
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

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await api.bookings.cancel(bookingId);
      if (res.success) {
        setActionSuccessMsg(`Booking #${bookingId} has been successfully cancelled.`);
        fetchBookings();
      }
    } catch (err) {
      alert(err.message || 'Failed to cancel booking.');
    }
  };

  return (
    <div style={{ padding: '3rem 0 6rem' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)' }}>My Bookings</h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Track appointments, review completed services, and manage your UK trade orders.
            </p>
          </div>
          <Link to="/services" className="btn btn-primary">
            Book New Service
          </Link>
        </div>

        {actionSuccessMsg && (
          <div style={{
            background: 'var(--success-light)',
            color: 'var(--success)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            border: '1px solid #a7f3d0'
          }}>
            {actionSuccessMsg}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
            <Loader2 size={32} className="spin" style={{ margin: '0 auto 1rem' }} />
            <p>Loading your appointments...</p>
          </div>
        ) : error ? (
          <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
            <AlertTriangle size={20} /> {error}
          </div>
        ) : bookings.length === 0 ? (
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            padding: '4rem 2rem',
            textAlign: 'center'
          }}>
            <Calendar size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Bookings Yet</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: 420, margin: '0 auto 1.5rem' }}>
              You don't have any active appointments. Explore our vetted UK trade directory to book certified plumbers, electricians and technicians.
            </p>
            <Link to="/services" className="btn btn-accent btn-lg">
              Explore Services <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {bookings.map((booking) => (
              <div
                key={booking.id}
                style={{
                  background: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                  padding: '1.75rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1.5rem',
                  alignItems: 'center'
                }}
              >
                {/* Service & Order Info */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      ORDER #{booking.id}
                    </span>
                    <StatusBadge status={booking.status} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                    {booking.serviceName}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600 }}>
                    {booking.serviceCategory}
                  </span>
                </div>

                {/* Date & Time Slot */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontWeight: 600, marginBottom: '0.35rem' }}>
                    <Calendar size={16} color="var(--primary)" />
                    {new Date(booking.bookingDate).toLocaleDateString('en-GB', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <Clock size={16} />
                    {booking.startTime.substring(0, 5)} - {booking.endTime.substring(0, 5)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.35rem' }}>
                    <MapPin size={15} />
                    {booking.serviceAddress}, {booking.servicePostcode}
                  </div>
                </div>

                {/* Price & Payment */}
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                    £{Number(booking.totalPrice).toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                    <Receipt size={14} /> Ref: {booking.paymentReference || 'N/A'}
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: booking.paymentStatus === 'COMPLETED' ? 'var(--success)' : 'var(--text-muted)'
                  }}>
                    Payment {booking.paymentStatus}
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', alignItems: 'flex-start' }}>
                  {booking.status === 'COMPLETED' && (
                    <button
                      onClick={() => setReviewBooking(booking)}
                      className="btn btn-outline btn-sm"
                      style={{ width: '100%', borderColor: '#eab308', color: '#854d0e', background: '#fefce8' }}
                    >
                      <Star size={14} fill="#eab308" /> Leave Feedback
                    </button>
                  )}

                  {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="btn btn-danger btn-sm"
                      style={{ width: '100%' }}
                    >
                      Cancel Booking
                    </button>
                  )}

                  {booking.status === 'CANCELLED' && (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      Cancelled (Refunded)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {reviewBooking && (
        <ReviewModal
          booking={reviewBooking}
          onClose={() => setReviewBooking(null)}
          onReviewSubmitted={() => {
            setReviewBooking(null);
            setActionSuccessMsg('Thank you! Your verified review has been published.');
          }}
        />
      )}
    </div>
  );
};
