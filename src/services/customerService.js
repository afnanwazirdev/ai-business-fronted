import api from './api';

export const customerService = {
  getCustomers: async (params = {}) => {
    return api.get('/customers', { params });
  },

  getCustomer: async (id) => {
    return api.get(`/customers/${id}`);
  },

  updateCustomer: async (id, data) => {
    return api.put(`/customers/${id}`, data);
  },
};

export default customerService;
