-- ========================================================
-- KisanSetu: Farmer-to-Buyer Marketplace Database Schema
-- Database Name: kisansetu
-- ========================================================

CREATE DATABASE IF NOT EXISTS kisansetu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kisansetu;

-- ========================================================
-- 1. FARMERS TABLE (Farmer Registration & Profiles)
-- ========================================================
CREATE TABLE IF NOT EXISTS farmers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    farm_name VARCHAR(150) DEFAULT 'Farm',
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    f_password VARCHAR(255) NOT NULL,
    address VARCHAR(255) NULL,
    kyc_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    status ENUM('active', 'inactive', 'blocked') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========================================================
-- 2. BUYERS TABLE (Buyer Registration & Profiles)
-- ========================================================
CREATE TABLE IF NOT EXISTS buyers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    b_type VARCHAR(100) NOT NULL,
    b_name VARCHAR(150) NOT NULL,
    b_address VARCHAR(200) NOT NULL,
    b_password VARCHAR(255) NOT NULL,
    gst_number VARCHAR(20) NULL,
    city VARCHAR(100) NULL,
    state VARCHAR(100) NULL,
    pincode VARCHAR(10) NULL,
    status ENUM('active', 'inactive', 'blocked') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========================================================
-- 3. ADMINS TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    admin_password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- 4. CATEGORIES TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_path VARCHAR(500),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========================================================
-- 5. PRODUCTS TABLE (Listed by Farmers)
-- ========================================================
CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT NOT NULL,
    category_id INT NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    p_location VARCHAR(200),
    min_order DECIMAL(10,2) DEFAULT 1.00,
    p_img1 VARCHAR(255) DEFAULT NULL,
    p_img2 VARCHAR(255) DEFAULT NULL,
    p_img3 VARCHAR(255) DEFAULT NULL,
    p_status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON UPDATE CASCADE
);

-- ========================================================
-- 6. ORDERS TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id INT NOT NULL,
    farmer_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',  -- pending | accepted | shipped | delivered | cancelled | rejected
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    delivery_address TEXT NOT NULL,
    note VARCHAR(255),
    delivered_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES buyers(id) ON DELETE CASCADE,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- ========================================================
-- 7. ENQUIRIES TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS enquiries (
    enquiry_id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id INT NOT NULL,
    farmer_id INT NOT NULL,
    product_id INT NOT NULL,
    message TEXT NOT NULL,
    requested_quantity DECIMAL(10,2),
    status ENUM('pending', 'responded', 'closed') DEFAULT 'pending',
    reply_message TEXT,
    replied_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES buyers(id) ON DELETE CASCADE,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- ========================================================
-- 8. WISHLIST TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS wishlist (
    wishlist_id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_buyer_product (buyer_id, product_id),
    FOREIGN KEY (buyer_id) REFERENCES buyers(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- ========================================================
-- 9. KYC DOCUMENTS TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS kyc_documents (
    kyc_id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    document_number VARCHAR(100),
    document_file_path VARCHAR(500) NOT NULL,
    verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    rejection_reason TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
);

-- ========================================================
-- 10. NOTIFICATIONS TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    recipient_type ENUM('farmer', 'buyer', 'admin') NOT NULL,
    recipient_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- 11. COMPLAINTS TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS complaints (
    complaint_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NULL,
    user_type ENUM('farmer', 'buyer') NOT NULL,
    user_id INT NOT NULL,
    subject VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('open', 'in_progress', 'resolved', 'rejected') DEFAULT 'open',
    resolution TEXT,
    contact_pref VARCHAR(20) DEFAULT 'email',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE SET NULL
);

-- ========================================================
-- 12. LOCATIONS TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS locations (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    taluka VARCHAR(100),
    village VARCHAR(100),
    postal_code VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- 13. BANNERS TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS banners (
    banner_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    image_path VARCHAR(500) NOT NULL,
    target_url VARCHAR(500),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- 14. CONTACT MESSAGES TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL,
    subject VARCHAR(200),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- SAMPLE SEED DATA
-- Default password for all sample accounts: Password@123
-- (Bcrypt hash below is valid for Password@123)
-- ========================================================

-- Categories
INSERT INTO categories (category_name, description, status) VALUES 
('Grains', 'Fresh wheat, paddy, corn, millets and other grain crops', 'active'),
('Vegetables', 'Fresh seasonal farm-grown green vegetables', 'active'),
('Fruits', 'Organic and orchard fruits directly from farmers', 'active'),
('Pulses', 'High-protein lentils, chickpeas, and legumes', 'active'),
('Spices', 'Pure authentic Indian spices and herbs', 'active'),
('Other', 'Dairy products, sugarcane, flowers, and miscellaneous crops', 'active')
ON DUPLICATE KEY UPDATE category_name = VALUES(category_name);

-- Default Admin (Password: Password@123)
INSERT INTO admins (full_name, email, admin_password, role) VALUES
('System Administrator', 'admin@kisansetu.com', '$2b$10$S2njHyTUJtHuNblZTOxnGeIJgfhStDkuabZNwXeQkP.auVX3o.mBC', 'admin')
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

-- Default Demo Farmer (Password: Password@123)
INSERT INTO farmers (id, full_name, mobile, email, farm_name, state, district, f_password, kyc_status) VALUES
(1, 'Ramesh Patil', '9876543210', 'farmer@kisansetu.com', 'Patil Organic Farms', 'Maharashtra', 'Nashik', '$2b$10$S2njHyTUJtHuNblZTOxnGeIJgfhStDkuabZNwXeQkP.auVX3o.mBC', 'verified')
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

-- Default Demo Buyer (Password: Password@123)
INSERT INTO buyers (id, full_name, mobile, email, b_type, b_name, b_address, b_password) VALUES
(1, 'Amit Sharma', '9123456780', 'buyer@kisansetu.com', 'Wholesaler', 'Kisan Retail & Wholesale Mart', 'Shop 12, APMC Market Yard, Pune', '$2b$10$S2njHyTUJtHuNblZTOxnGeIJgfhStDkuabZNwXeQkP.auVX3o.mBC')
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

-- Default Sample Products
INSERT INTO products (product_id, farmer_id, category_id, product_name, description, price, quantity, unit, p_location, min_order, p_status) VALUES
(1, 1, 1, 'Sharbati Wheat (Grade A)', 'Naturally dried high-grade Sharbati wheat, harvested fresh.', 2800.00, 50.00, 'quintal', 'Nashik, Maharashtra', 2.00, 'Available'),
(2, 1, 2, 'Fresh Red Onion (Nashik Special)', 'Grade-1 Nashik red onions, medium size, long storage life.', 25.00, 500.00, 'kg', 'Nashik, Maharashtra', 50.00, 'Available'),
(3, 1, 3, 'Fresh Alphonso Mango', 'Naturally ripened carbide-free export quality Alphonso mangoes.', 600.00, 100.00, 'dozen', 'Ratnagiri, Maharashtra', 2.00, 'Available'),
(4, 1, 4, 'Organic Chana (Chickpeas)', 'Chemical-free unpolished Desi Chana grown using organic manure.', 75.00, 200.00, 'kg', 'Nashik, Maharashtra', 10.00, 'Available')
ON DUPLICATE KEY UPDATE product_name = VALUES(product_name);


-- Demo orders & enquiries so the dashboards are not empty (safe to delete)
INSERT INTO orders (order_id, buyer_id, farmer_id, product_id, quantity, unit_price, total_amount, status, delivery_address, note, delivered_at) VALUES
(1, 1, 1, 2, 100.00, 25.00, 2500.00, 'delivered', 'Shop 12, APMC Market Yard, Pune', 'Demo order', NOW()),
(2, 1, 1, 1, 5.00, 2800.00, 14000.00, 'shipped',   'Shop 12, APMC Market Yard, Pune', 'Demo order', NULL),
(3, 1, 1, 4, 50.00, 75.00, 3750.00, 'pending',     'Shop 12, APMC Market Yard, Pune', 'Demo order', NULL)
ON DUPLICATE KEY UPDATE status = VALUES(status);

INSERT INTO enquiries (enquiry_id, buyer_id, farmer_id, product_id, message, requested_quantity, status, reply_message) VALUES
(1, 1, 1, 3, 'Is bulk price available for 20 dozen Alphonso?', 20.00, 'responded', 'Yes, Rs. 570 per dozen for 20+ dozen.'),
(2, 1, 1, 2, 'Can you deliver to Pune within 2 days?', 200.00, 'pending', NULL)
ON DUPLICATE KEY UPDATE message = VALUES(message);
