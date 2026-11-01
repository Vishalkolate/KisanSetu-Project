/** Optional: node database/seed.js  -> creates demo accounts (Password@123) if they do not exist yet. */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { exe, pool } = require('../db');
(async () => {
    const hash = await bcrypt.hash('Password@123', 10);
    await exe('UPDATE admins  SET admin_password = ? WHERE email = ?', [hash, 'admin@kisansetu.com']);
    await exe('UPDATE farmers SET f_password = ?     WHERE email = ?', [hash, 'farmer@kisansetu.com']);
    await exe('UPDATE buyers  SET b_password = ?     WHERE email = ?', [hash, 'buyer@kisansetu.com']);
    console.log('Demo passwords reset to Password@123');
    pool.end();
})().catch(e => { console.error(e); process.exit(1); });
