/** Role guards. Browser requests are redirected to login, fetch()/XHR requests get JSON 401/403. */
function wantsJson(req) {
    return req.xhr || (req.headers.accept || '').includes('application/json') || req.originalUrl.includes('/api/');
}

function guard(role, loginPath) {
    return function (req, res, next) {
        const u = req.session && req.session.user;
        if (u && u.role === role) return next();
        if (wantsJson(req)) {
            return res.status(u ? 403 : 401).json({ success: false, message: u ? `This action is only for ${role}s.` : 'Please login first.' });
        }
        if (u) {
            req.session.flash = { type: 'warning', msg: `That page is only for ${role}s. You are logged in as a ${u.role}.` };
            return res.redirect(u.role === 'farmer' ? '/farmer/dashboard' : '/buyer/dashboard');
        }
        req.session.returnTo = req.method === 'GET' ? req.originalUrl : undefined;
        return res.redirect(loginPath);
    };
}

module.exports = {
    requireBuyer: guard('buyer', '/login/buyer'),
    requireFarmer: guard('farmer', '/login/farmer'),
    wantsJson
};
