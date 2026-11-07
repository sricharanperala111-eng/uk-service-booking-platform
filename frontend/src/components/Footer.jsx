import React from 'react';
import { ShieldCheck, Award, ThumbsUp, Wrench } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        {/* Trust & Accreditations bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2rem',
          paddingBottom: '2.5rem',
          borderBottom: '1px solid #1e293b',
          marginBottom: '2.5rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ background: '#1e293b', padding: '0.6rem', borderRadius: 8, color: '#38bdf8' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '0.25rem' }}>Vetted & Insured</h4>
              <p style={{ fontSize: '0.85rem' }}>All tradespeople are identity-verified, NICEIC or Gas Safe registered with £5m public liability.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ background: '#1e293b', padding: '0.6rem', borderRadius: 8, color: '#4ade80' }}>
              <Award size={24} />
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '0.25rem' }}>Transparent Pricing</h4>
              <p style={{ fontSize: '0.85rem' }}>Upfront fixed rates in British Pounds (£). No hidden callout charges or unexpected fees.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ background: '#1e293b', padding: '0.6rem', borderRadius: 8, color: '#facc15' }}>
              <ThumbsUp size={24} />
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '0.25rem' }}>100% Satisfaction</h4>
              <p style={{ fontSize: '0.85rem' }}>Service guarantee with verified customer reviews and dedicated UK support.</p>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontWeight: 700 }}>
            <Wrench size={18} color="#38bdf8" />
            UK Service Booking Platform &copy; {new Date().getFullYear()}
          </div>
          <div>
            Built with Spring Boot 3, PostgreSQL, Java 17, and React for the UK Full-Stack Market.
          </div>
        </div>
      </div>
    </footer>
  );
};
