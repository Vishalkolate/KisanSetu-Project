/**
 * Auto-migration – runs on every server start (safe to run many times).
 * It upgrades an older KisanSetu database so every feature works:
 *   - order status values fixed (old forms used "confirmed", which the DB rejected)
 *   - buyer profile columns, delivered_at for the sales report
 *   - support tickets use the existing `complaints` table
 */
const { exe } = require('../db');

async function columnExists(table, column) {
    const rows = await exe(
        'SELECT COUNT(*) AS c FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?',
        [table, column]);
    return rows[0].c > 0;
}
async function addColumn(table, column, ddl) {
    if (!(await columnExists(table, column))) {
        await exe(`ALTER TABLE ${table} ADD COLUMN ${column} ${ddl}`);
        console.log(`   + added ${table}.${column}`);
    }
}
async function step(label, fn) {
    try { await fn(); } catch (e) { console.warn(`⚠️  migration "${label}" skipped:`, e.message); }
}

async function migrate() {
    // products.p_status – any text value (Pending / Approved / Available / Rejected / Sold Out)
    await step('products.p_status', () => exe("ALTER TABLE products MODIFY COLUMN p_status VARCHAR(50) DEFAULT 'Pending'"));
    await step('products.min_order', () => addColumn('products', 'min_order', 'DECIMAL(10,2) DEFAULT 1.00'));

    // Orders: status as VARCHAR so every panel can use the same values
    await step('orders.status', async () => {
        await exe("ALTER TABLE orders MODIFY COLUMN status VARCHAR(30) NOT NULL DEFAULT 'pending'");
        await exe("UPDATE orders SET status='accepted'  WHERE status IN ('confirmed','')");
        await exe("UPDATE orders SET status='delivered' WHERE status IN ('completed')");
    });
    await step('orders.delivered_at', () => addColumn('orders', 'delivered_at', 'TIMESTAMP NULL DEFAULT NULL'));
    await step('orders.delivered_at backfill', () =>
        exe("UPDATE orders SET delivered_at = updated_at WHERE status='delivered' AND delivered_at IS NULL"));

    // Buyer profile
    await step('buyers.gst_number', () => addColumn('buyers', 'gst_number', 'VARCHAR(20) NULL'));
    await step('buyers.city', () => addColumn('buyers', 'city', 'VARCHAR(100) NULL'));
    await step('buyers.state', () => addColumn('buyers', 'state', 'VARCHAR(100) NULL'));
    await step('buyers.pincode', () => addColumn('buyers', 'pincode', 'VARCHAR(10) NULL'));
    await step('farmers.farm_name', () => addColumn('farmers', 'farm_name', "VARCHAR(150) DEFAULT 'Farm'"));
    await step('farmers.address', () => addColumn('farmers', 'address', 'VARCHAR(255) NULL'));

    // Enquiry replies / timestamps
    await step('enquiries.replied_at', () => addColumn('enquiries', 'replied_at', 'TIMESTAMP NULL DEFAULT NULL'));

    // Support tickets (buyers & farmers) – reuse complaints table, add contact preference
    await step('complaints.contact_pref', () => addColumn('complaints', 'contact_pref', "VARCHAR(20) DEFAULT 'email'"));
    console.log('✅ Database migration check complete');
}

module.exports = { migrate };
