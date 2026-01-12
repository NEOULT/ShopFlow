import { apiRequest } from './apiClient.js';

export const categoriesService = {
  async list() {
    try {
      return await apiRequest('/categories');
    } catch (err) {
      if (err?.status === 404) {
        return apiRequest('/category');
      }
      throw err;
    }
  },
  async get(id) {
    try {
      return await apiRequest(`/categories/${id}`);
    } catch (err) {
      if (err?.status === 404) return apiRequest(`/category/${id}`);
      throw err;
    }
  },
  async create(payload) {
    try {
      return await apiRequest('/categories', { method: 'POST', body: payload });
    } catch (err) {
      if (err?.status === 404) {
        return apiRequest('/category', { method: 'POST', body: payload });
      }
      throw err;
    }
  },
  async update(id, payload) {
    try {
      return await apiRequest(`/categories/${id}`, { method: 'PUT', body: payload });
    } catch (err) {
      if (err?.status === 404) {
        return apiRequest(`/category/${id}`, { method: 'PUT', body: payload });
      }
      throw err;
    }
  },
  async remove(id) {
    try {
      return await apiRequest(`/categories/${id}`, { method: 'DELETE' });
    } catch (err) {
      if (err?.status === 404) return apiRequest(`/category/${id}`, { method: 'DELETE' });
      throw err;
    }
  },
};
