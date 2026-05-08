import React, { useState, useRef } from 'react';
import { ShieldCheck } from 'lucide-react';

/** * COMPONENTE: TwoFactorPage
 * RUTA: /src/components/auth/TwoFactorPage.jsx
 */
const TwoFactorPage = ({ onVerify, onBack, t }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const handleChange = (idx, val) => { if (isNaN(val)) return; const newCode = [...code]; newCode[idx] = val.substring(val.length - 1); setCode(newCode); if (val && idx < 5) inputRefs.current[idx + 1].focus(); };
  const handleKeyDown = (idx, e) => { if (e.key === 'Backspace' && !code[idx] && idx > 0) inputRefs.current[idx - 1].focus(); };
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-[3rem] p-10 shadow-2xl text-center animate-in slide-in-from-bottom-12 duration-500">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[1.25rem] flex items-center justify-center mx-auto mb-8 shadow-inner"><ShieldCheck size={32} /></div>
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{t('twoFactor')}</h2>
        <p className="text-slate-400 text-[10px] font-black mt-3 uppercase tracking-widest">{t('twoFactorDesc')}</p>
        <div className="flex justify-between gap-2.5 my-10">{code.map((digit, i) => (<input key={i} ref={el => inputRefs.current[i] = el} type="text" maxLength="1" value={digit} onKeyDown={(e) => handleKeyDown(i, e.target.value)} onChange={(e) => handleChange(i, e.target.value)} className="w-10 h-14 bg-slate-50 border border-slate-100 rounded-xl text-center font-black text-[#5564eb] text-xl focus:ring-2 focus:ring-[#5564eb] outline-none" />))}</div>
        <button onClick={() => onVerify(code.join(''))} className="w-full py-4 bg-[#5564eb] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all">{t('verify')}</button>
        <button onClick={onBack} className="mt-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Cancelar</button>
      </div>
    </div>
  );
};

export default TwoFactorPage;