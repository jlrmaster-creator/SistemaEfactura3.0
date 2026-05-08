# Sistema eFactura 3.0

Sistema de gestión de facturación electrónica compatible con estándares españoles (FacturaE), UBL 2.1, CII, Peppol y EDIFACT.

## Tecnologías

| Capa | Tecnología |
|---|---|
| Framework | React 18 |
| Build | Vite 5 |
| Estilos | Tailwind CSS 3 |
| Iconos | Lucide React |
| API | Axios (con fallback a datos mock) |
| PDF | jsPDF + html2canvas |
| Formularios | Formspree React |
| Internacionalización | i18n propio (ES, EN, FR, PT) |

## Arquitectura

```
src/
├── App.jsx                    # Orquestador principal (estado, auth, menú, layout)
├── main.jsx                   # Punto de entrada React
├── index.css                  # Directivas Tailwind + animaciones
├── components/
│   ├── auth/                  # LoginPage, TwoFactorPage
│   ├── common/                # ListView, DonutChart, ToggleButton, ModalImport
│   ├── invoices/              # InvoiceForm, InvoicePDF
│   ├── agenda/                # ContactForm
│   └── reports/               # ReportsView
├── services/
│   └── BillingAPI.js          # Capa de servicios (mock + API REST real)
├── data/
│   └── mockData.js            # Datos de demostración
├── config/
│   └── roles.js               # Roles y permisos (admin, accountant, sales)
└── i18n/
    └── translations.js        # Traducciones multi-idioma
```

### BillingAPI

El servicio `BillingAPI.js` soporta dos modos:

- **Modo mock** (por defecto): si no hay `VITE_API_URL`, responde con datos simulados y delays. Perfecto para desarrollo y demostraciones.
- **Modo API real**: si se define `VITE_API_URL`, todas las llamadas se redirigen a un REST API externo mediante axios.

## Funcionalidades

- **Autenticación**: Login + doble factor (simulado)
- **Dashboard**: KPIs, gráficos donut, cashflow, top clientes
- **Facturas Emitidas/Recibidas**: listado con filtro pendientes/contabilizadas, histórico por factura, menú de acciones contextual
- **Agenda**: clientes y proveedores con datos de contacto
- **Catálogo**: productos/servicios con precios y stock
- **Informes**: KPIs, gráficos, tabla detallada con exportación a CSV y PDF
- **Configuración**: datos de empresa, usuarios (CRUD), notificaciones, auditoría
- **Roles**: Administrador, Gestoría, Comercial (acceso diferencial)
- **Multi-idioma**: español, inglés, francés, portugués
- **Ayuda/Soporte**: formulario de ticket vía Formspree

## Requisitos

- Node.js 18+
- npm 9+

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre `http://localhost:5173` en el navegador. Los botones de rol en la cabecera permiten cambiar entre Admin/Gestoría/Comercial para probar permisos.

## Producción

```bash
npm run build
npm run preview
```

## Conectar a API externa

Crear archivo `.env` en la raíz:

```env
VITE_API_URL=https://tu-dominio.com/api
```

Sin esta variable, la aplicación funciona completamente con datos mock.

## Despliegue

El proyecto genera una carpeta `dist/` con archivos estáticos. Sirve con cualquier servidor web (nginx, Apache, Vercel, Netlify, etc.).

```bash
npm run build
# Sirve dist/ con tu servidor preferido
```

## Créditos

Desarrollado con React + Vite + Tailwind CSS. Iconos por Lucide. Facturación electrónica conforme a la normativa española.
