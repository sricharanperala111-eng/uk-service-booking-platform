const BASE_URL = '/api';

export const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || (data?.errors ? Object.values(data.errors).join(', ') : 'Request failed');
    throw new Error(errorMsg);
  }

  return data;
};

export const api = {
  // Auth
  auth: {
    login: (credentials) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    register: (userData) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    me: () => request('/auth/me'),
  },

  // Services Catalog
  services: {
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      if (params.category) query.append('category', params.category);
      if (params.search) query.append('search', params.search);
      if (params.minPrice) query.append('minPrice', params.minPrice);
      if (params.maxPrice) query.append('maxPrice', params.maxPrice);
      if (params.availableOnly !== undefined) query.append('availableOnly', params.availableOnly);
      const q = query.toString();
      return request(`/services${q ? `?${q}` : ''}`);
    },
    getById: (id) => request(`/services/${id}`),
    getAvailability: (id, date) => request(`/services/${id}/availability?date=${date}`),
    create: (data) =>
      request('/services', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      request(`/services/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id) =>
      request(`/services/${id}`, {
        method: 'DELETE',
      }),
  },

  // Bookings
  bookings: {
    create: (data) =>
      request('/bookings', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getMyBookings: () => request('/bookings'),
    getById: (id) => request(`/bookings/${id}`),
    updateStatus: (id, status) =>
      request(`/bookings/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }),
    cancel: (id) =>
      request(`/bookings/${id}/cancel`, {
        method: 'POST',
      }),
  },

  // Reviews
  reviews: {
    create: (data) =>
      request('/reviews', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getByServiceId: (serviceId) => request(`/services/${serviceId}/reviews`),
  },

  // Admin Operations
  admin: {
    getDashboard: () => request('/admin/dashboard'),
    getBookings: () => request('/admin/bookings'),
    getCustomers: () => request('/admin/customers'),
  },
};
