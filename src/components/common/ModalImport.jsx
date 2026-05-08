import React, { useState } from 'react';
import { X, Upload, CheckCircle2 } from 'lucide-react';

/** * COMPONENTE: ModalImport
 * RUTA: /src/components/common/ModalImport.jsx
 */
const ModalImport = ({ onCancel, onSuccess, t }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [format, setFormat] = useState('FacturaE');
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    if (!selectedFile) return;
    setLoading(true);
    // Simulate import
    setTimeout(() => {
      setLoading(false);
      onSuccess(format);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-[2rem] p-8 w-full max-w-md mx-4 animate-in slide-in-from-bottom-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{t('importXML')}</h2>
          <button onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{t('selectFormat')}</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#5564eb] outline-none">
              <option>FacturaE</option>
              <option>UBL 2.1</option>
              <option>CII XML</option>
              <option>Peppol</option>
              <option>EDIFACT</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Seleccionar Archivo</label>
            <input type="file" accept=".xml,.ubl" onChange={(e) => setSelectedFile(e.target.files[0])} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#5564eb] outline-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all">{t('cancel')}</button>
            <button onClick={handleImport} disabled={!selectedFile || loading} className="flex-1 py-3 bg-[#5564eb] text-white rounded-xl font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Upload size={16} />}
              {t('validate')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalImport;