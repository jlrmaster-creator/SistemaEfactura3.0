import React from 'react';

/** * COMPONENTE: ToggleButton
 * RUTA: /src/components/common/ToggleButton.jsx
 */
const ToggleButton = ({ enabled, onClick }) => (
  <button onClick={onClick} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-[#5564eb]' : 'bg-slate-300'}`}>
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

export default ToggleButton;