import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { X, Calendar, Clock, MapPin, CreditCard, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

export const BookingModal = ({ service, onClose, onBookingSuccess }) => {
  const { user } = useAuth();
  
  // Default to tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState(defaultDateStr);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [address, setAddress] = useState(user?.address || '');
  const [postcode, setPostcode] = useState(user?.postcode || '');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch availability when date changes
  useEffect(() => {
    if (!service || !date) return;
    
    const fetchSlots = async () => {
      setLoadingSlots(true);
      setError(null);
      setSelectedSlot(null);
      try {
        const res = await api.services.getAvailability(service.id, date);
        if (res.success && res.data) {
          setSlots(res.data.timeSlots || []);
        }
      } catch (err) {
        setError(err.message || 'Failed to load technician availability.');
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [service, date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      setError('Please select an available technician time slot.');
      return;
    }
    if (!address.trim() || !postcode.trim()) {
      setError('Please provide your service address and UK postcode.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        serviceId: service.id,
        bookingDate: date,
        startTime: selectedSlot.startTime,
        serviceAddress: address.trim(),
        servicePostcode: postcode.trim(),
        notes: notes.trim(),
        paymentMethod: 'DEBIT_CARD'
      };

      const res = await api.bookings.create(payload);
      if (res.success) {
        onBookingSuccess(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to confirm booking. Time slot may have just been reserved.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Book Service
            </span>
            <h3 className="modal-title">{service.name}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
            <X size={22} />
          </button>
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
            fontSize: '0.9rem'
          }}>
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Date Picker */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={16} />
              Select Date
            </label>
            <input
              type="date"
              className="form-control"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Time Slot Picker with Conflict Indicator */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={16} />
              Technician Time Slots (Double-Booking Protected)
            </label>

            {loadingSlots ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 0', color: 'var(--text-muted)' }}>
                <Loader2 size={18} className="spin" /> Checking slot availability...
              </div>
            ) : (
              <div className="slots-grid">
                {slots.map((slot, idx) => {
                  const isSelected = selectedSlot?.startTime === slot.startTime;
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={!slot.available}
                      className={`slot-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedSlot(slot)}
                      title={slot.available ? 'Available' : slot.conflictReason}
                    >
                      <div>{slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}</div>
                      <div style={{ fontSize: '0.7rem', marginTop: '2px', opacity: 0.85 }}>
                        {slot.available ? 'Available' : 'Booked'}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Address & Postcode */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={16} /> Service Address
              </label>
              <input
                type="text"
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 45 High Street, Flat 2"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">UK Postcode</label>
              <input
                type="text"
                className="form-control"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                placeholder="e.g. SW1A 1AA"
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">Special Notes / Access Instructions</label>
            <textarea
              className="form-control"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Key in safe box by rear door or meter location."
            />
          </div>

          {/* Pricing & Guarantee Summary */}
          <div style={{
            background: 'var(--bg-page)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <span>Service Total:</span>
              <span style={{ fontWeight: 700 }}>£{Number(service.price).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <span>UK VAT & Callout:</span>
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>Included (No extra fees)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border)', fontSize: '1.1rem', fontWeight: 800 }}>
              <span>Total Payable:</span>
              <span style={{ color: 'var(--primary)' }}>£{Number(service.price).toFixed(2)}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn btn-outline" disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-accent btn-lg" disabled={submitting || !selectedSlot}>
              {submitting ? (
                <>
                  <Loader2 size={18} className="spin" /> Processing Order...
                </>
              ) : (
                <>
                  <CreditCard size={18} /> Confirm & Pay £{Number(service.price).toFixed(2)}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
