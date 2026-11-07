import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Phone, MapPin, AlertTriangle, Loader2 } from 'lucide-react';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    postcode: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register(formData);
      navigate('/services');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3.5rem 0 6rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 560, margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
          padding: '2.5rem 2rem'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>
              Create Customer Account
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Join thousands of UK homeowners booking verified tradespeople
            </p>
          </div>

          {error && (
            <div style={{
              background: 'var(--danger-light)',
              color: 'var(--danger)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem'
            }}>
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="e.g. John"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="e.g. Smith"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={15} /> Email Address
              </label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                placeholder="john.smith@example.co.uk"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Lock size={15} /> Password (min 6 characters)
              </label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Phone size={15} /> UK Mobile / Phone
              </label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+44 7700 900123"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={15} /> Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. 45 Deansgate"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Postcode</label>
                <input
                  type="text"
                  name="postcode"
                  className="form-control"
                  value={formData.postcode}
                  onChange={handleChange}
                  placeholder="e.g. M1 1AE"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={18} className="spin" /> Registering...
                </>
              ) : (
                'Create Customer Account'
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
