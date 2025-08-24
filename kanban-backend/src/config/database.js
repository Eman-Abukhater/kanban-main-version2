import pkg from 'pg';
const { Pool } = pkg;
const useSSL = !process.env.DATABASE_URL?.includes('localhost');
export const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: useSSL ? { rejectUnauthorized:false } : false });
