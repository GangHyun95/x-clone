import { config } from 'dotenv';
import { Pool } from 'pg';

config();

export const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: 'xclone',
    password: process.env.PG_PASSWORD,
    port: Number(process.env.PG_PORT) || 5432,
});

export const connectDB = async () => {
    try {
        const client = await pool.connect();
        client.release();
    } catch (error) {
        console.error(`PostgreSQL Error: ${(error as Error).message}`);
        process.exit(1);
    }
};
