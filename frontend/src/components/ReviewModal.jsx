import React, { useState } from 'react';
import { api } from '../services/api';
import { X, Star, AlertTriangle, Loader2 } from 'lucide-react';

export const ReviewModal = ({ booking, onClose, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please provide feedback comments.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await api.reviews.create({
        bookingId: booking.id,
        rating,
        comment: comment.trim(),
      });

      if (res.success) {
        onReviewSubmitted(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit review.');
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
              Verified Customer Review
            </span>
            <h3 className="modal-title">{booking.serviceName}</h3>
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
          {/* Rating Stars */}
          <div className="form-group">
            <label className="form-label">Service Rating</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: star <= rating ? '#eab308' : '#cbd5e1',
                    transition: 'color 0.15s'
                  }}
                >
                  <Star size={32} fill={star <= rating ? '#eab308' : 'none'} />
                </button>
              ))}
              <span style={{ marginLeft: '0.75rem', fontWeight: 700, fontSize: '1.1rem' }}>
                {rating} / 5 Stars
              </span>
            </div>
          </div>

          {/* Comment */}
          <div className="form-group">
            <label className="form-label">Your Review</label>
            <textarea
              className="form-control"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How did the technician perform? Was the service completed on time?"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline" disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 size={16} className="spin" /> Submitting...
                </>
              ) : (
                'Submit Verified Review'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
