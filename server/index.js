import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { pool, initializeDatabase, getPostgresStatus } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Data file paths for persistent JSON fallback
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const MEDICINES_FILE = path.join(DATA_DIR, 'medicines.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const REQUIREMENTS_FILE = path.join(DATA_DIR, 'requirements.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Helper to read JSON
const readData = (filePath, defaultData = []) => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return defaultData;
  }
};

// Helper to write JSON
const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    return false;
  }
};

// Initial default medicines
const initialMedicines = [
  {
    id: 'med-1',
    name: 'Paracetamol 650mg (Dolo 650)',
    genericName: 'Paracetamol / Acetaminophen 650mg',
    category: 'Pain & Fever',
    price: 30.50,
    mrp: 34.00,
    stock: 120,
    unit: '15 Tablets / Strip',
    manufacturer: 'Micro Labs Ltd',
    prescriptionRequired: false,
    batchNo: 'DL-8921',
    expiryDate: '2026-11-30',
    description: 'Relieves mild to moderate pain and reduces high fever.',
    dosage: '1 tablet every 6 hours or as directed by doctor.',
    popular: true
  },
  {
    id: 'med-2',
    name: 'Azithromycin 500mg (Azee 500)',
    genericName: 'Azithromycin 500mg',
    category: 'Antibiotics',
    price: 115.00,
    mrp: 132.50,
    stock: 45,
    unit: '5 Tablets / Strip',
    manufacturer: 'Cipla Ltd',
    prescriptionRequired: true,
    batchNo: 'AZ-4091',
    expiryDate: '2026-08-15',
    description: 'Effective broad-spectrum antibiotic for bacterial infections in respiratory tract and skin.',
    dosage: '1 tablet once daily before food for 3-5 days.',
    popular: true
  },
  {
    id: 'med-3',
    name: 'Augmentin 625 Duo',
    genericName: 'Amoxicillin (500mg) + Clavulanic Acid (125mg)',
    category: 'Antibiotics',
    price: 185.00,
    mrp: 220.00,
    stock: 35,
    unit: '10 Tablets / Strip',
    manufacturer: 'GlaxoSmithKline (GSK)',
    prescriptionRequired: true,
    batchNo: 'AG-1022',
    expiryDate: '2026-10-20',
    description: 'Advanced antibiotic combating resistant bacterial infections.',
    dosage: '1 tablet twice daily with food as prescribed.',
    popular: true
  },
  {
    id: 'med-4',
    name: 'Pan-D Capsules',
    genericName: 'Pantoprazole (40mg) + Domperidone (30mg SR)',
    category: 'Gastro & Acidity',
    price: 145.00,
    mrp: 178.00,
    stock: 80,
    unit: '15 Capsules / Strip',
    manufacturer: 'Alkem Laboratories',
    prescriptionRequired: true,
    batchNo: 'PD-5541',
    expiryDate: '2026-12-31',
    description: 'Provides quick relief from hyperacidity, heartburn, GERD, and nausea.',
    dosage: '1 capsule in morning on empty stomach.',
    popular: true
  },
  {
    id: 'med-5',
    name: 'Telma 40 Tablets',
    genericName: 'Telmisartan 40mg',
    category: 'Cardiac & Blood Pressure',
    price: 170.00,
    mrp: 215.00,
    stock: 60,
    unit: '15 Tablets / Strip',
    manufacturer: 'Glenmark Pharmaceuticals',
    prescriptionRequired: true,
    batchNo: 'TL-9901',
    expiryDate: '2027-03-31',
    description: 'Controls high blood pressure and reduces cardiovascular risks.',
    dosage: '1 tablet daily at the same time.',
    popular: true
  },
  {
    id: 'med-6',
    name: 'Glycomet 500 SR',
    genericName: 'Metformin Hydrochloride 500mg Extended Release',
    category: 'Diabetes Care',
    price: 42.00,
    mrp: 51.00,
    stock: 95,
    unit: '20 Tablets / Strip',
    manufacturer: 'USV Ltd',
    prescriptionRequired: true,
    batchNo: 'GM-7712',
    expiryDate: '2026-09-30',
    description: 'Regulates blood glucose levels in patients with Type 2 Diabetes.',
    dosage: 'With or after main meal as advised.',
    popular: true
  }
];

// Initial default orders
const initialOrders = [
  {
    id: 'ORD-9021',
    customerName: 'Gajanan Patil',
    customerPhone: '9822334455',
    deliveryAddress: 'Main Galli, Sawkhed Tejan, Tq. Sindkhed Raja',
    orderDate: '2026-09-12 14:30',
    status: 'Pending',
    paymentMethod: 'Cash on Delivery',
    totalAmount: 260.50,
    items: [
      { id: 'med-1', name: 'Paracetamol 650mg (Dolo 650)', price: 30.50, quantity: 2 },
      { id: 'med-4', name: 'Pan-D Capsules', price: 145.00, quantity: 1 }
    ],
    notes: 'Please deliver after 5 PM near Gram Panchayat.'
  }
];

const initialRequirements = [
  {
    id: 'REQ-101',
    customerName: 'Vikas Jadhav',
    phone: '9765443321',
    address: 'Sawkhed Tejan',
    medicineName: 'Ecosprin AV 75/20 Capsules',
    quantity: '2 strips',
    urgency: 'High (within 24 hours)',
    status: 'Procured & Ready for Pickup',
    date: '2026-09-12 10:20',
    ownerNotes: 'Arrived from distributor in Jalna. Kept at counter.'
  }
];

// Initial default registered users
const initialUsers = [
  {
    id: 'user-admin-1',
    name: 'MR. Rushikesh Suresh Mante',
    email: 'admin@gurumedical.com',
    passwordHash: 'admin123',
    role: 'admin',
    phone: '8237729148',
    address: 'Guru Medical Store, Sawkhed Tejan, Sindkhed Raja, Buldhana',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-cust-1',
    name: 'Satyam Jaybhaye',
    email: 'satyam@example.com',
    passwordHash: 'customer123',
    role: 'customer',
    phone: '8237729148',
    address: 'Sawkhed Tejan, Tq. Sindkhed Raja, Dist. Buldhana',
    createdAt: new Date().toISOString()
  }
];

// Seed fallback JSON files if empty
if (!fs.existsSync(MEDICINES_FILE)) writeData(MEDICINES_FILE, initialMedicines);
if (!fs.existsSync(ORDERS_FILE)) writeData(ORDERS_FILE, initialOrders);
if (!fs.existsSync(REQUIREMENTS_FILE)) writeData(REQUIREMENTS_FILE, initialRequirements);
if (!fs.existsSync(USERS_FILE)) writeData(USERS_FILE, initialUsers);

// Initialize PostgreSQL on Startup
initializeDatabase(initialMedicines, initialOrders, initialRequirements);

// -------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------

// Database Status Endpoint
app.get('/api/db-status', (req, res) => {
  res.json({
    status: 'online',
    postgres: getPostgresStatus(),
    timestamp: new Date().toISOString()
  });
});

// Store metadata & contact
app.get('/api/store-info', (req, res) => {
  res.json({
    storeName: 'Guru Medical & Healthcare',
    marathiName: 'गुरु मेडिकल स्टोअर्स',
    owner: 'MR. Rushikesh Suresh Mante',
    contact: '8237729148',
    whatsapp: '918237729148',
    emergencyContact: '8237729148',
    address: 'Sawkhed Tejan, Tq. Sindkhed Raja, Dist. Buldhana, Maharashtra - 443308',
    timings: 'Monday to Sunday: 7:30 AM - 10:30 PM (Emergency 24/7 Available)',
    drugLicenseNo: 'MH-BUL-20B-194821 / 21B-194822',
    gstin: '27AAMPM8921L1Z4'
  });
});

// GET all medicines / search
app.get('/api/medicines', async (req, res) => {
  const { category, search, inStockOnly } = req.query;

  try {
    if (getPostgresStatus().connected) {
      let query = `
        SELECT id, name, generic_name AS "genericName", category, 
               CAST(price AS FLOAT) AS price, CAST(mrp AS FLOAT) AS mrp, 
               stock, unit, manufacturer, prescription_required AS "prescriptionRequired", 
               batch_no AS "batchNo", TO_CHAR(expiry_date, 'YYYY-MM-DD') AS "expiryDate", 
               description, dosage, popular 
        FROM medicines WHERE 1=1
      `;
      const params = [];

      if (category && category !== 'All') {
        params.push(category);
        query += ` AND LOWER(category) = LOWER($${params.length})`;
      }
      if (search) {
        params.push(`%${search}%`);
        query += ` AND (LOWER(name) LIKE LOWER($${params.length}) OR LOWER(generic_name) LIKE LOWER($${params.length}))`;
      }
      if (inStockOnly === 'true') {
        query += ` AND stock > 0`;
      }

      query += ` ORDER BY name ASC`;
      const result = await pool.query(query, params);
      return res.json(result.rows);
    }
  } catch (err) {
    console.error('Postgres query error, falling back to JSON:', err.message);
  }

  // Fallback to JSON file
  const medicines = readData(MEDICINES_FILE, initialMedicines);
  let filtered = [...medicines];

  if (category && category !== 'All') {
    filtered = filtered.filter(m => m.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(m =>
      m.name.toLowerCase().includes(q) ||
      (m.genericName && m.genericName.toLowerCase().includes(q))
    );
  }
  if (inStockOnly === 'true') {
    filtered = filtered.filter(m => m.stock > 0);
  }

  res.json(filtered);
});

// POST new medicine
app.post('/api/medicines', async (req, res) => {
  const newMed = {
    id: `med-${Date.now()}`,
    name: req.body.name || 'Unnamed Medicine',
    genericName: req.body.genericName || '',
    category: req.body.category || 'General',
    price: Number(req.body.price) || 0,
    mrp: Number(req.body.mrp) || Number(req.body.price) || 0,
    stock: Number(req.body.stock) || 0,
    unit: req.body.unit || '1 Strip',
    manufacturer: req.body.manufacturer || 'Standard Pharma',
    prescriptionRequired: Boolean(req.body.prescriptionRequired),
    batchNo: req.body.batchNo || `BT-${Math.floor(1000 + Math.random() * 9000)}`,
    expiryDate: req.body.expiryDate || '2027-12-31',
    description: req.body.description || '',
    dosage: req.body.dosage || '',
    popular: Boolean(req.body.popular)
  };

  try {
    if (getPostgresStatus().connected) {
      await pool.query(`
        INSERT INTO medicines (id, name, generic_name, category, price, mrp, stock, unit, manufacturer, prescription_required, batch_no, expiry_date, description, dosage, popular)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      `, [
        newMed.id, newMed.name, newMed.genericName, newMed.category,
        newMed.price, newMed.mrp, newMed.stock, newMed.unit,
        newMed.manufacturer, newMed.prescriptionRequired, newMed.batchNo,
        newMed.expiryDate, newMed.description, newMed.dosage, newMed.popular
      ]);
    }
  } catch (err) {
    console.error('Postgres insert error:', err.message);
  }

  // Always update JSON fallback
  const medicines = readData(MEDICINES_FILE, initialMedicines);
  medicines.unshift(newMed);
  writeData(MEDICINES_FILE, medicines);

  res.status(201).json(newMed);
});

// PUT update medicine & stock
app.put('/api/medicines/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    if (getPostgresStatus().connected) {
      await pool.query(`
        UPDATE medicines 
        SET stock = COALESCE($1, stock),
            price = COALESCE($2, price),
            mrp = COALESCE($3, mrp),
            name = COALESCE($4, name),
            category = COALESCE($5, category)
        WHERE id = $6
      `, [updateData.stock, updateData.price, updateData.mrp, updateData.name, updateData.category, id]);
    }
  } catch (err) {
    console.error('Postgres update error:', err.message);
  }

  const medicines = readData(MEDICINES_FILE, initialMedicines);
  const index = medicines.findIndex(m => m.id === id);
  if (index !== -1) {
    medicines[index] = { ...medicines[index], ...updateData };
    writeData(MEDICINES_FILE, medicines);
    return res.json(medicines[index]);
  }

  res.json({ id, ...updateData });
});

// DELETE medicine
app.delete('/api/medicines/:id', async (req, res) => {
  const { id } = req.params;

  try {
    if (getPostgresStatus().connected) {
      await pool.query('DELETE FROM medicines WHERE id = $1', [id]);
    }
  } catch (err) {
    console.error('Postgres delete error:', err.message);
  }

  let medicines = readData(MEDICINES_FILE, initialMedicines);
  medicines = medicines.filter(m => m.id !== id);
  writeData(MEDICINES_FILE, medicines);

  res.json({ message: 'Medicine deleted successfully' });
});

// GET stock report summary
app.get('/api/stock-report', async (req, res) => {
  const medicines = readData(MEDICINES_FILE, initialMedicines);
  const totalItems = medicines.length;
  const totalUnits = medicines.reduce((sum, m) => sum + (m.stock || 0), 0);
  const totalInventoryValue = medicines.reduce((sum, m) => sum + ((m.stock || 0) * (m.price || 0)), 0);
  const lowStock = medicines.filter(m => (m.stock || 0) > 0 && (m.stock || 0) <= 15);
  const outOfStock = medicines.filter(m => (m.stock || 0) === 0);

  const now = new Date();
  const expiringSoon = medicines.filter(m => {
    if (!m.expiryDate) return false;
    const exp = new Date(m.expiryDate);
    const diffDays = (exp - now) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 180;
  });

  res.json({
    totalItems,
    totalUnits,
    totalInventoryValue,
    lowStockCount: lowStock.length,
    outOfStockCount: outOfStock.length,
    expiringSoonCount: expiringSoon.length,
    lowStock,
    outOfStock,
    expiringSoon,
    medicines
  });
});

// GET all orders
app.get('/api/orders', async (req, res) => {
  try {
    if (getPostgresStatus().connected) {
      const result = await pool.query(`
        SELECT id, customer_name AS "customerName", customer_phone AS "customerPhone",
               delivery_address AS "deliveryAddress", order_date AS "orderDate",
               status, payment_method AS "paymentMethod", CAST(total_amount AS FLOAT) AS "totalAmount",
               items, notes
        FROM orders ORDER BY created_at DESC
      `);
      return res.json(result.rows);
    }
  } catch (err) {
    console.error('Postgres orders error:', err.message);
  }

  const orders = readData(ORDERS_FILE, initialOrders);
  res.json(orders);
});

// POST new online order
app.post('/api/orders', async (req, res) => {
  const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date();
  const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);

  const newOrder = {
    id: orderId,
    customerName: req.body.customerName || 'Walk-in Customer',
    customerPhone: req.body.customerPhone || '8237729148',
    deliveryAddress: req.body.deliveryAddress || 'Sawkhed Tejan',
    orderDate: dateStr,
    status: 'Pending',
    paymentMethod: req.body.paymentMethod || 'Cash on Delivery',
    totalAmount: Number(req.body.totalAmount) || 0,
    items: req.body.items || [],
    prescriptionFile: req.body.prescriptionFile || null,
    notes: req.body.notes || ''
  };

  try {
    if (getPostgresStatus().connected) {
      await pool.query(`
        INSERT INTO orders (id, customer_name, customer_phone, delivery_address, order_date, status, payment_method, total_amount, items, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [
        newOrder.id, newOrder.customerName, newOrder.customerPhone,
        newOrder.deliveryAddress, newOrder.orderDate, newOrder.status,
        newOrder.paymentMethod, newOrder.totalAmount, JSON.stringify(newOrder.items), newOrder.notes
      ]);
    }
  } catch (err) {
    console.error('Postgres order insert error:', err.message);
  }

  const orders = readData(ORDERS_FILE, initialOrders);
  orders.unshift(newOrder);
  writeData(ORDERS_FILE, orders);

  res.status(201).json(newOrder);
});

// PUT update order status
app.put('/api/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  try {
    if (getPostgresStatus().connected) {
      await pool.query('UPDATE orders SET status = $1 WHERE id = $2', [status, id]);
    }
  } catch (err) {
    console.error('Postgres status update error:', err.message);
  }

  const orders = readData(ORDERS_FILE, initialOrders);
  const index = orders.findIndex(o => o.id === id);
  if (index !== -1) {
    orders[index].status = status || orders[index].status;
    if (notes) orders[index].notes = notes;
    writeData(ORDERS_FILE, orders);
    return res.json(orders[index]);
  }

  res.json({ id, status, notes });
});

// GET customer requirements
app.get('/api/requirements', (req, res) => {
  const requirements = readData(REQUIREMENTS_FILE, initialRequirements);
  res.json(requirements);
});

// POST new customer requirement
app.post('/api/requirements', async (req, res) => {
  const newReq = {
    id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
    customerName: req.body.customerName || 'Anonymous',
    phone: req.body.phone || '',
    address: req.body.address || 'Sawkhed Tejan',
    medicineName: req.body.medicineName || '',
    quantity: req.body.quantity || '1 pack',
    urgency: req.body.urgency || 'Normal',
    doctorName: req.body.doctorName || '',
    status: 'Pending Review',
    date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    ownerNotes: req.body.ownerNotes || ''
  };

  try {
    if (getPostgresStatus().connected) {
      await pool.query(`
        INSERT INTO requirements (id, customer_name, phone, address, medicine_name, quantity, urgency, doctor_name, status, date, owner_notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [
        newReq.id, newReq.customerName, newReq.phone, newReq.address,
        newReq.medicineName, newReq.quantity, newReq.urgency, newReq.doctorName,
        newReq.status, newReq.date, newReq.ownerNotes
      ]);
    }
  } catch (err) {}

  const requirements = readData(REQUIREMENTS_FILE, initialRequirements);
  requirements.unshift(newReq);
  writeData(REQUIREMENTS_FILE, requirements);
  res.status(201).json(newReq);
});

// -------------------------------------------------------------
// USER AUTHENTICATION & CREDENTIALS ROUTES
// -------------------------------------------------------------

// POST Register New User
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role = 'customer', phone = '', address = '' } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    if (getPostgresStatus().connected) {
      const existing = await pool.query('SELECT id FROM users WHERE LOWER(email) = $1', [normalizedEmail]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
      }

      const userId = `user-${Date.now()}`;
      const insertResult = await pool.query(`
        INSERT INTO users (id, name, email, password_hash, role, phone, address)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, name, email, role, phone, address, created_at AS "createdAt"
      `, [userId, name.trim(), normalizedEmail, password, role, phone, address]);

      // Also mirror to JSON fallback
      const users = readData(USERS_FILE, initialUsers);
      users.push({
        id: userId,
        name: name.trim(),
        email: normalizedEmail,
        passwordHash: password,
        role,
        phone,
        address,
        createdAt: new Date().toISOString()
      });
      writeData(USERS_FILE, users);

      return res.status(201).json({
        message: 'Account registered successfully!',
        user: insertResult.rows[0],
        token: `jwt_mock_${userId}_${Date.now()}`
      });
    }
  } catch (err) {
    console.error('Postgres register error:', err.message);
  }

  // JSON Fallback
  const users = readData(USERS_FILE, initialUsers);
  if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: password,
    role,
    phone,
    address,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeData(USERS_FILE, users);

  const { passwordHash: _, ...safeUser } = newUser;
  res.status(201).json({
    message: 'Account registered successfully!',
    user: safeUser,
    token: `jwt_mock_${newUser.id}_${Date.now()}`
  });
});

// POST User Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    if (getPostgresStatus().connected) {
      const result = await pool.query(`
        SELECT id, name, email, password_hash AS "passwordHash", role, phone, address, created_at AS "createdAt"
        FROM users WHERE LOWER(email) = $1
      `, [normalizedEmail]);

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const user = result.rows[0];
      const storedPassword = user.passwordHash || user.password_hash || user.password;
      if (storedPassword !== password) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const { passwordHash: _, password_hash: __, ...safeUser } = user;
      return res.json({
        message: 'Login successful!',
        user: safeUser,
        token: `jwt_mock_${user.id}_${Date.now()}`
      });
    }
  } catch (err) {
    console.error('Postgres login error:', err.message);
  }

  // JSON Fallback
  const users = readData(USERS_FILE, initialUsers);
  const user = users.find(u => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const storedPassword = user.passwordHash || user.password_hash || user.password;
  if (storedPassword !== password) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const { passwordHash: _, password_hash: __, ...safeUser } = user;
  res.json({
    message: 'Login successful!',
    user: safeUser,
    token: `jwt_mock_${user.id}_${Date.now()}`
  });
});

// GET Current Authenticated User profile
app.get('/api/auth/me', async (req, res) => {
  const email = req.query.email || req.headers['x-user-email'];
  if (!email) {
    return res.status(400).json({ error: 'User email parameter required.' });
  }

  try {
    if (getPostgresStatus().connected) {
      const result = await pool.query(`
        SELECT id, name, email, role, phone, address, created_at AS "createdAt"
        FROM users WHERE LOWER(email) = $1
      `, [email.toLowerCase()]);
      if (result.rows.length > 0) {
        return res.json(result.rows[0]);
      }
    }
  } catch (err) {}

  const users = readData(USERS_FILE, initialUsers);
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    const { passwordHash: _, ...safeUser } = user;
    return res.json(safeUser);
  }

  res.status(404).json({ error: 'User not found.' });
});

// PUT Update User Profile
app.put('/api/auth/profile', async (req, res) => {
  const { id, email, name, phone, address } = req.body;

  try {
    if (getPostgresStatus().connected) {
      const updateResult = await pool.query(`
        UPDATE users 
        SET name = COALESCE($1, name),
            phone = COALESCE($2, phone),
            address = COALESCE($3, address),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $4 OR LOWER(email) = LOWER($5)
        RETURNING id, name, email, role, phone, address, created_at AS "createdAt", updated_at AS "updatedAt"
      `, [name, phone, address, id, email]);

      if (updateResult.rows.length > 0) {
        return res.json({ message: 'Profile updated in PostgreSQL!', user: updateResult.rows[0] });
      }
    }
  } catch (err) {
    console.error('Postgres profile update error:', err.message);
  }

  // Fallback JSON
  const users = readData(USERS_FILE, initialUsers);
  const index = users.findIndex(u => (id && u.id === id) || (email && u.email.toLowerCase() === email.toLowerCase()));
  if (index !== -1) {
    if (name) users[index].name = name;
    if (phone) users[index].phone = phone;
    if (address) users[index].address = address;
    users[index].updatedAt = new Date().toISOString();
    writeData(USERS_FILE, users);
    const { passwordHash: _, ...safeUser } = users[index];
    return res.json({ message: 'Profile updated successfully!', user: safeUser });
  }

  res.status(404).json({ error: 'User not found.' });
});

// GET All Registered Users (Admin oversight)
app.get('/api/users', async (req, res) => {
  try {
    if (getPostgresStatus().connected) {
      const result = await pool.query(`
        SELECT id, name, email, role, phone, address, created_at AS "createdAt", updated_at AS "updatedAt"
        FROM users ORDER BY created_at DESC
      `);
      return res.json(result.rows);
    }
  } catch (err) {
    console.error('Postgres get users error:', err.message);
  }

  const users = readData(USERS_FILE, initialUsers).map(({ passwordHash: _, ...safe }) => safe);
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`🏥 Guru Medical Store Server running on port ${PORT}`);
  console.log(`📍 Location: Sawkhed Tejan, Sindkhed Raja, Buldhana`);
  console.log(`📞 Owner: MR. Rushikesh Suresh Mante (8237729148)`);
});
