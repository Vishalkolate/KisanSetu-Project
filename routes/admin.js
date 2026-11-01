const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const { exe } = require('../db');
const { normalizeStatus, STATUSES } = require('../lib/orders');
const { notify } = require('../lib/notify');

const router = express.Router();

// Middleware
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Helper to provide pageTitle and defaults
function renderAdmin(res, view, data = {}) {
    res.render(view, {
        pageTitle: data.pageTitle || 'Admin Dashboard',
        admin: (res.req && res.req.session && res.req.session.admin) ? res.req.session.admin : { full_name: 'Administrator', role: 'Super Admin' },
        ...data
    });
}

// Admin Authentication Guard Middleware
function checkAdmin(req, res, next) {
    if (req.session && req.session.admin) {
        return next();
    }
    return res.redirect('/admin/');
}

// ==========================================
// ADMIN LOGIN & AUTHENTICATION
// ==========================================

// GET /admin/ or /admin/login
router.get(['/', '/login'], (req, res) => {
    if (req.session && req.session.admin) {
        return res.redirect('/admin/statistics');
    }
    res.render('admin/login.ejs', {
        error: req.query.error ? 'Invalid email or password' : null,
        email: req.query.email || ''
    });
});

// POST /admin/login or POST /admin/
async function handleAdminLogin(req, res) {
    try {
        const { email, password } = req.body;
        if (!email?.trim() || !password) {
            return res.render('admin/login.ejs', {
                error: 'Please enter both admin email and password.',
                email: email || ''
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const rows = await exe('SELECT * FROM admins WHERE LOWER(email) = ? LIMIT 1', [normalizedEmail]);

        if (!rows.length) {
            return res.render('admin/login.ejs', {
                error: 'No administrator account found with this email.',
                email: normalizedEmail
            });
        }

        const adminUser = rows[0];
        const savedPass = adminUser.admin_password || adminUser.password || '';

        let passwordMatches = false;
        try {
            passwordMatches = await bcrypt.compare(password, savedPass);
        } catch (e) {
            passwordMatches = false;
        }

        // Support direct match fallback for legacy plain text passwords if any
        if (!passwordMatches && password === savedPass) {
            passwordMatches = true;
        }

        if (!passwordMatches) {
            return res.render('admin/login.ejs', {
                error: 'Invalid password. Please check your credentials.',
                email: normalizedEmail
            });
        }

        // Set Admin Session
        req.session.admin = {
            id: adminUser.id || adminUser.admin_id,
            full_name: adminUser.full_name || 'Administrator',
            email: adminUser.email,
            role: adminUser.role || 'admin'
        };

        req.session.save((err) => {
            if (err) console.error('Admin session save error:', err);
            return res.redirect('/admin/statistics');
        });

    } catch (error) {
        console.error('Admin login error:', error);
        return res.render('admin/login.ejs', {
            error: 'An internal error occurred during login. Please try again.',
            email: req.body.email || ''
        });
    }
}

router.post(['/', '/login'], handleAdminLogin);

// Admin Logout
router.get(['/logout', '/admin/logout'], (req, res) => {
    if (req.session) {
        delete req.session.admin;
        req.session.save(() => {
            res.redirect('/admin/');
        });
    } else {
        res.redirect('/admin/');
    }
});

// ==========================================
// 1. DASHBOARD & STATISTICS (PROTECTED)
// ==========================================
router.get(['/statistics', '/admin/statistics', '/dashboard'], checkAdmin, async (req, res) => {
    try {
        const [farmers] = await exe('SELECT COUNT(*) AS total FROM farmers');
        const [buyers] = await exe('SELECT COUNT(*) AS total FROM buyers');
        const [products] = await exe('SELECT COUNT(*) AS total FROM products');
        const [orders] = await exe('SELECT COUNT(*) AS total FROM orders');
        const [pendingKyc] = await exe('SELECT COUNT(*) AS total FROM kyc_documents WHERE verification_status = "pending"');
        const [pendingProducts] = await exe('SELECT COUNT(*) AS total FROM products WHERE p_status = "Pending"');
        const [openComplaints] = await exe('SELECT COUNT(*) AS total FROM complaints WHERE status = "open"');

        renderAdmin(res, 'admin/dashboard_stats', {
            pageTitle: 'Statistics',
            stats: {
                totalFarmers: farmers ? farmers.total : 0,
                totalBuyers: buyers ? buyers.total : 0,
                totalProducts: products ? products.total : 0,
                totalOrders: orders ? orders.total : 0,
                pendingKyc: pendingKyc ? pendingKyc.total : 0,
                pendingProducts: pendingProducts ? pendingProducts.total : 0,
                openComplaints: openComplaints ? openComplaints.total : 0
            }
        });
    } catch (err) {
        console.error('Stats error:', err);
        renderAdmin(res, 'admin/dashboard_stats', { pageTitle: 'Statistics', stats: {} });
    }
});

// JSON API endpoint for statistics
router.get(['/api/stats', '/admin/api/stats'], checkAdmin, async (req, res) => {
    try {
        const [farmers] = await exe('SELECT COUNT(*) AS total FROM farmers');
        const [buyers] = await exe('SELECT COUNT(*) AS total FROM buyers');
        const [products] = await exe('SELECT COUNT(*) AS total FROM products');
        const [orders] = await exe('SELECT COUNT(*) AS total FROM orders');
        const [pendingKyc] = await exe('SELECT COUNT(*) AS total FROM kyc_documents WHERE verification_status = "pending"');
        const [pendingProducts] = await exe('SELECT COUNT(*) AS total FROM products WHERE p_status = "Pending"');
        const [openComplaints] = await exe('SELECT COUNT(*) AS total FROM complaints WHERE status = "open"');

        res.json({
            success: true,
            totalFarmers: farmers ? farmers.total : 0,
            totalBuyers: buyers ? buyers.total : 0,
            totalProducts: products ? products.total : 0,
            totalOrders: orders ? orders.total : 0,
            pendingKyc: pendingKyc ? pendingKyc.total : 0,
            pendingProducts: pendingProducts ? pendingProducts.total : 0,
            openComplaints: openComplaints ? openComplaints.total : 0
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ==========================================
// 2. MANAGE FARMERS (PROTECTED)
// ==========================================
router.get(['/farmers', '/admin/farmers'], checkAdmin, async (req, res) => {
    try {
        const farmers = await exe('SELECT * FROM farmers ORDER BY id DESC');
        renderAdmin(res, 'admin/manage_farmers', {
            pageTitle: 'Manage Farmers',
            farmers
        });
    } catch (err) {
        renderAdmin(res, 'admin/manage_farmers', { pageTitle: 'Manage Farmers', farmers: [] });
    }
});

router.post(['/farmers/toggle-status/:id', '/admin/farmers/toggle-status/:id'], checkAdmin, async (req, res) => {
    try {
        const rows = await exe('SELECT status FROM farmers WHERE id = ?', [req.params.id]);
        if (rows.length) {
            const newStatus = rows[0].status === 'blocked' ? 'active' : 'blocked';
            await exe('UPDATE farmers SET status = ? WHERE id = ?', [newStatus, req.params.id]);
        }
        res.redirect('/admin/farmers');
    } catch (err) {
        console.error('Toggle farmer status error:', err);
        res.redirect('/admin/farmers');
    }
});

// ==========================================
// 3. MANAGE BUYERS (PROTECTED)
// ==========================================
router.get(['/buyers', '/admin/buyers'], checkAdmin, async (req, res) => {
    try {
        const buyers = await exe('SELECT * FROM buyers ORDER BY id DESC');
        renderAdmin(res, 'admin/manage_buyers', {
            pageTitle: 'Manage Buyers',
            buyers
        });
    } catch (err) {
        renderAdmin(res, 'admin/manage_buyers', { pageTitle: 'Manage Buyers', buyers: [] });
    }
});

router.post(['/buyers/toggle-status/:id', '/admin/buyers/toggle-status/:id'], checkAdmin, async (req, res) => {
    try {
        const rows = await exe('SELECT status FROM buyers WHERE id = ?', [req.params.id]);
        if (rows.length) {
            const newStatus = rows[0].status === 'blocked' ? 'active' : 'blocked';
            await exe('UPDATE buyers SET status = ? WHERE id = ?', [newStatus, req.params.id]);
        }
        res.redirect('/admin/buyers');
    } catch (err) {
        console.error('Toggle buyer status error:', err);
        res.redirect('/admin/buyers');
    }
});

// ==========================================
// 4. VERIFY KYC (PROTECTED)
// ==========================================
router.get(['/kyc', '/admin/kyc'], checkAdmin, async (req, res) => {
    try {
        const kycDocs = await exe(
            `SELECT k.*, f.full_name AS farmer_name, f.mobile, f.district
             FROM kyc_documents k
             JOIN farmers f ON k.farmer_id = f.id
             ORDER BY k.kyc_id DESC`
        );
        renderAdmin(res, 'admin/verify_kyc', {
            pageTitle: 'Verify KYC',
            kycDocs
        });
    } catch (err) {
        renderAdmin(res, 'admin/verify_kyc', { pageTitle: 'Verify KYC', kycDocs: [] });
    }
});

router.post(['/kyc/approve/:id', '/admin/kyc/approve/:id'], checkAdmin, async (req, res) => {
    try {
        await exe('UPDATE kyc_documents SET verification_status = "verified", verified_at = NOW() WHERE kyc_id = ?', [req.params.id]);
        const [doc] = await exe('SELECT farmer_id FROM kyc_documents WHERE kyc_id = ?', [req.params.id]);
        if (doc) {
            await exe('UPDATE farmers SET kyc_status = "verified" WHERE id = ?', [doc.farmer_id]);
        }
        res.redirect('/admin/kyc');
    } catch (err) {
        console.error('Approve KYC error:', err);
        res.redirect('/admin/kyc');
    }
});

router.post(['/kyc/reject/:id', '/admin/kyc/reject/:id'], checkAdmin, async (req, res) => {
    try {
        await exe('UPDATE kyc_documents SET verification_status = "rejected" WHERE kyc_id = ?', [req.params.id]);
        const [doc] = await exe('SELECT farmer_id FROM kyc_documents WHERE kyc_id = ?', [req.params.id]);
        if (doc) {
            await exe('UPDATE farmers SET kyc_status = "rejected" WHERE id = ?', [doc.farmer_id]);
        }
        res.redirect('/admin/kyc');
    } catch (err) {
        console.error('Reject KYC error:', err);
        res.redirect('/admin/kyc');
    }
});

// ==========================================
// 5. MANAGE CATEGORIES (PROTECTED)
// ==========================================
router.get(['/categories', '/admin/categories'], checkAdmin, async (req, res) => {
    try {
        const categories = await exe(
            `SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.category_id) AS product_count
             FROM categories c
             ORDER BY c.category_id DESC`
        );
        renderAdmin(res, 'admin/manage-categories', {
            pageTitle: 'Manage Categories',
            categories
        });
    } catch (err) {
        renderAdmin(res, 'admin/manage-categories', { pageTitle: 'Manage Categories', categories: [] });
    }
});

router.post(['/categories/add', '/admin/categories/add'], checkAdmin, async (req, res) => {
    try {
        const { category_name, description } = req.body;
        if (category_name?.trim()) {
            await exe(
                'INSERT INTO categories (category_name, description) VALUES (?, ?)',
                [category_name.trim(), description || '']
            );
        }
        res.redirect('/admin/categories');
    } catch (err) {
        console.error('Add category error:', err);
        res.redirect('/admin/categories');
    }
});

router.post(['/categories/delete/:id', '/admin/categories/delete/:id'], checkAdmin, async (req, res) => {
    try {
        await exe('DELETE FROM categories WHERE category_id = ?', [req.params.id]);
        res.redirect('/admin/categories');
    } catch (err) {
        console.error('Delete category error:', err);
        res.redirect('/admin/categories');
    }
});

// ==========================================
// 6. APPROVE PRODUCTS (PROTECTED)
// ==========================================
router.get(['/products', '/admin/products'], checkAdmin, async (req, res) => {
    try {
        const products = await exe(
            `SELECT p.*, c.category_name, f.full_name AS farmer_name, f.district
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.category_id
             LEFT JOIN farmers f ON p.farmer_id = f.id
             ORDER BY p.product_id DESC`
        );
        renderAdmin(res, 'admin/approve-products', {
            pageTitle: 'Approve Products',
            products
        });
    } catch (err) {
        renderAdmin(res, 'admin/approve-products', { pageTitle: 'Approve Products', products: [] });
    }
});

router.post(['/products/approve/:id', '/admin/products/approve/:id'], checkAdmin, async (req, res) => {
    try {
        await exe('UPDATE products SET p_status = "Approved" WHERE product_id = ?', [req.params.id]);
        res.redirect('/admin/products');
    } catch (err) {
        console.error('Approve product error, attempting fallback to Available:', err.message);
        try {
            await exe('UPDATE products SET p_status = "Available" WHERE product_id = ?', [req.params.id]);
        } catch (e) {
            console.error('Fallback approve error:', e.message);
        }
        res.redirect('/admin/products');
    }
});

router.post(['/products/reject/:id', '/admin/products/reject/:id'], checkAdmin, async (req, res) => {
    try {
        await exe('UPDATE products SET p_status = "Rejected" WHERE product_id = ?', [req.params.id]);
        res.redirect('/admin/products');
    } catch (err) {
        console.error('Reject product error:', err);
        res.redirect('/admin/products');
    }
});

// ==========================================
// 7. MANAGE ORDERS (PROTECTED)
// ==========================================
router.get(['/orders', '/admin/orders'], checkAdmin, async (req, res) => {
    try {
        const orders = await exe(
            `SELECT o.*, b.full_name AS buyer_name, b.mobile AS buyer_mobile, f.full_name AS farmer_name, p.product_name
             FROM orders o
             LEFT JOIN buyers b ON o.buyer_id = b.id
             LEFT JOIN farmers f ON o.farmer_id = f.id
             LEFT JOIN products p ON o.product_id = p.product_id
             ORDER BY o.order_id DESC`
        );
        renderAdmin(res, 'admin/manage-orders', {
            pageTitle: 'Manage Orders',
            orders
        });
    } catch (err) {
        renderAdmin(res, 'admin/manage-orders', { pageTitle: 'Manage Orders', orders: [] });
    }
});

router.post(['/orders/status/:id', '/admin/orders/status/:id'], checkAdmin, async (req, res) => {
    try {
        const status = normalizeStatus(req.body.status);
        if (STATUSES.includes(status)) {
            const [o] = await exe('SELECT * FROM orders WHERE order_id = ?', [req.params.id]);
            if (o && o.status !== status) {
                if (status === 'delivered') await exe('UPDATE orders SET status = ?, delivered_at = ? WHERE order_id = ?', [status, new Date(), o.order_id]);
                else await exe('UPDATE orders SET status = ? WHERE order_id = ?', [status, o.order_id]);
                await notify('buyer', o.buyer_id, 'Order status updated', `Order #KS-${o.order_id} is now ${status}.`);
                await notify('farmer', o.farmer_id, 'Order status updated', `Order #KS-${o.order_id} is now ${status}.`);
            }
        }
        res.redirect('/admin/orders');
    } catch (err) {
        console.error('Update order status error:', err);
        res.redirect('/admin/orders');
    }
});

// ==========================================
// 8. MANAGE ENQUIRIES (PROTECTED)
// ==========================================
router.get(['/enquiries', '/admin/enquiries'], checkAdmin, async (req, res) => {
    try {
        const enquiries = await exe(
            `SELECT e.*, b.full_name AS buyer_name, f.full_name AS farmer_name, p.product_name
             FROM enquiries e
             LEFT JOIN buyers b ON e.buyer_id = b.id
             LEFT JOIN farmers f ON e.farmer_id = f.id
             LEFT JOIN products p ON e.product_id = p.product_id
             ORDER BY e.enquiry_id DESC`
        );
        renderAdmin(res, 'admin/manage-enquiries', {
            pageTitle: 'Manage Enquiries',
            enquiries
        });
    } catch (err) {
        renderAdmin(res, 'admin/manage-enquiries', { pageTitle: 'Manage Enquiries', enquiries: [] });
    }
});

router.post(['/enquiries/close/:id', '/admin/enquiries/close/:id'], checkAdmin, async (req, res) => {
    try {
        await exe('UPDATE enquiries SET status = "closed" WHERE enquiry_id = ?', [req.params.id]);
        res.redirect('/admin/enquiries');
    } catch (err) {
        console.error('Close enquiry error:', err);
        res.redirect('/admin/enquiries');
    }
});

// ==========================================
// 9. MANAGE COMPLAINTS (PROTECTED)
// ==========================================
router.get(['/complaints', '/admin/complaints'], checkAdmin, async (req, res) => {
    try {
        const complaints = await exe('SELECT * FROM complaints ORDER BY complaint_id DESC');
        renderAdmin(res, 'admin/manage-complaints', {
            pageTitle: 'Manage Complaints',
            complaints
        });
    } catch (err) {
        renderAdmin(res, 'admin/manage-complaints', { pageTitle: 'Manage Complaints', complaints: [] });
    }
});

// ==========================================
// 10. MANAGE BANNERS (PROTECTED)
// ==========================================
router.get(['/banners', '/admin/banners'], checkAdmin, async (req, res) => {
    try {
        const banners = await exe('SELECT * FROM banners ORDER BY banner_id DESC');
        renderAdmin(res, 'admin/manage-banners', {
            pageTitle: 'Manage Banners',
            banners
        });
    } catch (err) {
        renderAdmin(res, 'admin/manage-banners', { pageTitle: 'Manage Banners', banners: [] });
    }
});

// ==========================================
// 11. MANAGE LOCATIONS (PROTECTED)
// ==========================================
router.get(['/locations', '/admin/locations'], checkAdmin, async (req, res) => {
    try {
        const locations = await exe('SELECT * FROM locations ORDER BY state, district');
        renderAdmin(res, 'admin/manage-districts-talukas', {
            pageTitle: 'Manage Locations',
            locations
        });
    } catch (err) {
        renderAdmin(res, 'admin/manage-districts-talukas', { pageTitle: 'Manage Locations', locations: [] });
    }
});

// ==========================================
// 12. REPORTS, PROFILE, SETTINGS (PROTECTED)
// ==========================================
router.get(['/reports', '/admin/reports'], checkAdmin, (req, res) => {
    renderAdmin(res, 'admin/manage-User-sales-reports', {
        pageTitle: 'Manage Reports'
    });
});

router.get(['/profile', '/admin/profile'], checkAdmin, (req, res) => {
    renderAdmin(res, 'admin/manage-admin-profile', {
        pageTitle: 'Manage Profile'
    });
});

router.get(['/settings', '/admin/settings'], checkAdmin, (req, res) => {
    renderAdmin(res, 'admin/manage-admin-settings', {
        pageTitle: 'Manage Settings'
    });
});

module.exports = router;
