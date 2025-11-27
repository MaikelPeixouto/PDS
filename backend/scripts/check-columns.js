const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function checkColumns() {
    const client = await pool.connect();
    try {
        console.log('Checking vet_appointments columns...');
        const res = await client.query(`
            SELECT column_name, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'vet_appointments'
        `);

        const vetId = res.rows.find(r => r.column_name === 'veterinarian_id');
        const payMethod = res.rows.find(r => r.column_name === 'payment_method');

        if (vetId) {
            console.log(`veterinarian_id nullable: ${vetId.is_nullable}`);
        } else {
            console.log('veterinarian_id column missing!');
        }

        if (payMethod) {
            console.log(`payment_method nullable: ${payMethod.is_nullable}`);
        } else {
            console.log('payment_method column missing!');
        }

    } catch (err) {
        console.error(err);
    } finally {
        client.release();
        pool.end();
    }
}

checkColumns();
