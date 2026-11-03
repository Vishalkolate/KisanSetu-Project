require("dotenv").config();

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: b3rqgfkig7m7a85gyk4z-mysql.services.clever-cloud.com,
    port:3306,
    user: u6v17ecogpxk5p7l,
    password: KDxQoww7B8Y0nF6bOprk,
    database:b3rqgfkig7m7a85gyk4z,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function exe(sql, params = []) {
    const [rows] = await pool.execute(sql, params);
    return rows;
}

module.exports = {
    exe,
    pool
};
