import React from 'react';

/** * COMPONENTE: DonutChart
 * RUTA: /src/components/common/DonutChart.jsx
 */
const DonutChart = ({ stats, t }) => {
  const total = (stats.accepted || 0) + (stats.paid || 0) + (stats.rejected || 0) + (stats.pending || 0);
  const sections = [{ key: 'accepted', val: stats.accepted, color: '#10b981' }, { key: 'paid', val: stats.paid, color: '#3b82f6' }, { key: 'rejected', val: stats.rejected, color: '#ef4444' }, { key: 'pending', val: stats.pending, color: '#f59e0b' }].filter(s => s.val > 0);
  let cumulativePercent = 0;
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24 sm:w-32 sm:h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          {sections.map((s, i) => {
            const start = cumulativePercent; const end = start + (s.val / total) * 100; cumulativePercent = end;
            const x1 = Math.cos(2 * Math.PI * start / 100) * 40 + 50; const y1 = Math.sin(2 * Math.PI * start / 100) * 40 + 50;
            const x2 = Math.cos(2 * Math.PI * end / 100) * 40 + 50; const y2 = Math.sin(2 * Math.PI * end / 100) * 40 + 50;
            return <path key={i} d={`M ${x1} ${y1} A 40 40 0 ${(end-start)>50?1:0} 1 ${x2} ${y2}`} fill="none" stroke={s.color} strokeWidth="12" strokeLinecap="round" />;
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-black text-slate-800 text-lg sm:text-xl">{total}</div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-1 w-full">
         {sections.map(s => (<div key={s.key} className="flex items-center gap-1.5 truncate"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }}></div><span className="text-[8px] font-black text-slate-500 uppercase truncate">{t(s.key)}</span></div>))}
      </div>
    </div>
  );
};

export default DonutChart;