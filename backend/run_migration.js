const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runMigration() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL?.includes('supabase') ? { rejectUnauthorized: false } : false,
    });

    try {
        console.log('🔗 Connecting to database...');
        const client = await pool.connect();
        console.log('✅ Connected successfully!');

        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        console.log('📄 Reading schema file:', schemaPath);
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('🚀 Running migration...');
        await client.query(schema);
        console.log('✅ Migration completed successfully!');

        client.release();
        await pool.end();
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

runMigration();
