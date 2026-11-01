/**
 * Order status rules – ONE source of truth for buyer, farmer and admin panels.
 *
 *   pending  -> accepted | rejected | cancelled
 *   accepted -> shipped  | cancelled
 *   shipped  -> delivered
 *   delivered / rejected / cancelled are final.
 */
const STATUSES = ['pending', 'accepted', 'shipped', 'delivered', 'cancelled', 'rejected'];

const FARMER_TRANSITIONS = {
    pending: ['accepted', 'rejected'],
    accepted: ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: [], cancelled: [], rejected: []
};
const BUYER_TRANSITIONS = {
    pending: ['cancelled'],
    accepted: ['cancelled'],
    shipped: [], delivered: [], cancelled: [], rejected: []
};

// Old/legacy spellings that may exist in the database or old forms
const ALIASES = { confirmed: 'accepted', confirm: 'accepted', accept: 'accepted', complete: 'delivered', completed: 'delivered', dispatched: 'shipped', canceled: 'cancelled' };

function normalizeStatus(s) {
    const v = String(s || '').trim().toLowerCase();
    return ALIASES[v] || v;
}
function canFarmerMove(from, to) { return (FARMER_TRANSITIONS[from] || []).includes(to); }
function canBuyerMove(from, to) { return (BUYER_TRANSITIONS[from] || []).includes(to); }
function invoiceNo(orderId, createdAt) {
    const d = createdAt ? new Date(createdAt) : new Date();
    const y = d.getFullYear();
    return `KS-INV-${y}-${String(orderId).padStart(5, '0')}`;
}
const money = n => Number(n || 0);

module.exports = { STATUSES, FARMER_TRANSITIONS, BUYER_TRANSITIONS, normalizeStatus, canFarmerMove, canBuyerMove, invoiceNo, money };
