const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
    const client = await pool.connect();

    try {
        console.log('🔄 Starting migration: Add clinic_id to services...');

        // Add clinic_id column
        await client.query(`
      ALTER TABLE vet_services 
      ADD COLUMN IF NOT EXISTS clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE;
    `);
        console.log('✅ Added clinic_id column');

        // Add is_active column
        await client.query(`
      ALTER TABLE vet_services 
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
    `);
        console.log('✅ Added is_active column');

        // Create index
        await client.query(`
      CREATE INDEX IF NOT EXISTS idx_services_clinic ON vet_services(clinic_id);
    `);
        console.log('✅ Created index on clinic_id');

        console.log('✨ Migration completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

runMigration()
    .then(() => {
        console.log('Done!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('Fatal error:', err);
        process.exit(1);
    });
