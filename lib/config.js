// Central place for site-wide settings (override in .env)
module.exports = {
    siteName: 'KisanSetu',
    support: {
        phone: process.env.SUPPORT_PHONE || '+911800266327',
        phoneDisplay: process.env.SUPPORT_PHONE_DISPLAY || '+91 1800-266-3276',
        email: process.env.SUPPORT_EMAIL || 'support@kisansetu.in',
        whatsapp: process.env.SUPPORT_WHATSAPP || '911800266327',
        hours: process.env.SUPPORT_HOURS || 'Mon - Sat, 9:00 AM - 7:00 PM IST'
    },
    upload: {
        maxImageMB: 2,           // per image
        maxImages: 3
    },
    languages: { en: 'English', hi: 'हिन्दी', mr: 'मराठी' }
};
