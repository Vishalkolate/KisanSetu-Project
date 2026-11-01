const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const { exe } = require('../db');
const config = require('../lib/config');
const { requireFarmer, wantsJson } = require('../middleware/auth');
const { notify } = require('../lib/notify');
const { normalizeStatus, canFarmerMove, STATUSES } = require('../lib/orders');

const router = express.Router();

// ------------------------------------------------------------------ uploads
const MAX_MB = config.upload.maxImageMB;
const productDir = path.join(__dirname, '../public/uploads/products');
const kycDir = path.join(__dirname, '../public/uploads/kyc');
[productDir, kycDir].forEach(d => fs.mkdirSync(d, { recursive: true }));

const makeStorage = dir => multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname).toLowerCase()}`)
});
const IMG_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
const productUpload = multer({
    storage: makeStorage(productDir),
    limits: { fileSize: MAX_MB * 1024 * 1024, files: 3 },
    fileFilter: (req, file, cb) => IMG_TYPES.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only JPG, PNG or WEBP images are allowed.'))
}).fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }]);

const kycUpload = multer({
    storage: makeStorage(kycDir),
    limits: { fileSize: 3 * 1024 * 1024, files: 3 },
    fileFilter: (req, file, cb) => [...IMG_TYPES, 'application/pdf'].includes(file.mimetype) ? cb(null, true) : cb(new Error('KYC documents must be PDF, JPG or PNG.'))
}).fields([{ name: 'aadharFront', maxCount: 1 }, { name: 'aadharBack', maxCount: 1 }, { name: 'landRecord', maxCount: 1 }]);

/** Wrap multer so size/type errors become a friendly message instead of a crash page. */
function withUpload(mw, backUrl) {
    return (req, res, next) => mw(req, res, err => {
        if (!err) return next();
        const msg = err.code === 'LIMIT_FILE_SIZE' ? `Image is too large. Maximum allowed size is ${MAX_MB} MB per image.`
            : err.code === 'LIMIT_UNEXPECTED_FILE' ? 'Too many files selected.' : err.message;
        if (wantsJson(req)) return res.status(400).json({ success: false, message: msg });
        req.session.flash = { type: 'danger', msg };
        res.redirect(typeof backUrl === 'function' ? backUrl(req) : backUrl);
    });
}
const filesOf = req => Object.values(req.files || {}).flat();
const rmFile = p => { if (p) fs.unlink(p, () => { }); };
const rmUploaded = req => filesOf(req).forEach(f => rmFile(f.path));
const rmWeb = webPath => {
    if (!webPath) return;
    const full = path.join(productDir, path.basename(webPath));
    if (path.dirname(full) === productDir) rmFile(full);
};

router.use(requireFarmer);                       // every /farmer/* page needs a logged-in FARMER
const fid = req => req.session.user.id;
const flash = (req, type, msg) => { req.session.flash = { type, msg }; };
const done = (req, res, ok, msg, redirect, extra = {}) => {
    if (wantsJson(req)) return res.status(ok ? 200 : 400).json({ success: ok, message: msg, ...extra });
    flash(req, ok ? 'success' : 'danger', msg);
    return res.redirect(redirect);
};

// ------------------------------------------------------------------ data helpers
async function farmerSummary(id) {
    const products = await exe('SELECT p_status FROM products WHERE farmer_id = ?', [id]);
    const orders = await exe('SELECT status, total_amount FROM orders WHERE farmer_id = ?', [id]);
    const enq = await exe('SELECT status FROM enquiries WHERE farmer_id = ?', [id]);
    const [un] = await exe("SELECT COUNT(*) AS c FROM notifications WHERE recipient_type = 'farmer' AND recipient_id = ? AND is_read = 0", [id]);
    const sum = list => list.reduce((a, o) => a + Number(o.total_amount || 0), 0);
    const by = s => orders.filter(o => o.status === s);
    return {
        totalProducts: products.length,
        liveProducts: products.filter(p => ['Available', 'Approved'].includes(p.p_status)).length,
        pendingProducts: products.filter(p => p.p_status === 'Pending').length,
        totalOrders: orders.length,
        pendingOrders: by('pending').length,
        acceptedOrders: by('accepted').length,
        shippedOrders: by('shipped').length,
        deliveredOrders: by('delivered').length,
        cancelledOrders: by('cancelled').length + by('rejected').length,
        totalEarnings: sum(by('delivered')),                                   // money actually earned
        pipelineValue: sum([...by('pending'), ...by('accepted'), ...by('shipped')]),
        totalEnquiries: enq.length,
        pendingEnquiries: enq.filter(e => e.status === 'pending').length,
        unreadNotifications: un ? un.c : 0
    };
}
const ORDER_SQL = `SELECT o.*, b.full_name AS buyer_name, b.mobile AS buyer_mobile, b.b_name AS buyer_business, p.product_name, p.unit, p.p_img1
    FROM orders o LEFT JOIN buyers b ON o.buyer_id = b.id LEFT JOIN products p ON o.product_id = p.product_id`;

// ------------------------------------------------------------------ 1. DASHBOARD
router.get(['/', '/home', '/dashboard', '/dashboard.html'], async (req, res, next) => {
    try {
        const id = fid(req);
        const [stats, recentOrders, recentEnquiries, farmerRows] = await Promise.all([
            farmerSummary(id),
            exe(`${ORDER_SQL} WHERE o.farmer_id = ? ORDER BY o.order_id DESC LIMIT 6`, [id]),
            exe(`SELECT e.*, b.full_name AS buyer_name, p.product_name FROM enquiries e LEFT JOIN buyers b ON e.buyer_id = b.id
                 LEFT JOIN products p ON e.product_id = p.product_id WHERE e.farmer_id = ? ORDER BY e.enquiry_id DESC LIMIT 5`, [id]),
            exe('SELECT * FROM farmers WHERE id = ?', [id])
        ]);
        res.render('farmer/dashboard.ejs', { panel: 'farmer', title: 'Farmer Dashboard', farmer: farmerRows[0], stats, recentOrders, recentEnquiries });
    } catch (e) { next(e); }
});

router.get('/api/summary', async (req, res) => {
    try {
        const id = fid(req);
        const [stats, orders, enquiries] = await Promise.all([
            farmerSummary(id),
            exe(`${ORDER_SQL} WHERE o.farmer_id = ? ORDER BY o.order_id DESC LIMIT 6`, [id]),
            exe(`SELECT e.*, b.full_name AS buyer_name, p.product_name FROM enquiries e LEFT JOIN buyers b ON e.buyer_id = b.id
                 LEFT JOIN products p ON e.product_id = p.product_id WHERE e.farmer_id = ? ORDER BY e.enquiry_id DESC LIMIT 5`, [id])
        ]);
        res.json({ success: true, stats, orders, enquiries, at: Date.now() });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ------------------------------------------------------------------ 2. PRODUCTS
router.get(['/products', '/products.html'], async (req, res, next) => {
    try {
        const [products, categories] = await Promise.all([
            exe(`SELECT p.*, c.category_name FROM products p LEFT JOIN categories c ON p.category_id = c.category_id
                 WHERE p.farmer_id = ? AND p.p_status <> 'Archived' ORDER BY p.product_id DESC`, [fid(req)]),
            exe('SELECT * FROM categories ORDER BY category_name')
        ]);
        res.render('farmer/products.ejs', { panel: 'farmer', title: 'My Products', products, categories, maxMB: MAX_MB });
    } catch (e) { next(e); }
});

router.get('/add_product', async (req, res, next) => {
    try {
        res.render('farmer/add_product.ejs', { panel: 'farmer', title: 'Add Product', categories: await exe('SELECT * FROM categories ORDER BY category_name'), maxMB: MAX_MB });
    } catch (e) { next(e); }
});

async function resolveCategory(body) {
    const raw = body.category_id || body.category;
    if (!raw) return null;
    const rows = isNaN(raw)
        ? await exe('SELECT category_id FROM categories WHERE LOWER(category_name) = LOWER(?) LIMIT 1', [raw])
        : await exe('SELECT category_id FROM categories WHERE category_id = ? LIMIT 1', [Number(raw)]);
    return rows.length ? rows[0].category_id : null;
}

router.post('/products/add', withUpload(productUpload, '/farmer/add_product'), async (req, res, next) => {
    try {
        const b = req.body;
        const name = (b.productName || b.product_name || '').trim();
        const price = Number(b.price), qty = Number(b.quantity), minOrder = Number(b.min_order || 1);
        const catId = await resolveCategory(b);
        const problems = [];
        if (!name) problems.push('Product name is required.');
        if (!catId) problems.push('Please select a category.');
        if (!(price > 0)) problems.push('Price must be greater than zero.');
        if (!(qty > 0)) problems.push('Quantity must be greater than zero.');
        if (!b.unit) problems.push('Please select a unit.');
        if (!req.files || !req.files.image1) problems.push('Please upload at least the main product photo (JPG/PNG, max ' + MAX_MB + ' MB).');
        if (problems.length) { rmUploaded(req); flash(req, 'danger', problems.join(' ')); return res.redirect('/farmer/add_product'); }

        const img = n => (req.files[`image${n}`] ? '/uploads/products/' + req.files[`image${n}`][0].filename : null);
        await exe(
            `INSERT INTO products (farmer_id, category_id, product_name, description, price, quantity, unit, p_location, min_order, p_img1, p_img2, p_img3, p_status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
            [fid(req), catId, name, (b.description || '').trim(), price, qty, b.unit, (b.location || b.p_location || '').trim() || null,
                minOrder > 0 ? minOrder : 1, img(1), img(2), img(3)]);
        flash(req, 'success', 'Product submitted. It will appear to buyers once the admin approves it.');
        res.redirect('/farmer/products');
    } catch (e) { rmUploaded(req); next(e); }
});

router.get('/product_edit/:id', async (req, res, next) => {
    try {
        const rows = await exe(`SELECT p.*, c.category_name FROM products p LEFT JOIN categories c ON p.category_id = c.category_id
                                WHERE p.product_id = ? AND p.farmer_id = ? LIMIT 1`, [req.params.id, fid(req)]);
        if (!rows.length) { flash(req, 'danger', 'Product not found.'); return res.redirect('/farmer/products'); }
        res.render('farmer/product_edit.ejs', { panel: 'farmer', title: 'Edit Product', product: rows[0], categories: await exe('SELECT * FROM categories ORDER BY category_name'), maxMB: MAX_MB });
    } catch (e) { next(e); }
});

router.post('/products/update', withUpload(productUpload, req => `/farmer/product_edit/${req.body.productId || ''}`), async (req, res, next) => {
    try {
        const b = req.body;
        const [old] = await exe('SELECT * FROM products WHERE product_id = ? AND farmer_id = ?', [b.productId, fid(req)]);
        if (!old) { rmUploaded(req); flash(req, 'danger', 'Product not found.'); return res.redirect('/farmer/products'); }

        const name = (b.productName || b.product_name || '').trim();
        const price = Number(b.price), qty = Number(b.quantity);
        const catId = (await resolveCategory(b)) || old.category_id;
        if (!name || !(price > 0) || !(qty >= 0) || !b.unit) {
            rmUploaded(req); flash(req, 'danger', 'Please fill name, price, quantity and unit correctly.');
            return res.redirect(`/farmer/product_edit/${old.product_id}`);
        }

        // Image handling – EVERY slot is optional. A slot changes only if a new file was chosen or "remove" was ticked.
        const slots = [old.p_img1, old.p_img2, old.p_img3];
        const toDelete = [];
        for (let i = 1; i <= 3; i++) {
            const f = req.files && req.files[`image${i}`] ? req.files[`image${i}`][0] : null;
            if (f) { if (slots[i - 1]) toDelete.push(slots[i - 1]); slots[i - 1] = '/uploads/products/' + f.filename; }
            else if (b[`remove_image${i}`] && slots[i - 1]) { toDelete.push(slots[i - 1]); slots[i - 1] = null; }
        }
        const compact = slots.filter(Boolean);                       // keep main image first, no gaps
        const imgs = [compact[0] || null, compact[1] || null, compact[2] || null];

        // A rejected product goes back to review after the farmer edits it
        const newStatus = old.p_status === 'Rejected' ? 'Pending' : old.p_status;
        await exe(
            `UPDATE products SET category_id = ?, product_name = ?, description = ?, price = ?, quantity = ?, unit = ?, p_location = ?, min_order = ?,
                    p_img1 = ?, p_img2 = ?, p_img3 = ?, p_status = ? WHERE product_id = ? AND farmer_id = ?`,
            [catId, name, (b.description || '').trim(), price, qty, b.unit, (b.location || b.p_location || old.p_location || '').trim() || null,
                Number(b.min_order) > 0 ? Number(b.min_order) : (old.min_order || 1), imgs[0], imgs[1], imgs[2], newStatus, old.product_id, fid(req)]);
        toDelete.forEach(rmWeb);
        flash(req, 'success', 'Product updated.');
        res.redirect('/farmer/products');
    } catch (e) { rmUploaded(req); next(e); }
});

// Mark sold out / back in stock
router.post('/products/:id/toggle', async (req, res, next) => {
    try {
        const [p] = await exe('SELECT p_status FROM products WHERE product_id = ? AND farmer_id = ?', [req.params.id, fid(req)]);
        if (!p) return done(req, res, false, 'Product not found.', '/farmer/products');
        if (!['Approved', 'Available', 'Sold Out'].includes(p.p_status)) return done(req, res, false, 'Only approved products can be switched.', '/farmer/products');
        const next_ = p.p_status === 'Sold Out' ? 'Approved' : 'Sold Out';
        await exe('UPDATE products SET p_status = ? WHERE product_id = ?', [next_, req.params.id]);
        return done(req, res, true, next_ === 'Sold Out' ? 'Marked as sold out.' : 'Product is back in stock.', '/farmer/products', { status: next_ });
    } catch (e) { next(e); }
});

router.post(['/products/delete/:id', '/products/:id/delete'], async (req, res, next) => {
    try {
        const [p] = await exe('SELECT * FROM products WHERE product_id = ? AND farmer_id = ?', [req.params.id, fid(req)]);
        if (!p) return done(req, res, false, 'Product not found.', '/farmer/products');
        const [used] = await exe('SELECT COUNT(*) AS c FROM orders WHERE product_id = ?', [p.product_id]);
        if (used.c > 0) {   // never delete a product that has orders (would wipe order history) – hide it instead
            await exe("UPDATE products SET p_status = 'Archived' WHERE product_id = ?", [p.product_id]);
            return done(req, res, true, 'Product has past orders, so it was archived (hidden from buyers) instead of deleted.', '/farmer/products');
        }
        await exe('DELETE FROM products WHERE product_id = ?', [p.product_id]);
        [p.p_img1, p.p_img2, p.p_img3].forEach(rmWeb);
        return done(req, res, true, 'Product deleted.', '/farmer/products');
    } catch (e) { next(e); }
});

// ------------------------------------------------------------------ 3. ORDERS + STATUS ACTION
router.get(['/orders', '/orders.html'], async (req, res, next) => {
    try {
        const orders = await exe(`${ORDER_SQL} WHERE o.farmer_id = ? ORDER BY o.order_id DESC`, [fid(req)]);
        res.render('farmer/orders.ejs', { panel: 'farmer', title: 'Orders', orders, stats: await farmerSummary(fid(req)) });
    } catch (e) { next(e); }
});

router.post(['/orders/:id/status', '/orders/status/:id'], async (req, res, next) => {
    try {
        const to = normalizeStatus(req.body.status);
        const back = '/farmer/orders';
        if (!STATUSES.includes(to)) return done(req, res, false, 'Unknown status.', back);
        const [o] = await exe('SELECT * FROM orders WHERE order_id = ? AND farmer_id = ?', [req.params.id, fid(req)]);
        if (!o) return done(req, res, false, 'Order not found.', back);
        if (o.status === to) return done(req, res, true, 'Order already has this status.', back, { status: to });
        if (!canFarmerMove(o.status, to)) return done(req, res, false, `Cannot change an order from "${o.status}" to "${to}".`, back);

        if (to === 'accepted') {          // reserve stock
            const [p] = await exe('SELECT quantity, product_name FROM products WHERE product_id = ?', [o.product_id]);
            if (!p || Number(p.quantity) < Number(o.quantity)) return done(req, res, false, 'Not enough stock to accept this order. Update your product quantity first.', back);
            await exe('UPDATE products SET quantity = quantity - ? WHERE product_id = ?', [o.quantity, o.product_id]);
        }
        if (to === 'cancelled' && o.status === 'accepted') await exe('UPDATE products SET quantity = quantity + ? WHERE product_id = ?', [o.quantity, o.product_id]);

        if (to === 'delivered') await exe("UPDATE orders SET status = ?, delivered_at = ?, payment_status = 'paid' WHERE order_id = ?", [to, new Date(), o.order_id]);
        else await exe('UPDATE orders SET status = ? WHERE order_id = ?', [to, o.order_id]);

        const text = { accepted: 'accepted', rejected: 'rejected', shipped: 'dispatched', delivered: 'marked as delivered', cancelled: 'cancelled' }[to];
        await notify('buyer', o.buyer_id, `Order ${text}`, `Your order #KS-${o.order_id} was ${text} by the farmer.`);
        return done(req, res, true, `Order #KS-${o.order_id} ${text}.`, back, { status: to });
    } catch (e) { next(e); }
});

router.get('/orders/:id/invoice', async (req, res, next) => {
    try {
        const rows = await exe(
            `SELECT o.*, p.product_name, p.unit, f.full_name AS farmer_name, f.mobile AS farmer_mobile, f.farm_name, f.district AS farmer_district, f.state AS farmer_state,
                    b.full_name AS buyer_name, b.mobile AS buyer_mobile, b.email AS buyer_email, b.b_name, b.gst_number
             FROM orders o LEFT JOIN products p ON o.product_id = p.product_id LEFT JOIN farmers f ON o.farmer_id = f.id LEFT JOIN buyers b ON o.buyer_id = b.id
             WHERE o.order_id = ? AND o.farmer_id = ?`, [req.params.id, fid(req)]);
        if (!rows.length) return res.status(404).render('web/error.ejs', { code: 404, title: 'Invoice not found', message: 'We could not find this order.' });
        res.render('shared/invoice.ejs', { order: rows[0], kind: 'farmer', backUrl: '/farmer/orders' });
    } catch (e) { next(e); }
});

router.get(['/order_history', '/order_history.html'], async (req, res, next) => {
    try {
        const orders = await exe(`${ORDER_SQL} WHERE o.farmer_id = ? AND o.status IN ('delivered','cancelled','rejected') ORDER BY o.order_id DESC`, [fid(req)]);
        res.render('farmer/order_history.ejs', { panel: 'farmer', title: 'Order History', orders });
    } catch (e) { next(e); }
});

// ------------------------------------------------------------------ 4. SALES REPORT (delivered orders counted correctly)
async function salesData(id, months) {
    const rows = await exe(`SELECT o.order_id, o.status, o.total_amount, o.quantity, o.created_at, o.delivered_at, o.updated_at, p.product_name, p.unit
                            FROM orders o LEFT JOIN products p ON o.product_id = p.product_id WHERE o.farmer_id = ?`, [id]);
    const delivered = rows.filter(o => o.status === 'delivered');
    const when = o => new Date(o.delivered_at || o.updated_at || o.created_at);
    const now = new Date();
    const labels = [], revenue = [], count = [];
    for (let i = months - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const inMonth = delivered.filter(o => { const w = when(o); return w.getFullYear() === d.getFullYear() && w.getMonth() === d.getMonth(); });
        labels.push(d.toLocaleString('en-IN', { month: 'short', year: '2-digit' }));
        revenue.push(inMonth.reduce((a, o) => a + Number(o.total_amount), 0));
        count.push(inMonth.length);
    }
    const prod = {};
    delivered.forEach(o => { const k = o.product_name || 'Unknown'; prod[k] = prod[k] || { name: k, qty: 0, revenue: 0, orders: 0, unit: o.unit }; prod[k].qty += Number(o.quantity); prod[k].revenue += Number(o.total_amount); prod[k].orders++; });
    const totalRevenue = delivered.reduce((a, o) => a + Number(o.total_amount), 0);
    const statusCounts = {};
    STATUSES.forEach(s => statusCounts[s] = rows.filter(o => o.status === s).length);
    return {
        labels, revenue, count, statusCounts,
        deliveredOrders: delivered.length, totalOrders: rows.length, totalRevenue,
        avgOrder: delivered.length ? totalRevenue / delivered.length : 0,
        pipeline: rows.filter(o => ['pending', 'accepted', 'shipped'].includes(o.status)).reduce((a, o) => a + Number(o.total_amount), 0),
        topProducts: Object.values(prod).sort((a, b) => b.revenue - a.revenue).slice(0, 5)
    };
}
router.get(['/sales_report', '/sales_report.html'], async (req, res, next) => {
    try {
        const months = [3, 6, 12].includes(Number(req.query.months)) ? Number(req.query.months) : 6;
        res.render('farmer/sales_report.ejs', { panel: 'farmer', title: 'Sales Report', data: await salesData(fid(req), months), months });
    } catch (e) { next(e); }
});
router.get('/api/sales', async (req, res) => {
    try {
        const months = [3, 6, 12].includes(Number(req.query.months)) ? Number(req.query.months) : 6;
        res.json({ success: true, data: await salesData(fid(req), months) });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ------------------------------------------------------------------ 5. ENQUIRIES
router.get(['/enquiry', '/enquiry.html', '/enquiries'], async (req, res, next) => {
    try {
        const enquiries = await exe(
            `SELECT e.*, b.full_name AS buyer_name, b.mobile AS buyer_mobile, b.b_address AS buyer_location, p.product_name, p.unit
             FROM enquiries e LEFT JOIN buyers b ON e.buyer_id = b.id LEFT JOIN products p ON e.product_id = p.product_id
             WHERE e.farmer_id = ? ORDER BY e.enquiry_id DESC`, [fid(req)]);
        res.render('farmer/enquiry.ejs', { panel: 'farmer', title: 'Enquiries', enquiries });
    } catch (e) { next(e); }
});

router.post(['/enquiry/:id/respond', '/enquiry/respond/:id'], async (req, res, next) => {
    try {
        const reply = (req.body.replyMessage || req.body.reply || '').trim();
        if (reply.length < 2) return done(req, res, false, 'Please type a reply.', '/farmer/enquiry');
        const [e] = await exe('SELECT * FROM enquiries WHERE enquiry_id = ? AND farmer_id = ?', [req.params.id, fid(req)]);
        if (!e) return done(req, res, false, 'Enquiry not found.', '/farmer/enquiry');
        await exe("UPDATE enquiries SET status = 'responded', reply_message = ?, replied_at = ? WHERE enquiry_id = ?", [reply.slice(0, 1000), new Date(), e.enquiry_id]);
        await notify('buyer', e.buyer_id, 'Farmer replied to your enquiry', reply.slice(0, 120));
        return done(req, res, true, 'Reply sent to the buyer.', '/farmer/enquiry');
    } catch (err) { next(err); }
});

// ------------------------------------------------------------------ 6. PROFILE / PASSWORD / KYC
router.get(['/profile', '/profile.html'], async (req, res, next) => {
    try {
        const [farmer] = await exe('SELECT * FROM farmers WHERE id = ?', [fid(req)]);
        res.render('farmer/profile.ejs', { panel: 'farmer', title: 'My Profile', farmer, stats: await farmerSummary(fid(req)) });
    } catch (e) { next(e); }
});
router.post('/profile/update', async (req, res, next) => {
    try {
        const b = req.body;
        const name = (b.fullName || '').trim(), mobile = (b.mobile || '').trim();
        if (!name || !/^[0-9+\-\s]{10,15}$/.test(mobile)) { flash(req, 'danger', 'Enter your name and a valid mobile number.'); return res.redirect('/farmer/profile'); }
        await exe('UPDATE farmers SET full_name = ?, mobile = ?, farm_name = ?, state = ?, district = ?, address = ? WHERE id = ?',
            [name, mobile, (b.farmName || '').trim() || 'Farm', (b.state || '').trim(), (b.district || '').trim(), (b.address || '').trim() || null, fid(req)]);
        req.session.user.name = name;
        flash(req, 'success', 'Profile updated successfully.');
        res.redirect('/farmer/profile');
    } catch (e) { next(e); }
});
router.post('/profile/password', async (req, res, next) => {
    try {
        const { current_password = '', new_password = '', confirm_password = '' } = req.body;
        const [f] = await exe('SELECT f_password FROM farmers WHERE id = ?', [fid(req)]);
        if (!(await bcrypt.compare(current_password, f.f_password))) { flash(req, 'danger', 'Current password is incorrect.'); return res.redirect('/farmer/profile'); }
        if (new_password.length < 8 || new_password !== confirm_password) { flash(req, 'danger', 'New password must be 8+ characters and both fields must match.'); return res.redirect('/farmer/profile'); }
        await exe('UPDATE farmers SET f_password = ? WHERE id = ?', [await bcrypt.hash(new_password, 10), fid(req)]);
        flash(req, 'success', 'Password changed successfully.');
        res.redirect('/farmer/profile');
    } catch (e) { next(e); }
});

router.get(['/kyc_docs', '/kyc_docs.html', '/kyc'], async (req, res, next) => {
    try {
        const [docs, [farmer]] = await Promise.all([exe('SELECT * FROM kyc_documents WHERE farmer_id = ? ORDER BY kyc_id DESC', [fid(req)]), exe('SELECT kyc_status FROM farmers WHERE id = ?', [fid(req)])]);
        res.render('farmer/kyc_docs.ejs', { panel: 'farmer', title: 'KYC Documents', docs, kycStatus: farmer ? farmer.kyc_status : 'pending' });
    } catch (e) { next(e); }
});
router.post('/kyc/submit', withUpload(kycUpload, '/farmer/kyc_docs'), async (req, res, next) => {
    try {
        const num = (req.body.aadharNumber || '').replace(/\s/g, '');
        if (!/^\d{12}$/.test(num)) { rmUploaded(req); flash(req, 'danger', 'Aadhaar number must be 12 digits.'); return res.redirect('/farmer/kyc_docs'); }
        if (!req.files || !req.files.aadharFront) { rmUploaded(req); flash(req, 'danger', 'Please upload the front side of your Aadhaar card.'); return res.redirect('/farmer/kyc_docs'); }
        const add = (type, file, number) => exe(
            `INSERT INTO kyc_documents (farmer_id, document_type, document_number, document_file_path, verification_status) VALUES (?, ?, ?, ?, 'pending')`,
            [fid(req), type, number || null, '/uploads/kyc/' + file.filename]);
        await add('Aadhaar Card (Front)', req.files.aadharFront[0], num);
        if (req.files.aadharBack) await add('Aadhaar Card (Back)', req.files.aadharBack[0], num);
        if (req.files.landRecord) await add('Land Record (7/12)', req.files.landRecord[0], null);
        await exe("UPDATE farmers SET kyc_status = 'pending' WHERE id = ?", [fid(req)]);
        flash(req, 'success', 'KYC documents submitted. The admin will verify them soon.');
        res.redirect('/farmer/kyc_docs');
    } catch (e) { rmUploaded(req); next(e); }
});

// ------------------------------------------------------------------ 7. NOTIFICATIONS
router.get(['/notifications', '/notifications.html'], async (req, res, next) => {
    try {
        const notifications = await exe("SELECT * FROM notifications WHERE recipient_type = 'farmer' AND recipient_id = ? ORDER BY notification_id DESC LIMIT 100", [fid(req)]);
        res.render('farmer/notifications.ejs', { panel: 'farmer', title: 'Notifications', notifications });
    } catch (e) { next(e); }
});
router.post('/notifications/read', async (req, res, next) => {
    try {
        await exe("UPDATE notifications SET is_read = 1 WHERE recipient_type = 'farmer' AND recipient_id = ?", [fid(req)]);
        return done(req, res, true, 'All notifications marked as read.', '/farmer/notifications');
    } catch (e) { next(e); }
});

router.get('/logout', (req, res) => req.session.destroy(() => res.redirect('/')));

module.exports = router;
