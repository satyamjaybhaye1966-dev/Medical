# 🏥 Guru Medical Store – Full-Stack Web Application

A modern, responsive e-commerce and pharmacy management web platform for **Guru Medical / Mante Medical Store**. The application provides an end-to-end medical shopping experience for customers and a complete management dashboard for store administrators and owners.

---

## 🚀 Features

### 🛒 Customer Features
- **Interactive Medicine Catalog:** Browse medicines by categories (Prescription, OTC, First Aid, Supplements, etc.) with live search and price filtering.
- **Cart & Checkout:** Add/remove items, quantity management, discount calculation, and cash-on-delivery or online payment simulations.
- **Prescription Upload:** Securely attach prescription files for medicines requiring Rx verification.
- **Special Requirement Requests:** Submit requests for rare or out-of-stock medicines directly to the store owner.
- **User Authentication & Profile:** Register, log in, manage delivery addresses, and track active and past orders.
- **Services Page:** Emergency medicine requests, BP/sugar checks info, and pharmacy consultation details.

### 🛡️ Admin & Store Owner Features
- **Stock Management Dashboard:** Add, edit, delete, and restock medicines with batch numbers, expiry dates, MRP, discounted prices, and categories.
- **Order Management:** View incoming orders, verify prescriptions, update order statuses (`Pending`, `Confirmed`, `Out for Delivery`, `Delivered`, `Cancelled`).
- **Customer Requirement Tracker:** Review customer requests, add quotation notes, and update fulfillment statuses.
- **Owner Dashboard & Analytics:** High-level metrics, sales summaries, and store performance.

---

## 🛠️ Tech Stack

- **Frontend:** [React 18](https://react.dev/), [Vite](https://vitejs.dev/), [Lucide React Icons](https://lucide.dev/), [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti), Vanilla CSS (Custom Design System).
- **Backend:** [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/), [CORS](https://www.npmjs.com/package/cors), [dotenv](https://www.npmjs.com/package/dotenv).
- **Database:** [PostgreSQL](https://www.postgresql.org/) (via `pg` client) with **automatic persistent JSON fallback** in `server/data/`.
- **Alternative Backends (Included):**
  - Python / Django (`backend-python-django/`)
  - Java / Spring Boot (`backend-java-springboot/`)

---

## 📂 Project Structure

```text
Medical/
├── .env                      # Database & Server environment variables
├── .env.example              # Example environment configuration
├── package.json              # Project dependencies and run scripts
├── vite.config.js            # Vite configuration & dev proxy
├── index.html                # Main HTML entry
│
├── src/                      # Frontend Source Code
│   ├── main.jsx              # React root entry
│   ├── App.jsx               # Application routing and layout
│   ├── index.css             # Global styling and CSS design system
│   ├── components/           # UI Components (Navbar, Footer, Modals, etc.)
│   ├── context/              # StoreContext (Global state for cart, user, stock)
│   ├── data/                 # Initial medicine datasets & mock info
│   └── pages/                # Page Components
│       ├── HomePage.jsx
│       ├── CatalogPage.jsx
│       ├── ServicesPage.jsx
│       ├── CustomerReqPage.jsx
│       ├── UserProfilePage.jsx
│       ├── AdminStockPage.jsx
│       ├── AdminOrdersPage.jsx
│       └── OwnerPage.jsx
│
├── server/                   # Backend Node.js / Express API
│   ├── index.js              # Express server and REST API routes
│   ├── db.js                 # PostgreSQL connection pool & table setup
│   ├── setup-db.js           # Database initialization script
│   ├── init-postgres.sql     # PostgreSQL table creation schema
│   └── data/                 # Local persistent JSON data storage (fallback)
│       ├── medicines.json
│       ├── orders.json
│       ├── requirements.json
│       └── users.json
│
├── backend-python-django/    # Alternative Django backend
└── backend-java-springboot/  # Alternative Spring Boot backend
```

---

## ⚙️ Environment Configuration

Create or update the `.env` file in the root directory:

```env
# PostgreSQL Database Configuration
PGHOST=localhost
PGPORT=5432
PGDATABASE=guru_medical_db
PGUSER=postgres
PGPASSWORD=postgres

# Express API Port
PORT=5001
```

> **Note:** If PostgreSQL is not installed or running, the server will **automatically fall back** to the local JSON database located at `server/data/`, so the app works out-of-the-box!

---

## 🏁 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. (Optional) Initialize PostgreSQL Database
If you have PostgreSQL running locally:
```bash
npm run db:setup
```

### 3. Start the Backend API Server
```bash
npm run server
```
*Backend runs on: `http://localhost:5001`*

### 4. Start the Frontend Application
In a separate terminal window:
```bash
npm run dev
```
*Frontend runs on: `http://localhost:5173`*

---

## 📜 Available NPM Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite React development server with hot-reloading |
| `npm run server` | Starts the Express.js backend API (`server/index.js`) |
| `npm run db:setup` | Initializes PostgreSQL tables and seeds default data |
| `npm run build` | Builds production-ready frontend bundle into `/dist` |
| `npm run preview` | Previews the production build locally |

---

## 📡 API Endpoints Reference

### **Medicines**
- `GET /api/medicines` – Fetch all medicines.
- `POST /api/medicines` – Add a new medicine.
- `PUT /api/medicines/:id` – Update medicine details or stock.
- `DELETE /api/medicines/:id` – Remove a medicine.

### **Orders**
- `GET /api/orders` – Fetch all customer orders (Admin/User).
- `POST /api/orders` – Place a new order.
- `PUT /api/orders/:id/status` – Update order status & prescription verification.

### **Requirements & Special Requests**
- `GET /api/requirements` – List customer requirement requests.
- `POST /api/requirements` – Submit a new medicine request.
- `PUT /api/requirements/:id` – Update request status / add quotation notes.

### **Authentication & System Status**
- `POST /api/auth/login` – User authentication.
- `POST /api/auth/register` – User registration.
- `GET /api/status` – Check backend connectivity and PostgreSQL status.

---

## 📄 License
This project is for educational and commercial medical store operations.
