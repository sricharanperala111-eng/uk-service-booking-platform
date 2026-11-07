import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Search, Shield, Clock, Star, ArrowRight, Wrench, Zap, Flame, Sparkles, Trees, Cpu } from 'lucide-react';
import { BookingModal } from '../components/BookingModal';
import { useAuth } from '../context/AuthContext';

export const HomePage = () => {
  const [featuredServices, setFeaturedServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState(null);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await api.services.getAll({ availableOnly: true });
        if (res.success && res.data) {
          setFeaturedServices(res.data.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to load featured services', err);
      }
    };
    loadServices();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/services');
    }
  };

  const handleBookClick = (service) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedServiceForBooking(service);
  };

  const categories = [
    { name: 'Plumbing', category: 'PLUMBING', icon: <Wrench size={24} />, desc: 'Leaks, drains & taps' },
    { name: 'Heating', category: 'HEATING', icon: <Flame size={24} />, desc: 'Boilers & radiators' },
    { name: 'Electrical', category: 'ELECTRICAL', icon: <Zap size={24} />, desc: 'Certificates & wiring' },
    { name: 'Cleaning', category: 'CLEANING', icon: <Sparkles size={24} />, desc: 'End-of-tenancy & deep' },
    { name: 'Gardening', category: 'GARDENING', icon: <Trees size={24} />, desc: 'Lawn care & clearance' },
    { name: 'Appliances', category: 'APPLIANCE_REPAIR', icon: <Cpu size={24} />, desc: 'Ovens, washing machines' },
  ];

  return (
    <div>
      {/* Hero Banner */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-pill">
            <Shield size={16} color="#38bdf8" />
            <span>Trusted by 15,000+ UK Homeowners & Landlords</span>
          </div>

          <h1>Book Verified UK Tradespeople in Seconds</h1>
          <p>
            Upfront fixed pricing, certified technicians, and guaranteed time slots.
            From emergency plumbing to gas safety certificates across England, Scotland & Wales.
          </p>

          <form onSubmit={handleSearchSubmit} className="hero-search">
            <Search size={22} color="#94a3b8" style={{ margin: 'auto 0 auto 0.75rem' }} />
            <input
              type="text"
              placeholder="e.g. Boiler service, leak repair, or EICR certificate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-accent btn-lg">
              Search Services
            </button>
          </form>
        </div>
      </section>

      {/* Booking Success Notice */}
      {bookingSuccessMsg && (
        <div className="container" style={{ marginTop: '1.5rem' }}>
          <div style={{
            background: 'var(--success-light)',
            color: 'var(--success)',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #a7f3d0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>{bookingSuccessMsg}</span>
            <Link to="/my-bookings" className="btn btn-primary btn-sm">
              View My Bookings
            </Link>
          </div>
        </div>
      )}

      {/* Category Shortcuts */}
      <section style={{ padding: '4rem 0 3rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
              Explore Services by Trade
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Qualified Gas Safe, NICEIC and industry-certified professionals ready to book.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '1.25rem'
          }}>
            {categories.map((c, i) => (
              <Link
                key={i}
                to={`/services?category=${c.category}`}
                style={{
                  background: '#ffffff',
                  padding: '1.5rem 1rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div style={{
                  background: 'var(--accent-light)',
                  color: 'var(--accent)',
                  width: 54,
                  height: 54,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  {c.icon}
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                  {c.name}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section style={{ padding: '2rem 0 5rem', background: '#ffffff', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
                Instant Online Booking
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
                Popular Home Services
              </h2>
            </div>
            <Link to="/services" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              View All Services <ArrowRight size={16} />
            </Link>
          </div>

          <div className="services-grid">
            {featuredServices.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-img-wrap">
                  <img src={service.imageUrl} alt={service.name} className="service-img" />
                  <span className="category-tag">{service.category}</span>
                </div>

                <div className="service-body">
                  <h3 className="service-title">{service.name}</h3>
                  <p className="service-desc">{service.description}</p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', color: '#eab308' }}>
                      <Star size={16} fill="#eab308" />
                      <span style={{ fontWeight: 700, marginLeft: '0.25rem', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                        {service.averageRating > 0 ? service.averageRating : '5.0'}
                      </span>
                    </div>
                    <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                      ({service.reviewCount > 0 ? `${service.reviewCount} reviews` : 'Verified Trade'})
                    </span>
                  </div>

                  <div className="service-footer">
                    <div>
                      <div className="service-price">£{Number(service.price).toFixed(2)}</div>
                      <div className="service-duration">
                        <Clock size={13} /> {service.durationMinutes} mins
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link to={`/services/${service.id}`} className="btn btn-outline btn-sm">
                        Details
                      </Link>
                      <button onClick={() => handleBookClick(service)} className="btn btn-primary btn-sm">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-page)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 650, margin: '0 auto 3.5rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)' }}>How It Works</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              No endless phone calls or waiting for quotes. Instant confirmation with verified UK engineers.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div style={{ background: '#fff', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '0.75rem' }}>01</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Select Service & Time Slot</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
                Browse verified services and pick a live technician slot with double-booking prevention.
              </p>
            </div>

            <div style={{ background: '#fff', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '0.75rem' }}>02</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Fixed UK Pricing</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
                Know the exact total before you confirm. Upfront transparent rates with VAT and insurance included.
              </p>
            </div>

            <div style={{ background: '#fff', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '0.75rem' }}>03</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Track Order & Review</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
                Manage your booking in your customer portal, track status changes, and leave verified reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {selectedServiceForBooking && (
        <BookingModal
          service={selectedServiceForBooking}
          onClose={() => setSelectedServiceForBooking(null)}
          onBookingSuccess={(booking) => {
            setSelectedServiceForBooking(null);
            setBookingSuccessMsg(`Success! Booking #${booking.id} confirmed for ${booking.bookingDate} at ${booking.startTime}.`);
          }}
        />
      )}
    </div>
  );
};
