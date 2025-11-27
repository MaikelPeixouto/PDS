const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function reproduce() {
    const client = await pool.connect();
    try {
        console.log('Finding a clinic...');
        const res = await client.query('SELECT id, email FROM clinics LIMIT 1');
        if (res.rows.length === 0) {
            console.log('No clinics found.');
            return;
        }
        const clinic = res.rows[0];
        console.log(`Found clinic: ${clinic.email} (${clinic.id})`);

        const token = jwt.sign(
            { id: clinic.id, type: 'clinic' },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: '1h' }
        );

        console.log('Generated token.');

        // Generate a large string (approx 5MB)
        const largeString = 'a'.repeat(5 * 1024 * 1024);
        const payload = {
            photo_url: `data:image/jpeg;base64,${largeString}`
        };

        console.log('Sending PUT request to /api/clinics/me...');
        const response = await fetch('http://localhost:3000/api/clinics/me', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        console.log(`Response status: ${response.status}`);
        const text = await response.text();
        console.log('Response body:', text.substring(0, 200) + '...');


    } catch (err) {
        console.error('Error:', err);
    } finally {
        client.release();
        pool.end();
    }
}

reproduce();
