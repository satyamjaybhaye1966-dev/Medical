import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupPostgres() {
  console.log('🐘 ========================================');
  console.log('🐘  Guru Medical - PostgreSQL Setup Utility');
  console.log('🐘 ========================================');

  const config = {
    host: process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PGPORT || '5432', 10),
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
  };

  console.log(`Connecting to PostgreSQL host ${config.host}:${config.port} as user "${config.user}"...`);

  // Step 1: Connect to default 'postgres' db to ensure 'guru_medical_db' exists
  const rootClient = new Client({ ...config, database: 'postgres' });

  try {
    await rootClient.connect();
    console.log('✓ Successfully connected to PostgreSQL server.');

    const dbName = process.env.PGDATABASE || 'guru_medical_db';
    const checkDb = await rootClient.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);

    if (checkDb.rows.length === 0) {
      console.log(`Creating database "${dbName}"...`);
      await rootClient.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✓ Database "${dbName}" created.`);
    } else {
      console.log(`✓ Database "${dbName}" already exists.`);
    }

    await rootClient.end();

    // Step 2: Run schema migration
    console.log(`Applying SQL schema from server/init-postgres.sql...`);
    const appClient = new Client({ ...config, database: dbName });
    await appClient.connect();

    const sqlPath = path.join(__dirname, 'init-postgres.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    await appClient.query(sql);

    console.log('✓ Tables (medicines, orders, requirements, users) created successfully!');
    await appClient.end();

    console.log('🎉 PostgreSQL setup complete! Users authentication credentials table is active.');
  } catch (error) {
    console.error('\n❌ PostgreSQL Connection Error:', error.message);
    console.log('\n👉 Quick Fix:');
    console.log('1. Open your .env file in the project root.');
    console.log('2. Update PGPASSWORD with your Mac PostgreSQL password:');
    console.log('   PGPASSWORD=your_actual_password');
    console.log('3. Run "node server/setup-db.js" again.');
  }
}

setupPostgres();
