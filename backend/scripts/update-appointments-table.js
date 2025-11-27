const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function updateAppointmentsTable() {
    const client = await pool.connect();

    try {
        console.log('🔧 Updating vet_appointments table...\n');

        await client.query('BEGIN');

        // Make user_id nullable (so clinics can create appointments for non-registered clients)
        console.log('📝 Making user_id nullable...');
        await client.query(`ALTER TABLE vet_appointments ALTER COLUMN user_id DROP NOT NULL`);
        console.log('  ✓ user_id is now nullable');

        // Add client_name column if it doesn't exist
        console.log('\n📝 Adding client metadata columns...');
        const clientNameCheck = await client.query(`
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'vet_appointments' AND column_name = 'client_name'
    `);

        if (clientNameCheck.rows.length === 0) {
            await client.query(`ALTER TABLE vet_appointments ADD COLUMN client_name VARCHAR(255)`);
            console.log('  ✓ Added client_name column');
        } else {
            console.log('  ℹ️  client_name already exists');
        }

        // Add client_phone column if it doesn't exist
        const clientPhoneCheck = await client.query(`
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'vet_appointments' AND column_name = 'client_phone'
    `);

        if (clientPhoneCheck.rows.length === 0) {
            await client.query(`ALTER TABLE vet_appointments ADD COLUMN client_phone VARCHAR(20)`);
            console.log('  ✓ Added client_phone column');
        } else {
            console.log('  ℹ️  client_phone already exists');
        }

        // Add pet_name column if it doesn't exist (for non-registered pets)
        const petNameCheck = await client.query(`
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'vet_appointments' AND column_name = 'pet_name'
    `);

        if (petNameCheck.rows.length === 0) {
            await client.query(`ALTER TABLE vet_appointments ADD COLUMN pet_name VARCHAR(255)`);
            console.log('  ✓ Added pet_name column');
        } else {
            console.log('  ℹ️  pet_name already exists');
        }

        // Add pet_type column if it doesn't exist
        const petTypeCheck = await client.query(`
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'vet_appointments' AND column_name = 'pet_type'
    `);

        if (petTypeCheck.rows.length === 0) {
            await client.query(`ALTER TABLE vet_appointments ADD COLUMN pet_type VARCHAR(50)`);
            console.log('  ✓ Added pet_type column');
        } else {
            console.log('  ℹ️  pet_type already exists');
        }

        await client.query('COMMIT');

        console.log('\n✅ vet_appointments table updated successfully!\n');
        console.log('Clinics can now create appointments for non-registered clients.');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

updateAppointmentsTable();
