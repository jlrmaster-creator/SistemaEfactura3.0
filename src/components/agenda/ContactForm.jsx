import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';

/** * COMPONENTE: ContactForm
 * RUTA: /src/components/agenda/ContactForm.jsx
 */
const ContactForm = ({ contact, onCancel, onSave, t }) => {
  const [formData, setFormData] = useState({
    name: '',
    doc: '',
    email: ''
  });

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || '',
        doc: contact.doc || '',
        email: contact.email || ''
      });
    }
  }, [contact]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="bg-white p-8 rounded-[1.5rem] border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-8">{contact ? t('editContact') : t('newContact')}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{t('name')}</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#5564eb] outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{t('docId')}</label>
            <input type="text" value={formData.doc} onChange={(e) => setFormData({...formData, doc: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#5564eb] outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#5564eb] outline-none" required />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onCancel} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2"><X size={16} /> {t('cancel')}</button>
            <button type="submit" className="flex-1 py-3 bg-[#5564eb] text-white rounded-xl font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2"><Save size={16} /> {t('saveContact')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;