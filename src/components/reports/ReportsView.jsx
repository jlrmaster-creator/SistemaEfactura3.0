import React, { useState, useEffect, useRef } from 'react';
import { BarChart3, Briefcase, Wallet, Download, FileText, DownloadCloud, CheckSquare } from 'lucide-react';
import BillingAPI from '../../services/BillingAPI';
import DonutChart from '../common/DonutChart';

const ReportsView = ({ t, outbox = [], inbox = [], agenda = { clients: [] } }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(null);
  const reportRef = useRef(null);

  const allInvoices = [...outbox.map(i => ({ ...i, type: 'issued' })), ...inbox.map(i => ({ ...i, type: 'received' }))];

  useEffect(() => {
    BillingAPI.getDashboardStats(outbox, inbox, agenda.clients).then(res => {
      setStats(res);
      setLoading(false);
    });
  }, [outbox, inbox, agenda]);

  const treasury = outbox.reduce((a, b) => a + (b.total || 0), 0) - inbox.reduce((a, b) => a + (b.total || 0), 0);

  const exportCSV = () => {
    const header = 'Referencia,Tipo,Contacto,NIF/CIF,Importe,Estado,Fecha';
    const rows = allInvoices.map(i => `"${i.id}","${t(i.type)}","${i.client || i.supplier || ''}","${i.doc || ''}",${(i.total || 0).toFixed(2)},"${t(i.status)}","${i.date}"`);
    const bom = '\uFEFF';
    const blob = new Blob([bom + header + '\n' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'informe_facturas.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = async () => {
    setExporting('pdf');
    await new Promise(r => setTimeout(r, 200));
    try {
      const { default: jsPDF } = await import('jspdf');
      await import('jspdf-autotable');
      const html2canvas = (await import('html2canvas')).default;

      const el = reportRef.current;
      if (!el) return;

      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: '#f8fafc',
        allowTaint: false,
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = (canvas.height * pdfW) / canvas.width;

      let heightLeft = pdfH;
      let position = 0;
      const pageH = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, position, pdfW, pdfH);
      heightLeft -= pageH;

      while (heightLeft > 0) {
        position = heightLeft - pdfH;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfW, pdfH);
        heightLeft -= pageH;
      }

      pdf.save('informe_efactura.pdf');
    } catch (err) {
      console.error('PDF error:', err);
      alert('Error al generar PDF');
    }
    setExporting(null);
  };

  if (loading) return <div className="flex justify-center p-40 animate-pulse"><BarChart3 className="text-[#5564eb] w-12 h-12" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto" ref={reportRef}>
      <div className="flex justify-end gap-3">
        <button onClick={exportCSV} className="px-5 py-2.5 bg-slate-900 text-white rounded-lg font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-all"><Download size={16} /> CSV</button>
        <button onClick={exportPDF} disabled={exporting === 'pdf'} className="px-5 py-2.5 bg-[#5564eb] text-white rounded-lg font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50">
          {exporting === 'pdf' ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <DownloadCloud size={16} />}
          PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-[1.25rem] border border-slate-100 shadow-sm flex items-center gap-4"><div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><Briefcase size={20} /></div><div><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Aceptación</p><p className="text-base font-black text-slate-900">{stats.kpis.acceptance}</p></div></div>
        <div className="bg-white p-5 rounded-[1.25rem] border border-slate-100 shadow-sm flex items-center gap-4"><div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Wallet size={20} /></div><div><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Plazo Medio</p><p className="text-base font-black text-slate-900">{stats.kpis.avgDays}</p></div></div>
        <div className="bg-white p-5 rounded-[1.25rem] border border-slate-100 shadow-sm flex items-center gap-4"><div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><BarChart3 size={20} /></div><div><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Emitidas</p><p className="text-base font-black text-slate-900">{outbox.length}</p></div></div>
        <div className="bg-white p-5 rounded-[1.25rem] border border-slate-100 shadow-sm flex items-center gap-4"><div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center"><FileText size={20} /></div><div><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Recibidas</p><p className="text-base font-black text-slate-900">{inbox.length}</p></div></div>
      </div>

      <div className="col-span-1 md:col-span-2 bg-[#5564eb] p-5 rounded-[1.25rem] text-white shadow-xl flex justify-between items-center relative overflow-hidden">
        <div><p className="text-[9px] font-bold uppercase opacity-80 leading-tight">Tesorería Operativa</p><h3 className="text-xl font-black font-mono">{treasury.toLocaleString('es-ES')} €</h3></div>
        <div className="text-right"><p className="text-[9px] font-bold uppercase opacity-80 leading-tight">Total Facturado</p><h3 className="text-base font-black font-mono">{outbox.reduce((a, b) => a + (b.total || 0), 0).toLocaleString('es-ES')} €</h3></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm flex flex-col items-center"><h4 className="text-[10px] font-black text-slate-800 uppercase mb-6 flex items-center gap-2 w-full"><CheckSquare size={14} className="text-[#5564eb]" /> {t('statusSent')}</h4><DonutChart stats={stats.sent} t={t} /></div>
        <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm flex flex-col items-center"><h4 className="text-[10px] font-black text-slate-800 uppercase mb-6 flex items-center gap-2 w-full"><CheckSquare size={14} className="text-indigo-500" /> {t('statusReceived')}</h4><DonutChart stats={stats.received} t={t} /></div>
        <div className="bg-slate-900 p-6 rounded-[1.5rem] text-white shadow-2xl relative overflow-hidden"><h4 className="text-[10px] font-black uppercase mb-6 relative z-10">{t('topClients')}</h4><div className="space-y-4 relative z-10">{stats.topClients.map((c, i) => (<div key={c.id} className="space-y-1.5"><div className="flex justify-between text-[10px] font-bold"><span className="text-slate-400 truncate w-32">{c.name}</span><span className="text-blue-400">{c.totalSales.toLocaleString()} €</span></div><div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${(c.totalSales / 4000) * 100}%` }}></div></div></div>))}</div></div>
      </div>

      <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm"><h4 className="text-[10px] font-black text-slate-800 uppercase mb-6">{t('incVsExp')}</h4><div className="h-32 flex items-end justify-between gap-4 px-4">{stats.cashflow.map((m, i) => (<div key={i} className="flex-1 flex flex-col gap-2 h-full justify-end items-center group"><div className="flex w-full items-end justify-center gap-1 h-full"><div className="w-1/3 bg-[#5564eb] rounded-t-md shadow-lg" style={{ height: `${(m.in / 8000) * 100}%` }}></div><div className="w-1/3 bg-slate-100 rounded-t-md" style={{ height: `${(m.out / 8000) * 100}%` }}></div></div><span className="text-[8px] font-black text-slate-400 uppercase">{m.m}</span></div>))}</div></div>

      <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
          <h3 className="text-base font-black text-slate-800 tracking-tighter uppercase">Detalle de Facturas</h3>
          <span className="text-[10px] font-bold text-slate-400">{allInvoices.length} registros</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">
              <tr><th className="px-5 py-4">Referencia</th><th className="px-5 py-4">Tipo</th><th className="px-5 py-4">Contacto</th><th className="px-5 py-4">NIF/CIF</th><th className="px-5 py-4">Importe</th><th className="px-5 py-4">Estado</th><th className="px-5 py-4">Fecha</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {allInvoices.length > 0 ? allInvoices.map((inv, idx) => (
                <tr key={idx} className="hover:bg-indigo-50/10 transition-colors">
                  <td className="px-5 py-3.5 text-xs font-bold text-slate-800">{inv.id}</td>
                  <td className="px-5 py-3.5"><span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${inv.type === 'issued' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>{t(inv.type)}</span></td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-slate-700">{inv.client || inv.supplier || '-'}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-slate-600">{inv.doc || '-'}</td>
                  <td className="px-5 py-3.5 text-xs font-black text-slate-800">{(inv.total || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</td>
                  <td className="px-5 py-3.5"><span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${inv.status === 'paid' ? 'bg-blue-50 text-blue-600' : inv.status === 'accepted' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>{t(inv.status)}</span></td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-slate-500">{inv.date}</td>
                </tr>
              )) : <tr><td colSpan={7} className="px-6 py-10 text-center text-slate-400 italic text-xs font-bold uppercase tracking-widest">No hay facturas registradas</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
