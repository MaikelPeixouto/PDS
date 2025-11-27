const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function fixMissingColumns() {
    const client = await pool.connect();

    try {
        console.log('🔧 Fixing missing columns in clinics table...\n');

        await client.query('BEGIN');

        // Add photo_url if missing
        console.log('📸 Checking photo_url column...');
        const photoCheck = await client.query(`
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'clinics' AND column_name = 'photo_url'
    `);

        if (photoCheck.rows.length === 0) {
            await client.query(`ALTER TABLE clinics ADD COLUMN photo_url TEXT`);
            console.log('  ✓ Added photo_url column');
        } else {
            console.log('  ℹ️  photo_url column already exists');
        }

        await client.query('COMMIT');

        console.log('\n✅ Columns fixed successfully!\n');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

fixMissingColumns();
