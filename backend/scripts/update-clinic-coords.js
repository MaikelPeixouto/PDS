const { Client } = require('pg');
require('dotenv').config({ path: './.env' });

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function updateCoords() {
    try {
        await client.connect();
        console.log('Connected to database.');

        const clinicId = '623e04b1-e0c3-4f3c-922f-39d4b4be14f3';
        // Coordinates for Rua Alegrete, 347, Porto Alegre (approximate)
        const lat = -30.001646;
        const lng = -51.151874;

        const query = `
            UPDATE clinics 
            SET latitude = $1, longitude = $2 
            WHERE id = $3
        `;

        await client.query(query, [lat, lng, clinicId]);
        console.log('Updated coordinates for clinic:', clinicId);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

updateCoords();
