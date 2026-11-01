/* KisanSetu – ONE translation system for website, buyer panel and farmer panel.
   English text lives in the HTML itself; this file holds Hindi (hi) and Marathi (mr).
   Use  data-i18n="key"  (text),  data-i18n-ph="key"  (placeholder),  data-i18n-title="key"  (tooltip). */
(function () {
  const D = {
    hi: {
      'brand.tagline': 'किसान से खरीदार तक', 'nav.home': 'होम', 'nav.crops': 'फसलें', 'nav.about': 'हमारे बारे में', 'nav.contact': 'संपर्क करें',
      'nav.login': 'लॉगिन', 'nav.login_farmer': 'किसान लॉगिन', 'nav.login_buyer': 'खरीदार लॉगिन', 'nav.register': 'रजिस्टर करें',
      'nav.register_farmer': 'किसान के रूप में रजिस्टर', 'nav.register_buyer': 'खरीदार के रूप में रजिस्टर', 'nav.dashboard': 'डैशबोर्ड',
      'nav.browse': 'फसलें देखें', 'nav.orders': 'मेरे ऑर्डर', 'nav.orders_farmer': 'ऑर्डर', 'nav.enquiries': 'पूछताछ', 'nav.wishlist': 'पसंदीदा',
      'nav.support': 'सहायता', 'nav.products': 'मेरी उपज', 'nav.add_product': 'नया उत्पाद जोड़ें', 'nav.manage_products': 'उत्पाद प्रबंधन',
      'nav.reports': 'रिपोर्ट', 'nav.profile': 'मेरी प्रोफ़ाइल', 'nav.kyc': 'केवाईसी दस्तावेज़', 'nav.logout': 'लॉगआउट', 'nav.notifications': 'सूचनाएं', 'nav.history': 'ऑर्डर इतिहास',
      'role.buyer': 'खरीदार', 'role.farmer': 'किसान',
      'footer.about': 'किसानसेतु किसानों को सीधे खरीदारों से जोड़ता है – पारदर्शी भाव, सत्यापित सूची और कोई बिचौलिया नहीं।', 'footer.quick': 'त्वरित लिंक', 'footer.account': 'मेरा खाता',
      'footer.help': 'सहायता', 'footer.rights': 'सर्वाधिकार सुरक्षित।', 'footer.privacy': 'गोपनीयता नीति', 'footer.terms': 'उपयोग की शर्तें',
      'greet.morning': 'सुप्रभात', 'greet.afternoon': 'नमस्कार', 'greet.evening': 'शुभ संध्या', 'greet.hello': 'नमस्ते',
      'dash.buyer.sub': 'ऑर्डर ट्रैक करें, किसानों से बात करें और ताज़ी फसलें सीधे खरीदें।', 'dash.overview': 'सारांश', 'live.badge': 'लाइव', 'dash.recent_orders': 'हाल के ऑर्डर',
      'dash.inquiries': 'मेरी पूछताछ', 'dash.tracking': 'ऑर्डर ट्रैकिंग', 'dash.quick': 'त्वरित कार्य', 'dash.fresh': 'खेतों से ताज़ा',
      'btn.new_enquiry': 'नई पूछताछ', 'btn.view_all': 'सभी देखें', 'btn.start_shopping': 'खरीदारी शुरू करें', 'btn.view_buy': 'देखें और खरीदें', 'btn.buy_now': 'अभी खरीदें',
      'btn.place_order': 'ऑर्डर करें', 'btn.send_enquiry': 'पूछताछ भेजें', 'btn.call': 'कॉल', 'btn.invoice': 'इनवॉइस', 'btn.cancel': 'रद्द करें', 'btn.cancel_plain': 'रद्द करें',
      'btn.new_order': 'नया ऑर्डर', 'btn.close': 'बंद करें', 'btn.reset': 'फ़िल्टर रीसेट करें', 'btn.save': 'बदलाव सहेजें', 'btn.submit': 'जमा करें', 'btn.update_password': 'पासवर्ड बदलें',
      'btn.back': 'वापस', 'btn.print': 'प्रिंट / PDF सहेजें', 'btn.edit': 'संपादित करें', 'btn.reply': 'जवाब दें', 'btn.mark_read': 'सभी पढ़ा हुआ करें', 'btn.complete_kyc': 'केवाईसी पूरा करें',
      'btn.view_details': 'विवरण देखें', 'btn.create_account': 'खाता बनाएं', 'btn.submit_product': 'उत्पाद जमा करें',
      'stat.total_orders': 'कुल ऑर्डर', 'stat.active_orders': 'सक्रिय ऑर्डर', 'stat.delivered': 'डिलीवर हुए', 'stat.total_spend': 'कुल खर्च', 'stat.enquiries': 'पूछताछ', 'stat.replied': 'जवाब मिला',
      'stat.wishlist': 'पसंदीदा', 'stat.products': 'उत्पाद', 'stat.awaiting': 'मंज़ूरी की प्रतीक्षा', 'stat.pending_orders': 'नए / लंबित', 'stat.earnings': 'कमाई', 'stat.pipeline': 'प्रक्रिया में',
      'stat.open_enq': 'खुली पूछताछ', 'stat.in_progress': 'प्रगति में',
      'col.order': 'ऑर्डर', 'col.product': 'फसल', 'col.farmer': 'किसान', 'col.buyer': 'खरीदार', 'col.amount': 'राशि', 'col.status': 'स्थिति', 'col.qty': 'मात्रा', 'col.progress': 'प्रगति',
      'col.actions': 'कार्य', 'col.category': 'श्रेणी', 'col.price': 'कीमत (₹)', 'col.stock': 'मात्रा', 'col.date': 'तारीख', 'col.orders': 'ऑर्डर',
      'status.pending': 'लंबित', 'status.accepted': 'स्वीकृत', 'status.shipped': 'भेजा गया', 'status.delivered': 'डिलीवर हुआ', 'status.cancelled': 'रद्द', 'status.rejected': 'अस्वीकृत',
      'status.responded': 'जवाब मिला', 'status.closed': 'बंद', 'status.approved': 'स्वीकृत', 'status.available': 'उपलब्ध', 'status.sold-out': 'बिक गया', 'status.verified': 'सत्यापित',
      'status.open': 'खुला', 'status.resolved': 'हल हुआ', 'status.archived': 'संग्रहीत',
      'step.0': 'ऑर्डर दिया', 'step.1': 'पुष्टि', 'step.2': 'रास्ते में', 'step.3': 'डिलीवर',
      'act.accepted': 'स्वीकार करें', 'act.rejected': 'अस्वीकार करें', 'act.shipped': 'भेजा गया करें', 'act.cancelled': 'रद्द करें', 'act.delivered': 'डिलीवर हुआ करें',
      'empty.orders': 'अभी कोई ऑर्डर नहीं', 'empty.enquiries': 'अभी कोई पूछताछ नहीं', 'empty.enquiries_hint': 'किसान से भाव, गुणवत्ता या डिलीवरी के बारे में पूछें।', 'empty.tracking': 'कोई सक्रिय शिपमेंट नहीं',
      'empty.products': 'अभी कोई फसल उपलब्ध नहीं।', 'empty.no_match': 'फ़िल्टर से कोई फसल नहीं मिली', 'empty.wishlist': 'आपकी पसंदीदा सूची खाली है', 'empty.notifs': 'कोई सूचना नहीं',
      'empty.farmer_orders': 'कोई ऑर्डर नहीं मिला', 'empty.history': 'कोई पुराना ऑर्डर नहीं', 'empty.products_farmer': 'कोई उत्पाद नहीं मिला', 'empty.tickets': 'अभी कोई अनुरोध नहीं', 'empty.docs': 'अभी कुछ जमा नहीं किया',
      'enq.farmer_reply': 'किसान का जवाब', 'enq.you': 'आप', 'enq.sub': 'किसानों से भाव, गुणवत्ता और डिलीवरी के बारे में पूछें। जवाब यहाँ दिखेंगे।', 'enq.choose': 'फसल चुनें…', 'enq.qty': 'आवश्यक मात्रा (वैकल्पिक)',
      'enq.message': 'आपका प्रश्न', 'enq.msg_ph': 'जैसे: 200 किलो का सबसे अच्छा भाव क्या है?', 'enq.qty_ph': 'आवश्यक मात्रा (वैकल्पिक)', 'enq.waiting': 'प्रतीक्षा में', 'enq.waiting_hint': 'किसान के जवाब की प्रतीक्षा…', 'enq.new_reply': 'किसान ने आपकी पूछताछ का जवाब दिया',
      'f.search': 'खोजें', 'f.search_ph': 'प्याज, गेहूं, किसान…', 'f.search_orders': 'ऑर्डर, फसल, किसान खोजें…', 'f.category': 'श्रेणी', 'f.all': 'सभी', 'f.all_categories': 'सभी श्रेणियाँ', 'f.district': 'जिला', 'f.min': 'न्यूनतम ₹', 'f.max': 'अधिकतम ₹', 'f.sort': 'क्रमबद्ध करें',
      'sort.new': 'नवीनतम', 'sort.low': 'कीमत: कम से ज़्यादा', 'sort.high': 'कीमत: ज़्यादा से कम', 'sort.name': 'नाम A–Z', 'tab.all': 'सभी', 'prod.live': 'लाइव',
      'browse.sub': 'सत्यापित किसानों से सीधे ताज़ा उपज।', 'browse.found': 'फसलें मिलीं', 'crops.title': 'सत्यापित किसानों की ताज़ा फसलें', 'crops.sub': 'खोजें, फ़िल्टर करें और किसानों से सीधे संपर्क करें – कोई बिचौलिया नहीं।',
      'pd.notfound': 'फसल नहीं मिली', 'pd.details': 'फसल का विवरण', 'pd.category': 'श्रेणी', 'pd.stock': 'उपलब्ध स्टॉक', 'pd.min': 'न्यूनतम ऑर्डर', 'pd.location': 'स्थान', 'pd.listed': 'सूचीबद्ध तारीख', 'pd.qty': 'मात्रा',
      'pd.address': 'डिलीवरी पता', 'pd.note': 'किसान के लिए संदेश', 'pd.total': 'कुल राशि', 'pd.unavailable': 'यह फसल अभी ऑर्डर के लिए उपलब्ध नहीं है।', 'pd.ask': 'किसान से प्रश्न पूछें', 'pd.in_stock': 'स्टॉक में',
      'pd.verified': 'किसानसेतु सत्यापित सूची', 'pd.own': 'यह आपकी अपनी सूची है – आप इसे ऑर्डर नहीं कर सकते।', 'pd.farmer_note': 'आप किसान के रूप में लॉगिन हैं। केवल खरीदार ऑर्डर कर सकते हैं।', 'pd.login_order': 'ऑर्डर के लिए खरीदार लॉगिन करें', 'pd.more': 'और देखें:',
      'orders.sub': 'हर ऑर्डर ट्रैक करें और इनवॉइस डाउनलोड करें।', 'orders.received': 'प्राप्त ऑर्डर', 'orders.farmer_sub': 'खरीदारों के ऑर्डर स्वीकार करें, भेजें और डिलीवर करें।', 'orders.new': 'नया ऑर्डर मिला', 'hist.sub': 'डिलीवर, रद्द और अस्वीकृत ऑर्डर।',
      'confirm.cancel': 'यह ऑर्डर रद्द करें?', 'confirm.sure': 'क्या आप निश्चित हैं?',
      'wish.sub': 'जो फसलें आपने बाद के लिए सहेजीं।', 'wish.added': 'पसंदीदा में जोड़ा गया', 'wish.removed': 'पसंदीदा से हटाया गया',
      'prof.sub': 'अपना व्यवसाय विवरण अद्यतन रखें।', 'prof.details': 'व्यक्तिगत और व्यवसाय विवरण', 'prof.name': 'पूरा नाम', 'prof.mobile': 'मोबाइल', 'prof.email': 'ईमेल (बदला नहीं जा सकता)', 'prof.type': 'खरीदार प्रकार',
      'prof.business': 'व्यवसाय का नाम', 'prof.address': 'पता', 'prof.city': 'शहर', 'prof.state': 'राज्य', 'prof.pin': 'पिन कोड', 'prof.password': 'पासवर्ड बदलें', 'prof.cur': 'वर्तमान पासवर्ड', 'prof.new': 'नया पासवर्ड', 'prof.confirm': 'पासवर्ड की पुष्टि करें',
      'prof.member': 'सदस्य बने', 'prof.farm': 'खेत का नाम',
      'support.call': 'हमें कॉल करें', 'support.mail': 'हमें ईमेल करें', 'support.text': 'टेक्स्ट संदेश (SMS)', 'support.whatsapp': 'व्हाट्सऐप चैट', 'support.raise': 'सहायता अनुरोध भेजें', 'support.subject': 'विषय', 'support.order': 'संबंधित ऑर्डर',
      'support.desc': 'समस्या बताएं', 'support.pref': 'मुझसे संपर्क करें', 'support.my': 'मेरे अनुरोध',
      'pf.basic': 'मूल विवरण', 'pf.name': 'उत्पाद का नाम', 'pf.choose_cat': 'श्रेणी चुनें', 'pf.choose_unit': 'इकाई चुनें', 'pf.location': 'खेत का स्थान', 'pf.unit': 'इकाई', 'pf.desc': 'विवरण', 'pf.photos': 'उत्पाद की फ़ोटो',
      'pf.max': 'अधिकतम', 'pf.each': 'प्रति फ़ोटो', 'pf.optional': 'फ़ोटो बदलना वैकल्पिक है – वर्तमान फ़ोटो रखने के लिए खाली छोड़ें।', 'pf.first_required': 'पहली फ़ोटो आवश्यक है।', 'pf.click': 'अपलोड के लिए क्लिक करें या खींचें',
      'pf.remove': 'यह फ़ोटो हटाएं', 'pf.edit': 'उत्पाद संपादित करें', 'pf.need_main': 'कृपया मुख्य उत्पाद फ़ोटो अपलोड करें।', 'pf.sub': 'बेचने वाली उपज का विवरण भरें। खरीदारों को दिखने से पहले एडमिन मंज़ूरी देगा।', 'prod.sub': 'अपनी फसल सूची जोड़ें, संपादित करें और ट्रैक करें।',
      'upload.size': 'फ़ोटो बहुत बड़ी है', 'upload.limit': 'अधिकतम अनुमत आकार', 'upload.type': 'केवल JPG, PNG या WEBP फ़ोटो की अनुमति है।',
      'rep.sub': 'आय केवल डिलीवर हुए ऑर्डर से गिनी जाती है।', 'rep.months': 'महीने', 'rep.revenue': 'डिलीवर आय', 'rep.avg': 'औसत ऑर्डर मूल्य', 'rep.monthly': 'मासिक आय (डिलीवर)', 'rep.status': 'स्थिति के अनुसार ऑर्डर', 'rep.top': 'सबसे ज़्यादा बिकने वाली फसलें', 'rep.none': 'अभी कोई डिलीवर ऑर्डर नहीं। ऑर्डर को डिलीवर चिह्नित करें।',
      'fenq.sub': 'आपकी फसलों के बारे में खरीदारों के प्रश्न।', 'fenq.your_reply': 'आपका जवाब', 'fenq.ph': 'अपना जवाब लिखें (भाव, उपलब्धता, डिलीवरी)…', 'fenq.new': 'नई पूछताछ मिली',
      'kyc.pending_title': 'केवाईसी सत्यापित नहीं।', 'kyc.pending_text': 'केवाईसी पूरा करें ताकि खरीदार आप पर भरोसा करें।', 'kyc.sub': 'सत्यापित किसानों पर खरीदार ज़्यादा भरोसा करते हैं।', 'kyc.aadhaar': 'आधार नंबर', 'kyc.front': 'आधार – आगे *', 'kyc.back': 'आधार – पीछे', 'kyc.land': 'भूमि रिकॉर्ड (7/12)', 'kyc.submitted': 'जमा किए दस्तावेज़',
      'err.home': 'होम पर वापस जाएं'
    },
    mr: {
      'brand.tagline': 'शेतकरी ते खरेदीदार बाजारपेठ', 'nav.home': 'मुख्यपृष्ठ', 'nav.crops': 'पिके', 'nav.about': 'आमच्याबद्दल', 'nav.contact': 'संपर्क',
      'nav.login': 'लॉगिन', 'nav.login_farmer': 'शेतकरी लॉगिन', 'nav.login_buyer': 'खरेदीदार लॉगिन', 'nav.register': 'नोंदणी करा',
      'nav.register_farmer': 'शेतकरी म्हणून नोंदणी', 'nav.register_buyer': 'खरेदीदार म्हणून नोंदणी', 'nav.dashboard': 'डॅशबोर्ड',
      'nav.browse': 'पिके पहा', 'nav.orders': 'माझ्या ऑर्डर', 'nav.orders_farmer': 'ऑर्डर', 'nav.enquiries': 'चौकशी', 'nav.wishlist': 'आवडते',
      'nav.support': 'मदत', 'nav.products': 'माझी उत्पादने', 'nav.add_product': 'नवीन उत्पादन जोडा', 'nav.manage_products': 'उत्पादने व्यवस्थापन',
      'nav.reports': 'अहवाल', 'nav.profile': 'माझी प्रोफाइल', 'nav.kyc': 'केवायसी कागदपत्रे', 'nav.logout': 'लॉगआउट', 'nav.notifications': 'सूचना', 'nav.history': 'ऑर्डर इतिहास',
      'role.buyer': 'खरेदीदार', 'role.farmer': 'शेतकरी',
      'footer.about': 'किसानसेतू शेतकऱ्यांना थेट खरेदीदारांशी जोडते – पारदर्शक भाव, पडताळलेल्या नोंदी आणि मध्यस्थ नाही.', 'footer.quick': 'जलद दुवे', 'footer.account': 'माझे खाते',
      'footer.help': 'मदत व सहाय्य', 'footer.rights': 'सर्व हक्क राखीव.', 'footer.privacy': 'गोपनीयता धोरण', 'footer.terms': 'वापराच्या अटी',
      'greet.morning': 'शुभ प्रभात', 'greet.afternoon': 'नमस्कार', 'greet.evening': 'शुभ संध्याकाळ', 'greet.hello': 'नमस्कार',
      'dash.buyer.sub': 'ऑर्डर ट्रॅक करा, शेतकऱ्यांशी बोला आणि ताजी पिके थेट खरेदी करा.', 'dash.overview': 'आढावा', 'live.badge': 'लाइव्ह', 'dash.recent_orders': 'अलीकडील ऑर्डर',
      'dash.inquiries': 'माझ्या चौकशा', 'dash.tracking': 'ऑर्डर ट्रॅकिंग', 'dash.quick': 'जलद कृती', 'dash.fresh': 'शेतातून ताजे',
      'btn.new_enquiry': 'नवीन चौकशी', 'btn.view_all': 'सर्व पहा', 'btn.start_shopping': 'खरेदी सुरू करा', 'btn.view_buy': 'पहा आणि खरेदी करा', 'btn.buy_now': 'आता खरेदी करा',
      'btn.place_order': 'ऑर्डर द्या', 'btn.send_enquiry': 'चौकशी पाठवा', 'btn.call': 'कॉल', 'btn.invoice': 'इनव्हॉइस', 'btn.cancel': 'रद्द करा', 'btn.cancel_plain': 'रद्द करा',
      'btn.new_order': 'नवीन ऑर्डर', 'btn.close': 'बंद करा', 'btn.reset': 'फिल्टर रीसेट करा', 'btn.save': 'बदल जतन करा', 'btn.submit': 'सादर करा', 'btn.update_password': 'पासवर्ड बदला',
      'btn.back': 'मागे', 'btn.print': 'प्रिंट / PDF जतन करा', 'btn.edit': 'संपादित करा', 'btn.reply': 'उत्तर द्या', 'btn.mark_read': 'सर्व वाचले म्हणून खुणा करा', 'btn.complete_kyc': 'केवायसी पूर्ण करा',
      'btn.view_details': 'तपशील पहा', 'btn.create_account': 'खाते तयार करा', 'btn.submit_product': 'उत्पादन सादर करा',
      'stat.total_orders': 'एकूण ऑर्डर', 'stat.active_orders': 'सक्रिय ऑर्डर', 'stat.delivered': 'वितरित', 'stat.total_spend': 'एकूण खर्च', 'stat.enquiries': 'चौकशा', 'stat.replied': 'उत्तर मिळाले',
      'stat.wishlist': 'आवडते', 'stat.products': 'उत्पादने', 'stat.awaiting': 'मंजुरीच्या प्रतीक्षेत', 'stat.pending_orders': 'नवीन / प्रलंबित', 'stat.earnings': 'कमाई', 'stat.pipeline': 'प्रक्रियेत',
      'stat.open_enq': 'खुल्या चौकशा', 'stat.in_progress': 'प्रगतीत',
      'col.order': 'ऑर्डर', 'col.product': 'पीक', 'col.farmer': 'शेतकरी', 'col.buyer': 'खरेदीदार', 'col.amount': 'रक्कम', 'col.status': 'स्थिती', 'col.qty': 'प्रमाण', 'col.progress': 'प्रगती',
      'col.actions': 'कृती', 'col.category': 'प्रकार', 'col.price': 'किंमत (₹)', 'col.stock': 'प्रमाण', 'col.date': 'तारीख', 'col.orders': 'ऑर्डर',
      'status.pending': 'प्रलंबित', 'status.accepted': 'स्वीकारले', 'status.shipped': 'पाठवले', 'status.delivered': 'वितरित', 'status.cancelled': 'रद्द', 'status.rejected': 'नाकारले',
      'status.responded': 'उत्तर दिले', 'status.closed': 'बंद', 'status.approved': 'मंजूर', 'status.available': 'उपलब्ध', 'status.sold-out': 'विकले गेले', 'status.verified': 'पडताळले',
      'status.open': 'खुले', 'status.resolved': 'सोडवले', 'status.archived': 'संग्रहित',
      'step.0': 'ऑर्डर दिली', 'step.1': 'पुष्टी', 'step.2': 'मार्गावर', 'step.3': 'वितरित',
      'act.accepted': 'स्वीकारा', 'act.rejected': 'नाकारा', 'act.shipped': 'पाठवले करा', 'act.cancelled': 'रद्द करा', 'act.delivered': 'वितरित करा',
      'empty.orders': 'अजून ऑर्डर नाहीत', 'empty.enquiries': 'अजून चौकशी नाही', 'empty.enquiries_hint': 'शेतकऱ्याला भाव, दर्जा किंवा वितरणाबद्दल विचारा.', 'empty.tracking': 'सक्रिय शिपमेंट नाही',
      'empty.products': 'सध्या कोणतेही पीक उपलब्ध नाही.', 'empty.no_match': 'फिल्टरशी जुळणारे पीक नाही', 'empty.wishlist': 'तुमची आवडती यादी रिकामी आहे', 'empty.notifs': 'सूचना नाहीत',
      'empty.farmer_orders': 'ऑर्डर सापडल्या नाहीत', 'empty.history': 'जुन्या ऑर्डर नाहीत', 'empty.products_farmer': 'उत्पादने सापडली नाहीत', 'empty.tickets': 'अजून विनंती नाही', 'empty.docs': 'अजून काही सादर केले नाही',
      'enq.farmer_reply': 'शेतकऱ्याचे उत्तर', 'enq.you': 'तुम्ही', 'enq.sub': 'शेतकऱ्यांना भाव, दर्जा आणि वितरणाबद्दल विचारा. उत्तरे येथे दिसतील.', 'enq.choose': 'पीक निवडा…', 'enq.qty': 'हवे असलेले प्रमाण (ऐच्छिक)',
      'enq.message': 'तुमचा प्रश्न', 'enq.msg_ph': 'उदा. २०० किलोसाठी सर्वोत्तम भाव काय?', 'enq.qty_ph': 'हवे असलेले प्रमाण (ऐच्छिक)', 'enq.waiting': 'प्रतीक्षेत', 'enq.waiting_hint': 'शेतकऱ्याच्या उत्तराची प्रतीक्षा…', 'enq.new_reply': 'शेतकऱ्याने तुमच्या चौकशीला उत्तर दिले',
      'f.search': 'शोधा', 'f.search_ph': 'कांदा, गहू, शेतकरी…', 'f.search_orders': 'ऑर्डर, पीक, शेतकरी शोधा…', 'f.category': 'प्रकार', 'f.all': 'सर्व', 'f.all_categories': 'सर्व प्रकार', 'f.district': 'जिल्हा', 'f.min': 'किमान ₹', 'f.max': 'कमाल ₹', 'f.sort': 'क्रमवारी',
      'sort.new': 'नवीनतम', 'sort.low': 'किंमत: कमी ते जास्त', 'sort.high': 'किंमत: जास्त ते कमी', 'sort.name': 'नाव A–Z', 'tab.all': 'सर्व', 'prod.live': 'लाइव्ह',
      'browse.sub': 'पडताळलेल्या शेतकऱ्यांकडून थेट ताजा माल.', 'browse.found': 'पिके सापडली', 'crops.title': 'पडताळलेल्या शेतकऱ्यांकडून ताजी पिके', 'crops.sub': 'शोधा, फिल्टर करा आणि शेतकऱ्यांशी थेट संपर्क साधा – मध्यस्थ नाही.',
      'pd.notfound': 'पीक सापडले नाही', 'pd.details': 'पिकाचा तपशील', 'pd.category': 'प्रकार', 'pd.stock': 'उपलब्ध साठा', 'pd.min': 'किमान ऑर्डर', 'pd.location': 'ठिकाण', 'pd.listed': 'नोंद दिनांक', 'pd.qty': 'प्रमाण',
      'pd.address': 'वितरण पत्ता', 'pd.note': 'शेतकऱ्यासाठी संदेश', 'pd.total': 'एकूण रक्कम', 'pd.unavailable': 'हे पीक सध्या ऑर्डरसाठी उपलब्ध नाही.', 'pd.ask': 'शेतकऱ्याला प्रश्न विचारा', 'pd.in_stock': 'साठ्यात',
      'pd.verified': 'किसानसेतू पडताळलेली नोंद', 'pd.own': 'ही तुमचीच नोंद आहे – तुम्ही ती ऑर्डर करू शकत नाही.', 'pd.farmer_note': 'तुम्ही शेतकरी म्हणून लॉगिन आहात. फक्त खरेदीदार ऑर्डर देऊ शकतात.', 'pd.login_order': 'ऑर्डरसाठी खरेदीदार म्हणून लॉगिन करा', 'pd.more': 'अधिक:',
      'orders.sub': 'प्रत्येक ऑर्डर ट्रॅक करा आणि इनव्हॉइस डाउनलोड करा.', 'orders.received': 'प्राप्त ऑर्डर', 'orders.farmer_sub': 'खरेदीदारांच्या ऑर्डर स्वीकारा, पाठवा आणि वितरित करा.', 'orders.new': 'नवीन ऑर्डर मिळाली', 'hist.sub': 'वितरित, रद्द आणि नाकारलेल्या ऑर्डर.',
      'confirm.cancel': 'ही ऑर्डर रद्द करायची?', 'confirm.sure': 'तुम्हाला खात्री आहे?',
      'wish.sub': 'नंतरसाठी जतन केलेली पिके.', 'wish.added': 'आवडत्यांमध्ये जोडले', 'wish.removed': 'आवडत्यांमधून काढले',
      'prof.sub': 'तुमचा व्यवसाय तपशील अद्ययावत ठेवा.', 'prof.details': 'वैयक्तिक व व्यवसाय तपशील', 'prof.name': 'पूर्ण नाव', 'prof.mobile': 'मोबाइल', 'prof.email': 'ईमेल (बदलता येत नाही)', 'prof.type': 'खरेदीदाराचा प्रकार',
      'prof.business': 'व्यवसायाचे नाव', 'prof.address': 'पत्ता', 'prof.city': 'शहर', 'prof.state': 'राज्य', 'prof.pin': 'पिन कोड', 'prof.password': 'पासवर्ड बदला', 'prof.cur': 'सध्याचा पासवर्ड', 'prof.new': 'नवीन पासवर्ड', 'prof.confirm': 'पासवर्डची पुष्टी करा',
      'prof.member': 'सदस्य झाल्यापासून', 'prof.farm': 'शेताचे नाव',
      'support.call': 'आम्हाला कॉल करा', 'support.mail': 'आम्हाला ईमेल करा', 'support.text': 'मजकूर संदेश (SMS)', 'support.whatsapp': 'व्हॉट्सअ‍ॅप चॅट', 'support.raise': 'मदतीची विनंती करा', 'support.subject': 'विषय', 'support.order': 'संबंधित ऑर्डर',
      'support.desc': 'समस्या सांगा', 'support.pref': 'मला संपर्क करा', 'support.my': 'माझ्या विनंत्या',
      'pf.basic': 'मूलभूत तपशील', 'pf.name': 'उत्पादनाचे नाव', 'pf.choose_cat': 'प्रकार निवडा', 'pf.choose_unit': 'एकक निवडा', 'pf.location': 'शेताचे ठिकाण', 'pf.unit': 'एकक', 'pf.desc': 'वर्णन', 'pf.photos': 'उत्पादनाचे फोटो',
      'pf.max': 'कमाल', 'pf.each': 'प्रति फोटो', 'pf.optional': 'फोटो बदलणे ऐच्छिक आहे – सध्याचे फोटो ठेवण्यासाठी रिकामे सोडा.', 'pf.first_required': 'पहिला फोटो आवश्यक आहे.', 'pf.click': 'अपलोडसाठी क्लिक करा किंवा ओढा',
      'pf.remove': 'हा फोटो काढा', 'pf.edit': 'उत्पादन संपादित करा', 'pf.need_main': 'कृपया मुख्य उत्पादन फोटो अपलोड करा.', 'pf.sub': 'विकायच्या मालाचा तपशील भरा. खरेदीदारांना दिसण्यापूर्वी अ‍ॅडमिन मंजुरी देईल.', 'prod.sub': 'तुमची पिकांची यादी जोडा, संपादित करा आणि ट्रॅक करा.',
      'upload.size': 'फोटो खूप मोठा आहे', 'upload.limit': 'परवानगी असलेला कमाल आकार', 'upload.type': 'फक्त JPG, PNG किंवा WEBP फोटोंना परवानगी आहे.',
      'rep.sub': 'उत्पन्न फक्त वितरित ऑर्डरवरून मोजले जाते.', 'rep.months': 'महिने', 'rep.revenue': 'वितरित उत्पन्न', 'rep.avg': 'सरासरी ऑर्डर मूल्य', 'rep.monthly': 'मासिक उत्पन्न (वितरित)', 'rep.status': 'स्थितीनुसार ऑर्डर', 'rep.top': 'सर्वाधिक विकली जाणारी पिके', 'rep.none': 'अजून वितरित ऑर्डर नाहीत. ऑर्डर वितरित म्हणून नोंदवा.',
      'fenq.sub': 'तुमच्या पिकांबद्दल खरेदीदारांचे प्रश्न.', 'fenq.your_reply': 'तुमचे उत्तर', 'fenq.ph': 'तुमचे उत्तर लिहा (भाव, उपलब्धता, वितरण)…', 'fenq.new': 'नवीन चौकशी मिळाली',
      'kyc.pending_title': 'केवायसी पडताळलेले नाही.', 'kyc.pending_text': 'खरेदीदारांचा विश्वास मिळवण्यासाठी केवायसी पूर्ण करा.', 'kyc.sub': 'पडताळलेल्या शेतकऱ्यांवर खरेदीदार अधिक विश्वास ठेवतात.', 'kyc.aadhaar': 'आधार क्रमांक', 'kyc.front': 'आधार – पुढील बाजू *', 'kyc.back': 'आधार – मागील बाजू', 'kyc.land': 'जमीन नोंद (७/१२)', 'kyc.submitted': 'सादर केलेली कागदपत्रे',
      'err.home': 'मुख्यपृष्ठावर परत जा'
    }
  };

  const orig = new WeakMap(); // remembers the English text so we can switch back
  let lang = 'en';
  function t(key, fallback) {
    if (lang !== 'en' && D[lang] && D[lang][key] !== undefined) return D[lang][key];
    return fallback !== undefined ? fallback : key;
  }
  function apply(code) {
    lang = D[code] ? code : 'en';
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      if (!orig.has(el)) orig.set(el, { text: el.textContent });
      const key = el.getAttribute('data-i18n');
      if (lang === 'en') el.textContent = orig.get(el).text;
      else if (D[lang][key] !== undefined) el.textContent = D[lang][key];
    });
    [['data-i18n-ph', 'placeholder'], ['data-i18n-title', 'title']].forEach(([a, attr]) => {
      document.querySelectorAll('[' + a + ']').forEach(el => {
        if (!orig.has(el)) orig.set(el, {});
        const o = orig.get(el); if (o[attr] === undefined) o[attr] = el.getAttribute(attr) || '';
        const key = el.getAttribute(a);
        if (lang === 'en') el.setAttribute(attr, o[attr]); else if (D[lang][key] !== undefined) el.setAttribute(attr, D[lang][key]);
      });
    });
  }
  window.KS_I18N = { t, apply, dict: D };
})();
