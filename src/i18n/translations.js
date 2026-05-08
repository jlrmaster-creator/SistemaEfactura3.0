/**
 * =============================================================================
 * SECCIÓN 1: TRADUCCIONES E INTERNACIONALIZACIÓN
 * NOMBRE: translations
 * RUTA: /src/i18n/translations.js
 * =============================================================================
 */
const translations = {
  es: {
    dashboard: "Cuadro de Mando", outbox: "Facturas Emitidas", inbox: "Facturas Recibidas",
    pending: "Pendientes", processed: "Contabilizadas", agenda: "Agenda", clients: "Clientes",
    suppliers: "Proveedores", catalog: "Catálogo", reports: "INFORMES", xmlAudit: "Auditoría Técnica",
    settings: "Configuración", welcome: "Hola,", language: "Idioma", admin: "Administrador",
    accountant: "Gestoría", sales: "Comercial", newInvoice: "Nueva Factura", importXML: "Importar Fichero",
    total: "Total", company: "Mi Empresa", users: "Usuarios", notifications: "Notificaciones",
    downloadPDF: "Descargar PDF", downloadUBL: "UBL 2.1", downloadFacturaE: "FacturaE",
    downloadCII: "CII XML", downloadPeppol: "Peppol", downloadEdifact: "EDIFACT (SERGAS)",
    emit: "Validar y Emitir", cancel: "Cancelar", price: "Precio", stock: "Stock",
    selectFormat: "Formato de Fichero", validate: "Validar Estructura", loginDesc: "Gestión de Facturación Electrónica",
    twoFactor: "Segundo Factor", twoFactorDesc: "Token de seguridad enviado",
    verify: "Acceder al Sistema", login: "Identificarse", email: "Usuario / Email", password: "Password",
    incVsExp: "Flujo de Tesorería", catDistrib: "Ventas por Categoría", taxSummary: "Resumen de IVA",
    salesGoal: "Objetivo Comercial", newContact: "Alta de Contacto", editContact: "Ficha de Contacto",
    name: "Razón Social / Nombre", docId: "NIF / CIF / DNI", saveContact: "Guardar en Agenda",
    statusSent: "Estado de Ventas", statusReceived: "Estado de Compras", topClients: "Principales Clientes",
    accepted: "Aceptada", paid: "Cobrada", rejected: "Incidencia", draft: "Borrador",
    emailIssued: "Aviso al Cliente", emailReceived: "Aviso Interno", systemAlerts: "Alertas UI", stockAlerts: "Rotura Stock",
    issued: "Emitida", received: "Recibida"
  },
  en: {
    dashboard: "Dashboard", outbox: "Issued Invoices", inbox: "Received Invoices", pending: "Pending", processed: "Processed",
    agenda: "Agenda", clients: "Clients", suppliers: "Suppliers", catalog: "Catalog", reports: "Tax Reports",
    xmlAudit: "Audit", settings: "Settings", welcome: "Welcome,", loginDesc: "Electronic Billing System",
    twoFactor: "Two Factor", verify: "Access System", login: "Sign In", statusSent: "Sales Status",
    accepted: "Accepted", paid: "Paid", rejected: "Issue", draft: "Draft", incVsExp: "Cash Flow",
    issued: "Issued", received: "Received"
  },
  fr: {
    dashboard: "Tableau de Bord", outbox: "Factures Émises", inbox: "Factures Reçues", pending: "En attente", processed: "Comptabilisées",
    agenda: "Agenda", clients: "Clients", suppliers: "Fournisseurs", catalog: "Catalogue", reports: "Rapports Fiscaux",
    settings: "Paramètres", welcome: "Bonjour,", loginDesc: "Système de Facturation", twoFactor: "Deuxième Facteur", 
    verify: "Accéder au Système", login: "Se Connecter",
    issued: "Émise", received: "Reçue"
  },
  pt: {
    dashboard: "Painel de Controle", outbox: "Faturas Emitidas", inbox: "Faturas Recebidas", pending: "Pendentes", processed: "Contabilizadas",
    agenda: "Agenda", clients: "Clientes", suppliers: "Fornecedores", catalog: "Catálogo", reports: "Relatórios Fiscais",
    settings: "Configurações", welcome: "Olá,", loginDesc: "Sistema de Faturação", twoFactor: "Segundo Fator", 
    verify: "Aceder au Sistema", login: "Entrar",
    issued: "Emitida", received: "Recebida"
  }
};

export default translations;