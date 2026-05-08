import React, { useRef } from 'react';
import { ArrowLeft, Download, Printer, Building2, FileText, Hash, Calendar, User, CreditCard, BadgeCheck, FileSignature } from 'lucide-react';

const InvoicePDF = ({ invoice, onBack, t }) => {
  const pdfRef = useRef(null);

  const statusColor = invoice.status === 'paid' ? 'bg-blue-50 text-blue-600 border-blue-100'
    : invoice.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
    : 'bg-slate-50 text-slate-400 border-slate-100';

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
          <ArrowLeft size={16} />
          <span className="text-sm font-bold uppercase tracking-widest">Volver</span>
        </button>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-black text-xs uppercase tracking-widest flex items-center gap-2"><Printer size={14} /> {t('downloadPDF')}</button>
          <button className="px-4 py-2 bg-[#5564eb] text-white rounded-lg font-black text-xs uppercase tracking-widest flex items-center gap-2"><Download size={14} /> {t('downloadFacturaE')}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="space-y-5">
          <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-5 flex items-center gap-2"><FileText size={14} className="text-[#5564eb]" /> Datos de la Factura</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Hash size={16} className="text-slate-400" />
                <div><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Número</p><p className="text-sm font-black text-slate-900">{invoice.id}</p></div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Calendar size={16} className="text-slate-400" />
                <div><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Fecha de Emisión</p><p className="text-sm font-black text-slate-900">{invoice.date}</p></div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <CreditCard size={16} className="text-slate-400" />
                <div><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Importe Total</p><p className="text-lg font-black text-[#5564eb]">{invoice.total?.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</p></div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <BadgeCheck size={16} className="text-slate-400" />
                <div><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Estado</p><span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${statusColor}`}>{t(invoice.status)}</span></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-5 flex items-center gap-2"><Building2 size={14} className="text-[#5564eb]" /> Partes</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Emisor</p>
                <p className="text-sm font-black text-slate-900">Mi Empresa SL</p>
                <p className="text-[11px] font-semibold text-slate-500">NIF: B12345678</p>
                <p className="text-[11px] font-semibold text-slate-500">C/ Ejemplo 45, 28001 Madrid</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Receptor</p>
                <p className="text-sm font-black text-slate-900">{invoice.client || invoice.supplier || '-'}</p>
                <p className="text-[11px] font-semibold text-slate-500">NIF: {invoice.doc || '-'}</p>
                {invoice.client && <p className="text-[11px] font-semibold text-slate-500">Cliente</p>}
                {invoice.supplier && <p className="text-[11px] font-semibold text-slate-500">Proveedor</p>}
              </div>
            </div>
          </div>

          {invoice.ledger && (
            <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm">
              <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2"><FileSignature size={14} className="text-[#5564eb]" /> Contabilidad</h3>
              <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-3">
                <Hash size={16} className="text-slate-400" />
                <div><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Asiento Contable</p><p className="text-sm font-black text-slate-900">{invoice.ledger}</p></div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm overflow-hidden sticky top-24">
          <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2"><FileText size={14} /> Vista Previa PDF</span>
            <span className="text-[8px] text-slate-400">A4</span>
          </div>
          <div className="p-6 flex justify-center bg-slate-100/50" ref={pdfRef}>
            <div className="w-full max-w-[420px] bg-white shadow-2xl rounded-lg overflow-hidden" style={{ minHeight: '520px' }}>
              <div className="bg-[#5564eb] px-6 py-5 text-white">
                <div className="flex justify-between items-start">
                  <div><p className="text-[9px] font-bold uppercase opacity-70 tracking-widest">Factura Electrónica</p><h2 className="text-xl font-black mt-1">{invoice.id}</h2></div>
                  <div className="text-right"><p className="text-2xl font-black">{invoice.total?.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</p><p className="text-[9px] font-bold uppercase opacity-70 tracking-widest">EUR</p></div>
                </div>
              </div>
              <div className="p-6 space-y-5">
                <div className="flex justify-between text-[11px]">
                  <div><p className="font-black text-slate-800">Fecha:</p></div>
                  <div><p className="font-semibold text-slate-600">{invoice.date}</p></div>
                </div>
                <div className="border-t border-slate-100 pt-4">
                  <div className="grid grid-cols-2 gap-4 text-[11px]">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="font-black text-slate-700 mb-1 text-[9px] uppercase tracking-widest">Emisor</p>
                      <p className="font-bold text-slate-900">Mi Empresa SL</p>
                      <p className="text-slate-500">NIF: B12345678</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="font-black text-slate-700 mb-1 text-[9px] uppercase tracking-widest">Receptor</p>
                      <p className="font-bold text-slate-900">{invoice.client || invoice.supplier || '-'}</p>
                      <p className="text-slate-500">NIF: {invoice.doc || '-'}</p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-4">
                  <table className="w-full text-[11px]">
                    <thead><tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100"><th className="text-left pb-2">Concepto</th><th className="text-right pb-2">Importe</th></tr></thead>
                    <tbody>
                      <tr><td className="py-2 font-semibold text-slate-800">Servicio / Producto</td><td className="py-2 text-right font-bold text-slate-900">{invoice.total?.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</td></tr>
                      <tr><td className="py-2 font-semibold text-slate-800">IVA {invoice.total ? '21%' : '0%'}</td><td className="py-2 text-right font-bold text-slate-900">{(invoice.total ? invoice.total * 0.21 : 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="border-t-2 border-slate-200 pt-4 flex justify-between items-center">
                  <span className="text-sm font-black text-slate-800 uppercase tracking-tight">Total</span>
                  <span className="text-xl font-black text-[#5564eb]">{invoice.total?.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</span>
                </div>
                <div className="flex justify-center pt-2">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${statusColor}`}>{t(invoice.status)}</span>
                </div>
                <div className="text-center pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-center gap-2 text-[8px] text-slate-400 font-bold uppercase tracking-widest">
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235564eb' stroke-width='2'%3E%3Crect x='3' y='11' width='18' height='11' rx='2' ry='2'/%3E%3Cpath d='M7 11V7a5 5 0 0 1 10 0v4'/%3E%3C/svg%3E" alt="" className="opacity-50" />
                    Documento firmado electrónicamente
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePDF;
