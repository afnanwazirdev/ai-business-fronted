import api from './api';

export const orderService = {
  getOrders: async (params = {}) => {
    return api.get('/orders', { params });
  },

  getOrder: async (id) => {
    return api.get(`/orders/${id}`);
  },

  createOrder: async (orderData) => {
    return api.post('/orders', orderData);
  },

  updateStatus: async (id, status, note, courierInfo) => {
    return api.patch(`/orders/${id}/status`, { status, note, courierInfo });
  },

  bulkUpdateStatus: async (orderIds, status) => {
    return api.post('/orders/bulk-status', { orderIds, status });
  },
};

export default orderService;
