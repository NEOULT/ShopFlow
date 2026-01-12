import { apiRequest } from './apiClient.js';

export const productsService = {
	list(filters = {}) {
		const params = new URLSearchParams();
		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== '') {
				params.append(key, value);
			}
		});
		const qs = params.toString();
		return apiRequest(`/products${qs ? '?' + qs : ''}`);
	},
	get(id) {
		return apiRequest(`/products/${id}`);
	},
	create(payload) {
		return apiRequest('/products', { method: 'POST', body: payload });
	},
	update(id, payload) {
		return apiRequest(`/products/${id}`, { method: 'PUT', body: payload });
	},
	remove(id) {
		return apiRequest(`/products/${id}`, { method: 'DELETE' });
	},
};
