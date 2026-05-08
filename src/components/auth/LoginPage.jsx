import React from 'react';
import { ShieldCheck } from 'lucide-react';

/** * COMPONENTE: LoginPage
 * RUTA: /src/components/auth/LoginPage.jsx
 */
const LoginPage = ({ onLogin, t }) => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"><div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#5564eb] rounded-full blur-[120px]"></div></div>
    <div className="w-full max-w-sm bg-white rounded-[3rem] p-12 shadow-2xl border border-white/5 animate-in fade-in relative z-10">
      <div className="flex flex-col items-center mb-10 text-center"><div className="mb-8 w-full flex justify-center"><img src="http://pre-cliente-demo.efactura.sistemaefactura.com/sfe/static/img/logo_sef_login.png" alt="Unifiedpost" className="h-10 w-auto object-contain" onError={(e) => { e.target.src='https://placehold.co/180x60?text=Unifiedpost'; }} /></div><p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">{t('loginDesc')}</p></div>
      <div className="space-y-5"><input type="email" placeholder={t('email')} className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#5564eb] outline-none" /><input type="password" placeholder={t('password')} className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#5564eb] outline-none" /><button onClick={onLogin} className="w-full py-4 bg-[#5564eb] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-500/20 hover:opacity-90 transition-all mt-4">{t('login')}</button></div>
    </div>
  </div>
);

export default LoginPage;