import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, Calendar, LayoutDashboard, User as UserIcon, LogOut, LogIn, PlusCircle } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container nav-container">
        <Link to="/" className="brand-logo">
          <div style={{
            background: 'linear-gradient(135deg, #0f2b5c, #2563eb)',
            color: '#fff',
            width: 38,
            height: 38,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(15, 43, 92, 0.2)'
          }}>
            <Wrench size={20} />
          </div>
          <span>UK Services</span>
          <span className="brand-badge">Marketplace</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/services" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Explore Services
          </NavLink>

          {isAuthenticated && (
            <NavLink to="/my-bookings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Calendar size={16} />
              My Bookings
            </NavLink>
          )}

          {isAdmin && (
            <>
              <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={16} />
                Dashboard
              </NavLink>
              <NavLink to="/admin/manage-services" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <PlusCircle size={16} />
                Manage Services
              </NavLink>
              <NavLink to="/admin/manage-bookings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                All Orders
              </NavLink>
            </>
          )}
        </nav>

        <div className="nav-auth">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                <div style={{
                  background: '#e2e8f0',
                  color: '#1e293b',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <UserIcon size={16} />
                </div>
                <span>{user.firstName}</span>
                {isAdmin && (
                  <span style={{ fontSize: '0.7rem', background: '#fef3c7', color: '#92400e', padding: '1px 6px', borderRadius: 4 }}>
                    Admin
                  </span>
                )}
              </Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm" title="Sign Out">
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                <LogIn size={15} />
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
