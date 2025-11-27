const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
    const client = await pool.connect();

    try {
        console.log('🚀 Starting complete database migration...\n');

        await client.query('BEGIN');

        // 1. Enable UUID extension
        console.log('📦 Enabling UUID extension...');
        await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        console.log('✅ UUID extension enabled\n');

        // 2. Create operating hours table
        console.log('🕐 Creating clinic_operating_hours table...');
        await client.query(`
      CREATE TABLE IF NOT EXISTS clinic_operating_hours (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
        day_of_week VARCHAR(20) NOT NULL,
        open_time TIME,
        close_time TIME,
        is_open BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
        await client.query(`
      CREATE INDEX IF NOT EXISTS idx_operating_hours_clinic 
      ON clinic_operating_hours(clinic_id)
    `);
        console.log('✅ clinic_operating_hours table created\n');

        // 3. Create appointment durations table
        console.log('⏱️  Creating clinic_appointment_durations table...');
        await client.query(`
      CREATE TABLE IF NOT EXISTS clinic_appointment_durations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        clinic_id UUID UNIQUE NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
        standard INTEGER DEFAULT 30,
        followup INTEGER DEFAULT 15,
        emergency INTEGER DEFAULT 60,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
        await client.query(`
      CREATE INDEX IF NOT EXISTS idx_appointment_durations_clinic 
      ON clinic_appointment_durations(clinic_id)
    `);
        console.log('✅ clinic_appointment_durations table created\n');

        // 4. Create payment methods table
        console.log('💳 Creating clinic_payment_methods table...');
        await client.query(`
      CREATE TABLE IF NOT EXISTS clinic_payment_methods (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
        method VARCHAR(50) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
        await client.query(`
      CREATE INDEX IF NOT EXISTS idx_payment_methods_clinic 
      ON clinic_payment_methods(clinic_id)
    `);
        console.log('✅ clinic_payment_methods table created\n');

        // 5. Create billing info table
        console.log('🏦 Creating clinic_billing_info table...');
        await client.query(`
      CREATE TABLE IF NOT EXISTS clinic_billing_info (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        clinic_id UUID UNIQUE NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
        pix_key VARCHAR(255),
        bank_name VARCHAR(255),
        bank_agency VARCHAR(50),
        bank_account VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
        await client.query(`
      CREATE INDEX IF NOT EXISTS idx_billing_info_clinic 
      ON clinic_billing_info(clinic_id)
    `);
        console.log('✅ clinic_billing_info table created\n');

        // 6. Update vet_services table
        console.log('🛠️  Updating vet_services table...');

        // Check if clinic_id column exists
        const clinicIdCheck = await client.query(`
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'vet_services' AND column_name = 'clinic_id'
    `);

        if (clinicIdCheck.rows.length === 0) {
            await client.query(`
        ALTER TABLE vet_services 
        ADD COLUMN clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE
      `);
            await client.query(`
        CREATE INDEX idx_services_clinic ON vet_services(clinic_id)
      `);
            console.log('  ✓ Added clinic_id column');
        } else {
            console.log('  ℹ️  clinic_id column already exists');
        }

        // Check if is_active column exists
        const isActiveCheck = await client.query(`
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'vet_services' AND column_name = 'is_active'
    `);

        if (isActiveCheck.rows.length === 0) {
            await client.query(`
        ALTER TABLE vet_services 
        ADD COLUMN is_active BOOLEAN DEFAULT true
      `);
            console.log('  ✓ Added is_active column');
        } else {
            console.log('  ℹ️  is_active column already exists');
        }

        console.log('✅ vet_services table updated\n');

        await client.query('COMMIT');

        console.log('═'.repeat(50));
        console.log('✨ MIGRATION COMPLETED SUCCESSFULLY! ✨');
        console.log('═'.repeat(50));
        console.log('\n📊 Summary:');
        console.log('  ✓ clinic_operating_hours table created');
        console.log('  ✓ clinic_appointment_durations table created');
        console.log('  ✓ clinic_payment_methods table created');
        console.log('  ✓ clinic_billing_info table created');
        console.log('  ✓ vet_services table updated');
        console.log('\n🚀 You can now start the backend server!');
        console.log('   Run: npm start\n');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('\n❌ Migration failed!');
        console.error('Error:', error.message);
        console.error('\nStack trace:', error.stack);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

runMigration();
