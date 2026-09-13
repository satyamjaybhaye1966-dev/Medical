import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PostgreSQL connection config
const dbConfig = {
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432', 10),
  database: process.env.PGDATABASE || 'guru_medical_db',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  connectionTimeoutMillis: 3000,
};

export const pool = new Pool(dbConfig);

let isPostgresConnected = false;

// Initialize tables in PostgreSQL
export async function initializeDatabase(initialMedicines = [], initialOrders = [], initialRequirements = []) {
  try {
    const client = await pool.connect();
    isPostgresConnected = true;
    console.log(`🐘 Connected to PostgreSQL server on ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);

    // Create Tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS medicines (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        generic_name VARCHAR(255),
        category VARCHAR(100) NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        mrp NUMERIC(10, 2) NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        unit VARCHAR(100) DEFAULT '1 Strip',
        manufacturer VARCHAR(255),
        prescription_required BOOLEAN DEFAULT FALSE,
        batch_no VARCHAR(100),
        expiry_date DATE,
        description TEXT,
        dosage TEXT,
        popular BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(64) PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(50) NOT NULL,
        delivery_address TEXT NOT NULL,
        order_date VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Pending',
        payment_method VARCHAR(100) NOT NULL DEFAULT 'Cash on Delivery',
        total_amount NUMERIC(10, 2) NOT NULL,
        prescription_required BOOLEAN DEFAULT FALSE,
        prescription_verified BOOLEAN DEFAULT FALSE,
        prescription_file TEXT,
        notes TEXT,
        items JSONB NOT NULL DEFAULT '[]',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS requirements (
        id VARCHAR(64) PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        address TEXT,
        medicine_name VARCHAR(255) NOT NULL,
        quantity VARCHAR(100) DEFAULT '1 pack',
        urgency VARCHAR(100) DEFAULT 'Normal',
        doctor_name VARCHAR(255),
        status VARCHAR(100) DEFAULT 'Pending Review',
        date VARCHAR(50) NOT NULL,
        owner_notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'customer',
        phone VARCHAR(50),
        address TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_medicines_category ON medicines(category);
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
      CREATE INDEX IF NOT EXISTS idx_requirements_status ON requirements(status);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    `);

    // Seed Medicines if table is empty
    const medCount = await client.query('SELECT COUNT(*) FROM medicines');
    if (parseInt(medCount.rows[0].count, 10) === 0 && initialMedicines.length > 0) {
      console.log('🌱 Seeding initial medicine inventory into PostgreSQL...');
      for (const med of initialMedicines) {
        await client.query(`
          INSERT INTO medicines (id, name, generic_name, category, price, mrp, stock, unit, manufacturer, prescription_required, batch_no, expiry_date, description, dosage, popular)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          ON CONFLICT (id) DO NOTHING
        `, [
          med.id, med.name, med.genericName, med.category, med.price, med.mrp,
          med.stock, med.unit, med.manufacturer, med.prescriptionRequired,
          med.batchNo, med.expiryDate || null, med.description, med.dosage, med.popular
        ]);
      }
    }

    // Seed Orders if table is empty
    const orderCount = await client.query('SELECT COUNT(*) FROM orders');
    if (parseInt(orderCount.rows[0].count, 10) === 0 && initialOrders.length > 0) {
      for (const ord of initialOrders) {
        await client.query(`
          INSERT INTO orders (id, customer_name, customer_phone, delivery_address, order_date, status, payment_method, total_amount, items, notes)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (id) DO NOTHING
        `, [
          ord.id, ord.customerName, ord.customerPhone, ord.deliveryAddress,
          ord.orderDate, ord.status, ord.paymentMethod, ord.totalAmount,
          JSON.stringify(ord.items), ord.notes
        ]);
      }
    }

    // Seed Requirements if empty
    const reqCount = await client.query('SELECT COUNT(*) FROM requirements');
    if (parseInt(reqCount.rows[0].count, 10) === 0 && initialRequirements.length > 0) {
      for (const r of initialRequirements) {
        await client.query(`
          INSERT INTO requirements (id, customer_name, phone, address, medicine_name, quantity, urgency, status, date, owner_notes)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (id) DO NOTHING
        `, [
          r.id, r.customerName, r.phone, r.address, r.medicineName,
          r.quantity, r.urgency, r.status, r.date, r.ownerNotes
        ]);
      }
    }

    // Seed Default Users if empty
    const userCount = await client.query('SELECT COUNT(*) FROM users');
    if (parseInt(userCount.rows[0].count, 10) === 0) {
      console.log('👤 Seeding default users (Admin & Customer) into PostgreSQL...');
      const defaultUsers = [
        {
          id: 'user-admin-1',
          name: 'MR. Rushikesh Suresh Mante',
          email: 'admin@gurumedical.com',
          password_hash: 'admin123',
          role: 'admin',
          phone: '8237729148',
          address: 'Guru Medical Store, Sawkhed Tejan, Sindkhed Raja, Buldhana'
        },
        {
          id: 'user-cust-1',
          name: 'Satyam Jaybhaye',
          email: 'satyam@example.com',
          password_hash: 'customer123',
          role: 'customer',
          phone: '8237729148',
          address: 'Sawkhed Tejan, Tq. Sindkhed Raja, Dist. Buldhana'
        }
      ];

      for (const u of defaultUsers) {
        await client.query(`
          INSERT INTO users (id, name, email, password_hash, role, phone, address)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (id) DO NOTHING
        `, [u.id, u.name, u.email, u.password_hash, u.role, u.phone, u.address]);
      }
    }

    client.release();
    console.log('✅ PostgreSQL Schema & Seed initialized successfully!');
    return true;
  } catch (error) {
    isPostgresConnected = false;
    console.warn(`⚠️ PostgreSQL connection not established (${error.message}).`);
    console.info(`ℹ️ Using local persistent JSON storage fallback. Edit your .env file with your PostgreSQL password to enable live Postgres DB!`);
    return false;
  }
}

export function getPostgresStatus() {
  return {
    connected: isPostgresConnected,
    config: {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      user: dbConfig.user
    }
  };
}
