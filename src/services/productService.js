import api from './api';

export const productService = {
  getProducts: async (params = {}) => {
    return api.get('/products', { params });
  },

  getProduct: async (id) => {
    return api.get(`/products/${id}`);
  },

  createProduct: async (productData) => {
    return api.post('/products', productData);
  },

  updateProduct: async (id, productData) => {
    return api.put(`/products/${id}`, productData);
  },

  adjustStock: async (id, delta, reason, variantId) => {
    return api.patch(`/products/${id}/stock`, { delta, reason, variantId });
  },

  getLowStock: async () => {
    return api.get('/products/low-stock');
  },

  getMovements: async (id) => {
    return api.get(`/products/${id}/movements`);
  },

  deleteProduct: async (id) => {
    return api.delete(`/products/${id}`);
  },

  uploadImage: async (formData) => {
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default productService;
