-- =========================================================================
-- PostgreSQL Database Schema for Guru Medical & Healthcare (Sawkhed Tejan)
-- Owner: MR. Rushikesh Suresh Mante (8237729148)
-- =========================================================================

-- Create Database (run in psql as superuser if database doesn't exist)
-- CREATE DATABASE guru_medical_db;

-- 1. Medicines Inventory Table
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

-- 2. Orders Table
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

-- 3. Customer Requirements Table
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

-- 4. Users & Authentication Credentials Table
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

-- Indexes for high performance
CREATE INDEX IF NOT EXISTS idx_medicines_category ON medicines(category);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_requirements_status ON requirements(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
