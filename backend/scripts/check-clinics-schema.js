const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function checkClinicsTable() {
    const client = await pool.connect();
    try {
        console.log('Checking clinics table columns...');
        const res = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'clinics'
        `);

        console.log('Columns found:', res.rows.map(r => `${r.column_name} (${r.data_type})`).join(', '));

        const hasPhotoUrl = res.rows.some(r => r.column_name === 'photo_url');
        console.log('Has photo_url column:', hasPhotoUrl);

    } catch (err) {
        console.error(err);
    } finally {
        client.release();
        pool.end();
    }
}

checkClinicsTable();
