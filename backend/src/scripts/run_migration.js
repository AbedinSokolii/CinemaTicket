const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function runMigration() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'kinema',
        multipleStatements: true // This is important for running multiple SQL statements
    });

    try {
        console.log('Reading migration file...');
        const migrationFile = await fs.readFile(
            path.join(__dirname, '../migrations/create_tables.sql'),
            'utf8'
        );

        console.log('Running migration...');
        await connection.query(migrationFile);
        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
        // Log more detailed error information
        if (error.sqlMessage) {
            console.error('SQL Error:', error.sqlMessage);
        }
    } finally {
        await connection.end();
    }
}

runMigration(); 