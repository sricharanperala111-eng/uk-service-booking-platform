import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Shield, CheckCircle } from 'lucide-react';

export const ProfilePage = () => {
  const { user, isAdmin } = useAuth();

  if (!user) return null;

  return (
    <div style={{ padding: '3.5rem 0 6rem' }}>
      <div className="container" style={{ maxWidth: 700 }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>
          My Account Profile
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Personal details, registered UK service address, and security permissions.
        </p>

        <div style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
          padding: '2.5rem'
        }}>
          {/* Header avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              backgroundColor: 'var(--accent-light)',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              fontWeight: 800
            }}>
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {user.fullName}
                </h2>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isAdmin ? '#fef3c7' : '#ecfdf5',
                  color: isAdmin ? '#92400e' : '#047857',
                  border: isAdmin ? '1px solid #fde68a' : '1px solid #a7f3d0'
                }}>
                  {isAdmin ? 'ADMINISTRATOR' : 'VERIFIED CUSTOMER'}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                User ID #{user.id} &bull; UK Marketplace Account
              </p>
            </div>
          </div>

          {/* Details list */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.75rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
                <Mail size={14} /> Registered Email
              </label>
              <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {user.email}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
                <Phone size={14} /> UK Phone Number
              </label>
              <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {user.phone || 'Not provided'}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
                <MapPin size={14} /> Default Service Address
              </label>
              <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {user.address || 'Not provided'}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
                <MapPin size={14} /> UK Postcode
              </label>
              <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {user.postcode || 'Not provided'}
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '2.5rem',
            paddingTop: '1.75rem',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: 'var(--success)',
            fontSize: '0.9rem',
            fontWeight: 600
          }}>
            <CheckCircle size={18} />
            <span>Account secured with BCrypt password hashing & JWT authentication.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
