import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { 
  LayoutDashboard, FileText, Users, Package, BarChart3, Settings, Plus, Search, 
  Bell, Menu, X, Download, Eye, Trash2, TrendingUp, CreditCard, CheckCircle2, 
  Clock, AlertCircle, LogOut, ChevronRight, ArrowLeft, Save, Printer, Calendar, 
  Info, Building2, Mail, Smartphone, Globe, Lock, History, ShieldCheck, QrCode,
  MapPin, Edit3, Filter, MoreVertical, Layers, Languages, UserCircle, ChevronDown,
  Inbox, Send, BookUser, Truck, ToggleLeft, ToggleRight, Trash, DollarSign, Calculator,
  FileCode, ShieldAlert, Binary, CheckSquare, Activity, BellRing, MailCheck, TrendingDown,
  PieChart, BarChart, KeyRound, Fingerprint, RefreshCcw, Target, Upload, FileUp, FileCheck,
  FileType, UserPlus, Image as ImageIcon, Briefcase, Wallet, ClipboardCheck,
  HelpCircle
} from 'lucide-react';

// Imports from separate files
import translations from './i18n/translations.js';
import ROLES from './config/roles.js';
import { INITIAL_OUTBOX, INITIAL_INBOX, INITIAL_AGENDA, MOCK_CATALOG, MOCK_USERS } from './data/mockData.js';
import BillingAPI from './services/BillingAPI.js';
import DonutChart from './components/common/DonutChart.jsx';
import ToggleButton from './components/common/ToggleButton.jsx';
import ListView from './components/common/ListView.jsx';
import ModalImport from './components/common/ModalImport.jsx';
import ContactForm from './components/agenda/ContactForm.jsx';
import InvoicePDF from './components/invoices/InvoicePDF.jsx';
import InvoiceForm from './components/invoices/InvoiceForm.jsx';
import ReportsView from './components/reports/ReportsView.jsx';
import LoginPage from './components/auth/LoginPage.jsx';
import TwoFactorPage from './components/auth/TwoFactorPage.jsx';

const BRAND_LOGO = "http://pre-cliente-demo.efactura.sistemaefactura.com/sfe/static/img/logo_sef_login.png";
const PRIMARY_COLOR = "#5564eb";

/**
 * =============================================================================
 * SECCIÓN 8: ORQUESTADOR PRINCIPAL (APP)
 * RUTA: /src/App.jsx
 * =============================================================================
 */
export default function App() {
  const [authState, setAuthState] = useState('logged_out'); 
  const [lang, setLang] = useState('es');
  const [user, setUser] = useState({ name: "Admin Pro", role: ROLES.ADMIN });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subMenuId, setSubMenuId] = useState('pending');
  const [expandedMenu, setExpandedMenu] = useState(null);
  
  const [outbox, setOutbox] = useState(INITIAL_OUTBOX);
  const [inbox, setInbox] = useState(INITIAL_INBOX);
  const [agenda, setAgenda] = useState(INITIAL_AGENDA);
  const [stats, setStats] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [isCreatingContact, setIsCreatingContact] = useState(false);
  const [settingsTab, setSettingsTab] = useState('empresa');
  const [notifs, setNotifs] = useState({ emailIssued: true, emailReceived: true, systemAlerts: true, stockAlerts: false });
  const [showHelp, setShowHelp] = useState(false);
  const [formState, handleFormSubmit] = useForm('mbdwaeyb');

  useEffect(() => {
    if (formState.succeeded) setShowHelp(false);
  }, [formState.succeeded]);
  const [users, setUsers] = useState(MOCK_USERS);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: 'accountant', department: '', phone: '', status: 'activo' });

  const t = (k) => translations[lang][k] || k;

  const handleAction = (type, item) => { 
    if (type === 'view' || type === 'download') setViewingInvoice(item); 
    if (type === 'edit' && activeTab === 'agenda') setEditingContact(item);
  };
  const handleHistory = (item) => {};

  const handleSaveContact = (contactData) => {
    const type = subMenuId === 'clients' ? 'clients' : 'suppliers';
    const newList = [...agenda[type]];
    if (editingContact) { const idx = newList.findIndex(x => x.id === editingContact.id); newList[idx] = { ...editingContact, ...contactData }; }
    else { newList.push({ id: Date.now(), ...contactData, totalSales: 0 }); }
    setAgenda({ ...agenda, [type]: newList }); setEditingContact(null); setIsCreatingContact(false);
  };

  const handleImportSuccess = (format) => { setIsImporting(false); alert(`Éxito: Procesado bajo estándar ${format}`); setActiveTab('outbox'); setSubMenuId('processed'); };

  const handleEditUser = (user) => { setEditingUser(user); setEditForm({ name: user.name || '', email: user.email || '', role: user.role || 'accountant', department: user.department || '', phone: user.phone || '', status: user.status || 'activo' }); };
  const handleDeleteUser = (userId) => { if (window.confirm('¿Eliminar usuario definitivamente?')) setUsers(users.filter(u => u.id !== userId)); };
  const handleSaveUser = (userData) => {
    if (editingUser) setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...userData } : u));
    else setUsers([...users, { id: Date.now(), ...userData }]);
    setEditingUser(null);
  };

  useEffect(() => {
    if (authState !== 'authenticated') return;
    const load = async () => {
      setLoading(true); setData([]); 
      if (activeTab === 'dashboard') setStats(await BillingAPI.getDashboardStats(outbox, inbox, agenda.clients));
      else if (activeTab === 'outbox') {
        const filtered = outbox.filter(f => subMenuId === 'processed' ? (f.status === 'accepted' || f.status === 'paid') : (f.status === 'pending' || f.status === 'rejected'));
        setData(filtered);
      }
      else if (activeTab === 'inbox') {
        const filtered = inbox.filter(f => subMenuId === 'processed' ? (f.status === 'accepted' || f.status === 'paid') : (f.status === 'pending' || f.status === 'rejected'));
        setData(filtered);
      }
      else if (activeTab === 'agenda') setData(agenda[subMenuId] || []);
      else if (activeTab === 'catalog') setData(MOCK_CATALOG);
      else if (activeTab === 'xmlAudit') setData(await BillingAPI.getAuditLogs());
      setLoading(false);
    };
    load();
  }, [activeTab, subMenuId, authState, agenda, outbox, inbox]);

  const renderContent = () => {
    if (viewingInvoice) return <InvoicePDF invoice={viewingInvoice} onBack={() => setViewingInvoice(null)} t={t} />;
    if (isCreatingInvoice) return <InvoiceForm agenda={agenda} onCancel={() => setIsCreatingInvoice(false)} onEmit={(d) => { setLoading(true); BillingAPI.emitInvoice(d).then(r => { setOutbox([...outbox, r.data]); setViewingInvoice(r.data); setIsCreatingInvoice(false); setLoading(false); }); }} t={t} />;
    if (editingContact || isCreatingContact) return <ContactForm contact={editingContact} onCancel={() => {setEditingContact(null); setIsCreatingContact(false);}} onSave={handleSaveContact} t={t} />;
    
    if (activeTab === 'dashboard' && stats) return (
      <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-[1.25rem] border border-slate-100 shadow-sm flex items-center gap-4"><div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><Briefcase size={20}/></div><div><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Aceptación</p><p className="text-base font-black text-slate-900">{stats.kpis.acceptance}</p></div></div>
            <div className="bg-white p-5 rounded-[1.25rem] border border-slate-100 shadow-sm flex items-center gap-4"><div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Wallet size={20}/></div><div><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Plazo Medio</p><p className="text-base font-black text-slate-900">{stats.kpis.avgDays}</p></div></div>
            <div className="col-span-1 md:col-span-2 bg-[#5564eb] p-5 rounded-[1.25rem] text-white shadow-xl flex justify-between items-center relative overflow-hidden"><div><p className="text-[9px] font-bold uppercase opacity-80 leading-tight">Tesorería Operativa</p><h3 className="text-xl font-black font-mono">{(outbox.reduce((a,b)=>a+(b.total||0),0) - inbox.reduce((a,b)=>a+(b.total||0),0)).toLocaleString('es-ES')} €</h3></div><button onClick={() => setIsCreatingInvoice(true)} className="bg-white text-[#5564eb] px-4 py-2 rounded-lg font-black text-[9px] uppercase shadow-lg hover:scale-105 transition-all">+ Facturar</button></div>
         </div>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm flex flex-col items-center"><h4 className="text-[10px] font-black text-slate-800 uppercase mb-6 flex items-center gap-2 w-full"><CheckSquare size={14} className="text-[#5564eb]"/> {t('statusSent')}</h4><DonutChart stats={stats.sent} t={t} /></div>
            <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm flex flex-col items-center"><h4 className="text-[10px] font-black text-slate-800 uppercase mb-6 flex items-center gap-2 w-full"><CheckSquare size={14} className="text-indigo-500"/> {t('statusReceived')}</h4><DonutChart stats={stats.received} t={t} /></div>
            <div className="bg-slate-900 p-6 rounded-[1.5rem] text-white shadow-2xl relative overflow-hidden"><h4 className="text-[10px] font-black uppercase mb-6 relative z-10">{t('topClients')}</h4><div className="space-y-4 relative z-10">{stats.topClients.map((c, i) => (<div key={c.id} className="space-y-1.5"><div className="flex justify-between text-[10px] font-bold"><span className="text-slate-400 truncate w-32">{c.name}</span><span className="text-blue-400">{c.totalSales.toLocaleString()} €</span></div><div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${(c.totalSales / 4000) * 100}%` }}></div></div></div>))}</div></div>
         </div>
         <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm"><h4 className="text-[10px] font-black text-slate-800 uppercase mb-6">{t('incVsExp')}</h4><div className="h-32 flex items-end justify-between gap-4 px-4">{stats.cashflow.map((m, i) => (<div key={i} className="flex-1 flex flex-col gap-2 h-full justify-end items-center group"><div className="flex w-full items-end justify-center gap-1 h-full"><div className="w-1/3 bg-[#5564eb] rounded-t-md shadow-lg" style={{ height: `${(m.in / 8000) * 100}%` }}></div><div className="w-1/3 bg-slate-100 rounded-t-md" style={{ height: `${(m.out / 8000) * 100}%` }}></div></div><span className="text-[8px] font-black text-slate-400 uppercase">{m.m}</span></div>))}</div></div>
      </div>
    );

    if (activeTab === 'reports') return <ReportsView t={t} outbox={outbox} inbox={inbox} agenda={agenda} />;
    
    if (activeTab === 'settings') {
      return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
           <div className="flex gap-6 border-b border-slate-200 overflow-x-auto">
              {['empresa', 'usuarios', 'notificaciones', 'xmlAudit'].map(st => (
                <button key={st} onClick={() => setSettingsTab(st)} className={`px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${settingsTab === st ? 'text-[#5564eb] border-b-2 border-[#5564eb]' : 'text-slate-400 hover:text-slate-600'}`}>{t(st)}</button>
              ))}
           </div>
           {settingsTab === 'xmlAudit' ? (
             <ListView title={t('xmlAudit')} data={data} t={t} onAction={handleAction} onHistory={handleHistory} columns={[{ key: 'id', label: 'ID Fichero' }, { key: 'format', label: 'Estándar' }, { key: 'status', label: 'Estado Firma' }, { key: 'message', label: 'Respuesta' }]} />
            ) : settingsTab === 'usuarios' ? (
              <div className="space-y-4">
                <div className="flex justify-end"><button onClick={() => setEditingUser({})} className="px-5 py-2.5 bg-[#5564eb] text-white rounded-lg font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2 transition-all"><UserPlus size={18}/> Nuevo Usuario</button></div>
                <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      <tr>
                        <th className="px-5 py-4">Usuario</th>
                        <th className="px-5 py-4">Email</th>
                        <th className="px-5 py-4">Rol</th>
                        <th className="px-5 py-4">Departamento</th>
                        <th className="px-5 py-4">Teléfono</th>
                        <th className="px-5 py-4">Estado</th>
                        <th className="px-5 py-4">Último Acceso</th>
                        <th className="px-5 py-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-indigo-50/10 transition-colors group">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-[#5564eb] group-hover:text-white transition-all text-[11px] font-black">{u.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}</div>
                              <span className="text-xs font-black text-slate-800">{u.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-[11px] font-semibold text-slate-600">{u.email}</td>
                          <td className="px-5 py-4"><span className="px-2.5 py-1 bg-indigo-50 text-[#5564eb] rounded-lg text-[9px] font-black uppercase tracking-widest border border-indigo-100">{t(u.role)}</span></td>
                          <td className="px-5 py-4 text-[11px] font-semibold text-slate-600">{u.department}</td>
                          <td className="px-5 py-4 text-[11px] font-semibold text-slate-600">{u.phone}</td>
                          <td className="px-5 py-4"><span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${u.status === 'activo' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>{u.status}</span></td>
                          <td className="px-5 py-4 text-[10px] font-semibold text-slate-400">{u.lastLogin}</td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button onClick={() => handleEditUser(u)} className="p-2 text-slate-400 hover:text-[#5564eb] bg-slate-50 rounded-lg transition-all"><Edit3 size={14} /></button>
                              <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 rounded-lg transition-all"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {editingUser !== null && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setEditingUser(null)}>
                    <div className="bg-white rounded-[2rem] p-8 w-full max-w-md mx-4 animate-in slide-in-from-bottom-4" onClick={e => e.stopPropagation()}>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{editingUser.id ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
                        <button onClick={() => setEditingUser(null)} className="p-2 text-slate-400 hover:text-slate-600"><X size={20} /></button>
                      </div>
                      <form onSubmit={e => { e.preventDefault(); handleSaveUser(editForm); }} className="space-y-4">
                        <div><label className="block text-xs font-bold text-slate-700 mb-1.5">Nombre</label><input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#5564eb] outline-none" required /></div>
                        <div><label className="block text-xs font-bold text-slate-700 mb-1.5">Email</label><input type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#5564eb] outline-none" required /></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div><label className="block text-xs font-bold text-slate-700 mb-1.5">Rol</label><select value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#5564eb] outline-none">{Object.values(ROLES).map(r => <option key={r.id} value={r.id}>{t(r.label)}</option>)}</select></div>
                          <div><label className="block text-xs font-bold text-slate-700 mb-1.5">Estado</label><select value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#5564eb] outline-none"><option value="activo">Activo</option><option value="inactivo">Inactivo</option></select></div>
                        </div>
                        <div><label className="block text-xs font-bold text-slate-700 mb-1.5">Departamento</label><input type="text" value={editForm.department} onChange={e => setEditForm({...editForm, department: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#5564eb] outline-none" /></div>
                        <div><label className="block text-xs font-bold text-slate-700 mb-1.5">Teléfono</label><input type="text" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#5564eb] outline-none" /></div>
                        <div className="flex gap-3 pt-2">
                          <button type="button" onClick={() => setEditingUser(null)} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all">Cancelar</button>
                          <button type="submit" className="flex-1 py-3 bg-[#5564eb] text-white rounded-xl font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2"><Save size={16} /> {editingUser.id ? 'Guardar' : 'Crear'}</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
           ) : settingsTab === 'notificaciones' ? (
             <div className="bg-white p-8 rounded-[1.5rem] border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-5">{[ { k: 'emailIssued', i: MailCheck }, { k: 'emailReceived', i: Inbox }, { k: 'systemAlerts', i: Bell }, { k: 'stockAlerts', i: Package } ].map(n => (<div key={n.k} className="flex items-center justify-between p-4 bg-slate-50 rounded-[1.25rem] border border-transparent hover:border-slate-100 transition-all"><div className="flex items-center gap-4"><div className="p-2.5 bg-white rounded-xl shadow-sm text-slate-400"><n.i size={18}/></div><p className="text-xs font-black text-slate-800 uppercase tracking-widest">{t(n.k)}</p></div><ToggleButton enabled={notifs[n.k]} onClick={() => setNotifs({...notifs, [n.k]: !notifs[n.k]})} /></div>))}</div>
            ) : <div className="space-y-6 max-w-2xl mx-auto">
              <div className="bg-white p-8 rounded-[1.5rem] border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                  <div className="w-16 h-16 bg-[#5564eb]/10 rounded-2xl flex items-center justify-center"><Building2 size={32} className="text-[#5564eb]" /></div>
                  <div><h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Mi Empresa SL</h2><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Razón Social</p></div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 bg-slate-50 rounded-xl"><p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">NIF / CIF</p><p className="text-sm font-black text-slate-900">B12345678</p></div>
                  <div className="p-4 bg-slate-50 rounded-xl"><p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Teléfono</p><p className="text-sm font-black text-slate-900">91 123 45 67</p></div>
                  <div className="p-4 bg-slate-50 rounded-xl"><p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Email</p><p className="text-sm font-black text-slate-900">admin@miempresa.es</p></div>
                  <div className="p-4 bg-slate-50 rounded-xl"><p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Web</p><p className="text-sm font-black text-slate-900">www.miempresa.es</p></div>
                  <div className="col-span-2 p-4 bg-slate-50 rounded-xl"><p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Dirección</p><p className="text-sm font-black text-slate-900">C/ Mayor 45, 28001 Madrid, España</p></div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[1.5rem] border border-slate-200 shadow-sm">
                <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-5">Registro e Identificación</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl"><p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Registro Mercantil</p><p className="text-xs font-black text-slate-900">Tomo 4523, Folio 89, Hoja M-234567</p></div>
                  <div className="p-3 bg-slate-50 rounded-xl"><p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Nº Identificación IVA</p><p className="text-xs font-black text-slate-900">ESB12345678</p></div>
                  <div className="p-3 bg-slate-50 rounded-xl"><p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Nº Seguridad Social</p><p className="text-xs font-black text-slate-900">28/1234567/89</p></div>
                  <div className="p-3 bg-slate-50 rounded-xl"><p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">CNAE</p><p className="text-xs font-black text-slate-900">6201 - Actividades informáticas</p></div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[1.5rem] border border-slate-200 shadow-sm">
                <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-5">Configuración Fiscal</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl"><p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Régimen IVA</p><p className="text-xs font-black text-slate-900">Régimen General</p></div>
                  <div className="p-3 bg-slate-50 rounded-xl"><p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Tipo por Defecto</p><p className="text-xs font-black text-slate-900">21%</p></div>
                  <div className="p-3 bg-slate-50 rounded-xl"><p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Modelo 347</p><p className="text-xs font-black text-slate-900">Obligado</p></div>
                  <div className="p-3 bg-slate-50 rounded-xl"><p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">SII (Suministro Inmediato)</p><p className="text-xs font-black text-slate-900">No activado</p></div>
                  <div className="p-3 bg-slate-50 rounded-xl"><p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Nº Operador FacturaE</p><p className="text-xs font-black text-slate-900">FE-123456</p></div>
                  <div className="p-3 bg-slate-50 rounded-xl"><p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Código PEPPOL</p><p className="text-xs font-black text-slate-900">ES:1234:5678</p></div>
                </div>
              </div>
            </div>}
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-in fade-in">
         {((activeTab === 'outbox' || activeTab === 'inbox') && subMenuId === 'pending') && (
            <div className="flex justify-end gap-3">
               <button onClick={() => setIsImporting(true)} className="px-5 py-2.5 bg-slate-900 text-white rounded-lg font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><FileUp size={16}/> {t('importXML')}</button>
               <button onClick={() => setIsCreatingInvoice(true)} className="px-7 py-2.5 bg-[#5564eb] text-white rounded-lg font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2"><Plus size={18}/> {t('newInvoice')}</button>
            </div>
         )}
         {activeTab === 'agenda' && (<div className="flex justify-end"><button onClick={() => setIsCreatingContact(true)} className="px-7 py-2.5 bg-[#5564eb] text-white rounded-lg font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2 transition-all"><UserPlus size={18}/> {t('newContact')}</button></div>)}
         <ListView title={`${t(activeTab)} - ${t(subMenuId)}`} data={data} t={t} onAction={handleAction} onHistory={handleHistory} columns={
           activeTab === 'agenda'
             ? [{ key: 'name', label: 'Nombre' }, { key: 'doc', label: 'NIF/CIF' }, { key: 'email', label: 'Email' }, { key: 'phone', label: 'Teléfono' }, { key: 'address', label: 'Dirección' }, { key: 'totalSales', label: 'Volumen' }].filter(c => data[0]?.[c.key])
           : activeTab === 'catalog'
             ? [{ key: 'name', label: 'Artículo' }, { key: 'category', label: 'Categoría' }, { key: 'price', label: 'Precio' }, { key: 'stock', label: 'Stock' }]
           : subMenuId === 'processed'
             ? [{ key: 'id', label: 'Referencia' }, { key: 'client', label: 'Cliente' }, { key: 'supplier', label: 'Proveedor' }, { key: 'total', label: 'Importe' }, { key: 'ledger', label: 'Asiento' }, { key: 'status', label: 'Estado' }]
             : [{ key: 'id', label: 'Referencia' }, { key: 'client', label: 'Contacto' }, { key: 'supplier', label: 'Proveedor' }, { key: 'total', label: 'Importe' }, { key: 'doc', label: 'NIF/CIF' }].filter(c => data[0]?.[c.key])
         } />
      </div>
    );
  };

  if (authState === 'logged_out') return <LoginPage onLogin={() => setAuthState('two_factor')} t={t} />;
  if (authState === 'two_factor') return <TwoFactorPage onVerify={() => setAuthState('authenticated')} onBack={() => setAuthState('logged_out')} t={t} />;

  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'outbox', label: t('outbox'), icon: Send, hasSub: true, subs: [{ id: 'pending', label: t('pending') }, { id: 'processed', label: t('processed') }] },
    { id: 'inbox', label: t('inbox'), icon: Inbox, hasSub: true, subs: [{ id: 'pending', label: t('pending') }, { id: 'processed', label: t('processed') }] },
    { id: 'agenda', label: t('agenda'), icon: BookUser, hasSub: true, subs: [{ id: 'clients', label: t('clients') }, { id: 'suppliers', label: t('suppliers') }] },
    { id: 'catalog', label: t('catalog'), icon: Package },
    { id: 'reports', label: t('reports'), icon: BarChart3 },
    { id: 'settings', label: t('settings'), icon: Settings },
  ].filter(i => user.role.access.includes(i.id));

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      <aside className="w-72 bg-[#dce3f5] text-indigo-900 flex flex-col shadow-lg no-print border-r border-indigo-300/50 overflow-y-auto">
        <div className="p-8 flex flex-col items-center gap-3 border-b border-indigo-300/40 mb-4"><img src={BRAND_LOGO} alt="Unifiedpost" className="h-10 w-auto cursor-pointer" onClick={() => setActiveTab('dashboard')} /><p className="text-[8px] uppercase tracking-[0.4em] text-indigo-400 font-black mt-1">Enterprise Business UI</p></div>
        <nav className="flex-1 px-3 py-4 space-y-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button onClick={() => { if(item.hasSub) setExpandedMenu(expandedMenu === item.id ? null : item.id); else { setActiveTab(item.id); setExpandedMenu(null); setViewingInvoice(null); setIsCreatingInvoice(false); setIsImporting(false); setEditingContact(null); setIsCreatingContact(false); } }} 
                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-[1.25rem] transition-all group ${activeTab === item.id ? 'bg-[#5564eb] text-white shadow-xl' : 'hover:bg-[#cdd6ed] text-indigo-800'}`}>
                <item.icon size={18} className={activeTab === item.id ? 'text-white' : 'text-indigo-400 group-hover:text-[#5564eb]'} />
                <span className="flex-1 text-left text-sm font-bold uppercase tracking-tight">{item.label}</span>
                {(item.id === 'outbox' || item.id === 'inbox') && <span className="bg-indigo-200/50 text-indigo-600 px-2.5 py-0.5 rounded-full text-[9px] font-black group-hover:bg-[#5564eb] group-hover:text-white transition-all">{item.id === 'outbox' ? outbox.length : inbox.length}</span>}
                {item.hasSub && <ChevronDown size={14} className={expandedMenu === item.id ? 'rotate-180 transition-all' : 'transition-all'} />}
              </button>
              {item.hasSub && expandedMenu === item.id && (<div className="pl-10 space-y-1.5 mt-1 border-l border-indigo-200 ml-8 animate-in slide-in-from-top-1">{item.subs.map(sub => (<button key={sub.id} onClick={() => { setActiveTab(item.id); setSubMenuId(sub.id); setViewingInvoice(null); setIsCreatingInvoice(false); setEditingContact(null); setIsCreatingContact(false); }} className={`w-full text-left py-2 text-[12px] font-bold transition-colors ${activeTab === item.id && subMenuId === sub.id ? 'text-[#5564eb]' : 'text-indigo-400 hover:text-indigo-700'}`}>• {sub.label}</button>))}</div>)}
            </div>
          ))}
        </nav>
        <div className="p-5 bg-[#cdd6ed] m-4 rounded-[1.5rem] border border-indigo-300/40">
          <div className="flex gap-2 mb-4 border-b border-indigo-300/40 pb-4">{['es', 'en', 'fr', 'pt'].map(l => <button key={l} onClick={() => setLang(l)} className={`w-7 h-7 rounded-lg text-[9px] font-black uppercase transition-all ${lang === l ? 'bg-[#5564eb] text-white shadow-md' : 'bg-white/70 text-indigo-600 border border-indigo-300/40 hover:bg-white'}`}>{l}</button>)}</div>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-[#5564eb] rounded-lg flex items-center justify-center text-[10px] text-white font-black">JD</div>
             <div className="min-w-0 flex-1"><p className="text-xs font-black text-indigo-900 truncate leading-none mb-1">{user.name}</p><p className="text-[9px] font-bold text-[#5564eb] uppercase tracking-widest">{t(user.role.label)}</p></div>
             <button onClick={() => setAuthState('logged_out')} className="p-1.5 text-indigo-400 hover:text-red-500 transition-all"><LogOut size={14} /></button>
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="px-10 py-6 flex justify-between items-center no-print bg-white/40 backdrop-blur-md sticky top-0 z-20 border-b border-slate-100">
          <div className="flex flex-col"><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{t('welcome')} {user.name}</span><h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">{viewingInvoice ? 'Certificación Digital' : isCreatingInvoice ? t('newInvoice') : isImporting ? t('importXML') : editingContact || isCreatingContact ? t('agenda') : t(activeTab)} </h2></div>
          <div className="flex items-center gap-4"><div className="bg-slate-100 p-1 rounded-xl flex shadow-inner border border-slate-200/30">{Object.values(ROLES).map(r => (<button key={r.id} onClick={() => {setUser({...user, role: r}); setActiveTab('dashboard')}} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${user.role.id === r.id ? 'bg-white shadow-md text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>{t(r.label)}</button>))}</div><button onClick={() => setShowHelp(true)} className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-500 hover:text-[#5564eb] transition-all"><HelpCircle size={18} /></button><button className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm relative text-slate-500 hover:text-[#5564eb] transition-all"><Bell size={18} /><span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></span></button></div>
        </header>
        <div className="flex-1 overflow-y-auto px-10 py-6 scroll-smooth"><div className="max-w-6xl mx-auto pb-16">{loading ? (<div className="flex flex-col items-center justify-center p-32"><div className="w-12 h-12 border-4 border-[#5564eb] border-t-transparent rounded-full animate-spin shadow-xl"></div><p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Sincronizando Entorno...</p></div>) : isImporting ? (<ModalImport onCancel={() => setIsImporting(false)} onSuccess={handleImportSuccess} t={t} />) : renderContent()}</div></div>
        <footer className="px-10 py-4 flex justify-between items-center text-[8px] text-slate-400 font-black uppercase tracking-[0.3em] border-t border-slate-100 bg-white/50 no-print backdrop-blur-md"><span>FacturoPro v5.4 — Spain Localized Business Intelligence</span><div className="flex items-center gap-5"><div className="flex items-center gap-2 text-green-600 font-black"><ShieldCheck size={12} /> SECURE CORE</div><span>© 2024 FACTUROPRO GLOBAL</span></div></footer>
      </main>
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 pt-16 overflow-y-auto" onClick={() => setShowHelp(false)}>
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-lg mx-4 my-8 animate-in slide-in-from-bottom-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2"><HelpCircle size={22} className="text-[#5564eb]" /> Ayuda / Soporte</h2>
              <button onClick={() => setShowHelp(false)} className="p-2 text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input type="hidden" name="_subject" value="Ticket de Soporte - Sistema eFactura" />
              <div><label className="block text-xs font-bold text-slate-700 mb-1.5">Asunto</label><input type="text" name="subject" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#5564eb] outline-none" required /><ValidationError field="subject" errors={formState.errors} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-700 mb-1.5">Nombre</label><input type="text" name="name" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#5564eb] outline-none" required /><ValidationError field="name" errors={formState.errors} /></div>
                <div><label className="block text-xs font-bold text-slate-700 mb-1.5">Teléfono</label><input type="tel" name="phone" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#5564eb] outline-none" /></div>
              </div>
              <div><label className="block text-xs font-bold text-slate-700 mb-1.5">Email de contacto</label><input type="email" name="email" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#5564eb] outline-none" required /><ValidationError field="email" errors={formState.errors} /></div>
              <div><label className="block text-xs font-bold text-slate-700 mb-1.5">Descripción del problema</label><textarea name="description" rows="4" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#5564eb] outline-none resize-none" required></textarea><ValidationError field="description" errors={formState.errors} /></div>
              {formState.errors && formState.errors.length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl"><p className="text-[11px] font-bold text-red-600">Error al enviar. Revise los campos e intente de nuevo.</p></div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowHelp(false)} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all">Cancelar</button>
                <button type="submit" disabled={formState.submitting} className="flex-1 py-3 bg-[#5564eb] text-white rounded-xl font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">{formState.submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={16} />} Enviar Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}