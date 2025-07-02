import { config } from 'dotenv';
import { Pool } from 'pg';

config();

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
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
