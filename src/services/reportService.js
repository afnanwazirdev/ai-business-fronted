import api from './api';

export const reportService = {
  getDashboardStats: async () => {
    return api.get('/reports/dashboard');
  },

  getCityAnalytics: async () => {
    return api.get('/reports/cities');
  },

  exportCsv: async () => {
    const response = await fetch('/api/reports/export', { credentials: 'include' });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `karobar_orders_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  },
};

export default reportService;
