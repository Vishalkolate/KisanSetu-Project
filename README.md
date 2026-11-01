# KisanSetu – Farmer-to-Buyer Marketplace (v2)

Node.js + Express + EJS + MySQL. Panels: Public website, Buyer, Farmer, Admin.

## Setup (5 steps)
1. `npm install`
2. Create the database: open MySQL and run `database/schema.sql` (creates tables + demo data).
3. Copy `.env.example` to `.env` and fill your MySQL details (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME).
4. `npm start`  → http://localhost:3000   (use `npm run dev` for auto-restart)
5. Already have an older database? Just start the app – `lib/migrate.js` upgrades it automatically.

### Demo logins (password `Password@123`)
| Role | Email | Login URL |
|---|---|---|
| Buyer | buyer@kisansetu.com | /login/buyer |
| Farmer | farmer@kisansetu.com | /login/farmer |
| Admin | admin@kisansetu.com | /admin |

If demo login fails on an old database run `npm run seed` (resets the 3 demo passwords).

> **Security:** your old `db.js` contained a real database password. It has been removed – it now reads `.env`.
> Because the old password was in the zip/Git history, **change it** in your Clever Cloud dashboard.

## Order flow
`pending → accepted → shipped → delivered` (farmer) · buyer can cancel while pending/accepted · farmer can reject pending.
Stock is reserved when the farmer accepts and restored if the order is cancelled afterwards.

## Folder map
- `routes/` web.js · buyer.js · farmer.js · admin.js
- `lib/` order rules, notifications, DB auto-migration, config (support phone/email)
- `middleware/auth.js` role guards (buyer pages can no longer be opened without login)
- `views/partials/` ONE navbar, logo and footer used by website, buyer and farmer panels
- `public/css/ks.css` the shared design system · `public/js/i18n.js` English/Hindi/Marathi · `public/js/ks.js` live updates, uploads, filters
- `test/run.js` end-to-end tests (`npm test`, no MySQL needed – uses a built-in SQLite stand-in)
"# KisanSetu-Project" 
