import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

const http = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

http.interceptors.response.use(
  r => r,
  error => {
    const msg = error.response?.data?.message || error.message || 'Error de conexión';
    console.error('[BillingAPI]', msg);
    return Promise.reject(new Error(msg));
  }
);

const isReal = () => !!API_BASE;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const BillingAPI = {
  isReal,
  getBaseURL: () => API_BASE,

  async getDashboardStats(outbox, inbox, clients) {
    if (isReal()) {
      const { data } = await http.get('/dashboard/stats');
      return data;
    }
    await delay(300);
    const getCounts = (list) => ({
      accepted: list.filter(f => f.status === 'accepted').length,
      paid: list.filter(f => f.status === 'paid').length,
      rejected: list.filter(f => f.status === 'rejected').length,
      pending: list.filter(f => f.status === 'pending').length
    });
    return {
      sent: getCounts(outbox),
      received: getCounts(inbox),
      topClients: [...clients].sort((a,b)=>b.totalSales - a.totalSales).slice(0, 4),
      cashflow: [{ m: 'Ene', in: 4000, out: 2100 }, { m: 'Feb', in: 5200, out: 1800 }, { m: 'Mar', in: 4800, out: 3200 }, { m: 'Abr', in: 7100, out: 2500 }],
      kpis: { acceptance: "94.2%", avgDays: "12 días" }
    };
  },

  async emitInvoice(data) {
    if (isReal()) {
      const { data: res } = await http.post('/invoices', data);
      return { success: true, data: res };
    }
    await delay(1000);
    return { success: true, data: { ...data, id: `FAC-${new Date().getFullYear()}-${Math.floor(Math.random()*9000)+1000}`, status: 'accepted' } };
  },

  async getInvoices(type = 'outbox', status = 'pending') {
    if (isReal()) {
      const { data } = await http.get(`/invoices/${type}`, { params: { status } });
      return data;
    }
    return null;
  },

  async getReportData() {
    if (isReal()) {
      const { data } = await http.get('/reports');
      return data;
    }
    await delay(500);
    return { monthly: [{ month: 'Ene', income: 4500, expense: 2100 }, { month: 'Feb', income: 5200, expense: 1800 }, { month: 'Mar', income: 4800, expense: 3200 }], categories: [{ name: 'Software', value: 55, color: 'bg-[#5564eb]' }], progress: 72 };
  },

  async getAuditLogs() {
    if (isReal()) {
      const { data } = await http.get('/audit/logs');
      return data;
    }
    await delay(300);
    return [{ id: 'FAC-2023-001', format: 'FacturaE 3.2.2', timestamp: '2023-11-01', status: 'FIRMADO', hash: 'sha256:7a8b...', message: 'Validación AEAT Correcta' }];
  },

  async validateXML(content) {
    if (isReal()) {
      const { data } = await http.post('/validate/xml', { content });
      return data.valid;
    }
    await delay(300);
    return content.trim().startsWith('<?xml');
  },

  async getCatalog() {
    if (isReal()) {
      const { data } = await http.get('/catalog');
      return data;
    }
    return null;
  },

  async getContacts(type = 'clients') {
    if (isReal()) {
      const { data } = await http.get(`/contacts/${type}`);
      return data;
    }
    return null;
  },

  async saveContact(contactData) {
    if (isReal()) {
      const { data } = contactData.id
        ? await http.put(`/contacts/${contactData.id}`, contactData)
        : await http.post('/contacts', contactData);
      return data;
    }
    return null;
  },

  generateEdifact(invoice) {
    const ref = `ID${Date.now().toString().slice(-6)}`;
    const dateStr = (invoice.date || '').replace(/-/g, '');
    return [`UNH+${ref}+ORDERS:D:96A:UN:EAN008'`, `BGM+220+${invoice.id || 'TEMP'}+9'`, `DTM+137:${dateStr}:102'`, `NAD+BY+8437003583001::9'`, `NAD+SU+${invoice.doc || 'NIF001'}::9'`, `CUX+2:${invoice.currency || 'EUR'}:9'`, `LIN+1++8400000000000:EN'`, `QTY+21:1'`, `MOA+139:${(invoice.total || 0).toFixed(2)}'`, `UNS+S'`, `UNT+11+${ref}'`].join('\n');
  }
};

export default BillingAPI;
