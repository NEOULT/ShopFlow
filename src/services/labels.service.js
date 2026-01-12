import { apiRequest } from './apiClient.js';

export const labelsService = {
  list() {
    return apiRequest('/labels');
  },
  get(id) {
    return apiRequest(`/labels/${id}`);
  },
  create(payload) {
    return apiRequest('/labels', { method: 'POST', body: payload });
  },
  update(id, payload) {
    return apiRequest(`/labels/${id}`, { method: 'PUT', body: payload });
  },
  remove(id) {
    return apiRequest(`/labels/${id}`, { method: 'DELETE' });
  },
};
