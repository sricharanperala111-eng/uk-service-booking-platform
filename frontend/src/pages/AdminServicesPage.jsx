import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Clock, AlertTriangle, Loader2, X } from 'lucide-react';

export const AdminServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'PLUMBING',
    price: '',
    durationMinutes: 60,
    available: true,
    imageUrl: '',
  });
  const [modalSubmitting, setModalSubmitting] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.services.getAll({ availableOnly: false });
      if (res.success && res.data) {
        setServices(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      category: 'PLUMBING',
      price: '',
      durationMinutes: 60,
      available: true,
      imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    });
    setShowModal(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category,
      price: service.price,
      durationMinutes: service.durationMinutes,
      available: service.available,
      imageUrl: service.imageUrl || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }
    try {
      const res = await api.services.delete(id);
      if (res.success) {
        setActionSuccessMsg(`Service "${name}" was deleted.`);
        fetchServices();
      }
    } catch (err) {
      alert(err.message || 'Failed to delete service.');
    }
  };

  const handleToggleAvailable = async (service) => {
    try {
      const updated = {
        name: service.name,
        description: service.description,
        category: service.category,
        price: service.price,
        durationMinutes: service.durationMinutes,
        available: !service.available,
        imageUrl: service.imageUrl,
      };
      await api.services.update(service.id, updated);
      fetchServices();
    } catch (err) {
      alert(err.message || 'Failed to update availability.');
    }
  };

  const handleSubmitModal = async (e) => {
    e.preventDefault();
    setModalSubmitting(true);
    try {
      if (editingService) {
        await api.services.update(editingService.id, formData);
        setActionSuccessMsg(`Service "${formData.name}" updated successfully.`);
      } else {
        await api.services.create(formData);
        setActionSuccessMsg(`New service "${formData.name}" created successfully.`);
      }
      setShowModal(false);
      fetchServices();
    } catch (err) {
      alert(err.message || 'Operation failed.');
    } finally {
      setModalSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '3rem 0 6rem' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)' }}>
              Manage Home Services
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Create, update pricing, toggle availability, and configure trade offerings.
            </p>
          </div>
          <button onClick={openCreateModal} className="btn btn-primary">
            <Plus size={18} /> Add New Service
          </button>
        </div>

        {actionSuccessMsg && (
          <div style={{
            background: 'var(--success-light)',
            color: 'var(--success)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            border: '1px solid #a7f3d0'
          }}>
            {actionSuccessMsg}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
            <Loader2 size={32} className="spin" style={{ margin: '0 auto 1rem' }} />
            <p>Loading services...</p>
          </div>
        ) : error ? (
          <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
            <AlertTriangle size={20} /> {error}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Category</th>
                  <th>Fixed Rate</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{s.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: 350, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {s.description}
                      </div>
                    </td>
                    <td>
                      <span className="category-tag" style={{ position: 'static' }}>{s.category}</span>
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.05rem' }}>
                      £{Number(s.price).toFixed(2)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.9rem' }}>
                        <Clock size={14} /> {s.durationMinutes}m
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleAvailable(s)}
                        style={{
                          background: s.available ? 'var(--success-light)' : 'var(--danger-light)',
                          color: s.available ? 'var(--success)' : 'var(--danger)',
                          border: 'none',
                          borderRadius: 'var(--radius-full)',
                          padding: '0.25rem 0.75rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        {s.available ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {s.available ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => openEditModal(s)} className="btn btn-outline btn-sm" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(s.id, s.name)} className="btn btn-danger btn-sm" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingService ? 'Edit Service' : 'Add New Trade Service'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmitModal}>
              <div className="form-group">
                <label className="form-label">Service Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Radiator Power Flush"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Details of service and engineer qualifications..."
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Trade Category</label>
                  <select
                    className="form-control"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="PLUMBING">PLUMBING</option>
                    <option value="HEATING">HEATING</option>
                    <option value="ELECTRICAL">ELECTRICAL</option>
                    <option value="CLEANING">CLEANING</option>
                    <option value="GARDENING">GARDENING</option>
                    <option value="APPLIANCE_REPAIR">APPLIANCE_REPAIR</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price (£ GBP)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="5"
                    className="form-control"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 95.00"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Duration (Minutes)</label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    className="form-control"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value, 10) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    className="form-control"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" disabled={modalSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={modalSubmitting}>
                  {modalSubmitting ? 'Saving...' : editingService ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
