const express = require('express');
const bcrypt = require('bcryptjs');
const { exe } = require('../db');
const { requireBuyer, wantsJson } = require('../middleware/auth');
const { notify } = require('../lib/notify');
const { canBuyerMove, normalizeStatus } = require('../lib/orders');

const router = express.Router();
router.use(requireBuyer);               // every /buyer/* page needs a logged-in BUYER

const LIVE = "('Available','Approved')";  // product statuses visible to buyers
const bid = req => req.session.user.id;
const flash = (req, type, msg) => { req.session.flash = { type, msg }; };
const done = (req, res, ok, msg, redirect, extra = {}) => {
    if (wantsJson(req)) return res.status(ok ? 200 : 400).json({ success: ok, message: msg, ...extra });
    flash(req, ok ? 'success' : 'danger', msg);
    return res.redirect(redirect);
};

// ------------------------------------------------------------------ data helpers
async function getBuyer(id) {
    const rows = await exe('SELECT * FROM buyers WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
}

async function buyerSummary(id) {
    const orders = await exe('SELECT status, quantity, total_amount FROM orders WHERE buyer_id = ?', [id]);
    const enq = await exe('SELECT status FROM enquiries WHERE buyer_id = ?', [id]);
    const [wl] = await exe('SELECT COUNT(*) AS c FROM wishlist WHERE buyer_id = ?', [id]);
    const [un] = await exe("SELECT COUNT(*) AS c FROM notifications WHERE recipient_type = 'buyer' AND recipient_id = ? AND is_read = 0", [id]);

    const by = s => orders.filter(o => o.status === s).length;
    const spendable = orders.filter(o => ['accepted', 'shipped', 'delivered'].includes(o.status));
    return {
        totalOrders: orders.length,                                   // <- "Total order count"
        pendingOrders: by('pending'),
        activeOrders: by('pending') + by('accepted') + by('shipped'),
        shippedOrders: by('shipped'),
        deliveredOrders: by('delivered'),
        cancelledOrders: by('cancelled') + by('rejected'),
        totalSpend: spendable.reduce((a, o) => a + Number(o.total_amount || 0), 0),
        totalVolume: orders.filter(o => o.status === 'delivered').reduce((a, o) => a + Number(o.quantity || 0), 0),
        totalEnquiries: enq.length,
        pendingEnquiries: enq.filter(e => e.status === 'pending').length,
        repliedEnquiries: enq.filter(e => e.status === 'responded').length,
        wishlistCount: wl ? wl.c : 0,
        unreadNotifications: un ? un.c : 0
    };
}

const ORDER_SQL = `SELECT o.*, p.product_name, p.unit, p.p_img1, f.full_name AS farmer_name, f.mobile AS farmer_mobile, f.district AS farmer_district
    FROM orders o LEFT JOIN products p ON o.product_id = p.product_id LEFT JOIN farmers f ON o.farmer_id = f.id`;
const ENQ_SQL = `SELECT e.*, p.product_name, p.unit, f.full_name AS farmer_name, f.mobile AS farmer_mobile
    FROM enquiries e LEFT JOIN products p ON e.product_id = p.product_id LEFT JOIN farmers f ON e.farmer_id = f.id`;

// ------------------------------------------------------------------ 1. DASHBOARD
router.get(['/', '/home', '/home.html', '/dashboard', '/dashboard.html', '/overview'], async (req, res, next) => {
    try {
        const id = bid(req);
        const [buyer, stats, recentOrders, recentEnquiries, tracking] = await Promise.all([
            getBuyer(id), buyerSummary(id),
            exe(`${ORDER_SQL} WHERE o.buyer_id = ? ORDER BY o.order_id DESC LIMIT 6`, [id]),
            exe(`${ENQ_SQL} WHERE e.buyer_id = ? ORDER BY e.enquiry_id DESC LIMIT 5`, [id]),
            exe(`${ORDER_SQL} WHERE o.buyer_id = ? AND o.status IN ('pending','accepted','shipped') ORDER BY o.order_id DESC LIMIT 4`, [id])
        ]);
        const featured = await exe(
            `SELECT p.*, c.category_name, f.district FROM products p LEFT JOIN categories c ON p.category_id = c.category_id
             LEFT JOIN farmers f ON p.farmer_id = f.id WHERE p.p_status IN ${LIVE} ORDER BY p.product_id DESC LIMIT 4`);
        res.render('buyer/dashboard.ejs', { panel: 'buyer', title: 'Buyer Dashboard', buyer, stats, recentOrders, recentEnquiries, tracking, featured });
    } catch (e) { next(e); }
});

// Live JSON used by the dashboard (auto-refresh without page reload)
router.get('/api/summary', async (req, res) => {
    try {
        const id = bid(req);
        const [stats, orders, enquiries, tracking] = await Promise.all([
            buyerSummary(id),
            exe(`${ORDER_SQL} WHERE o.buyer_id = ? ORDER BY o.order_id DESC LIMIT 6`, [id]),
            exe(`${ENQ_SQL} WHERE e.buyer_id = ? ORDER BY e.enquiry_id DESC LIMIT 5`, [id]),
            exe(`${ORDER_SQL} WHERE o.buyer_id = ? AND o.status IN ('pending','accepted','shipped') ORDER BY o.order_id DESC LIMIT 4`, [id])
        ]);
        res.json({ success: true, stats, orders, enquiries, tracking, at: Date.now() });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ------------------------------------------------------------------ 2. BROWSE (filters)
router.get(['/browse', '/browse-products', '/browse-products.html', '/browse_products', '/search-filter', '/search_filter'], async (req, res, next) => {
    try {
        const { q = '', category = '', district = '', min = '', max = '', sort = 'new' } = req.query;
        let sql = `SELECT p.*, c.category_name, f.full_name AS farmer_name, f.district, f.state
                   FROM products p LEFT JOIN categories c ON p.category_id = c.category_id
                   LEFT JOIN farmers f ON p.farmer_id = f.id WHERE p.p_status IN ${LIVE} AND p.quantity > 0`;
        const params = [];
        if (q.trim()) { sql += ' AND (LOWER(p.product_name) LIKE ? OR LOWER(p.description) LIKE ? OR LOWER(f.full_name) LIKE ?)'; const k = `%${q.trim().toLowerCase()}%`; params.push(k, k, k); }
        if (category) { sql += ' AND p.category_id = ?'; params.push(Number(category)); }
        if (district.trim()) { sql += ' AND (LOWER(f.district) LIKE ? OR LOWER(p.p_location) LIKE ?)'; const k = `%${district.trim().toLowerCase()}%`; params.push(k, k); }
        if (min !== '' && !isNaN(min)) { sql += ' AND p.price >= ?'; params.push(Number(min)); }
        if (max !== '' && !isNaN(max)) { sql += ' AND p.price <= ?'; params.push(Number(max)); }
        sql += { low: ' ORDER BY p.price ASC', high: ' ORDER BY p.price DESC', name: ' ORDER BY p.product_name ASC' }[sort] || ' ORDER BY p.product_id DESC';
        const [products, categories, wl] = await Promise.all([
            exe(sql, params),
            exe('SELECT * FROM categories ORDER BY category_name'),
            exe('SELECT product_id FROM wishlist WHERE buyer_id = ?', [bid(req)])
        ]);
        res.render('buyer/browse.ejs', {
            panel: 'buyer', title: 'Browse Crops', products, categories,
            wished: wl.map(w => w.product_id), filters: { q, category, district, min, max, sort }
        });
    } catch (e) { next(e); }
});

// light product list for the "new enquiry" dropdown
router.get('/api/products', async (req, res) => {
    try {
        const products = await exe(`SELECT p.product_id, p.product_name, p.price, p.unit, f.full_name AS farmer_name FROM products p
            JOIN farmers f ON p.farmer_id = f.id WHERE p.p_status IN ${LIVE} ORDER BY p.product_name`);
        res.json({ success: true, products });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ------------------------------------------------------------------ 3. PRODUCT DETAILS (+ order + enquiry)
async function loadProduct(id) {
    const rows = await exe(
        `SELECT p.*, c.category_name, f.full_name AS farmer_name, f.mobile AS farmer_mobile, f.district, f.state, f.farm_name
         FROM products p LEFT JOIN categories c ON p.category_id = c.category_id LEFT JOIN farmers f ON p.farmer_id = f.id
         WHERE p.product_id = ? LIMIT 1`, [id]);
    return rows[0] || null;
}

router.get(['/product/:id', '/product-details/:id', '/product-details', '/product_details', '/product-details.html'], async (req, res, next) => {
    try {
        const id = req.params.id || req.query.id || req.query.product_id;
        const product = id ? await loadProduct(id) : null;
        const buyer = await getBuyer(bid(req));
        let isWished = false;
        if (product) {
            const w = await exe('SELECT 1 AS x FROM wishlist WHERE buyer_id = ? AND product_id = ?', [bid(req), product.product_id]);
            isWished = w.length > 0;
        }
        res.render('buyer/product-details.ejs', { panel: 'buyer', title: product ? product.product_name : 'Crop not found', product, buyer, isWished });
    } catch (e) { next(e); }
});

// ------------------------------------------------------------------ 4. PLACE ORDER
router.get(['/place-order', '/place-order.html', '/place_order'], (req, res) => {
    const id = req.query.product_id;
    res.redirect(id ? `/buyer/product/${encodeURIComponent(id)}#order` : '/buyer/browse');
});

router.post(['/orders/place', '/place-order', '/api/order'], async (req, res, next) => {
    try {
        const productId = Number(req.body.product_id);
        const qty = Number(req.body.quantity);
        const back = productId ? `/buyer/product/${productId}#order` : '/buyer/browse';
        const product = productId ? await loadProduct(productId) : null;

        if (!product || !['Available', 'Approved'].includes(product.p_status)) return done(req, res, false, 'This crop is not available for ordering.', '/buyer/browse');
        if (!(qty > 0)) return done(req, res, false, 'Please enter a valid quantity.', back);
        if (qty < Number(product.min_order || 0)) return done(req, res, false, `Minimum order for this crop is ${Number(product.min_order)} ${product.unit}.`, back);
        if (qty > Number(product.quantity)) return done(req, res, false, `Only ${Number(product.quantity)} ${product.unit} is in stock.`, back);

        const buyer = await getBuyer(bid(req));
        const address = (req.body.delivery_address || '').trim() || [buyer.b_address, buyer.city, buyer.pincode].filter(Boolean).join(', ');
        if (!address) return done(req, res, false, 'Please enter a delivery address.', back);

        const price = Number(product.price);              // price is ALWAYS taken from the database, not from the form
        const total = Math.round(price * qty * 100) / 100;
        const r = await exe(
            `INSERT INTO orders (buyer_id, farmer_id, product_id, quantity, unit_price, total_amount, status, delivery_address, note)
             VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?)`,
            [bid(req), product.farmer_id, product.product_id, qty, price, total, address, (req.body.note || '').slice(0, 250)]);

        await notify('farmer', product.farmer_id, 'New order received',
            `${buyer.full_name} ordered ${qty} ${product.unit} of ${product.product_name} (₹${total.toLocaleString('en-IN')}).`);
        await notify('buyer', bid(req), 'Order placed', `Your order #KS-${r.insertId} for ${product.product_name} was sent to the farmer.`);
        return done(req, res, true, `Order #KS-${r.insertId} placed successfully! The farmer will confirm it soon.`, '/buyer/orders', { order_id: r.insertId });
    } catch (e) { next(e); }
});

// ------------------------------------------------------------------ 5. MY ORDERS
router.get(['/orders', '/my-orders', '/my-orders.html', '/my_orders'], async (req, res, next) => {
    try {
        const orders = await exe(`${ORDER_SQL} WHERE o.buyer_id = ? ORDER BY o.order_id DESC`, [bid(req)]);
        res.render('buyer/orders.ejs', { panel: 'buyer', title: 'My Orders', orders, stats: await buyerSummary(bid(req)) });
    } catch (e) { next(e); }
});

router.post(['/orders/:id/cancel', '/orders/cancel/:id'], async (req, res, next) => {
    try {
        const [o] = await exe('SELECT * FROM orders WHERE order_id = ? AND buyer_id = ?', [req.params.id, bid(req)]);
        if (!o) return done(req, res, false, 'Order not found.', '/buyer/orders');
        if (!canBuyerMove(o.status, 'cancelled')) return done(req, res, false, `A ${o.status} order cannot be cancelled.`, '/buyer/orders');
        await exe("UPDATE orders SET status = 'cancelled' WHERE order_id = ?", [o.order_id]);
        if (o.status === 'accepted') await exe('UPDATE products SET quantity = quantity + ? WHERE product_id = ?', [o.quantity, o.product_id]); // give stock back
        await notify('farmer', o.farmer_id, 'Order cancelled', `Buyer cancelled order #KS-${o.order_id}.`);
        return done(req, res, true, `Order #KS-${o.order_id} cancelled.`, '/buyer/orders', { status: 'cancelled' });
    } catch (e) { next(e); }
});

// Invoice (buyer copy – "Tax Invoice")
router.get('/orders/:id/invoice', async (req, res, next) => {
    try {
        const rows = await exe(
            `SELECT o.*, p.product_name, p.unit, f.full_name AS farmer_name, f.mobile AS farmer_mobile, f.farm_name, f.district AS farmer_district, f.state AS farmer_state,
                    b.full_name AS buyer_name, b.mobile AS buyer_mobile, b.email AS buyer_email, b.b_name, b.gst_number
             FROM orders o LEFT JOIN products p ON o.product_id = p.product_id LEFT JOIN farmers f ON o.farmer_id = f.id LEFT JOIN buyers b ON o.buyer_id = b.id
             WHERE o.order_id = ? AND o.buyer_id = ?`, [req.params.id, bid(req)]);
        if (!rows.length) return res.status(404).render('web/error.ejs', { code: 404, title: 'Invoice not found', message: 'We could not find this order.' });
        res.render('shared/invoice.ejs', { order: rows[0], kind: 'buyer', backUrl: '/buyer/orders' });
    } catch (e) { next(e); }
});

// ------------------------------------------------------------------ 6. ENQUIRIES (inquiry section)
router.get(['/enquiries', '/inquiries', '/send-enquiry', '/send-enquiry.html', '/send_enquiry'], async (req, res, next) => {
    try {
        const enquiries = await exe(`${ENQ_SQL} WHERE e.buyer_id = ? ORDER BY e.enquiry_id DESC`, [bid(req)]);
        const preselect = req.query.product_id ? await loadProduct(req.query.product_id) : null;
        res.render('buyer/enquiries.ejs', { panel: 'buyer', title: 'My Enquiries', enquiries, preselect, stats: await buyerSummary(bid(req)) });
    } catch (e) { next(e); }
});

// Used by BOTH the product page form and the enquiries page form
router.post(['/enquiries', '/send-enquiry', '/api/enquiry'], async (req, res, next) => {
    try {
        const productId = Number(req.body.product_id);
        const message = (req.body.message || '').trim();
        const qty = req.body.requested_quantity === '' || req.body.requested_quantity === undefined ? null : Number(req.body.requested_quantity);
        const back = req.body.return_to && req.body.return_to.startsWith('/buyer/') ? req.body.return_to : '/buyer/enquiries';

        const product = productId ? await loadProduct(productId) : null;
        if (!product) return done(req, res, false, 'Please choose a valid crop for your enquiry.', back);
        if (message.length < 5) return done(req, res, false, 'Please write a short message (at least 5 characters).', back);
        if (qty !== null && !(qty > 0)) return done(req, res, false, 'Requested quantity must be a positive number.', back);

        const buyer = await getBuyer(bid(req));
        const r = await exe(
            `INSERT INTO enquiries (buyer_id, farmer_id, product_id, message, requested_quantity, status) VALUES (?, ?, ?, ?, ?, 'pending')`,
            [bid(req), product.farmer_id, product.product_id, message.slice(0, 1000), qty]);
        await notify('farmer', product.farmer_id, 'New enquiry', `${buyer.full_name} asked about ${product.product_name}: "${message.slice(0, 80)}"`);
        return done(req, res, true, 'Your enquiry was sent to the farmer. You will see the reply here.', '/buyer/enquiries', { enquiry_id: r.insertId });
    } catch (e) { next(e); }
});

router.post('/enquiries/:id/close', async (req, res, next) => {
    try {
        await exe("UPDATE enquiries SET status = 'closed' WHERE enquiry_id = ? AND buyer_id = ?", [req.params.id, bid(req)]);
        return done(req, res, true, 'Enquiry closed.', '/buyer/enquiries');
    } catch (e) { next(e); }
});

// ------------------------------------------------------------------ 7. WISHLIST
router.get(['/wishlist', '/wishlist.html'], async (req, res, next) => {
    try {
        const items = await exe(
            `SELECT w.*, p.product_name, p.price, p.unit, p.p_location, p.p_img1, p.p_status, p.quantity, f.full_name AS farmer_name
             FROM wishlist w JOIN products p ON w.product_id = p.product_id LEFT JOIN farmers f ON p.farmer_id = f.id
             WHERE w.buyer_id = ? ORDER BY w.wishlist_id DESC`, [bid(req)]);
        res.render('buyer/wishlist.ejs', { panel: 'buyer', title: 'Wishlist', items });
    } catch (e) { next(e); }
});

router.post('/wishlist/toggle', async (req, res, next) => {
    try {
        const pid = Number(req.body.product_id);
        const ex = await exe('SELECT wishlist_id FROM wishlist WHERE buyer_id = ? AND product_id = ?', [bid(req), pid]);
        let saved;
        if (ex.length) { await exe('DELETE FROM wishlist WHERE wishlist_id = ?', [ex[0].wishlist_id]); saved = false; }
        else { await exe('INSERT INTO wishlist (buyer_id, product_id) VALUES (?, ?)', [bid(req), pid]); saved = true; }
        const [c] = await exe('SELECT COUNT(*) AS c FROM wishlist WHERE buyer_id = ?', [bid(req)]);
        if (wantsJson(req)) return res.json({ success: true, saved, count: c.c });
        return res.redirect(req.get('referer') || '/buyer/wishlist');
    } catch (e) { next(e); }
});

// ------------------------------------------------------------------ 8. PROFILE  (was "not showing")
router.get(['/profile', '/profile.html'], async (req, res, next) => {
    try {
        res.render('buyer/profile.ejs', { panel: 'buyer', title: 'My Profile', buyer: await getBuyer(bid(req)), stats: await buyerSummary(bid(req)) });
    } catch (e) { next(e); }
});

router.post('/profile', async (req, res, next) => {
    try {
        const b = req.body;
        const name = (b.full_name || '').trim(), mobile = (b.mobile || '').trim();
        if (!name) { flash(req, 'danger', 'Full name is required.'); return res.redirect('/buyer/profile'); }
        if (!/^[0-9+\-\s]{10,15}$/.test(mobile)) { flash(req, 'danger', 'Enter a valid mobile number (10–15 digits).'); return res.redirect('/buyer/profile'); }
        if (b.gst_number && !/^[0-9A-Za-z]{15}$/.test(b.gst_number.trim())) { flash(req, 'danger', 'GST number must be 15 characters.'); return res.redirect('/buyer/profile'); }
        await exe(
            `UPDATE buyers SET full_name = ?, mobile = ?, b_type = ?, b_name = ?, b_address = ?, city = ?, state = ?, pincode = ?, gst_number = ? WHERE id = ?`,
            [name, mobile, (b.b_type || 'Individual').trim(), (b.b_name || name).trim(), (b.b_address || '').trim() || 'India',
                (b.city || '').trim() || null, (b.state || '').trim() || null, (b.pincode || '').trim() || null,
                (b.gst_number || '').trim().toUpperCase() || null, bid(req)]);
        req.session.user.name = name;
        flash(req, 'success', 'Profile updated successfully.');
        res.redirect('/buyer/profile');
    } catch (e) { next(e); }
});

router.post('/profile/password', async (req, res, next) => {
    try {
        const { current_password = '', new_password = '', confirm_password = '' } = req.body;
        const buyer = await getBuyer(bid(req));
        if (!(await bcrypt.compare(current_password, buyer.b_password))) { flash(req, 'danger', 'Current password is incorrect.'); return res.redirect('/buyer/profile#security'); }
        if (new_password.length < 8) { flash(req, 'danger', 'New password must be at least 8 characters.'); return res.redirect('/buyer/profile#security'); }
        if (new_password !== confirm_password) { flash(req, 'danger', 'New passwords do not match.'); return res.redirect('/buyer/profile#security'); }
        await exe('UPDATE buyers SET b_password = ? WHERE id = ?', [await bcrypt.hash(new_password, 10), bid(req)]);
        flash(req, 'success', 'Password changed successfully.');
        res.redirect('/buyer/profile#security');
    } catch (e) { next(e); }
});

// ------------------------------------------------------------------ 9. SUPPORT (call / mail / text / ticket)
router.get(['/support', '/farmer-contact', '/farmer-contact.html', '/farmer_contact', '/help'], async (req, res, next) => {
    try {
        const tickets = await exe("SELECT * FROM complaints WHERE user_type = 'buyer' AND user_id = ? ORDER BY complaint_id DESC LIMIT 20", [bid(req)]);
        const orders = await exe('SELECT order_id FROM orders WHERE buyer_id = ? ORDER BY order_id DESC LIMIT 30', [bid(req)]);
        res.render('buyer/support.ejs', { panel: 'buyer', title: 'Help & Support', tickets, orders, buyer: await getBuyer(bid(req)) });
    } catch (e) { next(e); }
});

router.post('/support', async (req, res, next) => {
    try {
        const subject = (req.body.subject || '').trim(), description = (req.body.description || '').trim();
        if (subject.length < 3 || description.length < 10) { flash(req, 'danger', 'Please enter a subject and describe your problem (at least 10 characters).'); return res.redirect('/buyer/support#ticket'); }
        const orderId = Number(req.body.order_id) || null;
        if (orderId) {
            const own = await exe('SELECT 1 AS x FROM orders WHERE order_id = ? AND buyer_id = ?', [orderId, bid(req)]);
            if (!own.length) { flash(req, 'danger', 'Invalid order selected.'); return res.redirect('/buyer/support#ticket'); }
        }
        await exe(`INSERT INTO complaints (order_id, user_type, user_id, subject, description, status, contact_pref) VALUES (?, 'buyer', ?, ?, ?, 'open', ?)`,
            [orderId, bid(req), subject.slice(0, 200), description, ['email', 'phone', 'whatsapp'].includes(req.body.contact_pref) ? req.body.contact_pref : 'email']);
        await notify('buyer', bid(req), 'Support request received', `We received your request "${subject.slice(0, 60)}". Our team will contact you soon.`);
        flash(req, 'success', 'Support request submitted. Our team will contact you shortly.');
        res.redirect('/buyer/support#tickets');
    } catch (e) { next(e); }
});

// ------------------------------------------------------------------ 10. NOTIFICATIONS
router.get(['/notifications', '/notifications.html'], async (req, res, next) => {
    try {
        const notifications = await exe("SELECT * FROM notifications WHERE recipient_type = 'buyer' AND recipient_id = ? ORDER BY notification_id DESC LIMIT 100", [bid(req)]);
        res.render('buyer/notifications.ejs', { panel: 'buyer', title: 'Notifications', notifications });
    } catch (e) { next(e); }
});
router.post('/notifications/read', async (req, res, next) => {
    try {
        await exe("UPDATE notifications SET is_read = 1 WHERE recipient_type = 'buyer' AND recipient_id = ?", [bid(req)]);
        return done(req, res, true, 'All notifications marked as read.', '/buyer/notifications');
    } catch (e) { next(e); }
});

module.exports = router;
