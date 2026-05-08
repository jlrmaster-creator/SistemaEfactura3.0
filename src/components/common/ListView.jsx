import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Eye, Download, Edit3, History, ChevronUp, Clock, CheckCircle2, Send, XCircle, CreditCard, FileText } from 'lucide-react';

const STEP_ICONS = { created: FileText, emitted: Send, accepted: CheckCircle2, rejected: XCircle, paid: CreditCard };
const STEP_COLORS = { created: 'text-slate-400', emitted: 'text-blue-500', accepted: 'text-emerald-500', rejected: 'text-red-500', paid: 'text-indigo-500' };

const historySteps = {
  'FAC-2023-001': [
    { step: 'created', date: '2023-10-28 09:15', desc: 'Factura creada manualmente por Juan Delgado' },
    { step: 'emitted', date: '2023-10-29 10:30', desc: 'Envío a SISTEMA DE FACTURACIÓN ELECTRÓNICA' },
    { step: 'accepted', date: '2023-10-30 14:22', desc: 'Aceptada por el receptor (Sistemas Digitales SL)' },
    { step: 'paid', date: '2023-11-15 08:45', desc: 'Cobro registrado. Asiento A-221' }
  ],
  'FAC-2023-002': [
    { step: 'created', date: '2023-10-29 11:00', desc: 'Factura creada manualmente por Elena Ramos' },
    { step: 'emitted', date: '2023-10-30 09:15', desc: 'Envío a SISTEMA DE FACTURACIÓN ELECTRÓNICA' },
    { step: 'accepted', date: '2023-11-01 16:30', desc: 'Aceptada por el receptor (Logística Galega SA)' }
  ],
  'FAC-2023-003': [
    { step: 'created', date: '2023-11-02 14:00', desc: 'Factura creada manualmente por Juan Delgado' },
    { step: 'emitted', date: '2023-11-03 08:00', desc: 'Envío a SISTEMA DE FACTURACIÓN ELECTRÓNICA' }
  ],
  'FAC-2023-004': [
    { step: 'created', date: '2023-11-04 10:30', desc: 'Factura creada manualmente por Admin Pro' },
    { step: 'emitted', date: '2023-11-05 12:00', desc: 'Envío a SISTEMA DE FACTURACIÓN ELECTRÓNICA' },
    { step: 'rejected', date: '2023-11-07 09:45', desc: 'Rechazada por el receptor. Motivo: Datos fiscales incorrectos' }
  ],
  'FAC-2023-005': [
    { step: 'created', date: '2023-10-12 08:00', desc: 'Factura creada automáticamente desde ERP' },
    { step: 'emitted', date: '2023-10-12 08:01', desc: 'Envío a SISTEMA DE FACTURACIÓN ELECTRÓNICA' },
    { step: 'accepted', date: '2023-10-13 11:20', desc: 'Aceptada por el receptor (Exportadora Sur SL)' },
    { step: 'paid', date: '2023-10-30 10:00', desc: 'Cobro registrado. Asiento A-198' }
  ],
  'REC-23-4412': [
    { step: 'created', date: '2023-10-30 08:00', desc: 'Recibida de Telefónica de España vía PEPPOL' },
    { step: 'accepted', date: '2023-10-31 09:00', desc: 'Aceptación automática por reglas de negocio' },
    { step: 'paid', date: '2023-11-15 11:30', desc: 'Pago registrado. Asiento C-990' }
  ],
  'REC-23-9980': [
    { step: 'created', date: '2023-11-02 14:00', desc: 'Recibida de Endesa Energía vía FacturaE' },
    { step: 'accepted', date: '2023-11-03 10:00', desc: 'Aceptada manualmente por Elena Ramos' }
  ]
};

const HistoryTimeline = ({ history }) => (
  <div className="py-4 px-2 space-y-0">
    {history.map((h, i) => {
      const Icon = STEP_ICONS[h.step] || Clock;
      const color = STEP_COLORS[h.step] || 'text-slate-400';
      return (
        <div key={i} className="flex gap-4 relative pb-6 last:pb-0">
          {i < history.length - 1 && <div className="absolute left-[15px] top-7 bottom-0 w-px bg-slate-200" />}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-white border-2 ${color.replace('text-', 'border-')} shadow-sm`}>
            <Icon size={14} className={color} />
          </div>
          <div className="pt-0.5 min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h.date}</p>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">{h.desc}</p>
          </div>
        </div>
      );
    })}
  </div>
);

const ActionMenu = ({ item, onAction, onHistory, onClose, isProcessed }) => {
  const menuRef = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const actions = [];
  actions.push({ key: 'view', icon: Eye, label: 'Ver Detalle' });
  actions.push({ key: 'download', icon: Download, label: 'Descargar' });
  if (onHistory && (isProcessed || item.status === 'accepted' || item.status === 'paid')) actions.push({ key: 'history', icon: History, label: 'Histórico' });
  if (item.status !== 'paid') actions.push({ key: 'edit', icon: Edit3, label: 'Editar' });

  return (
    <div ref={menuRef} className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 min-w-[160px] animate-in fade-in">
      {actions.map((a, i) => (
        <button key={a.key} onClick={() => { onClose(); if (a.key === 'history') onHistory(item); else onAction(a.key, item); }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-left transition-colors ${a.key === 'history' ? 'text-indigo-600 hover:bg-indigo-50' : 'text-slate-700 hover:bg-slate-50'}`}>
          <a.icon size={15} className={a.key === 'history' ? 'text-indigo-400' : 'text-slate-400'} />
          {a.label}
        </button>
      ))}
    </div>
  );
};

const ListView = ({ data = [], columns = [], title, t, onAction, onHistory }) => {
  const [openMenuIdx, setOpenMenuIdx] = useState(null);
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);

  const handleToggleMenu = (idx) => setOpenMenuIdx(openMenuIdx === idx ? null : idx);

  const handleHistory = (item) => {
    const id = item.id;
    if (expandedHistoryId === id) { setExpandedHistoryId(null); return; }
    setExpandedHistoryId(id);
    if (onHistory) onHistory(item);
  };

  const renderCell = (item, col) => {
    const value = item[col.key];
    if (col.key === 'total' || col.key === 'price') return `${(parseFloat(value) || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })} €`;
    if (col.key === 'status') return <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${value === 'paid' ? 'bg-blue-50 text-blue-600' : value === 'accepted' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>{t(value)}</span>;
    return typeof value === 'object' ? '' : (value !== undefined && value !== null ? String(value) : '');
  };

  const isProcessed = data[0]?.status === 'accepted' || data[0]?.status === 'paid';

  return (
    <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in">
      <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
        <h3 className="text-base font-black text-slate-800 tracking-tighter uppercase">{title}</h3>
        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} /><input type="text" placeholder="Buscar..." className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none w-48 focus:ring-2 focus:ring-[#5564eb]" /></div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">
            <tr>{columns.map(col => <th key={col.key} className="px-5 py-4">{col.label}</th>)}<th className="px-5 py-4 text-right">Acciones</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.length > 0 ? data.map((item, idx) => (
              <React.Fragment key={item.id || idx}>
                <tr className="hover:bg-indigo-50/10 transition-colors group">
                  {columns.map(col => <td key={col.key} className="px-5 py-4 text-xs font-semibold text-slate-700">{renderCell(item, col)}</td>)}
                  <td className="px-5 py-4 text-right relative">
                    <div className="flex justify-end">
                      <button onClick={() => handleToggleMenu(idx)} className="p-2 text-slate-400 hover:text-[#5564eb] hover:bg-slate-100 rounded-lg transition-all relative">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                    {openMenuIdx === idx && (
                      <ActionMenu item={item} onAction={onAction} onHistory={handleHistory} onClose={() => setOpenMenuIdx(null)} isProcessed={isProcessed} />
                    )}
                  </td>
                </tr>
                {expandedHistoryId === item.id && historySteps[item.id] && historySteps[item.id].length > 0 && (
                  <tr key={`history-${item.id}`}>
                    <td colSpan={columns.length + 1} className="px-8 py-4 bg-indigo-50/30 border-b border-slate-100">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2"><History size={14} /> Histórico — {item.id}</h4>
                        <button onClick={() => setExpandedHistoryId(null)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-all"><ChevronUp size={18} /></button>
                      </div>
                      <HistoryTimeline history={historySteps[item.id]} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            )) : <tr><td colSpan={columns.length + 1} className="px-6 py-10 text-center text-slate-400 italic text-xs font-bold uppercase tracking-widest">No se encontraron registros activos</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListView;
