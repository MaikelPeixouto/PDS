const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function migrate() {
    const client = await pool.connect();
    try {
        console.log('Altering vet_appointments table...');

        // Make pet_id nullable
        await client.query(`
            ALTER TABLE vet_appointments 
            ALTER COLUMN pet_id DROP NOT NULL;
        `);

        console.log('Successfully made pet_id nullable.');

    } catch (err) {
        console.error('Error executing migration:', err);
    } finally {
        client.release();
        pool.end();
    }
}

migrate();
