process.env.SESSION_SECRET = 'test';
const path = require('path'), fs = require('fs');
const shim = require('./sqlite-shim');
require.cache[require.resolve('../db')] = { id: 'db', filename: 'db', loaded: true, exports: shim };
const app = require('../server');
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log('  ✓', m); } else { fail++; console.log('  ✗ FAIL:', m); } };

(async () => {
  const srv = app.listen(0); const base = 'http://127.0.0.1:' + srv.address().port;
  class Client {
    constructor() { this.cookie = ''; }
    async req(method, url, { body, json, form, headers = {} } = {}) {
      const h = { cookie: this.cookie, ...headers };
      let b;
      if (json) { h['content-type'] = 'application/json'; h.accept = 'application/json'; b = JSON.stringify(json); }
      else if (form instanceof FormData) b = form;
      else if (body) { h['content-type'] = 'application/x-www-form-urlencoded'; b = new URLSearchParams(body).toString(); }
      const r = await fetch(base + url, { method, headers: h, body: b, redirect: 'manual' });
      const sc = r.headers.getSetCookie ? r.headers.getSetCookie() : []; if (sc.length) { const jar = Object.fromEntries(this.cookie.split('; ').filter(Boolean).map(x => x.split('='))); sc.forEach(c => { const [kv] = c.split(';'); const [k, v] = kv.split('='); jar[k] = v; }); this.cookie = Object.entries(jar).map(([k, v]) => k + '=' + v).join('; '); }
      const text = await r.text(); let j = null; try { j = JSON.parse(text); } catch (e) { }
      return { status: r.status, loc: r.headers.get('location'), text, json: j };
    }
    get(u, o) { return this.req('GET', u, o); } post(u, o) { return this.req('POST', u, o); }
  }
  const login = async (c, role, email, pw = 'Password@123') => c.post('/login/' + role, { body: { email, password: pw } });

  console.log('\n== PUBLIC =='); const anon = new Client();
  for (const u of ['/', '/home', '/about', '/contact', '/products', '/products/1', '/privacy', '/terms', '/login/farmer', '/login/buyer', '/farmer_register', '/buyer_register', '/forgot-password', '/nope']) {
    const r = await anon.get(u); ok(u === '/nope' ? r.status === 404 : r.status === 200, `GET ${u} -> ${r.status}`);
  }
  let r = await anon.get('/products?min=100&sort=high'); ok(r.text.includes('Wheat') && !r.text.includes('Red Onion'), 'public price filter works (min 100)');
  r = await anon.get('/products?category=3'); ok(r.text.includes('Mango') && !r.text.includes('Red Onion'), 'public category filter works');
  r = await anon.get('/products/1'); ok(r.text.includes('Login as buyer to order') && !r.text.includes('Place Order'), 'anon sees login-to-order');
  r = await anon.get('/buyer/dashboard'); ok(r.status === 302 && r.loc === '/login/buyer', 'buyer area protected');
  r = await anon.get('/farmer/dashboard'); ok(r.status === 302 && r.loc === '/login/farmer', 'farmer area protected');
  r = await anon.post('/contact_save', { body: { c_name: 'Test', mobile: '9999999999', user_type: 'buyer', subject_department: 'other', message: 'hello there' } }); ok(r.loc === '/contact?success=1', 'contact form saves');
  ok((await shim.exe('SELECT * FROM contact_messages')).length === 1, 'contact message in DB');
  r = await anon.post('/login/buyer', { body: { email: 'buyer@kisansetu.com', password: 'wrong' } }); ok(r.status === 401 && r.text.includes('Invalid email or password'), 'wrong password shows error');

  console.log('\n== BUYER ==='); const b = new Client();
  r = await login(b, 'buyer', 'buyer@kisansetu.com'); ok(r.loc === '/buyer/dashboard', 'buyer login');
  for (const u of ['/buyer/dashboard', '/buyer/browse', '/buyer/product/1', '/buyer/orders', '/buyer/enquiries', '/buyer/enquiries?product_id=2', '/buyer/wishlist', '/buyer/profile', '/buyer/support', '/buyer/notifications', '/buyer/api/summary', '/buyer/api/products', '/products/2']) {
    r = await b.get(u, u.includes('api') ? { headers: { accept: 'application/json' } } : {}); ok(r.status === 200, `GET ${u} -> ${r.status}`);
  }
  r = await b.get('/buyer/profile'); ok(r.text.includes('Amit Sharma') && r.text.includes('Kisan Mart'), 'PROFILE shows buyer data');
  r = await b.get('/buyer/support'); ok(r.text.includes('tel:') && r.text.includes('mailto:') && r.text.includes('sms:'), 'SUPPORT has call/mail/sms links');
  r = await b.get('/buyer/browse?q=wheat'); ok(r.text.includes('Wheat') && !r.text.includes('Red Onion'), 'buyer search filter works');
  r = await b.get('/products/1'); ok(r.text.includes('Place Order'), 'buyer sees Place Order on public page');
  r = await b.get('/farmer/dashboard'); ok(r.status === 302, 'buyer cannot open farmer area');

  r = await b.post('/buyer/orders/place', { json: { product_id: 1, quantity: 10, delivery_address: 'Pune' } }); ok(!r.json.success && /Minimum/.test(r.json.message), 'min order enforced: ' + r.json.message);
  r = await b.post('/buyer/orders/place', { json: { product_id: 1, quantity: 9999, delivery_address: 'Pune' } }); ok(!r.json.success && /stock/.test(r.json.message), 'stock limit enforced');
  r = await b.post('/buyer/orders/place', { json: { product_id: 4, quantity: 5, delivery_address: 'Pune' } }); ok(!r.json.success, 'pending product not orderable');
  r = await b.post('/buyer/orders/place', { json: { product_id: 1, quantity: 100, unit_price: 1, total_amount: 1, delivery_address: 'Pune' } }); ok(r.json.success, 'order placed'); const oid = r.json.order_id;
  let o = (await shim.exe('SELECT * FROM orders WHERE order_id=?', [oid]))[0]; ok(Number(o.total_amount) === 2500, 'total computed server side (2500), ignoring client price');
  r = await b.post('/buyer/orders/place', { body: { product_id: 2, quantity: 2, delivery_address: 'Mumbai' } }); ok(r.status === 302 && r.loc === '/buyer/orders', 'form order redirects to orders'); const oid2 = (await shim.exe('SELECT MAX(order_id) m FROM orders'))[0].m;
  r = await b.get('/buyer/api/summary', { headers: { accept: 'application/json' } }); ok(r.json.stats.totalOrders === 2 && r.json.stats.pendingOrders === 2, 'TOTAL ORDERS counted: ' + r.json.stats.totalOrders);
  r = await b.get('/buyer/orders'); ok(r.text.includes('#KS-' + oid) && r.text.includes('data-cancel'), 'orders page lists order + cancel btn');

  r = await b.post('/buyer/enquiries', { body: { product_id: 3, message: 'Is bulk price possible?', requested_quantity: 5, return_to: '/buyer/product/3' } }); ok(r.status === 302, 'PRODUCT-PAGE enquiry works');
  r = await b.post('/buyer/enquiries', { json: { product_id: 1, message: 'Can you deliver tomorrow?' } }); ok(r.json.success, 'JSON enquiry works');
  r = await b.post('/buyer/enquiries', { json: { product_id: 1, message: 'x' } }); ok(!r.json.success, 'short enquiry rejected');
  r = await b.get('/buyer/dashboard'); ok(r.text.includes('Can you deliver tomorrow?'), 'DASHBOARD INQUIRY section shows enquiries');

  r = await b.post('/buyer/wishlist/toggle', { json: { product_id: 1 } }); ok(r.json.saved === true && r.json.count === 1, 'wishlist add');
  r = await b.post('/buyer/wishlist/toggle', { json: { product_id: 1 } }); ok(r.json.saved === false, 'wishlist remove');
  r = await b.post('/buyer/profile', { body: { full_name: 'Amit S', mobile: '9123456780', b_type: 'Retailer', b_name: 'New Mart', b_address: 'Addr', city: 'Pune', state: 'MH', pincode: '411001', gst_number: '27aabcs1429b1z8' } }); ok(r.loc === '/buyer/profile', 'profile update');
  ok((await shim.exe('SELECT * FROM buyers'))[0].gst_number === '27AABCS1429B1Z8', 'profile saved to DB (GST upper-cased)');
  r = await b.post('/buyer/support', { body: { subject: 'Late delivery', description: 'Order is late by two days', order_id: oid, contact_pref: 'phone' } }); ok(r.loc === '/buyer/support#tickets', 'support ticket created');
  ok((await shim.exe("SELECT * FROM complaints"))[0].user_type === 'buyer', 'ticket stored');
  r = await b.get('/buyer/orders/' + oid + '/invoice'); ok(r.status === 200 && r.text.includes('PURCHASE INVOICE') && r.text.includes('KS-INV-'), 'BUYER INVOICE renders');
  r = await b.get('/farmer/orders/' + oid + '/invoice'); ok(r.status === 302, 'buyer cannot open farmer invoice');

  console.log('\n== FARMER ==='); const f = new Client();
  r = await login(f, 'farmer', 'farmer@kisansetu.com'); ok(r.loc === '/farmer/dashboard', 'farmer login');
  for (const u of ['/farmer/dashboard', '/farmer/products', '/farmer/add_product', '/farmer/product_edit/1', '/farmer/orders', '/farmer/order_history', '/farmer/sales_report', '/farmer/sales_report?months=12', '/farmer/enquiry', '/farmer/profile', '/farmer/kyc_docs', '/farmer/notifications', '/farmer/api/summary', '/farmer/api/sales', '/farmer/orders/' + oid + '/invoice']) {
    r = await f.get(u, u.includes('api') ? { headers: { accept: 'application/json' } } : {}); ok(r.status === 200, `GET ${u} -> ${r.status}`);
  }
  r = await f.get('/farmer/product_edit/3'); ok(r.status === 302, "farmer cannot edit another farmer's product");
  r = await f.get('/products/1'); ok(!r.text.includes('Place Order') && r.text.includes('own listing'), 'FARMER does NOT see Place Order on own product');
  r = await f.get('/products/3'); ok(!r.text.includes('Place Order') && r.text.includes('Only buyers'), 'farmer does not see Place Order on any product');
  r = await f.post('/buyer/orders/place', { json: { product_id: 1, quantity: 100, delivery_address: 'x' } }); ok(r.status === 403, 'farmer blocked from ordering (server)');
  r = await f.get('/farmer/orders'); ok(r.text.includes('#KS-' + oid) && r.text.includes('data-act="accepted"'), 'farmer sees order + Accept action');
  r = await f.get('/farmer/api/summary', { headers: { accept: 'application/json' } }); ok(r.json.stats.totalOrders === 2 && r.json.stats.pendingEnquiries === 1, 'farmer live stats');

  console.log('\n-- status actions --');
  r = await f.post('/farmer/orders/' + oid + '/status', { json: { status: 'delivered' } }); ok(!r.json.success, 'cannot jump pending->delivered');
  r = await f.post('/farmer/orders/' + oid + '/status', { json: { status: 'confirmed' } }); ok(r.json.success && r.json.status === 'accepted', 'legacy "confirmed" maps to accepted');
  ok(Number((await shim.exe('SELECT quantity FROM products WHERE product_id=1'))[0].quantity) === 400, 'stock reduced on accept (500-100)');
  r = await f.post('/farmer/orders/' + oid + '/status', { json: { status: 'shipped' } }); ok(r.json.success, 'accepted -> shipped');
  r = await b.post('/buyer/orders/' + oid + '/cancel', { json: {} }); ok(!r.json.success, 'buyer cannot cancel shipped order');
  r = await b.get('/buyer/api/summary', { headers: { accept: 'application/json' } }); ok(r.json.stats.shippedOrders === 1, 'buyer dashboard sees shipped without refresh (API)');
  r = await f.post('/farmer/orders/' + oid + '/status', { json: { status: 'delivered' } }); ok(r.json.success, 'shipped -> delivered');
  r = await f.get('/farmer/api/sales', { headers: { accept: 'application/json' } }); ok(r.json.data.deliveredOrders === 1 && r.json.data.totalRevenue === 2500, 'SALES REPORT counts delivered: ' + r.json.data.deliveredOrders + ' / ₹' + r.json.data.totalRevenue);
  r = await f.get('/farmer/sales_report'); ok(r.text.includes('₹2,500'), 'sales report page shows revenue');
  r = await f.get('/farmer/order_history'); ok(r.text.includes('#KS-' + oid), 'delivered order in history');
  r = await f.post('/farmer/orders/' + oid2 + '/status', { json: { status: 'rejected' } }); ok(r.json.success, 'pending -> rejected');
  r = await b.post('/buyer/orders/place', { json: { product_id: 2, quantity: 2, delivery_address: 'Pune' } }); const oid3 = r.json.order_id;
  r = await f.post('/farmer/orders/' + oid3 + '/status', { body: { status: 'accepted' } }); ok(r.status === 302, 'form-style status post works (redirect)');
  r = await b.post('/buyer/orders/' + oid3 + '/cancel', { json: {} }); ok(r.json.success, 'buyer cancels accepted order');
  ok(Number((await shim.exe('SELECT quantity FROM products WHERE product_id=2'))[0].quantity) === 50, 'stock restored after cancel');

  console.log('\n-- enquiry reply --');
  const eq = (await shim.exe("SELECT enquiry_id FROM enquiries WHERE farmer_id=1 LIMIT 1"))[0].enquiry_id;
  r = await f.post('/farmer/enquiry/' + eq + '/respond', { body: { replyMessage: 'Yes, 570 per dozen' } }); ok(r.status === 302, 'farmer replies');
  r = await b.get('/buyer/enquiries'); ok(r.text.includes('Yes, 570 per dozen'), 'buyer sees reply');

  console.log('\n-- product add/edit + uploads --');
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
  const mk = (over = {}, files = {}) => { const fd = new FormData(); Object.entries({ productName: 'Test Tomato', category_id: '2', price: '30', quantity: '100', unit: 'kg', location: 'Nashik', description: 'd', ...over }).forEach(([k, v]) => fd.append(k, v)); Object.entries(files).forEach(([k, buf]) => fd.append(k, new Blob([buf], { type: 'image/png' }), k + '.png')); return fd; };
  r = await f.post('/farmer/products/add', { form: mk() }); ok(r.status === 302 && r.loc === '/farmer/add_product', 'add without photo rejected');
  r = await f.get('/farmer/add_product'); ok(r.text.includes('main product photo'), 'error flashed on form');
  r = await f.post('/farmer/products/add', { form: mk({}, { image1: Buffer.alloc(3 * 1024 * 1024, 1) }) }); ok(r.loc === '/farmer/add_product', 'oversize (3MB) rejected');
  r = await f.get('/farmer/add_product'); ok(/too large/i.test(r.text) && r.text.includes('2 MB'), 'SIZE LIMIT alert shown: 2 MB');
  r = await f.post('/farmer/products/add', { form: mk({}, { image1: png }) }); ok(r.loc === '/farmer/products', 'add with photo OK');
  const np = (await shim.exe("SELECT * FROM products WHERE product_name='Test Tomato'"))[0]; ok(np && np.p_img1 && np.p_img1.startsWith('/uploads/products/') && np.p_status === 'Pending', 'image path stored, status Pending');
  ok(fs.existsSync(path.join(__dirname, '../public', np.p_img1)), 'image file saved on disk');
  r = await anon.get(np.p_img1); ok(r.status === 200, 'image is served');
  r = await f.post('/farmer/products/update', { form: mk({ productId: np.product_id, productName: 'Edited Name', price: '35' }) }); ok(r.status === 302 && r.loc === '/farmer/products', 'EDIT without image works (image optional)');
  const ed = (await shim.exe('SELECT * FROM products WHERE product_id=?', [np.product_id]))[0]; ok(ed.product_name === 'Edited Name' && ed.p_img1 === np.p_img1, 'old image kept, no default image injected');
  r = await f.post('/farmer/products/update', { form: mk({ productId: np.product_id }, { image2: png }) }); const ed2 = (await shim.exe('SELECT * FROM products WHERE product_id=?', [np.product_id]))[0]; ok(ed2.p_img1 === np.p_img1 && ed2.p_img2, 'edit adds 2nd image only');
  r = await f.post('/farmer/products/update', { form: mk({ productId: np.product_id, remove_image2: '1' }) }); ok(!(await shim.exe('SELECT * FROM products WHERE product_id=?', [np.product_id]))[0].p_img2, 'remove image works');
  r = await f.get('/farmer/products'); if (!(r.text.includes('Test Tomato') && r.text.includes('data-status="Pending"'))) console.log(r.text.match(/<tr class="p-row[^>]*>/g)); ok(r.text.includes('Test Tomato') && r.text.includes('data-status="Pending"'), 'products list + filter data attrs');
  r = await f.post('/farmer/products/' + 1 + '/delete', { json: {} }); ok(r.json.success && /archived/.test(r.json.message), 'product with orders archived, not deleted');
  r = await f.post('/farmer/products/' + np.product_id + '/delete', { json: {} }); ok(r.json.success, 'product without orders deleted');
  r = await anon.get('/products'); ok(!r.text.includes('Red Onion'), 'archived product hidden from public');
  r = await anon.get('/products/1'); ok(r.status === 200, 'archived product page does not crash');
  r = await f.get('/products/2'); ok(r.text.includes('crop-placeholder') || r.text.includes('Wheat'), 'no-image product shows neutral placeholder (not tomato)');

  console.log('\n-- profile / KYC / pw --');
  r = await f.post('/farmer/profile/update', { body: { fullName: 'Ramesh P', mobile: '9876543210', farmName: 'New Farm', state: 'MH', district: 'Nashik', address: 'x' } }); ok(r.loc === '/farmer/profile', 'farmer profile saved');
  const kf = new FormData(); kf.append('aadharNumber', '1234 5678 9012'); kf.append('aadharFront', new Blob([png], { type: 'image/png' }), 'a.png');
  r = await f.post('/farmer/kyc/submit', { form: kf }); ok(r.loc === '/farmer/kyc_docs' && (await shim.exe('SELECT * FROM kyc_documents')).length === 1, 'KYC upload saved');
  r = await f.post('/farmer/profile/password', { body: { current_password: 'Password@123', new_password: 'NewPass@123', confirm_password: 'NewPass@123' } }); ok(r.loc === '/farmer/profile', 'password change');
  r = await f.get('/farmer/logout'); ok(r.loc === '/', 'farmer logout');
  r = await f.get('/farmer/dashboard'); ok(r.status === 302, 'after logout protected again');
  r = await b.get('/logout'); ok(r.loc === '/', 'buyer logout');

  console.log('\n== REGISTRATION =='); const n = new Client();
  r = await n.post('/buyer_register_save', { body: { fullName: 'New Buyer', mobile: '9000011111', email: 'nb@x.com', password: 'Passw0rd!x', confirmPassword: 'Passw0rd!x' } }); ok(r.loc === '/login/buyer?registered=1', 'buyer register');
  r = await n.post('/buyer_register_save', { body: { fullName: 'New Buyer', mobile: '9000011111', email: 'nb@x.com', password: 'Passw0rd!x' } }); ok(r.loc === '/buyer_register', 'duplicate -> back to form w/ flash');
  r = await n.get('/buyer_register'); ok(r.text.includes('already registered'), 'duplicate error shown');
  r = await n.post('/farmer_register_save', { body: { full_name: 'New Farmer', mobile: '9000022222', email: 'nf@x.com', state: 'MH', district: 'Pune', f_password: 'Passw0rd!x' } }); ok(r.loc === '/login/farmer?registered=1', 'farmer register');
  r = await login(n, 'farmer', 'nf@x.com', 'Passw0rd!x'); ok(r.loc === '/farmer/dashboard', 'new farmer can login');
  r = await n.get('/farmer/dashboard'); ok(r.status === 200, 'empty farmer dashboard renders');
  r = await n.get('/farmer/sales_report'); ok(r.status === 200, 'empty sales report renders');
  const n2 = new Client(); await login(n2, 'buyer', 'nb@x.com', 'Passw0rd!x'); for (const u of ['/buyer/dashboard', '/buyer/orders', '/buyer/enquiries', '/buyer/profile']) { r = await n2.get(u); ok(r.status === 200, 'empty buyer ' + u); }
  r = await n2.get('/lang/hi'); ok(r.status === 302, 'language route');
  r = await n2.get('/buyer/dashboard'); ok(r.text.includes('<html lang="hi"'), 'server honors language cookie (hi)');


  console.log('\n== ADMIN + INLINE SCRIPT CHECK ==');
  const bcrypt = require('bcryptjs');
  await shim.exe("INSERT INTO admins (full_name,email,admin_password,role) VALUES ('Admin','admin@kisansetu.com',?, 'admin')", [bcrypt.hashSync('Password@123', 4)]);
  const a = new Client(); r = await a.post('/admin/login', { body: { email: 'admin@kisansetu.com', password: 'Password@123' } }); ok(r.status === 302, 'admin login');
  const vm = require('vm'); let scripts = 0, bad = 0;
  const checkScripts = (html, label) => { for (const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) { scripts++; try { new vm.Script(m[1]); } catch (e) { bad++; console.log('  ✗ bad inline script in', label, e.message); } } };
  for (const u of ['/admin/statistics', '/admin/farmers', '/admin/buyers', '/admin/kyc', '/admin/categories', '/admin/products', '/admin/orders', '/admin/enquiries', '/admin/complaints', '/admin/reports']) { r = await a.get(u); ok(r.status === 200, 'admin ' + u); }
  r = await a.get('/admin/orders'); ok(!r.text.includes('value="confirmed"'), 'admin order status uses valid values');
  const o4 = (await shim.exe('SELECT MAX(order_id) m FROM orders'))[0].m; r = await a.post('/admin/orders/status/' + o4, { body: { status: 'shipped' } }); ok(r.status === 302, 'admin status update');
  const b3 = new Client(); await login(b3, 'buyer', 'buyer@kisansetu.com'); const f3 = new Client(); await login(f3, 'farmer', 'farmer@kisansetu.com', 'NewPass@123');
  for (const [c, urls] of [[anon, ['/', '/products', '/products/2', '/contact', '/login/buyer']], [b3, ['/buyer/dashboard', '/buyer/browse', '/buyer/product/2', '/buyer/orders', '/buyer/enquiries', '/buyer/wishlist', '/buyer/profile', '/buyer/support', '/buyer/notifications', '/buyer/orders/1/invoice']], [f3, ['/farmer/dashboard', '/farmer/products', '/farmer/add_product', '/farmer/product_edit/2', '/farmer/orders', '/farmer/order_history', '/farmer/sales_report', '/farmer/enquiry', '/farmer/profile', '/farmer/kyc_docs', '/farmer/notifications']]]) for (const u of urls) { r = await c.get(u); checkScripts(r.text, u); }
  ok(bad === 0, `all ${scripts} inline scripts parse`);

  console.log(`\nRESULT: ${pass} passed, ${fail} failed`); srv.close(); process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
