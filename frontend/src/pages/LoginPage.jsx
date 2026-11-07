import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertTriangle, Loader2, UserCheck, Shield } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/services';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await login(email, password);
      if (data.user.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate(from === '/services' ? '/my-bookings' : from);
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (type) => {
    if (type === 'admin') {
      setEmail('admin@ukservices.co.uk');
      setPassword('AdminPass123!');
    } else {
      setEmail('john.smith@example.co.uk');
      setPassword('CustomerPass123!');
    }
  };

  return (
    <div style={{ padding: '4rem 0 6rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 460, margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
          padding: '2.5rem 2rem'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>
              Welcome Back
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Sign in to manage your service bookings or admin dashboard
            </p>
          </div>

          {/* Recruiter / Evaluator 1-Click Demo Buttons */}
          <div style={{
            background: 'var(--accent-light)',
            border: '1px solid #bfdbfe',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
              Portfolio Evaluation Demo Credentials
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => handleFillDemo('customer')}
                className="btn btn-outline btn-sm"
                style={{ background: '#fff' }}
              >
                <UserCheck size={14} /> Customer Demo
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('admin')}
                className="btn btn-primary btn-sm"
              >
                <Shield size={14} /> Admin Demo
              </button>
            </div>
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
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={15} /> Email Address
              </label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.co.uk"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Lock size={15} /> Password
              </label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '0.75rem' }} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={18} className="spin" /> Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
