const { Client } = require('pg');
require('dotenv').config({ path: './.env' });

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function fixHours() {
    try {
        await client.connect();
        console.log('Connected to database.');

        const clinicId = '623e04b1-e0c3-4f3c-922f-39d4b4be14f3';
        const days = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        const openTime = '08:00';
        const closeTime = '19:00';

        // Check if hours exist
        const res = await client.query('SELECT * FROM clinic_operating_hours WHERE clinic_id = $1', [clinicId]);
        if (res.rows.length > 0) {
            console.log('Operating hours already exist:', res.rows.length);
            console.log('Deleting existing hours...');
            await client.query('DELETE FROM clinic_operating_hours WHERE clinic_id = $1', [clinicId]);
        }

        console.log('Inserting correct operating hours...');

        for (const day of days) {
            const query = `
                INSERT INTO clinic_operating_hours (id, clinic_id, day_of_week, open_time, close_time, is_open, created_at, updated_at)
                VALUES (gen_random_uuid(), $1, $2, $3, $4, true, NOW(), NOW())
            `;
            await client.query(query, [clinicId, day, openTime, closeTime]);
            console.log(`Inserted ${day}`);
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

fixHours();
