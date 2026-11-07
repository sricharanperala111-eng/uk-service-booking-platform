import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BookingModal } from '../components/BookingModal';
import { Search, Filter, Clock, Star, AlertCircle, Loader2 } from 'lucide-react';

export const ServicesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  const [bookingService, setBookingService] = useState(null);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState(null);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const categories = [
    { label: 'All Services', value: '' },
    { label: 'Plumbing', value: 'PLUMBING' },
    { label: 'Heating & Gas', value: 'HEATING' },
    { label: 'Electrical', value: 'ELECTRICAL' },
    { label: 'Deep Cleaning', value: 'CLEANING' },
    { label: 'Gardening', value: 'GARDENING' },
    { label: 'Appliance Repair', value: 'APPLIANCE_REPAIR' },
  ];

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        availableOnly: true,
      };
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await api.services.getAll(params);
      if (res.success && res.data) {
        setServices(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch services catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [selectedCategory, maxPrice]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchServices();
  };

  const handleBook = (service) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setBookingService(service);
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>
            UK Home Services & Trade Directory
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Transparent fixed pricing, Gas Safe and NICEIC verified engineers. Select a service to check live slot availability.
          </p>
        </div>

        {bookingSuccessMsg && (
          <div style={{
            background: 'var(--success-light)',
            color: 'var(--success)',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #a7f3d0',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>{bookingSuccessMsg}</span>
            <Link to="/my-bookings" className="btn btn-primary btn-sm">
              View My Bookings
            </Link>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div style={{
          background: '#ffffff',
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2rem'
        }}>
          {/* Categories Pill Bar */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  border: '1.5px solid',
                  cursor: 'pointer',
                  borderColor: selectedCategory === cat.value ? 'var(--primary)' : 'var(--border)',
                  backgroundColor: selectedCategory === cat.value ? 'var(--primary)' : '#ffffff',
                  color: selectedCategory === cat.value ? '#ffffff' : 'var(--text-muted)',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Max Price Inputs */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search by keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div>
              <select
                className="form-control"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              >
                <option value="">Max Price (Any)</option>
                <option value="80">Under £80</option>
                <option value="120">Under £120</option>
                <option value="200">Under £200</option>
                <option value="300">Under £300</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>
              <Search size={16} /> Apply Filters
            </button>
          </form>
        </div>

        {/* Content Area */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <Loader2 size={32} className="spin" style={{ margin: '0 auto 1rem' }} />
            <p>Loading available services...</p>
          </div>
        ) : error ? (
          <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
            <AlertCircle size={20} /> {error}
          </div>
        ) : services.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>No services found matching your criteria.</p>
            <button onClick={() => { setSelectedCategory(''); setSearchQuery(''); setMaxPrice(''); }} className="btn btn-outline" style={{ marginTop: '1rem' }}>
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="services-grid">
            {services.map((service) => (
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
                      <button onClick={() => handleBook(service)} className="btn btn-primary btn-sm">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {bookingService && (
        <BookingModal
          service={bookingService}
          onClose={() => setBookingService(null)}
          onBookingSuccess={(booking) => {
            setBookingService(null);
            setBookingSuccessMsg(`Booking #${booking.id} confirmed for ${booking.bookingDate} at ${booking.startTime}!`);
          }}
        />
      )}
    </div>
  );
};
