-- =====================================================
-- KisanSetu - Product CRUD Queries
-- Database: kisansetu
-- Table: products
-- =====================================================

USE kisansetu;

-- 1. VIEW ALL PRODUCTS
SELECT * FROM products;

-- 2. VIEW PRODUCT BY ID
SELECT *
FROM products
WHERE product_id = 1;

-- 3. VIEW PRODUCTS OF A PARTICULAR FARMER
SELECT *
FROM products
WHERE farmer_id = 1;

-- 4. ADD PRODUCT
-- Replace farmer_id and category_id with existing IDs.
INSERT INTO products (
    farmer_id,
    category_id,
    product_name,
    description,
    price,
    quantity,
    unit,
    quality,
    p_location,
    p_status
)
VALUES (
    1,
    1,
    'Fresh Tomatoes',
    'Fresh farm-grown tomatoes',
    40.00,
    50.00,
    'kg',
    'Good',
    'Ahmednagar',
    'pending'
);

-- 5. EDIT PRODUCT DETAILS
UPDATE products
SET
    product_name = 'Fresh Red Tomatoes',
    description = 'Fresh quality tomatoes',
    price = 45.00,
    quantity = 60.00,
    unit = 'kg',
    quality = 'Premium',
    p_location = 'Ahmednagar'
WHERE product_id = 1
  AND farmer_id = 1;

-- 6. UPDATE PRODUCT STATUS
-- Allowed values: pending, active, sold, inactive, rejected
UPDATE products
SET p_status = 'active'
WHERE product_id = 1
  AND farmer_id = 1;

-- 7. DELETE PRODUCT
DELETE FROM products
WHERE product_id = 1
  AND farmer_id = 1;

-- 8. SEARCH PRODUCTS BY NAME
SELECT *
FROM products
WHERE product_name LIKE '%Tomato%';

-- 9. VIEW PRODUCTS WITH CATEGORY NAME
SELECT p.*, c.category_name
FROM products AS p
LEFT JOIN categories AS c
    ON p.category_id = c.category_id;

-- 10. COUNT TOTAL PRODUCTS
SELECT COUNT(*) AS total_products
FROM products;

