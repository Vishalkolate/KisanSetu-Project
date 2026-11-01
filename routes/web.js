const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const { exe } = require('../db');

const router = express.Router();

// Helper: handle duplicate email errors
function isDuplicateEmail(error) {
    return error && error.code === 'ER_DUP_ENTRY';
}


// Show registration errors as a nice alert on the form page (instead of a blank white text page)
function regFail(req, res, backPath, message) {
    req.session.flash = { type: 'danger', msg: message };
    return res.redirect(backPath);
}

// ==================== PUBLIC PAGES ====================

router.get(['/', '/home', '/home.html'], async (req, res) => {
    try {
        const latestProducts = await exe(
            `SELECT p.*, c.category_name, f.full_name AS farmer_name, f.district, f.state
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.category_id
             LEFT JOIN farmers f ON p.farmer_id = f.id
             WHERE p.p_status IN ('Available', 'Approved')
             ORDER BY p.product_id DESC LIMIT 8`
        );
        const categories = await exe('SELECT * FROM categories ORDER BY category_name ASC');
        res.render('web/home.ejs', { products: latestProducts || [], categories: categories || [] });
    } catch (err) {
        console.error('Web home error:', err);
        res.render('web/home.ejs', { products: [], categories: [] });
    }
});

router.get('/about', (req, res) => {
    res.render('web/about.ejs');
});

router.get(['/products', '/products.html'], async (req, res) => {
    try {
        const { search, category, district, min = '', max = '', sort = 'new' } = req.query;
        let sql = `SELECT p.*, c.category_name, f.full_name AS farmer_name, f.mobile AS farmer_mobile, f.district, f.state
                   FROM products p
                   LEFT JOIN categories c ON p.category_id = c.category_id
                   LEFT JOIN farmers f ON p.farmer_id = f.id
                   WHERE p.p_status IN ('Available', 'Approved')`;
        const params = [];

        if (category && category !== 'all' && category !== '') {
            sql += ` AND (LOWER(c.category_name) = LOWER(?) OR c.category_id = ?)`;
            params.push(category, isNaN(category) ? -1 : Number(category));
        }

        if (district && district.trim()) {
            sql += ` AND (LOWER(f.district) LIKE ? OR LOWER(p.p_location) LIKE ?)`;
            params.push(`%${district.trim().toLowerCase()}%`, `%${district.trim().toLowerCase()}%`);
        }

        if (search && search.trim()) {
            sql += ` AND (LOWER(p.product_name) LIKE ? OR LOWER(c.category_name) LIKE ? OR LOWER(f.full_name) LIKE ? OR LOWER(p.description) LIKE ?)`;
            const kw = `%${search.trim().toLowerCase()}%`;
            params.push(kw, kw, kw, kw);
        }

        if (min !== '' && !isNaN(min)) { sql += ' AND p.price >= ?'; params.push(Number(min)); }
        if (max !== '' && !isNaN(max)) { sql += ' AND p.price <= ?'; params.push(Number(max)); }
        sql += { low: ' ORDER BY p.price ASC', high: ' ORDER BY p.price DESC', name: ' ORDER BY p.product_name ASC' }[sort] || ' ORDER BY p.product_id DESC';

        const products = await exe(sql, params);
        const categories = await exe('SELECT * FROM categories ORDER BY category_name ASC');

        res.render('web/products.ejs', {
            products: products || [],
            categories: categories || [],
            selectedCategory: category || 'all',
            searchKeyword: search || '',
            selectedDistrict: district || '',
            filters: { min, max, sort }
        });
    } catch (err) {
        console.error('Web products error:', err);
        res.render('web/products.ejs', {
            products: [],
            categories: [],
            selectedCategory: 'all',
            searchKeyword: '',
            selectedDistrict: '',
            filters: { min: '', max: '', sort: 'new' }
        });
    }
});

router.get(['/products/:id', '/product_details/:id'], async (req, res) => {
    try {
        const prodId = req.params.id;
        const rows = await exe(
            `SELECT p.*, c.category_name, f.full_name AS farmer_name, f.mobile AS farmer_mobile, f.district, f.state
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.category_id
             LEFT JOIN farmers f ON p.farmer_id = f.id
             WHERE p.product_id = ? LIMIT 1`,
            [prodId]
        );
        const product = rows.length ? rows[0] : null;
        let relatedProducts = [];
        if (product && product.category_id) {
            relatedProducts = await exe(
                `SELECT p.*, c.category_name, f.full_name AS farmer_name, f.district, f.state
                 FROM products p
                 LEFT JOIN categories c ON p.category_id = c.category_id
                 LEFT JOIN farmers f ON p.farmer_id = f.id
                 WHERE p.category_id = ? AND p.product_id != ? AND p.p_status IN ('Available', 'Approved')
                 ORDER BY p.product_id DESC LIMIT 3`,
                [product.category_id, prodId]
            );
        }
        const u = req.session && req.session.user;
        res.render('web/product_details.ejs', {
            product, relatedProducts: relatedProducts || [], id: prodId,
            isFarmer: !!(u && u.role === 'farmer'),
            isOwner: !!(u && u.role === 'farmer' && product && product.farmer_id === u.id),
            isBuyer: !!(u && u.role === 'buyer')
        });
    } catch (err) {
        console.error('Product details error:', err);
        res.render('web/product_details.ejs', { product: null, relatedProducts: [], id: req.params.id, isFarmer: false, isOwner: false, isBuyer: false });
    }
});

router.get('/set-return', (req, res) => {
    const to = String(req.query.to || '');
    if (to.startsWith('/buyer/product/')) req.session.returnTo = to;
    res.json({ ok: true });
});

router.get('/product_details', async (req, res) => {
    if (req.query.id) {
        return res.redirect(`/products/${encodeURIComponent(req.query.id)}`);
    }
    res.redirect('/products');
});

router.get('/contact', (req, res) => {
    res.render('web/contact.ejs');
});

router.post('/contact_save', async (req, res) => {
    try {
        const b = req.body;
        const name = (b.c_name || b.name || '').trim();
        const message = (b.message || '').trim();
        if (!name || !message) return res.redirect('/contact?error=1');
        const extra = [b.mobile ? `Mobile: ${b.mobile}` : '', b.user_type ? `Role: ${b.user_type}` : ''].filter(Boolean).join(' | ');
        await exe(
            'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [name.slice(0, 100), (b.email || '').trim().slice(0, 120), (b.subject_department || b.subject || '').slice(0, 200), (extra ? extra + '\n' : '') + message]
        );
        res.redirect('/contact?success=1');
    } catch (err) {
        console.error('Contact message save error:', err);
        res.redirect('/contact?error=1');
    }
});

router.get('/privacy', (req, res) => {
    res.render('web/privacy.ejs');
});

router.get('/terms', (req, res) => {
    res.render('web/terms.ejs');
});

// ==================== FARMER REGISTRATION ====================

router.get(['/farmer_register', '/farmer-register', '/register/farmer'], (req, res) => {
    res.render('web/farmer-register.ejs');
});

router.post('/farmer_register_save', async (req, res) => {
    try {
        const {
            full_name,
            fullName,
            mobile,
            email,
            farm_name,
            farmName,
            state,
            district,
            f_password,
            password
        } = req.body;

        const name = (full_name || fullName || '').trim();
        const mob = (mobile || '').trim();
        const mail = (email || '').trim().toLowerCase();
        const st = (state || '').trim();
        const dist = (district || '').trim();
        const pass = f_password || password || '';
        const farm = (farm_name || farmName || '').trim() || (name ? `${name}'s Farm` : 'My Farm');

        if (!name || !mob || !mail || !st || !dist || !pass) {
            return regFail(req, res, '/farmer_register', 
                'Please fill in all required farmer registration fields.'
            );
        }

        if (pass.length < 8) {
            return regFail(req, res, '/farmer_register', 
                'Password must contain at least 8 characters.'
            );
        }

        const hashedPassword = await bcrypt.hash(pass, 12);

        // Try inserting with farm_name; if the table doesn't have farm_name, insert without it
        try {
            const sql = `
                INSERT INTO farmers
                (full_name, mobile, email, farm_name, state, district, f_password)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            await exe(sql, [
                name,
                mob,
                mail,
                farm,
                st,
                dist,
                hashedPassword
            ]);
        } catch (insertErr) {
            // If column 'farm_name' is missing in existing table, fallback to old schema insert
            if (insertErr.code === 'ER_BAD_FIELD_ERROR' && insertErr.message.includes('farm_name')) {
                const fallbackSql = `
                    INSERT INTO farmers
                    (full_name, mobile, email, state, district, f_password)
                    VALUES (?, ?, ?, ?, ?, ?)
                `;
                await exe(fallbackSql, [
                    name,
                    mob,
                    mail,
                    st,
                    dist,
                    hashedPassword
                ]);
            } else {
                throw insertErr;
            }
        }

        return res.redirect('/login/farmer?registered=1');

    } catch (error) {
        console.error('Farmer registration error:', error);

        if (isDuplicateEmail(error)) {
            return regFail(req, res, '/farmer_register', 
                'This farmer email is already registered. Please use another email.'
            );
        }

        return regFail(req, res, '/farmer_register', 
            'Farmer registration failed: ' + (error.sqlMessage || error.message)
        );
    }
});

// ==================== BUYER REGISTRATION ====================

router.get(['/buyer_register', '/buyer-register', '/register/buyer'], (req, res) => {
    res.render('web/buyer-register.ejs');
});

router.post('/buyer_register_save', async (req, res) => {
    try {
        const {
            fullName,
            full_name,
            mobile,
            email,
            buyerType,
            b_type,
            businessName,
            b_name,
            cityAddress,
            b_address,
            password,
            b_password,
            confirmPassword
        } = req.body;

        const name = (fullName || full_name || '').trim();
        const mob = (mobile || '').trim();
        const mail = (email || '').trim().toLowerCase();
        const type = (buyerType || b_type || 'Individual').trim();
        const bName = (businessName || b_name || `${name} Traders`).trim();
        const address = (cityAddress || b_address || 'India').trim();
        const pass = password || b_password || '';

        if (!name || !mob || !mail || !pass) {
            return regFail(req, res, '/buyer_register', 
                'Please fill in all required buyer registration fields.'
            );
        }

        if (pass.length < 8) {
            return regFail(req, res, '/buyer_register', 
                'Password must contain at least 8 characters.'
            );
        }

        if (confirmPassword && pass !== confirmPassword) {
            return regFail(req, res, '/buyer_register', 
                'Passwords do not match. Please go back and try again.'
            );
        }

        const hashedPassword = await bcrypt.hash(pass, 12);

        const sql = `
            INSERT INTO buyers
            (full_name, mobile, email, b_type, b_name, b_address, b_password)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        await exe(sql, [
            name,
            mob,
            mail,
            type,
            bName,
            address,
            hashedPassword
        ]);

        return res.redirect('/login/buyer?registered=1');

    } catch (error) {
        console.error('Buyer registration error:', error);

        if (isDuplicateEmail(error)) {
            return regFail(req, res, '/buyer_register', 
                'This buyer email is already registered. Please use another email.'
            );
        }

        return regFail(req, res, '/buyer_register', 
            'Buyer registration failed: ' + (error.sqlMessage || error.message)
        );
    }
});

// ==================== LOGIN PAGES ====================

function loginPage(role) {
    return (req, res) => {
        const u = req.session && req.session.user;
        if (u) return res.redirect(u.role === 'farmer' ? '/farmer/dashboard' : '/buyer/dashboard');
        res.render('web/login.ejs', { role, error: req.query.error || null });
    };
}
router.get(['/login', '/login.html'], (req, res) => loginPage(req.query.role === 'farmer' ? 'farmer' : 'buyer')(req, res));
router.get(['/login/farmer', '/farmer/login', '/farmer-login'], loginPage('farmer'));
router.get(['/login/buyer', '/buyer/login', '/buyer-login'], loginPage('buyer'));

// ==================== LOGIN HANDLERS ====================

async function loginUser(req, res, role) {
    const fail = (code, msg) => {
        if ((req.headers.accept || '').includes('json')) return res.status(code).json({ success: false, message: msg });
        return res.status(code).render('web/login.ejs', { role, error: msg });
    };
    try {
        const { email, password } = req.body;
        if (!email?.trim() || !password) return fail(400, 'Please enter both email and password.');

        const table = role === 'farmer' ? 'farmers' : 'buyers';
        const passCol = role === 'farmer' ? 'f_password' : 'b_password';
        const rows = await exe(`SELECT id, full_name, email, status, ${passCol} AS pass FROM ${table} WHERE email = ? LIMIT 1`, [email.trim().toLowerCase()]);
        if (!rows.length || !(await bcrypt.compare(password, rows[0].pass))) return fail(401, 'Invalid email or password.');
        if (rows[0].status === 'blocked') return fail(403, 'Your account has been blocked. Please contact support.');
        if (rows[0].status === 'inactive') return fail(403, 'Your account is inactive. Please contact support.');

        const returnTo = req.session.returnTo;
        req.session.regenerate(err => {
            if (err) return fail(500, 'Login failed. Please try again.');
            req.session.user = { id: rows[0].id, name: rows[0].full_name, email: rows[0].email, role };
            const home = role === 'farmer' ? '/farmer/dashboard' : '/buyer/dashboard';
            const safeReturn = returnTo && returnTo.startsWith('/' + role) ? returnTo : (role === 'buyer' && returnTo && returnTo.startsWith('/products') ? returnTo : home);
            req.session.save(() => res.redirect(safeReturn));
        });
    } catch (error) {
        console.error(`${role} login error:`, error);
        return fail(500, 'Login failed. Please try again.');
    }
}

router.post('/login', (req, res) => loginUser(req, res, req.body.role === 'farmer' ? 'farmer' : 'buyer'));
router.post(['/login/farmer', '/farmer/login'], (req, res) => loginUser(req, res, 'farmer'));
router.post(['/login/buyer', '/buyer/login'], (req, res) => loginUser(req, res, 'buyer'));

// Logout (every panel's "Logout" link points here or to /farmer/logout)
router.all(['/logout', '/logout.html', '/buyer/logout'], (req, res) => {
    req.session.destroy(() => res.redirect('/'));
});

// ==================== OTHER ROUTES ====================

router.get(['/dashboard', '/dashboard.html', '/buyer-dashboard'], (req, res) => {
    const u = req.session && req.session.user;
    res.redirect(u ? (u.role === 'farmer' ? '/farmer/dashboard' : '/buyer/dashboard') : '/login');
});

router.get(['/forgot-password', '/forgot_password'], (req, res) => {
    res.render('web/forgot-password.ejs');
});

module.exports = router;
