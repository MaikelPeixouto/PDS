const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function checkPetIdConstraint() {
    const client = await pool.connect();
    try {
        console.log('Checking vet_appointments pet_id constraint...');
        const res = await client.query(`
            SELECT column_name, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'vet_appointments' AND column_name = 'pet_id'
        `);

        if (res.rows.length > 0) {
            console.log(`pet_id nullable: ${res.rows[0].is_nullable}`);
        } else {
            console.log('pet_id column not found');
        }

    } catch (err) {
        console.error(err);
    } finally {
        client.release();
        pool.end();
    }
}

checkPetIdConstraint();
