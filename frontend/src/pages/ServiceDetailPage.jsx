import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BookingModal } from '../components/BookingModal';
import { Clock, Star, ShieldCheck, Check, Calendar, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export const ServiceDetailPage = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState(null);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [serviceRes, reviewsRes] = await Promise.all([
          api.services.getById(id),
          api.reviews.getByServiceId(id),
        ]);

        if (serviceRes.success && serviceRes.data) {
          setService(serviceRes.data);
        }
        if (reviewsRes.success && reviewsRes.data) {
          setReviews(reviewsRes.data);
        }
      } catch (err) {
        setError(err.message || 'Service not found.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleBookClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowBookingModal(true);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}>
        <Loader2 size={36} className="spin" style={{ margin: '0 auto 1rem' }} />
        <p>Loading service details...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="container" style={{ padding: '4rem 0' }}>
        <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <AlertCircle size={24} style={{ marginBottom: '0.5rem' }} />
          <h3>Error loading service</h3>
          <p>{error || 'Service not found.'}</p>
          <Link to="/services" className="btn btn-outline" style={{ marginTop: '1rem' }}>
            <ArrowLeft size={16} /> Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        <Link to="/services" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to Services Directory
        </Link>

        {bookingSuccessMsg && (
          <div style={{
            background: 'var(--success-light)',
            color: 'var(--success)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #a7f3d0',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{bookingSuccessMsg}</span>
            <Link to="/my-bookings" className="btn btn-primary btn-sm">
              View In My Bookings
            </Link>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '3rem', alignItems: 'start' }}>
          {/* Main Details */}
          <div>
            <div style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              height: 380,
              backgroundColor: '#e2e8f0',
              marginBottom: '2rem',
              boxShadow: 'var(--shadow-md)'
            }}>
              <img src={service.imageUrl} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span className="category-tag" style={{ position: 'static' }}>{service.category}</span>
              <div style={{ display: 'flex', alignItems: 'center', color: '#eab308' }}>
                <Star size={18} fill="#eab308" />
                <span style={{ fontWeight: 800, marginLeft: '0.35rem', color: 'var(--text-main)', fontSize: '1.05rem' }}>
                  {service.averageRating > 0 ? service.averageRating : '5.0'}
                </span>
                <span style={{ color: 'var(--text-light)', marginLeft: '0.35rem', fontSize: '0.9rem' }}>
                  ({service.reviewCount} customer reviews)
                </span>
              </div>
            </div>

            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1.25rem', lineHeight: 1.2 }}>
              {service.name}
            </h1>

            <div style={{ background: '#fff', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary)' }}>
                About This Service
              </h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1.025rem' }}>
                {service.description}
              </p>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '1.75rem', marginBottom: '0.75rem' }}>
                What's Included:
              </h4>
              <ul style={{ listStyle: 'none', display: 'grid', gap: '0.6rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                  <Check size={18} color="var(--success)" /> Qualified UK Certified Engineer visit
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                  <Check size={18} color="var(--success)" /> Standard diagnostic checks & equipment inspection
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                  <Check size={18} color="var(--success)" /> Digital completion certificate & receipt
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                  <Check size={18} color="var(--success)" /> £5,000,000 Public Liability Insurance protection
                </li>
              </ul>
            </div>

            {/* Customer Reviews Section */}
            <div style={{ background: '#fff', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>
                  Verified Customer Reviews
                </h3>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {reviews.length} Verified {reviews.length === 1 ? 'Review' : 'Reviews'}
                </span>
              </div>

              {reviews.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>
                  No customer reviews yet. Be the first to book and rate this service!
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {reviews.map((rev) => (
                    <div key={rev.id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{rev.customerName}</span>
                        <div style={{ display: 'flex', color: '#eab308' }}>
                          {[...Array(rev.rating)].map((_, idx) => (
                            <Star key={idx} size={14} fill="#eab308" />
                          ))}
                        </div>
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.5 }}>
                        "{rev.comment}"
                      </p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.35rem', display: 'block' }}>
                        Verified Booking
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sticky Booking Action Card */}
          <div style={{
            position: 'sticky',
            top: '6rem',
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-lg)',
            padding: '2rem'
          }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Fixed Guaranteed Price
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', margin: '0.25rem 0 1rem' }}>
              £{Number(service.price).toFixed(2)}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
              <Clock size={16} /> Typical Duration: <strong style={{ color: 'var(--text-main)' }}>{service.durationMinutes} minutes</strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <ShieldCheck size={18} color="var(--accent)" /> Identity-vetted trade professionals
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <Calendar size={18} color="var(--accent)" /> Real-time double-booking prevention
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <Check size={18} color="var(--success)" /> Instant booking confirmation
              </div>
            </div>

            <button onClick={handleBookClick} className="btn btn-accent btn-lg" style={{ width: '100%' }}>
              Book This Service
            </button>
          </div>
        </div>
      </div>

      {showBookingModal && (
        <BookingModal
          service={service}
          onClose={() => setShowBookingModal(false)}
          onBookingSuccess={(booking) => {
            setShowBookingModal(false);
            setBookingSuccessMsg(`Your booking #${booking.id} has been confirmed for ${booking.bookingDate} at ${booking.startTime}!`);
          }}
        />
      )}
    </div>
  );
};
