const { exe } = require('../db');

/** Create an in-app notification. Never throws (a failed notification must not break an order). */
async function notify(type, id, title, message) {
    try {
        await exe('INSERT INTO notifications (recipient_type, recipient_id, title, message) VALUES (?, ?, ?, ?)',
            [type, id, String(title).slice(0, 150), message]);
    } catch (e) { console.warn('notify failed:', e.message); }
}
module.exports = { notify };
