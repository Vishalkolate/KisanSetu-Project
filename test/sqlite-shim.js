// Test-only: lets the app run against in-memory SQLite instead of MySQL (so tests need no MySQL server).
const { DatabaseSync } = require('node:sqlite');
const bcrypt = require('bcryptjs');
const db = new DatabaseSync(':memory:');
const fmt = v => v instanceof Date ? v.toISOString().slice(0, 19).replace('T', ' ') : (v === undefined ? null : v);
async function exe(sql, params = []) {
    const p = params.map(fmt);
    try {
        const st = db.prepare(sql);
        if (/^\s*select/i.test(sql)) return st.all(...p);
        var r = st.run(...p);
    } catch (e) { if (/UNIQUE/.test(e.message)) e.code = 'ER_DUP_ENTRY'; throw e; }
    return { insertId: Number(r.lastInsertRowid), affectedRows: Number(r.changes) };
}
db.exec(`
PRAGMA foreign_keys = OFF;
CREATE TABLE farmers (id INTEGER PRIMARY KEY AUTOINCREMENT, full_name, mobile, email UNIQUE, farm_name, state, district, f_password, address, kyc_status DEFAULT 'pending', status DEFAULT 'active', created_at DEFAULT CURRENT_TIMESTAMP, updated_at DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE buyers (id INTEGER PRIMARY KEY AUTOINCREMENT, full_name, mobile, email UNIQUE, b_type, b_name, b_address, b_password, gst_number, city, state, pincode, status DEFAULT 'active', created_at DEFAULT CURRENT_TIMESTAMP, updated_at DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE admins (id INTEGER PRIMARY KEY AUTOINCREMENT, full_name, email UNIQUE, admin_password, role, status DEFAULT 'active');
CREATE TABLE categories (category_id INTEGER PRIMARY KEY AUTOINCREMENT, category_name UNIQUE, description, image_path, status DEFAULT 'active');
CREATE TABLE products (product_id INTEGER PRIMARY KEY AUTOINCREMENT, farmer_id, category_id, product_name, description, price, quantity, unit, p_location, min_order DEFAULT 1, p_img1, p_img2, p_img3, p_status DEFAULT 'Pending', created_at DEFAULT CURRENT_TIMESTAMP, updated_at DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE orders (order_id INTEGER PRIMARY KEY AUTOINCREMENT, buyer_id, farmer_id, product_id, quantity, unit_price, total_amount, status DEFAULT 'pending', payment_status DEFAULT 'pending', delivery_address, note, delivered_at, created_at DEFAULT CURRENT_TIMESTAMP, updated_at DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE enquiries (enquiry_id INTEGER PRIMARY KEY AUTOINCREMENT, buyer_id, farmer_id, product_id, message, requested_quantity, status DEFAULT 'pending', reply_message, replied_at, created_at DEFAULT CURRENT_TIMESTAMP, updated_at DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE wishlist (wishlist_id INTEGER PRIMARY KEY AUTOINCREMENT, buyer_id, product_id, created_at DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE kyc_documents (kyc_id INTEGER PRIMARY KEY AUTOINCREMENT, farmer_id, document_type, document_number, document_file_path, verification_status DEFAULT 'pending', rejection_reason, submitted_at DEFAULT CURRENT_TIMESTAMP, verified_at);
CREATE TABLE notifications (notification_id INTEGER PRIMARY KEY AUTOINCREMENT, recipient_type, recipient_id, title, message, is_read DEFAULT 0, created_at DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE complaints (complaint_id INTEGER PRIMARY KEY AUTOINCREMENT, order_id, user_type, user_id, subject, description, status DEFAULT 'open', resolution, contact_pref DEFAULT 'email', created_at DEFAULT CURRENT_TIMESTAMP, updated_at DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE contact_messages (id INTEGER PRIMARY KEY AUTOINCREMENT, name, email NOT NULL, subject, message, created_at DEFAULT CURRENT_TIMESTAMP);
`);
const h = bcrypt.hashSync('Password@123', 4);
db.exec(`INSERT INTO categories (category_name) VALUES ('Grains'),('Vegetables'),('Fruits')`);
db.prepare(`INSERT INTO farmers (full_name,mobile,email,farm_name,state,district,f_password,kyc_status) VALUES ('Ramesh Patil','9876543210','farmer@kisansetu.com','Patil Farms','Maharashtra','Nashik',?,'verified'),('Other Farmer','9000000001','farmer2@kisansetu.com','Other Farm','Maharashtra','Pune',?,'pending')`).run(h, h);
db.prepare(`INSERT INTO buyers (full_name,mobile,email,b_type,b_name,b_address,b_password) VALUES ('Amit Sharma','9123456780','buyer@kisansetu.com','Wholesaler','Kisan Mart','Shop 12, Pune',?)`).run(h);
db.exec(`INSERT INTO products (farmer_id,category_id,product_name,description,price,quantity,unit,p_location,min_order,p_status) VALUES
 (1,2,'Red Onion','Nashik onions',25,500,'kg','Nashik',50,'Approved'),(1,1,'Wheat','Sharbati',2800,50,'quintal','Nashik',2,'Approved'),(2,3,'Mango','Alphonso',600,100,'dozen','Pune',2,'Approved'),(1,2,'Pending Crop','x',10,10,'kg','Nashik',1,'Pending')`);
module.exports = { exe, pool: { end() { } }, db };
