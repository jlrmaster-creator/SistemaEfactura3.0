import React, { useState } from 'react';
import { Save, X } from 'lucide-react';

/** * COMPONENTE: InvoiceForm
 * RUTA: /src/components/invoices/InvoiceForm.jsx
 */
const InvoiceForm = ({ agenda, onCancel, onEmit, t }) => {
  const [formData, setFormData] = useState({
    client: '',
    total: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedClient = agenda.clients.find(c => c.id == formData.client);
    onEmit({
      ...formData,
      client: selectedClient?.name,
      doc: selectedClient?.doc,
      total: parseFloat(formData.total)
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="bg-white p-8 rounded-[1.5rem] border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-8">{t('newInvoice')}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Cliente</label>
            <select value={formData.client} onChange={(e) => setFormData({...formData, client: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#5564eb] outline-none" required>
              <option value="">Seleccionar cliente</option>
              {agenda.clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Importe Total (€)</label>
            <input type="number" step="0.01" value={formData.total} onChange={(e) => setFormData({...formData, total: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#5564eb] outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Fecha</label>
            <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#5564eb] outline-none" required />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onCancel} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2"><X size={16} /> {t('cancel')}</button>
            <button type="submit" className="flex-1 py-3 bg-[#5564eb] text-white rounded-xl font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2"><Save size={16} /> {t('emit')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceForm;