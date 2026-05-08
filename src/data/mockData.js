/**
 * =============================================================================
 * SECCIÓN 3: CAPA DE DATOS (MOCK DATA LOCALIZADO)
 * NOMBRE: mockData
 * RUTA: /src/data/mockData.js
 * =============================================================================
 */
const INITIAL_OUTBOX = [
  { id: 'FAC-2023-001', client: 'Sistemas Digitales SL', date: '2023-11-01', total: 1500.00, status: 'paid', doc: 'B12345678', ledger: 'A-221' },
  { id: 'FAC-2023-002', client: 'Logística Galega SA', date: '2023-11-02', total: 850.00, status: 'accepted', doc: 'A87654321', ledger: 'A-222' },
  { id: 'FAC-2023-003', client: 'Sistemas Digitales SL', date: '2023-11-05', total: 2400.00, status: 'pending', doc: 'B12345678' },
  { id: 'FAC-2023-004', client: 'Hostelería Madrid', date: '2023-11-07', total: 3200.00, status: 'rejected', doc: 'B55443322' },
  { id: 'FAC-2023-005', client: 'Exportadora Sur', date: '2023-10-15', total: 12500.00, status: 'paid', doc: 'B99887766', ledger: 'A-198' }
];

const INITIAL_INBOX = [
  { id: 'REC-23-4412', supplier: 'Telefónica de España', date: '2023-11-01', total: 120.00, status: 'paid', doc: 'A28015865', ledger: 'C-990' },
  { id: 'REC-23-9980', supplier: 'Endesa Energía', date: '2023-11-05', total: 450.00, status: 'accepted', doc: 'A81948077', ledger: 'C-995' }
];

const INITIAL_AGENDA = {
  clients: [
    { id: 1, name: 'Sistemas Digitales SL', doc: 'B12345678', email: 'admin@sisdig.es', phone: '91 123 45 67', address: 'C/ Mayor 45, 28001 Madrid', totalSales: 3900, contactPerson: 'Laura Gómez', status: 'active' },
    { id: 2, name: 'Logística Galega SA', doc: 'A87654321', email: 'info@loggal.com', phone: '981 234 567', address: 'Avda. do Porto 89, 15703 Santiago', totalSales: 850, contactPerson: 'Manuel Rivas', status: 'active' },
    { id: 3, name: 'Hostelería Madrid', doc: 'B55443322', email: 'contacto@hostmad.es', phone: '91 987 65 43', address: 'C/ Gran Vía 23, 28013 Madrid', totalSales: 3200, contactPerson: 'Ana Torres', status: 'active' },
    { id: 4, name: 'Exportadora Sur SL', doc: 'B99887766', email: 'ventas@exportsur.es', phone: '95 456 789', address: 'Pol. Ind. Store 15, 41006 Sevilla', totalSales: 12500, contactPerson: 'Carlos Herrera', status: 'active' },
    { id: 5, name: 'Consultoría Tecnológica IT', doc: 'B11223344', email: 'info@consulit.es', phone: '93 555 66 77', address: 'C/ Balmes 200, 08006 Barcelona', totalSales: 5800, contactPerson: 'Marta Puig', status: 'inactive' }
  ],
  suppliers: [
    { id: 101, name: 'Telefónica de España', doc: 'A28015865', email: 'billing@telefonica.es', phone: '900 100 100', address: 'C/ Gran Vía 28, 28013 Madrid', contactPerson: 'Dpto. Facturación' },
    { id: 102, name: 'Endesa Energía', doc: 'A81948077', email: 'facturas@endesa.es', phone: '900 900 900', address: 'C/ Ribera del Loira 60, 28042 Madrid', contactPerson: 'Atención al Cliente' },
    { id: 103, name: 'Proveedor Informático SL', doc: 'B55667788', email: 'pedidos@provinf.es', phone: '91 444 55 66', address: 'C/ Alcalá 150, 28009 Madrid', contactPerson: 'Pedro Sánchez' }
  ]
};

const MOCK_CATALOG = [
  { id: 1, name: "Licencia ERP Anual", category: "Software", price: 1200, stock: 150 },
  { id: 2, name: "Hora Consultoría", category: "Servicios", price: 85, stock: "-" },
  { id: 3, name: "Servidor Cloud Dedicado", category: "Infraestructura", price: 2400, stock: 20 },
  { id: 4, name: "Certificado Digital FNMT", category: "Seguridad", price: 24, stock: 500 },
  { id: 5, name: "Módulo FacturaE 3.2", category: "Software", price: 600, stock: 80 },
  { id: 6, name: "Instalación y Configuración", category: "Servicios", price: 350, stock: "-" },
  { id: 7, name: "Lote 1000 Sellos TSA", category: "Seguridad", price: 180, stock: 300 },
  { id: 8, name: "Disco SSD 1TB Empresarial", category: "Hardware", price: 220, stock: 45 },
  { id: 9, name: "Mantenimiento Mensual SFE", category: "Servicios", price: 95, stock: "-" },
  { id: 10, name: "Adaptador Peppol ID", category: "Software", price: 450, stock: 120 },
  { id: 11, name: "Router Corporativo VPN", category: "Hardware", price: 890, stock: 15 },
  { id: 12, name: "Curso Factura Electrónica", category: "Formación", price: 199, stock: 1000 }
];

const MOCK_USERS = [
  { id: 1, name: "Juan Delgado", email: "juan@empresa.es", role: "admin", status: "activo", phone: "91 123 45 78", department: "Dirección", lastLogin: "2024-11-15 09:30", created: "2022-01-10" },
  { id: 2, name: "Elena Ramos", email: "elena@gestoria.es", role: "accountant", status: "activo", phone: "91 123 45 79", department: "Contabilidad", lastLogin: "2024-11-14 16:45", created: "2023-03-22" },
  { id: 3, name: "Carlos Méndez", email: "carlos@empresa.es", role: "sales", status: "activo", phone: "91 123 45 80", department: "Comercial", lastLogin: "2024-11-13 11:00", created: "2023-06-05" },
  { id: 4, name: "María López", email: "maria@gestoria.es", role: "accountant", status: "inactivo", phone: "91 123 45 81", department: "Contabilidad", lastLogin: "2024-10-28 08:15", created: "2024-01-15" },
  { id: 5, name: "Pedro Sánchez", email: "pedro@empresa.es", role: "admin", status: "activo", phone: "91 123 45 82", department: "IT", lastLogin: "2024-11-15 10:00", created: "2021-09-01" }
];

export { INITIAL_OUTBOX, INITIAL_INBOX, INITIAL_AGENDA, MOCK_CATALOG, MOCK_USERS };