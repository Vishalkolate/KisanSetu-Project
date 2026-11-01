
/**
 * KisanSetu - MySQL Database Connection
 * Promise-based MySQL Connection Pool
 */

require('dotenv').config();

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME || 'kisansetu',

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
    dateStrings: false
});

// Execute SQL queries
async function exe(sql, params = []) {
    const [rows] = await pool.execute(sql, params);
    return rows;
}

// Test MySQL connection
async function testConnection() {
    let connection;

    try {
        connection = await pool.getConnection();

        await connection.query('SELECT 1');

        console.log('MySQL Database Connected Successfully!');

        return true;

    } catch (error) {
        console.error(
            'MySQL Database Connection Failed:',
            error.message
        );

        throw error;

    } finally {
        if (connection) {
            connection.release();
        }
    }
}

// Export database functions
module.exports = {
    pool,
    exe,
    testConnection
};
