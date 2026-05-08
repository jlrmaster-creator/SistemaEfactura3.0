/**
 * =============================================================================
 * SECCIÓN 2: SEGURIDAD Y ROLES
 * NOMBRE: ROLES
 * RUTA: /src/config/roles.js
 * =============================================================================
 */
const ROLES = {
  ADMIN: { id: 'admin', label: 'admin', access: ['dashboard', 'outbox', 'inbox', 'agenda', 'catalog', 'reports', 'settings'] },
  ACCOUNTANT: { id: 'accountant', label: 'accountant', access: ['dashboard', 'outbox', 'inbox', 'reports', 'settings'] },
  SALES: { id: 'sales', label: 'sales', access: ['dashboard', 'outbox', 'catalog', 'agenda'] }
};

export default ROLES;