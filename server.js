
/**
 * KisanSetu - Main Server Configuration
 */

// 1. Environment Configuration
require('dotenv').config();

// 2. Import Required Packages
const express = require('express');
const session = require('express-session');
const path = require('path');

// 3. Import Project Configuration
const config = require('./lib/config');
const { invoiceNo } = require('./lib/orders');

// 4. Initialize Express Application
const app = express();
const PORT = process.env.PORT || 3000;

// 5. EJS Configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', 1);

// 6. Middleware Configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// 7. Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'kisansetu-local-dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// 8. Helpers Available in Every EJS Template
const PLACEHOLDER_IMG = '/images/crop-placeholder.svg';

app.use((req, res, next) => {

    const l = res.locals;

    l.currentUser = req.session && req.session.user
        ? req.session.user
        : null;

    const m = (req.headers.cookie || '').match(/(?:^|;\s*)ks_lang=(\w+)/);

    l.lang = m && ['en', 'hi', 'mr'].includes(m[1])
        ? m[1]
        : 'en';

    l.support = config.support;
    l.languages = config.languages;
    l.siteName = config.siteName;
    l.currentPath = req.path;

    l.flash = null;

    if (req.session && req.session.flash) {
        l.flash = req.session.flash;
        delete req.session.flash;
    }

    l.productImg = p =>
        (p && (p.p_img1 || p.p_img2 || p.p_img3)) ||
        PLACEHOLDER_IMG;

    l.placeholderImg = PLACEHOLDER_IMG;

    l.inr = n =>
        '₹' + Number(n || 0).toLocaleString('en-IN', {
            maximumFractionDigits: 2
        });

    l.num = n =>
        Number(n || 0).toLocaleString('en-IN', {
            maximumFractionDigits: 2
        });

    l.fdate = d =>
        d
            ? new Date(d).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            })
            : '—';

    l.invoiceNo = invoiceNo;

    l.statusBadge = s => {
        const v = String(s || 'pending').toLowerCase();
        const label = v.charAt(0).toUpperCase() + v.slice(1);

        return `<span class="ks-badge st-${v}" data-i18n="status.${v}">${label}</span>`;
    };

    next();
});

// 9. Disable Browser Cache for Logged-in Pages
app.use(['/buyer', '/farmer'], (req, res, next) => {

    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');

    next();
});

// 10. Language Switch
app.get('/lang/:code', (req, res) => {

    const code = ['en', 'hi', 'mr'].includes(req.params.code)
        ? req.params.code
        : 'en';

    res.cookie('ks_lang', code, {
        maxAge: 365 * 24 * 3600 * 1000,
        sameSite: 'lax'
    });

    const back = req.get('referer');

    res.redirect(
        back && back.startsWith(`${req.protocol}://${req.get('host')}`)
            ? back
            : '/'
    );
});

// 11. Application Routes

// Public Pages, Login, Logout and Registration
app.use('/', require('./routes/web.js'));

// Admin Routes
app.use('/admin', require('./routes/admin.js'));

// Farmer Routes
app.use('/farmer', require('./routes/farmer.js'));

// Buyer Routes
app.use('/buyer', require('./routes/buyer.js'));

// 12. 404 Error Handler
app.use((req, res) => {

    res.status(404).render('web/error.ejs', {
        code: 404,
        title: 'Page not found',
        message: 'The page you are looking for does not exist or was moved.'
    });
});

// 13. Global Error Handler
app.use((err, req, res, next) => {

    console.error(err);

    if (res.headersSent) {
        return next(err);
    }

    const status = err.status || 500;

    if (req.xhr || (req.headers.accept || '').includes('json')) {

        return res.status(status).json({
            success: false,
            message: err.message || 'Server error'
        });
    }

    res.status(status).render('web/error.ejs', {
        code: status,
        title: 'Something went wrong',
        message: 'Please go back and try again.'
    });
});

// 14. Export Express Application
module.exports = app;

// 15. Start Server
if (require.main === module) {

    const { migrate } = require('./lib/migrate');

    migrate()
        .catch(err => {
            console.warn('Migration warning:', err.message);
        })
        .finally(() => {

            app.listen(PORT, () => {
                console.log(`KisanSetu running at http://localhost:${PORT}`);
            });

        });
}
