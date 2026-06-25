# 🍔 Hamburgueria App — Sistema de Cocina

Sistema de gestión de pedidos en tiempo real para hamburguerías.
Los pedidos llegan desde WhatsApp a Google Sheets, se imprimen automáticamente
y se muestran en un tablero Kanban para que la cocina los gestione.

---

## Flujo del sistema

```
1. Cliente pide por WhatsApp
         ↓
2. Pedido llega a Google Sheets
         ↓
3. Backend detecta el nuevo pedido (polling cada 5s)
         ↓
4. Backend imprime ticket automáticamente 🖨️
         ↓
5. Frontend muestra el pedido en cocina (polling cada 3s)
         ↓
6. Cocina cambia el estado del pedido
         ↓
7. Backend actualiza Google Sheets
```

---

## Stack tecnológico

| Capa      | Tecnología                                      |
|-----------|-------------------------------------------------|
| Frontend  | React 19, Vite, react-hot-toast                 |
| Backend   | Node.js, Express 5                              |
| Datos     | Google Sheets + Apps Script                     |
| Impresión | pdfkit (modo PDF) / node-thermal-printer (modo térmico) |

---

## Requisitos previos

- Node.js 18 o superior
- npm 9 o superior
- Una hoja de Google Sheets con el Apps Script configurado
- (Opcional) Impresora térmica 80mm compatible con ESC/POS conectada por USB

---

## Configuración del entorno

Creá el archivo `backend/.env` con las siguientes variables:

```env
# URL pública del Apps Script de Google Sheets
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/TU_SCRIPT_ID/exec

# Modo de impresión: "pdf" o "thermal"
PRINTER_MODE=pdf

# Ruta USB de la impresora térmica (solo si PRINTER_MODE=thermal)
THERMAL_PRINTER_PATH=\\.\USB001
```

> El archivo `.env` está en `.gitignore` y nunca se sube al repositorio.

---

## Instalación y ejecución

### Backend

```bash
cd backend
npm install
npm start
```

El servidor queda corriendo en `http://localhost:3001`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

---

## Estructura del proyecto

```
hamburgueria-app/
├── backend/
│   ├── jobs/
│   │   └── watcher.js           # Detecta pedidos nuevos cada 5s e imprime
│   ├── services/
│   │   ├── printer.js           # Dispatcher: elige modo PDF o térmico
│   │   ├── printerPdf.js        # Genera PDF A4 con pdfkit
│   │   └── printerThermal.js    # Envía ticket a impresora térmica ESC/POS
│   ├── .env                     # Variables de entorno (no se sube a git)
│   ├── package.json
│   └── server.js                # API REST: GET /pedidos, POST /status
│
├── frontend/
│   ├── public/
│   │   └── notify.mp3           # Sonido de alerta para pedidos nuevos
│   └── src/
│       ├── components/
│       │   └── PedidoCard.jsx   # Tarjeta individual de pedido
│       ├── pages/
│       │   └── Cozinha.jsx      # Tablero Kanban principal
│       ├── services/
│       │   └── api.js           # Funciones para consumir el backend
│       └── App.jsx
│
└── README.md
```

---

## Modos de impresión

### Modo PDF (por defecto)

Genera un archivo `pedido-N.pdf` en la carpeta `backend/` al llegar cada pedido nuevo.
Útil para desarrollo y pruebas.

```env
PRINTER_MODE=pdf
```

### Modo Térmico

Envía el ticket directamente a una impresora térmica 80mm por USB usando el protocolo ESC/POS.

```env
PRINTER_MODE=thermal
THERMAL_PRINTER_PATH=\\.\USB001
```

Para encontrar el puerto correcto en Windows:
1. Conectar la impresora por USB
2. Abrir **Panel de control → Dispositivos e impresoras**
3. Ver el puerto asignado a la impresora (ej. `USB001`, `USB002`)
4. Actualizar `THERMAL_PRINTER_PATH` en el `.env` y reiniciar el backend

---

## Estados de los pedidos

| Estado | Descripción |
|---|---|
| Novo | Pedido recién recibido |
| Preparando | En preparación en la cocina |
| Listo | Listo para entregar |
| Cancelado | Pedido cancelado |

