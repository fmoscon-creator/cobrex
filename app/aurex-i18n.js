/* aurex-i18n.js — Sistema de internacionalización PWA Cobrex
   Replica el sistema de CobrexApp/src/lib/i18n.js para vanilla JS.
   Tab Perfil + Login completo — 8 idiomas.
*/

(function() {
  'use strict';

  // Idioma: preferencia guardada → si no, idioma del navegador (si es uno de los 8) → si no, EN
  var _lang = localStorage.getItem('aurex_lang') || (function() {
    try {
      var l = (navigator.language || navigator.userLanguage || 'en').toLowerCase().slice(0, 2);
      return ['es', 'en', 'pt', 'zh', 'fr', 'it', 'hi', 'ar'].indexOf(l) > -1 ? l : 'en';
    } catch (e) { return 'en'; }
  })();
  var _listeners = [];

  // ═══ TRADUCCIONES ═══
  var T = {

    // === TABS ===
    tab_portfolio: { es: 'Portfolio', en: 'Portfolio', pt: 'Portfólio', zh: '投资组合', fr: 'Portfolio', it: 'Portfolio', hi: 'Portfolio', ar: 'Portfolio' },
    tab_mercados: { es: 'Mercados', en: 'Markets', pt: 'Mercados', zh: '市场', fr: 'Marchés', it: 'Mercati', hi: 'बाज़ार', ar: 'الأسواق' },
    tab_watchlist: { es: 'Watchlist', en: 'Watchlist', pt: 'Watchlist', zh: '自选列表', fr: 'Watchlist', it: 'Watchlist', hi: 'Watchlist', ar: 'Watchlist' },
    tab_alertas: { es: 'Alertas', en: 'Alerts', pt: 'Alertas', zh: '提醒', fr: 'Alertes', it: 'Avvisi', hi: 'अलर्ट', ar: 'تنبيهات' },
    tab_perfil: { es: 'Perfil', en: 'Profile', pt: 'Perfil', zh: '个人资料', fr: 'Profil', it: 'Profilo', hi: 'प्रोफ़ाइल', ar: 'الملف الشخصي' },

    // === LOGIN ===
    login_subtitle: { es: 'Portfolio Tracker con IA', en: 'AI Portfolio Tracker', pt: 'Portfolio Tracker com IA', zh: 'AI投资组合追踪器', fr: 'Portfolio Tracker avec IA', it: 'Portfolio Tracker con IA', hi: 'AI Portfolio Tracker', ar: 'Portfolio Tracker مع AI' },
    email_placeholder: { es: 'Email', en: 'Email', pt: 'Email', zh: '邮箱', fr: 'Email', it: 'Email', hi: 'ईमेल', ar: 'البريد الإلكتروني' },
    contrasena_placeholder: { es: 'Contraseña', en: 'Password', pt: 'Senha', zh: '密码', fr: 'Mot de passe', it: 'Password', hi: 'पासवर्ड', ar: 'كلمة المرور' },
    login_btn: { es: 'Ingresar', en: 'Log in', pt: 'Entrar', zh: '登录', fr: 'Se connecter', it: 'Accedi', hi: 'लॉग इन', ar: 'تسجيل الدخول' },
    contrasena_min6: { es: 'Contraseña (mín 6 car.)', en: 'Password (min 6 chars)', pt: 'Senha (mín 6 car.)', zh: '密码（至少6位）', fr: 'Mot de passe (min 6 car.)', it: 'Password (min 6 car.)', hi: 'पासवर्ड (न्यूनतम 6 अक्षर)', ar: 'كلمة المرور (6 أحرف على الأقل)' },
    registro_hint_celular: { es: '* Para recibir alertas automáticas de señales IA', en: '* To receive automatic AI signal alerts', pt: '* Para receber alertas automáticas de sinais IA', zh: '* 用于接收自动AI信号提醒', fr: '* Pour recevoir les alertes automatiques de signaux IA', it: '* Per ricevere avvisi automatici dei segnali IA', hi: '* स्वचालित AI सिग्नल अलर्ट प्राप्त करने के लिए', ar: '* لتلقي تنبيهات إشارات AI التلقائية' },
    crear_cuenta_btn: { es: 'Crear cuenta', en: 'Create account', pt: 'Criar conta', zh: '创建账户', fr: 'Créer un compte', it: 'Crea account', hi: 'खाता बनाएँ', ar: 'إنشاء حساب' },
    no_tenes_cuenta: { es: '¿No tenés cuenta?', en: "Don't have an account?", pt: 'Não tem conta?', zh: '没有账户？', fr: "Pas de compte ?", it: 'Non hai un account?', hi: 'खाता नहीं है?', ar: 'ليس لديك حساب؟' },
    registrate: { es: 'Registrate', en: 'Sign up', pt: 'Cadastre-se', zh: '注册', fr: "S'inscrire", it: 'Registrati', hi: 'साइन अप', ar: 'سجّل' },
    ya_tenes_cuenta: { es: '¿Ya tenés cuenta?', en: 'Already have an account?', pt: 'Já tem conta?', zh: '已有账户？', fr: 'Déjà un compte ?', it: 'Hai già un account?', hi: 'पहले से खाता है?', ar: 'لديك حساب بالفعل؟' },
    ingresa: { es: 'Ingresá', en: 'Log in', pt: 'Entrar', zh: '登录', fr: 'Connectez-vous', it: 'Accedi', hi: 'लॉग इन', ar: 'سجّل الدخول' },
    completar_campos: { es: 'Completá todos los campos', en: 'Fill in all fields', pt: 'Preencha todos os campos', zh: '请填写所有字段', fr: 'Remplissez tous les champs', it: 'Compila tutti i campi', hi: 'सभी फ़ील्ड भरें', ar: 'املأ جميع الحقول' },
    completar_email_pass: { es: 'Completá email y contraseña', en: 'Enter email and password', pt: 'Preencha email e senha', zh: '请输入邮箱和密码', fr: 'Entrez email et mot de passe', it: 'Inserisci email e password', hi: 'ईमेल और पासवर्ड दर्ज करें', ar: 'أدخل البريد الإلكتروني وكلمة المرور' },
    pass_min6_error: { es: 'La contraseña debe tener al menos 6 caracteres', en: 'Password must be at least 6 characters', pt: 'A senha deve ter pelo menos 6 caracteres', zh: '密码至少需要6个字符', fr: 'Le mot de passe doit contenir au moins 6 caractères', it: 'La password deve avere almeno 6 caratteri', hi: 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए', ar: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' },
    error_sesion: { es: 'Error: sesión no iniciada', en: 'Error: session not started', pt: 'Erro: sessão não iniciada', zh: '错误：会话未启动', fr: 'Erreur : session non démarrée', it: 'Errore: sessione non avviata', hi: 'त्रुटि: सत्र शुरू नहीं हुआ', ar: 'خطأ: لم يتم بدء الجلسة' },
    ingresa_celular: { es: 'Ingresá un número de celular', en: 'Enter a phone number', pt: 'Insira um número de celular', zh: '输入手机号码', fr: 'Entrez un numéro de téléphone', it: 'Inserisci un numero di cellulare', hi: 'मोबाइल नंबर दर्ज करें', ar: 'أدخل رقم هاتف محمول' },

    // === B1: USUARIO ===
    b1_usuario: { es: '👤 Usuario', en: '👤 User', pt: '👤 Usuário', zh: '👤 用户', fr: '👤 Utilisateur', it: '👤 Utente', hi: '👤 उपयोगकर्ता', ar: '👤 المستخدم' },
    plan_free_badge: { es: 'PLAN FREE', en: 'FREE PLAN', pt: 'PLANO FREE', zh: 'FREE方案', fr: 'PLAN FREE', it: 'PIANO FREE', hi: 'FREE योजना', ar: 'خطة FREE' },
    invitado: { es: 'Invitado', en: 'Guest', pt: 'Convidado', zh: '访客', fr: 'Invité', it: 'Ospite', hi: 'अतिथि', ar: 'ضيف' },
    sin_cuenta: { es: 'Sin cuenta', en: 'No account', pt: 'Sem conta', zh: '未注册', fr: 'Pas de compte', it: 'Senza account', hi: 'खाता नहीं', ar: 'بدون حساب' },

    // === B2: PLAN ACTUAL ===
    b2_plan_actual: { es: '⭐ Plan actual', en: '⭐ Current plan', pt: '⭐ Plano atual', zh: '⭐ 当前方案', fr: '⭐ Plan actuel', it: '⭐ Piano attuale', hi: '⭐ वर्तमान योजना', ar: '⭐ الخطة الحالية' },
    free_label: { es: 'FREE', en: 'FREE', pt: 'FREE', zh: 'FREE', fr: 'FREE', it: 'FREE', hi: 'FREE', ar: 'FREE' },
    plan_gratuito: { es: 'Plan gratuito', en: 'Free plan', pt: 'Plano gratuito', zh: '免费方案', fr: 'Plan gratuit', it: 'Piano gratuito', hi: 'मुफ़्त योजना', ar: 'خطة مجانية' },
    plan_free_desc: { es: '5 activos • 3 señales IA/día • Cobrex Pulse básico', en: '5 assets • 3 AI signals/day • Basic Cobrex Pulse', pt: '5 ativos • 3 sinais IA/dia • Cobrex Pulse básico', zh: '5个资产 • 每日3个AI信号 • 基础Cobrex Pulse', fr: '5 actifs • 3 signaux IA/jour • Cobrex Pulse basique', it: '5 asset • 3 segnali IA/giorno • Cobrex Pulse base', hi: '5 एसेट • 3 AI सिग्नल/दिन • बुनियादी Cobrex Pulse', ar: '5 أصول • 3 إشارات AI/يوم • Cobrex Pulse أساسي' },
    ver_planes_btn: { es: '🚀 Ver planes y ventajas', en: '🚀 View plans and benefits', pt: '🚀 Ver planos e vantagens', zh: '🚀 查看方案和优势', fr: '🚀 Voir les plans et avantages', it: '🚀 Vedi piani e vantaggi', hi: '🚀 योजनाएँ और लाभ देखें', ar: '🚀 عرض الخطط والمزايا' },

    // === B3: MI CUENTA ===
    b3_mi_cuenta: { es: '⚙️ Mi cuenta', en: '⚙️ My account', pt: '⚙️ Minha conta', zh: '⚙️ 我的账户', fr: '⚙️ Mon compte', it: '⚙️ Il mio account', hi: '⚙️ मेरा खाता', ar: '⚙️ حسابي' },
    nombre_label: { es: 'Nombre', en: 'Name', pt: 'Nome', zh: '名称', fr: 'Nom', it: 'Nome', hi: 'नाम', ar: 'الاسم' },
    tu_nombre_placeholder: { es: 'Tu nombre', en: 'Your name', pt: 'Seu nome', zh: '您的名字', fr: 'Votre nom', it: 'Il tuo nome', hi: 'आपका नाम', ar: 'اسمك' },
    guardar: { es: 'Guardar', en: 'Save', pt: 'Salvar', zh: '保存', fr: 'Enregistrer', it: 'Salva', hi: 'सहेजें', ar: 'حفظ' },
    email_label: { es: 'Email', en: 'Email', pt: 'Email', zh: '邮箱', fr: 'Email', it: 'Email', hi: 'ईमेल', ar: 'البريد الإلكتروني' },
    email_no_editar: { es: '🔒 El email no se puede modificar', en: '🔒 Email cannot be changed', pt: '🔒 O email não pode ser modificado', zh: '🔒 邮箱不可修改', fr: "🔒 L'email ne peut pas être modifié", it: "🔒 L'email non può essere modificata", hi: '🔒 ईमेल बदला नहीं जा सकता', ar: '🔒 لا يمكن تعديل البريد الإلكتروني' },
    telefono_label: { es: 'Teléfono', en: 'Phone', pt: 'Telefone', zh: '电话', fr: 'Téléphone', it: 'Telefono', hi: 'फ़ोन', ar: 'الهاتف' },
    necesario_alertas: { es: '* Necesario para alertas automáticas', en: '* Required for automatic alerts', pt: '* Necessário para alertas automáticas', zh: '* 自动提醒所需', fr: '* Nécessaire pour les alertes automatiques', it: '* Necessario per gli avvisi automatici', hi: '* स्वचालित अलर्ट के लिए आवश्यक', ar: '* مطلوب للتنبيهات التلقائية' },
    contrasena_label: { es: 'Contraseña', en: 'Password', pt: 'Senha', zh: '密码', fr: 'Mot de passe', it: 'Password', hi: 'पासवर्ड', ar: 'كلمة المرور' },
    nueva_contrasena: { es: 'Nueva contraseña', en: 'New password', pt: 'Nova senha', zh: '新密码', fr: 'Nouveau mot de passe', it: 'Nuova password', hi: 'नया पासवर्ड', ar: 'كلمة مرور جديدة' },
    repetir_contrasena: { es: 'Repetir contraseña', en: 'Repeat password', pt: 'Repetir senha', zh: '重复密码', fr: 'Répéter le mot de passe', it: 'Ripeti password', hi: 'पासवर्ड दोहराएँ', ar: 'تكرار كلمة المرور' },
    cambiar_contrasena_btn: { es: 'Cambiar contraseña', en: 'Change password', pt: 'Alterar senha', zh: '修改密码', fr: 'Changer le mot de passe', it: 'Cambia password', hi: 'पासवर्ड बदलें', ar: 'تغيير كلمة المرور' },
    contrasena_actualizada: { es: 'Contraseña actualizada', en: 'Password updated', pt: 'Senha atualizada', zh: '密码已更新', fr: 'Mot de passe mis à jour', it: 'Password aggiornata', hi: 'पासवर्ड अपडेट किया गया', ar: 'تم تحديث كلمة المرور' },
    contrasenas_no_coinciden: { es: 'Las contraseñas no coinciden', en: 'Passwords do not match', pt: 'As senhas não coincidem', zh: '密码不匹配', fr: 'Les mots de passe ne correspondent pas', it: 'Le password non corrispondono', hi: 'पासवर्ड मेल नहीं खाते', ar: 'كلمتا المرور غير متطابقتين' },
    telefono_guardado: { es: 'Teléfono guardado', en: 'Phone saved', pt: 'Telefone salvo', zh: '电话已保存', fr: 'Téléphone enregistré', it: 'Telefono salvato', hi: 'फ़ोन सहेजा गया', ar: 'تم حفظ الهاتف' },

    // === B4: PREFERENCIAS ===
    b4_preferencias: { es: '🎨 Preferencias', en: '🎨 Preferences', pt: '🎨 Preferências', zh: '🎨 偏好设置', fr: '🎨 Préférences', it: '🎨 Preferenze', hi: '🎨 प्राथमिकताएँ', ar: '🎨 التفضيلات' },
    tema_label: { es: '🌓 Tema', en: '🌓 Theme', pt: '🌓 Tema', zh: '🌓 主题', fr: '🌓 Thème', it: '🌓 Tema', hi: '🌓 थीम', ar: '🌓 المظهر' },
    tema_desc: { es: 'Elegí cómo se ve la app', en: 'Choose how the app looks', pt: 'Escolha a aparência do app', zh: '选择应用外观', fr: "Choisissez l'apparence de l'app", it: "Scegli l'aspetto dell'app", hi: 'ऐप कैसा दिखे चुनें', ar: 'اختر مظهر التطبيق' },
    tema_auto: { es: 'Auto', en: 'Auto', pt: 'Auto', zh: '自动', fr: 'Auto', it: 'Auto', hi: 'स्वचालित', ar: 'تلقائي' },
    tema_claro: { es: 'Claro', en: 'Light', pt: 'Claro', zh: '浅色', fr: 'Clair', it: 'Chiaro', hi: 'लाइट', ar: 'فاتح' },
    tema_oscuro: { es: 'Oscuro', en: 'Dark', pt: 'Escuro', zh: '深色', fr: 'Sombre', it: 'Scuro', hi: 'डार्क', ar: 'داكن' },
    idioma_label: { es: '🌐 Idioma', en: '🌐 Language', pt: '🌐 Idioma', zh: '🌐 语言', fr: '🌐 Langue', it: '🌐 Lingua', hi: '🌐 भाषा', ar: '🌐 اللغة' },
    pulse_indicador: { es: '🔴 Indicador Cobrex Pulse', en: '🔴 Cobrex Pulse Indicator', pt: '🔴 Indicador Cobrex Pulse', zh: '🔴 Cobrex Pulse 指标', fr: '🔴 Indicateur Cobrex Pulse', it: '🔴 Indicatore Cobrex Pulse', hi: '🔴 Cobrex Pulse संकेतक', ar: '🔴 مؤشر Cobrex Pulse' },
    pulse_indicador_desc: { es: 'Visible en tab Mercados', en: 'Visible in Markets tab', pt: 'Visível na aba Mercados', zh: '在市场标签页中可见', fr: "Visible dans l'onglet Marchés", it: 'Visibile nella scheda Mercati', hi: 'बाज़ार टैब में दिखाई देता है', ar: 'مرئي في تبويب الأسواق' },

    // === B5: SEGURIDAD ===
    b5_seguridad: { es: '🔒 Seguridad', en: '🔒 Security', pt: '🔒 Segurança', zh: '🔒 安全', fr: '🔒 Sécurité', it: '🔒 Sicurezza', hi: '🔒 सुरक्षा', ar: '🔒 الأمان' },
    auth_2fa: { es: '📱 Autenticación en 2 pasos', en: '📱 Two-factor authentication', pt: '📱 Autenticação em 2 etapas', zh: '📱 两步验证', fr: '📱 Authentification en 2 étapes', it: '📱 Autenticazione a 2 fattori', hi: '📱 2-चरण प्रमाणीकरण', ar: '📱 المصادقة بخطوتين' },
    soon_badge: { es: 'SOON', en: 'SOON', pt: 'SOON', zh: 'SOON', fr: 'SOON', it: 'SOON', hi: 'SOON', ar: 'SOON' },
    auth_2fa_desc: { es: 'Protección extra al iniciar sesión', en: 'Extra protection when logging in', pt: 'Proteção extra ao iniciar sessão', zh: '登录时的额外保护', fr: 'Protection supplémentaire à la connexion', it: 'Protezione extra al login', hi: 'लॉगिन पर अतिरिक्त सुरक्षा', ar: 'حماية إضافية عند تسجيل الدخول' },
    acceso_biometrico: { es: '👁 Acceso biométrico', en: '👁 Biometric access', pt: '👁 Acesso biométrico', zh: '👁 生物识别访问', fr: '👁 Accès biométrique', it: '👁 Accesso biometrico', hi: '👁 बायोमेट्रिक एक्सेस', ar: '👁 الوصول البيومتري' },
    face_touch_id: { es: 'Face ID / Touch ID', en: 'Face ID / Touch ID', pt: 'Face ID / Touch ID', zh: 'Face ID / Touch ID', fr: 'Face ID / Touch ID', it: 'Face ID / Touch ID', hi: 'Face ID / Touch ID', ar: 'Face ID / Touch ID' },
    sesion_activa: { es: '👨‍💻 Sesión activa', en: '👨‍💻 Active session', pt: '👨‍💻 Sessão ativa', zh: '👨‍💻 活跃会话', fr: '👨‍💻 Session active', it: '👨‍💻 Sessione attiva', hi: '👨‍💻 सक्रिय सत्र', ar: '👨‍💻 جلسة نشطة' },
    este_dispositivo: { es: 'Este dispositivo', en: 'This device', pt: 'Este dispositivo', zh: '此设备', fr: 'Cet appareil', it: 'Questo dispositivo', hi: 'यह डिवाइस', ar: 'هذا الجهاز' },
    sesion_actual: { es: 'Sesión actual', en: 'Current session', pt: 'Sessão atual', zh: '当前会话', fr: 'Session actuelle', it: 'Sessione attuale', hi: 'वर्तमान सत्र', ar: 'الجلسة الحالية' },
    ultimos_accesos: { es: '🕐 Últimos accesos', en: '🕐 Recent access', pt: '🕐 Últimos acessos', zh: '🕐 最近访问', fr: '🕐 Derniers accès', it: '🕐 Accessi recenti', hi: '🕐 हाल की पहुँच', ar: '🕐 آخر الدخول' },
    hoy: { es: 'Hoy', en: 'Today', pt: 'Hoje', zh: '今日', fr: "Aujourd'hui", it: 'Oggi', hi: 'आज', ar: 'اليوم' },
    navegador_web: { es: 'Navegador web', en: 'Web browser', pt: 'Navegador web', zh: '网页浏览器', fr: 'Navigateur web', it: 'Browser web', hi: 'वेब ब्राउज़र', ar: 'متصفح الويب' },

    // === B6: ALERTAS (Perfil) ===
    b6_alertas: { es: '🔔 Alertas', en: '🔔 Alerts', pt: '🔔 Alertas', zh: '🔔 提醒', fr: '🔔 Alertes', it: '🔔 Avvisi', hi: '🔔 अलर्ट', ar: '🔔 تنبيهات' },
    alertas_titulo_banner: { es: '⚡ TU NÚMERO, TUS ALERTAS AL INSTANTE', en: '⚡ YOUR NUMBER, YOUR ALERTS INSTANTLY', pt: '⚡ SEU NÚMERO, SEUS ALERTAS INSTANTÂNEOS', zh: '⚡ 您的号码，即时提醒', fr: '⚡ VOTRE NUMÉRO, VOS ALERTES INSTANTANÉMENT', it: '⚡ IL TUO NUMERO, I TUOI AVVISI ISTANTANEI', hi: '⚡ आपका नंबर, तुरंत अलर्ट', ar: '⚡ رقمك، تنبيهاتك فوراً' },
    alertas_desc_banner: { es: 'Cobrex te avisa directo a tu celéfono cuando el mercado se mueve. Sin delays.', en: 'Cobrex alerts you directly on your phone when the market moves. No delays.', pt: 'Cobrex avisa direto no seu celular quando o mercado se move. Sem atrasos.', zh: 'Cobrex在市场波动时直接通知您的手机。零延迟。', fr: 'Cobrex vous alerte directement sur votre téléphone quand le marché bouge. Sans délai.', it: 'Cobrex ti avvisa direttamente sul cellulare quando il mercato si muove. Senza ritardi.', hi: 'Cobrex बाज़ार में बदलाव पर सीधे आपके फ़ोन पर सूचित करता है। बिना देरी।', ar: 'Cobrex ينبهك مباشرة على هاتفك عندما يتحرك السوق. بدون تأخير.' },
    recibir_alertas_numero: { es: 'Recibir alertas en este número', en: 'Receive alerts on this number', pt: 'Receber alertas neste número', zh: '在此号码接收提醒', fr: 'Recevoir les alertes sur ce numéro', it: 'Ricevi avvisi su questo numero', hi: 'इस नंबर पर अलर्ट प्राप्त करें', ar: 'تلقي التنبيهات على هذا الرقم' },
    activar_notif_push: { es: 'Activá para recibir notificaciones push', en: 'Activate to receive push notifications', pt: 'Ative para receber notificações push', zh: '启用以接收推送通知', fr: 'Activer pour recevoir les notifications push', it: 'Attiva per ricevere notifiche push', hi: 'पुश सूचनाएँ प्राप्त करने के लिए सक्रिय करें', ar: 'فعّل لتلقي إشعارات Push' },
    numero_celular_label: { es: 'Número de celular', en: 'Phone number', pt: 'Número de celular', zh: '手机号码', fr: 'Numéro de téléphone', it: 'Numero di cellulare', hi: 'मोबाइल नंबर', ar: 'رقم الهاتف المحمول' },
    recibir_notif_cuando: { es: 'Recibí notificaciones push cuando ocurra:', en: 'Receive push notifications when:', pt: 'Receba notificações push quando ocorrer:', zh: '发生以下情况时接收推送通知：', fr: 'Recevez des notifications push quand :', it: 'Ricevi notifiche push quando:', hi: 'इन स्थितियों में पुश सूचनाएँ प्राप्त करें:', ar: 'تلقي إشعارات Push عند حدوث:' },
    alerta_precio_obj: { es: 'Precio objetivo', en: 'Target price', pt: 'Preço alvo', zh: '目标价格', fr: 'Prix objectif', it: 'Prezzo obiettivo', hi: 'लक्ष्य मूल्य', ar: 'السعر المستهدف' },
    alerta_precio_obj_desc: { es: 'Cuando un activo alcanza tu precio', en: 'When an asset reaches your target price', pt: 'Quando um ativo atinge seu preço', zh: '当资产达到您的价格时', fr: 'Quand un actif atteint votre prix', it: 'Quando un asset raggiunge il tuo prezzo', hi: 'जब कोई एसेट आपके मूल्य पर पहुँचता है', ar: 'عندما يصل أصل إلى سعرك' },
    alerta_senal_ia: { es: 'Señal IA', en: 'AI Signal', pt: 'Sinal IA', zh: 'AI信号', fr: 'Signal IA', it: 'Segnale IA', hi: 'AI सिग्नल', ar: 'إشارة AI' },
    alerta_senal_ia_desc: { es: 'Nueva señal de compra o venta', en: 'New buy or sell signal', pt: 'Novo sinal de compra ou venda', zh: '新的买卖信号', fr: "Nouveau signal d'achat ou de vente", it: 'Nuovo segnale di acquisto o vendita', hi: 'नया खरीद या बिक्री सिग्नल', ar: 'إشارة شراء أو بيع جديدة' },
    alerta_variacion: { es: 'Variación brusca', en: 'Sharp variation', pt: 'Variação brusca', zh: '剧烈波动', fr: 'Variation brusque', it: 'Variazione brusca', hi: 'तीव्र भिन्नता', ar: 'تغير حاد' },
    alerta_variacion_desc: { es: 'Sube o baja más del 5% en 24hs tu portafolio', en: 'Your portfolio rises or falls more than 5% in 24h', pt: 'Portfólio sobe ou desce mais de 5% em 24h', zh: '投资组合24小时内涨跌超过5%', fr: 'Le portfolio monte ou descend de plus de 5% en 24h', it: 'Il tuo portafoglio sale o scende di più del 5% in 24h', hi: '24 घंटे में आपका portfolio 5% से अधिक बढ़ता या गिरता है', ar: 'محفظتك ترتفع أو تنخفض أكثر من 5% خلال 24 ساعة' },
    alerta_pulse_extremo: { es: 'Cobrex Pulse extremo', en: 'Extreme Cobrex Pulse', pt: 'Cobrex Pulse extremo', zh: 'Cobrex Pulse 极端', fr: 'Cobrex Pulse extrême', it: 'Cobrex Pulse estremo', hi: 'Cobrex Pulse चरम', ar: 'Cobrex Pulse متطرف' },
    alerta_pulse_desc: { es: 'Cuando Pulse supera zona de riesgo', en: 'When Pulse exceeds risk zone', pt: 'Quando Pulse supera zona de risco', zh: '当Pulse超过风险区域时', fr: 'Quand Pulse dépasse la zone de risque', it: 'Quando Pulse supera la zona di rischio', hi: 'जब Pulse जोखिम ज़ोन से ऊपर जाता है', ar: 'عندما يتجاوز Pulse منطقة المخاطر' },
    alertas_requieren_plan: { es: '🔒 Las alertas push requieren plan PRO o ELITE', en: '🔒 Push alerts require PRO or ELITE plan', pt: '🔒 Alertas push requerem plano PRO ou ELITE', zh: '🔒 推送提醒需要PRO或ELITE方案', fr: '🔒 Les alertes push nécessitent le plan PRO ou ELITE', it: '🔒 Gli avvisi push richiedono il piano PRO o ELITE', hi: '🔒 पुश अलर्ट के लिए PRO या ELITE योजना आवश्यक', ar: '🔒 تنبيهات Push تتطلب خطة PRO أو ELITE' },

    // === B7: NOTIFICACIONES ===
    b7_notificaciones: { es: '📩 Notificaciones', en: '📩 Notifications', pt: '📩 Notificações', zh: '📩 通知', fr: '📩 Notifications', it: '📩 Notifiche', hi: '📩 सूचनाएँ', ar: '📩 الإشعارات' },
    notif_push: { es: 'Notificaciones push', en: 'Push notifications', pt: 'Notificações push', zh: '推送通知', fr: 'Notifications push', it: 'Notifiche push', hi: 'पुश सूचनाएँ', ar: 'إشعارات Push' },
    notif_push_desc: { es: 'Activá todas las notificaciones', en: 'Activate all notifications', pt: 'Ative todas as notificações', zh: '启用所有通知', fr: 'Activer toutes les notifications', it: 'Attiva tutte le notifiche', hi: 'सभी सूचनाएँ सक्रिय करें', ar: 'فعّل جميع الإشعارات' },
    notif_resumen: { es: 'Resumen diario', en: 'Daily summary', pt: 'Resumo diário', zh: '每日摘要', fr: 'Résumé quotidien', it: 'Riepilogo giornaliero', hi: 'दैनिक सारांश', ar: 'ملخص يومي' },
    notif_resumen_desc: { es: 'Recibí un resumen de tu portafolio', en: 'Receive a summary of your portfolio', pt: 'Receba um resumo do seu portfólio', zh: '接收投资组合摘要', fr: 'Recevez un résumé de votre portefeuille', it: 'Ricevi un riepilogo del tuo portafoglio', hi: 'अपने portfolio का सारांश प्राप्त करें', ar: 'تلقي ملخص محفظتك' },
    notif_hora_resumen: { es: 'Hora del resumen:', en: 'Summary time:', pt: 'Hora do resumo:', zh: '摘要时间:', fr: 'Heure du résumé :', it: 'Ora del riepilogo:', hi: 'सारांश का समय:', ar: 'وقت الملخص:' },
    notif_newsletter: { es: 'Newsletter semanal', en: 'Weekly newsletter', pt: 'Newsletter semanal', zh: '每周通讯', fr: 'Newsletter hebdomadaire', it: 'Newsletter settimanale', hi: 'साप्ताहिक न्यूज़लेटर', ar: 'نشرة أسبوعية' },
    notif_newsletter_desc: { es: 'Análisis y novedades cada semana', en: 'Analysis and news every week', pt: 'Análises e novidades toda semana', zh: '每周分析和新闻', fr: 'Analyses et actualités chaque semaine', it: 'Analisi e novità ogni settimana', hi: 'हर सप्ताह विश्लेषण और समाचार', ar: 'تحليلات وأخبار كل أسبوع' },
    notif_novedades: { es: 'Novedades Cobrex', en: 'Cobrex Updates', pt: 'Novidades Cobrex', zh: 'Cobrex更新', fr: 'Nouveautés Cobrex', it: 'Novità Cobrex', hi: 'Cobrex अपडेट', ar: 'جديد Cobrex' },
    notif_novedades_desc: { es: 'Updates y nuevas funciones de la app', en: 'Updates and new app features', pt: 'Atualizações e novos recursos do app', zh: '应用更新和新功能', fr: "Mises à jour et nouvelles fonctionnalités de l'application", it: "Aggiornamenti e nuove funzionalità dell'app", hi: 'ऐप अपडेट और नई सुविधाएँ', ar: 'تحديثات وميزات جديدة للتطبيق' },

    // === B8: SOPORTE ===
    b8_soporte: { es: '💬 Soporte', en: '💬 Support', pt: '💬 Suporte', zh: '💬 支持', fr: '💬 Support', it: '💬 Supporto', hi: '💬 सहायता', ar: '💬 الدعم' },
    centro_ayuda: { es: 'Centro de ayuda', en: 'Help center', pt: 'Central de ajuda', zh: '帮助中心', fr: "Centre d'aide", it: 'Centro assistenza', hi: 'सहायता केंद्र', ar: 'مركز المساعدة' },
    centro_ayuda_desc: { es: 'Preguntas frecuentes y guías', en: 'FAQ and guides', pt: 'Perguntas frequentes e guias', zh: '常见问题和指南', fr: 'Questions fréquentes et guides', it: 'Domande frequenti e guide', hi: 'अक्सर पूछे जाने वाले प्रश्न और गाइड', ar: 'الأسئلة الشائعة والأدلة' },
    calificar_aurex: { es: 'Calificá Cobrex', en: 'Rate Cobrex', pt: 'Avalie o Cobrex', zh: '给Cobrex评分', fr: 'Évaluez Cobrex', it: 'Valuta Cobrex', hi: 'Cobrex को रेट करें', ar: 'قيّم Cobrex' },
    calificar_desc: { es: 'Tu opinión nos ayuda a mejorar', en: 'Your feedback helps us improve', pt: 'Sua opinião nos ajuda a melhorar', zh: '您的意见帮助我们改进', fr: 'Votre avis nous aide à nous améliorer', it: 'La tua opinione ci aiuta a migliorare', hi: 'आपकी राय हमें बेहतर बनाने में मदद करती है', ar: 'رأيك يساعدنا على التحسين' },
    contactar_soporte: { es: 'Contactar soporte', en: 'Contact support', pt: 'Contatar suporte', zh: '联系客服', fr: 'Contacter le support', it: 'Contatta il supporto', hi: 'सहायता से संपर्क करें', ar: 'تواصل مع الدعم' },
    siguenos: { es: 'Síguenos', en: 'Follow us', pt: 'Siga-nos', zh: '关注我们', fr: 'Suivez-nous', it: 'Seguici', hi: 'हमें फ़ॉलो करें', ar: 'تابعنا' },
    version_app: { es: 'Versión de la app', en: 'App version', pt: 'Versão do app', zh: '应用版本', fr: "Version de l'application", it: "Versione dell'app", hi: 'ऐप संस्करण', ar: 'إصدار التطبيق' },
    terminos_uso: { es: 'Términos de uso', en: 'Terms of use', pt: 'Termos de uso', zh: '使用条款', fr: "Conditions d'utilisation", it: "Termini d'uso", hi: 'उपयोग की शर्तें', ar: 'شروط الاستخدام' },
    politica_privacidad: { es: 'Política de privacidad', en: 'Privacy policy', pt: 'Política de privacidade', zh: '隐私政策', fr: 'Politique de confidentialité', it: 'Informativa sulla privacy', hi: 'गोपनीयता नीति', ar: 'سياسة الخصوصية' },
    disclaimer_legal: {
      es: 'Cobrex no es un asesor financiero. Las señales, análisis e indicadores mostrados son generados por algoritmos automatizados y no deben interpretarse como garantía de resultados futuros. Invertir conlleva riesgos, incluida la posible pérdida del capital invertido. Consulte siempre a un asesor financiero certificado antes de tomar decisiones de inversión.',
      en: 'Cobrex is not a financial advisor. The signals, analysis and indicators shown are generated by automated algorithms and should not be interpreted as a guarantee of future results. Investing involves risks, including the possible loss of invested capital. Always consult a certified financial advisor before making investment decisions.',
      pt: 'Cobrex não é um assessor financeiro. Os sinais, análises e indicadores exibidos são gerados por algoritmos automatizados e não devem ser interpretados como garantia de resultados futuros. Investir envolve riscos, incluindo a possível perda do capital investido. Consulte sempre um assessor financeiro certificado antes de tomar decisões de investimento.',
      zh: 'Cobrex不是财务顾问。所显示的信号、分析和指标由自动算法生成，不应被解释为对未来结果的保证。投资涉及风险，包括可能损失投入的资金。在做出投资决策之前，请务必咨询持证财务顾问。',
      fr: "Cobrex n'est pas un conseiller financier. Les signaux, analyses et indicateurs affichés sont générés par des algorithmes automatisés et ne doivent pas être interprétés comme une garantie de résultats futurs. Investir comporte des risques, y compris la perte possible du capital investi. Consultez toujours un conseiller financier certifié avant de prendre des décisions d'investissement.",
      it: "Cobrex non è un consulente finanziario. I segnali, le analisi e gli indicatori mostrati sono generati da algoritmi automatizzati e non devono essere interpretati come garanzia di risultati futuri. Investire comporta rischi, inclusa la possibile perdita del capitale investito. Consultare sempre un consulente finanziario certificato prima di prendere decisioni d'investimento.",
      hi: 'Cobrex एक वित्तीय सलाहकार नहीं है। दिखाए गए सिग्नल, विश्लेषण और संकेतक स्वचालित एल्गोरिदम द्वारा उत्पन्न होते हैं और भविष्य के परिणामों की गारंटी नहीं माने जाने चाहिए। निवेश में जोखिम शामिल है, जिसमें निवेशित पूँजी का संभावित नुकसान भी शामिल है। निवेश निर्णय लेने से पहले हमेशा प्रमाणित वित्तीय सलाहकार से परामर्श लें।',
      ar: 'Cobrex ليس مستشاراً مالياً. الإشارات والتحليلات والمؤشرات المعروضة يتم إنشاؤها بواسطة خوارزميات آلية ولا ينبغي تفسيرها كضمان لنتائج مستقبلية. الاستثمار ينطوي على مخاطر بما في ذلك الخسارة المحتملة لرأس المال المستثمر. استشر دائماً مستشاراً مالياً معتمداً قبل اتخاذ قرارات استثمارية.'
    },
    aviso_legal: { es: 'Aviso Legal', en: 'Legal Notice', pt: 'Aviso Legal', zh: '法律声明', fr: 'Avis Juridique', it: 'Avviso Legale', hi: 'कानूनी सूचना', ar: 'إشعار قانوني' },

    // === B9: SESIÓN ===
    b9_sesion: { es: '🚪 Sesión', en: '🚪 Session', pt: '🚪 Sessão', zh: '🚪 会话', fr: '🚪 Session', it: '🚪 Sessione', hi: '🚪 सत्र', ar: '🚪 الجلسة' },
    cerrar_sesion_desc: { es: 'Vas a salir de tu cuenta en este dispositivo.', en: 'You will log out from your account on this device.', pt: 'Você sairá da sua conta neste dispositivo.', zh: '您将从此设备退出账户。', fr: 'Vous allez vous déconnecter de votre compte sur cet appareil.', it: 'Stai per uscire dal tuo account su questo dispositivo.', hi: 'आप इस डिवाइस पर अपने खाते से लॉग आउट होंगे।', ar: 'ستخرج من حسابك على هذا الجهاز.' },
    cerrar_sesion_btn: { es: '🚪 Cerrar sesión', en: '🚪 Log out', pt: '🚪 Encerrar sessão', zh: '🚪 退出登录', fr: '🚪 Se déconnecter', it: '🚪 Esci', hi: '🚪 लॉग आउट', ar: '🚪 تسجيل الخروج' },
    zona_peligro: { es: '⚠ Zona de peligro', en: '⚠ Danger zone', pt: '⚠ Zona de perigo', zh: '⚠ 危险区域', fr: '⚠ Zone de danger', it: '⚠ Zona di pericolo', hi: '⚠ खतरे का ज़ोन', ar: '⚠ منطقة خطر' },
    eliminar_cuenta_desc: { es: 'Eliminar tu cuenta es una acción irreversible. Se borrarán todos tus datos, portafolio y configuración.', en: 'Deleting your account is irreversible. All your data, portfolio and settings will be erased.', pt: 'Excluir sua conta é uma ação irreversível. Todos os seus dados, portfólio e configurações serão excluídos.', zh: '删除账户是不可逆的操作。您的所有数据、投资组合和设置将被删除。', fr: 'Supprimer votre compte est une action irréversible. Toutes vos données, votre portfolio et votre configuration seront supprimés.', it: "Eliminare il tuo account è un'azione irreversibile. Tutti i tuoi dati, portafoglio e configurazioni verranno eliminati.", hi: 'अपना खाता हटाना एक अपरिवर्तनीय कार्रवाई है। आपका सारा डेटा, portfolio और सेटिंग्स हटा दी जाएँगी।', ar: 'حذف حسابك إجراء لا رجعة فيه. سيتم حذف جميع بياناتك ومحفظتك وإعداداتك.' },
    eliminar_cuenta_btn: { es: '🗑️ Eliminar mi cuenta', en: '🗑️ Delete my account', pt: '🗑️ Excluir minha conta', zh: '🗑️ 删除我的账户', fr: '🗑️ Supprimer mon compte', it: '🗑️ Elimina il mio account', hi: '🗑️ मेरा खाता हटाएँ', ar: '🗑️ حذف حسابي' },
    confirmar_email_elim: { es: 'Escribí tu email para confirmar:', en: 'Enter your email to confirm:', pt: 'Digite seu email para confirmar:', zh: '输入您的邮箱确认：', fr: 'Saisissez votre email pour confirmer :', it: 'Inserisci la tua email per confermare:', hi: 'पुष्टि के लिए अपना ईमेल लिखें:', ar: 'اكتب بريدك الإلكتروني للتأكيد:' },
    cancelar: { es: 'Cancelar', en: 'Cancel', pt: 'Cancelar', zh: '取消', fr: 'Annuler', it: 'Annulla', hi: 'रद्द करें', ar: 'إلغاء' },
    confirmar_eliminacion: { es: 'Confirmar eliminación', en: 'Confirm deletion', pt: 'Confirmar exclusão', zh: '确认删除', fr: 'Confirmer la suppression', it: "Conferma l'eliminazione", hi: 'हटाने की पुष्टि करें', ar: 'تأكيد الحذف' },

    // === MODAL RATING ===
    calificar_titulo: { es: 'Calificá Cobrex', en: 'Rate Cobrex', pt: 'Avalie o Cobrex', zh: '给Cobrex评分', fr: 'Évaluez Cobrex', it: 'Valuta Cobrex', hi: 'Cobrex को रेट करें', ar: 'قيّم Cobrex' },
    calificar_sub: { es: 'Tu opinión nos ayuda a mejorar la app para vos', en: 'Your feedback helps us improve the app for you', pt: 'Sua opinião nos ajuda a melhorar o app para você', zh: '您的意见帮助我们为您改进应用', fr: "Votre avis nous aide à améliorer l'app pour vous", it: "La tua opinione ci aiuta a migliorare l'app per te", hi: 'आपकी राय हमें आपके लिए ऐप बेहतर बनाने में मदद करती है', ar: 'رأيك يساعدنا على تحسين التطبيق لك' },
    enviar: { es: 'Enviar', en: 'Submit', pt: 'Enviar', zh: '提交', fr: 'Envoyer', it: 'Invia', hi: 'भेजें', ar: 'إرسال' },
    rating_excelente: { es: '¡Excelente!', en: 'Excellent!', pt: 'Excelente!', zh: '优秀！', fr: 'Excellent !', it: 'Eccellente!', hi: 'उत्कृष्ट!', ar: 'ممتاز!' },
    rating_muy_buena: { es: '¡Muy buena!', en: 'Very good!', pt: 'Muito bom!', zh: '非常好！', fr: 'Très bien !', it: 'Molto bene!', hi: 'बहुत अच्छा!', ar: 'جيد جداً!' },
    rating_buena: { es: 'Buena', en: 'Good', pt: 'Bom', zh: '好', fr: 'Bien', it: 'Buona', hi: 'अच्छा', ar: 'جيد' },
    rating_gracias_feedback: { es: 'Gracias por tu feedback', en: 'Thanks for your feedback', pt: 'Obrigado pelo seu feedback', zh: '感谢您的反馈', fr: 'Merci pour votre retour', it: 'Grazie per il tuo feedback', hi: 'आपकी प्रतिक्रिया के लिए धन्यवाद', ar: 'شكراً لملاحظاتك' },
    rating_enviada: { es: '¡Gracias! Tu calificación fue enviada', en: 'Thanks! Your rating was submitted', pt: 'Obrigado! Sua avaliação foi enviada', zh: '谢谢！您的评分已提交', fr: 'Merci ! Votre note a été envoyée', it: 'Grazie! La tua valutazione è stata inviata', hi: 'धन्यवाद! आपकी रेटिंग भेज दी गई', ar: 'شكراً! تم إرسال تقييمك' },

    // === MODAL PLANES ===
    elegir_plan: { es: 'Elegir tu plan', en: 'Choose your plan', pt: 'Escolha seu plano', zh: '选择您的方案', fr: 'Choisir votre plan', it: 'Scegli il tuo piano', hi: 'अपनी योजना चुनें', ar: 'اختر خطتك' },
    planes_incluyen_pulse: { es: 'Todos los planes incluyen Cobrex Pulse', en: 'All plans include Cobrex Pulse', pt: 'Todos os planos incluem Cobrex Pulse', zh: '所有方案均包含Cobrex Pulse', fr: 'Tous les plans incluent Cobrex Pulse', it: 'Tutti i piani includono Cobrex Pulse', hi: 'सभी योजनाओं में Cobrex Pulse शामिल है', ar: 'جميع الخطط تشمل Cobrex Pulse' },
    plan_free_subtitle: { es: 'Para empezar a invertir mejor', en: 'To start investing better', pt: 'Para começar a investir melhor', zh: '开始更好地投资', fr: 'Pour commencer à mieux investir', it: 'Per iniziare a investire meglio', hi: 'बेहतर निवेश शुरू करने के लिए', ar: 'للبدء في الاستثمار بشكل أفضل' },
    plan_free_f1: { es: '5 activos en portfolio', en: '5 assets in portfolio', pt: '5 ativos no portfólio', zh: '投资组合5个资产', fr: '5 actifs dans le portfolio', it: '5 asset nel portfolio', hi: 'Portfolio में 5 एसेट', ar: '5 أصول في Portfolio' },
    plan_free_f2: { es: '3 señales IA por día', en: '3 AI signals per day', pt: '3 sinais IA por dia', zh: '每日3个AI信号', fr: '3 signaux IA par jour', it: '3 segnali IA al giorno', hi: 'प्रतिदिन 3 AI सिग्नल', ar: '3 إشارات AI يومياً' },
    plan_free_f3: { es: 'Mercados en tiempo real', en: 'Real-time markets', pt: 'Mercados em tempo real', zh: '实时市场', fr: 'Marchés en temps réel', it: 'Mercati in tempo reale', hi: 'रियल-टाइम बाज़ार', ar: 'أسواق في الوقت الحقيقي' },
    plan_free_f4_pulse: { es: 'Cobrex Pulse', en: 'Cobrex Pulse', pt: 'Cobrex Pulse', zh: 'Cobrex Pulse', fr: 'Cobrex Pulse', it: 'Cobrex Pulse', hi: 'Cobrex Pulse', ar: 'Cobrex Pulse' },
    plan_free_f4_detail: { es: '(indicador, sin detalles)', en: '(indicator, no details)', pt: '(indicador, sem detalhes)', zh: '（指标，无详情）', fr: '(indicateur, sans détails)', it: '(indicatore, senza dettagli)', hi: '(संकेतक, बिना विवरण)', ar: '(مؤشر، بدون تفاصيل)' },
    plan_free_f5: { es: 'Alertas push al celular', en: 'Push alerts to phone', pt: 'Alertas push no celular', zh: '手机推送提醒', fr: 'Alertes push sur le téléphone', it: 'Avvisi push sul cellulare', hi: 'फ़ोन पर पुश अलर्ट', ar: 'تنبيهات Push إلى الهاتف' },
    plan_free_f6: { es: 'Variables y explicación de Pulse', en: 'Pulse variables and explanation', pt: 'Variáveis e explicação do Pulse', zh: 'Pulse变量和说明', fr: 'Variables et explication de Pulse', it: 'Variabili e spiegazione di Pulse', hi: 'Pulse वेरिएबल और व्याख्या', ar: 'متغيرات وشرح Pulse' },
    plan_free_f7: { es: 'Historial de señales', en: 'Signal history', pt: 'Histórico de sinais', zh: '信号历史', fr: 'Historique des signaux', it: 'Storico segnali', hi: 'सिग्नल इतिहास', ar: 'سجل الإشارات' },
    plan_free_f8: { es: 'Sin publicidad', en: 'Ad-free', pt: 'Sem publicidade', zh: '无广告', fr: 'Sans publicité', it: 'Senza pubblicità', hi: 'कोई विज्ञापन नहीं', ar: 'بدون إعلانات' },
    ver_plan_pro: { es: 'Ver plan PRO →', en: 'View PRO plan →', pt: 'Ver plano PRO →', zh: '查看PRO方案 →', fr: 'Voir le plan PRO →', it: 'Vedi piano PRO →', hi: 'PRO योजना देखें →', ar: 'عرض خطة PRO ←' },
    mas_popular: { es: 'MÁS POPULAR', en: 'MOST POPULAR', pt: 'MAIS POPULAR', zh: '最受欢迎', fr: 'PLUS POPULAIRE', it: 'PIÙ POPOLARE', hi: 'सबसे लोकप्रिय', ar: 'الأكثر شعبية' },
    por_mes: { es: '/mes', en: '/mo', pt: '/mês', zh: '/月', fr: '/mois', it: '/mese', hi: '/माह', ar: '/شهر' },
    pro_anual_desc: { es: '$7,79/mes si pagás anual', en: '$7.79/mo if paid annually', pt: '$7,79/mês se pagar anual', zh: '年付$7.79/月', fr: '7,79$/mois si payé annuellement', it: '$7,79/mese se pagato annualmente', hi: 'वार्षिक भुगतान पर $7.79/माह', ar: '$7.79/شهر إذا دُفع سنوياً' },
    plan_pro_subtitle: { es: 'Para el inversor activo', en: 'For the active investor', pt: 'Para o investidor ativo', zh: '适合活跃投资者', fr: "Pour l'investisseur actif", it: "Per l'investitore attivo", hi: 'सक्रिय निवेशक के लिए', ar: 'للمستثمر النشط' },
    plan_pro_f1: { es: 'Activos ilimitados en portfolio', en: 'Unlimited assets in portfolio', pt: 'Ativos ilimitados no portfólio', zh: '投资组合无限资产', fr: 'Actifs illimités dans le portfolio', it: 'Asset illimitati nel portfolio', hi: 'Portfolio में असीमित एसेट', ar: 'أصول غير محدودة في Portfolio' },
    plan_pro_f2: { es: 'Señales IA ilimitadas', en: 'Unlimited AI signals', pt: 'Sinais IA ilimitados', zh: '无限AI信号', fr: 'Signaux IA illimités', it: 'Segnali IA illimitati', hi: 'असीमित AI सिग्नल', ar: 'إشارات AI غير محدودة' },
    plan_pro_f3: { es: 'Alertas push al celular (precio, señal IA, variación)', en: 'Push alerts to phone (price, AI signal, variation)', pt: 'Alertas push no celular (preço, sinal IA, variação)', zh: '手机推送提醒（价格、AI信号、波动）', fr: 'Alertes push sur le téléphone (prix, signal IA, variation)', it: 'Avvisi push sul cellulare (prezzo, segnale IA, variazione)', hi: 'फ़ोन पर पुश अलर्ट (मूल्य, AI सिग्नल, भिन्नता)', ar: 'تنبيهات Push إلى الهاتف (سعر، إشارة AI، تغير)' },
    plan_pro_f4: { es: 'Cobrex Pulse con variables y explicación básica', en: 'Cobrex Pulse with variables and basic explanation', pt: 'Cobrex Pulse com variáveis e explicação básica', zh: 'Cobrex Pulse含变量和基础说明', fr: 'Cobrex Pulse avec variables et explication basique', it: 'Cobrex Pulse con variabili e spiegazione base', hi: 'वेरिएबल और बुनियादी व्याख्या के साथ Cobrex Pulse', ar: 'Cobrex Pulse مع متغيرات وشرح أساسي' },
    plan_pro_f5: { es: 'Sin publicidad', en: 'Ad-free', pt: 'Sem publicidade', zh: '无广告', fr: 'Sans publicité', it: 'Senza pubblicità', hi: 'कोई विज्ञापन नहीं', ar: 'بدون إعلانات' },
    plan_pro_f6: { es: 'Alertas Telegram en tiempo real', en: 'Real-time Telegram alerts', pt: 'Alertas Telegram em tempo real', zh: '实时Telegram提醒', fr: 'Alertes Telegram en temps réel', it: 'Avvisi Telegram in tempo reale', hi: 'रियल-टाइम Telegram अलर्ट', ar: 'تنبيهات Telegram في الوقت الحقيقي' },
    plan_pro_f7: { es: 'Soporte prioritario por email', en: 'Priority email support', pt: 'Suporte prioritário por email', zh: '优先邮件支持', fr: 'Support prioritaire par email', it: 'Supporto prioritario via email', hi: 'ईमेल द्वारा प्राथमिकता सहायता', ar: 'دعم أولوي عبر البريد الإلكتروني' },
    plan_pro_f8: { es: 'Pulse explicación profunda + historial', en: 'Deep Pulse explanation + history', pt: 'Pulse explicação profunda + histórico', zh: 'Pulse深度说明+历史', fr: 'Pulse explication approfondie + historique', it: 'Pulse spiegazione approfondita + storico', hi: 'Pulse गहन व्याख्या + इतिहास', ar: 'Pulse شرح معمّق + سجل' },
    pro_mensual_btn: { es: '🚀 PRO Mensual — $9,99/mes', en: '🚀 PRO Monthly — $9.99/mo', pt: '🚀 PRO Mensal — $9,99/mês', zh: '🚀 PRO月付 — $9.99/月', fr: '🚀 PRO Mensuel — 9,99$/mois', it: '🚀 PRO Mensile — $9,99/mese', hi: '🚀 PRO मासिक — $9.99/माह', ar: '🚀 PRO شهري — $9.99/شهر' },
    pro_anual_btn: { es: '⭐ PRO Anual — $89,99/año', en: '⭐ PRO Annual — $89.99/yr', pt: '⭐ PRO Anual — $89,99/ano', zh: '⭐ PRO年付 — $89.99/年', fr: '⭐ PRO Annuel — 89,99$/an', it: '⭐ PRO Annuale — $89,99/anno', hi: '⭐ PRO वार्षिक — $89.99/वर्ष', ar: '⭐ PRO سنوي — $89.99/سنة' },
    ahorras_25: { es: '(ahorrás 25%)', en: '(save 25%)', pt: '(economize 25%)', zh: '（省25%）', fr: '(économisez 25%)', it: '(risparmi il 25%)', hi: '(25% बचाएँ)', ar: '(وفّر 25%)' },
    elite_anual_desc: { es: '$15,99/mes si pagás anual', en: '$15.99/mo if paid annually', pt: '$15,99/mês se pagar anual', zh: '年付$15.99/月', fr: '15,99$/mois si payé annuellement', it: '$15,99/mese se pagato annualmente', hi: 'वार्षिक भुगतान पर $15.99/माह', ar: '$15.99/شهر إذا دُفع سنوياً' },
    plan_elite_subtitle: { es: 'Para el inversor profesional', en: 'For the professional investor', pt: 'Para o investidor profissional', zh: '适合专业投资者', fr: "Pour l'investisseur professionnel", it: "Per l'investitore professionista", hi: 'पेशेवर निवेशक के लिए', ar: 'للمستثمر المحترف' },
    plan_elite_f1: { es: 'Todo lo incluido en PRO', en: 'Everything included in PRO', pt: 'Tudo incluído no PRO', zh: 'PRO所有功能', fr: 'Tout ce qui est inclus dans PRO', it: 'Tutto incluso nel PRO', hi: 'PRO में शामिल सब कुछ', ar: 'كل ما في PRO' },
    plan_elite_f2: { es: 'Cobrex Pulse completo: variables, explicación profunda e historial', en: 'Full Cobrex Pulse: variables, deep explanation and history', pt: 'Cobrex Pulse completo: variáveis, explicação profunda e histórico', zh: '完整Cobrex Pulse：变量、深度说明和历史', fr: 'Cobrex Pulse complet : variables, explication approfondie et historique', it: 'Cobrex Pulse completo: variabili, spiegazione approfondita e storico', hi: 'पूर्ण Cobrex Pulse: वेरिएबल, गहन व्याख्या और इतिहास', ar: 'Cobrex Pulse كامل: متغيرات وشرح معمّق وسجل' },
    plan_elite_f3: { es: 'Señales IA con nivel de confianza y razón detallada', en: 'AI signals with confidence level and detailed reasoning', pt: 'Sinais IA com nível de confiança e razão detalhada', zh: 'AI信号含置信度和详细理由', fr: 'Signaux IA avec niveau de confiance et raison détaillée', it: 'Segnali IA con livello di fiducia e motivazione dettagliata', hi: 'विश्वास स्तर और विस्तृत कारण के साथ AI सिग्नल', ar: 'إشارات AI مع مستوى الثقة والتبرير المفصّل' },
    plan_elite_f4: { es: 'Análisis técnico avanzado (RSI, MACD)', en: 'Advanced technical analysis (RSI, MACD)', pt: 'Análise técnica avançada (RSI, MACD)', zh: '高级技术分析（RSI, MACD）', fr: 'Analyse technique avancée (RSI, MACD)', it: 'Analisi tecnica avanzata (RSI, MACD)', hi: 'उन्नत तकनीकी विश्लेषण (RSI, MACD)', ar: 'تحليل تقني متقدم (RSI, MACD)' },
    plan_elite_f5: { es: 'Alertas geopolíticas GDELT exclusivas', en: 'Exclusive GDELT geopolitical alerts', pt: 'Alertas geopolíticos GDELT exclusivos', zh: '专属GDELT地缘政治提醒', fr: 'Alertes géopolitiques GDELT exclusives', it: 'Avvisi geopolitici GDELT esclusivi', hi: 'विशेष GDELT भू-राजनीतिक अलर्ट', ar: 'تنبيهات جيوسياسية GDELT حصرية' },
    plan_elite_f6: { es: 'Acceso anticipado a funciones beta', en: 'Early access to beta features', pt: 'Acesso antecipado a funções beta', zh: '抢先体验测试功能', fr: 'Accès anticipé aux fonctionnalités bêta', it: 'Accesso anticipato alle funzionalità beta', hi: 'बीटा सुविधाओं तक शीघ्र पहुँच', ar: 'وصول مبكر إلى ميزات تجريبية' },
    elite_mensual_btn: { es: '👑 ELITE Mensual — $19,99/mes', en: '👑 ELITE Monthly — $19.99/mo', pt: '👑 ELITE Mensal — $19,99/mês', zh: '👑 ELITE月付 — $19.99/月', fr: '👑 ELITE Mensuel — 19,99$/mois', it: '👑 ELITE Mensile — $19,99/mese', hi: '👑 ELITE मासिक — $19.99/माह', ar: '👑 ELITE شهري — $19.99/شهر' },
    elite_anual_btn: { es: '⭐ ELITE Anual — $179,99/año', en: '⭐ ELITE Annual — $179.99/yr', pt: '⭐ ELITE Anual — $179,99/ano', zh: '⭐ ELITE年付 — $179.99/年', fr: '⭐ ELITE Annuel — 179,99$/an', it: '⭐ ELITE Annuale — $179,99/anno', hi: '⭐ ELITE वार्षिक — $179.99/वर्ष', ar: '⭐ ELITE سنوي — $179.99/سنة' },

    // === AVISO LEGAL POPUP ===
    aviso_legal_titulo: { es: '⚖️ AVISO LEGAL', en: '⚖️ LEGAL NOTICE', pt: '⚖️ AVISO LEGAL', zh: '⚖️ 法律声明', fr: '⚖️ AVIS JURIDIQUE', it: '⚖️ AVVISO LEGALE', hi: '⚖️ कानूनी सूचना', ar: '⚖️ إشعار قانوني' },
    aviso_legal_p1: {
      es: 'La información proporcionada por Cobrex tiene carácter exclusivamente informativo y educativo. No constituye asesoramiento financiero, recomendación de inversión, ni oferta de compra o venta de ningún activo financiero.',
      en: 'The information provided by Cobrex is exclusively informational and educational. It does not constitute financial advice, investment recommendation, or offer to buy or sell any financial asset.',
      pt: 'As informações fornecidas pela Cobrex têm caráter exclusivamente informativo e educativo. Não constituem aconselhamento financeiro, recomendação de investimento, nem oferta de compra ou venda de qualquer ativo financeiro.',
      zh: 'Cobrex提供的信息仅供参考和教育目的。不构成财务建议、投资推荐或任何金融资产的买卖要约。',
      fr: "Les informations fournies par Cobrex sont exclusivement à caractère informatif et éducatif. Elles ne constituent pas un conseil financier, une recommandation d'investissement, ni une offre d'achat ou de vente d'un actif financier.",
      it: "Le informazioni fornite da Cobrex hanno carattere esclusivamente informativo ed educativo. Non costituiscono consulenza finanziaria, raccomandazione d'investimento, né offerta di acquisto o vendita di alcun asset finanziario.",
      hi: 'Cobrex द्वारा प्रदान की गई जानकारी विशेष रूप से सूचनात्मक और शैक्षिक उद्देश्यों के लिए है। यह वित्तीय सलाह, निवेश की सिफ़ारिश, या किसी भी वित्तीय एसेट को खरीदने या बेचने का प्रस्ताव नहीं है।',
      ar: 'المعلومات المقدمة من Cobrex ذات طابع إعلامي وتعليمي حصرياً. لا تشكل استشارة مالية أو توصية استثمارية أو عرضاً لشراء أو بيع أي أصل مالي.'
    },
    aviso_legal_p2: {
      es: 'Las señales, análisis e indicadores mostrados son generados por algoritmos automatizados y no deben interpretarse como garantía de resultados futuros. Invertir conlleva riesgos, incluida la posible pérdida del capital invertido.',
      en: 'The signals, analysis and indicators shown are generated by automated algorithms and should not be interpreted as a guarantee of future results. Investing involves risks, including the possible loss of invested capital.',
      pt: 'Os sinais, análises e indicadores exibidos são gerados por algoritmos automatizados e não devem ser interpretados como garantia de resultados futuros. Investir envolve riscos, incluindo a possível perda do capital investido.',
      zh: '所显示的信号、分析和指标由自动算法生成，不应被解释为对未来结果的保证。投资涉及风险，包括可能损失投入的资金。',
      fr: "Les signaux, analyses et indicateurs affichés sont générés par des algorithmes automatisés et ne doivent pas être interprétés comme une garantie de résultats futurs. Investir comporte des risques, y compris la perte possible du capital investi.",
      it: 'I segnali, le analisi e gli indicatori mostrati sono generati da algoritmi automatizzati e non devono essere interpretati come garanzia di risultati futuri. Investire comporta rischi, inclusa la possibile perdita del capitale investito.',
      hi: 'दिखाए गए सिग्नल, विश्लेषण और संकेतक स्वचालित एल्गोरिदम द्वारा उत्पन्न होते हैं और भविष्य के परिणामों की गारंटी नहीं माने जाने चाहिए। निवेश में जोखिम शामिल है, जिसमें निवेशित पूँजी का संभावित नुकसान भी शामिल है।',
      ar: 'الإشارات والتحليلات والمؤشرات المعروضة يتم إنشاؤها بواسطة خوارزميات آلية ولا ينبغي تفسيرها كضمان لنتائج مستقبلية. الاستثمار ينطوي على مخاطر بما في ذلك الخسارة المحتملة لرأس المال المستثمر.'
    },
    aviso_legal_p3: {
      es: 'Consulte siempre a un asesor financiero certificado antes de tomar decisiones de inversión.',
      en: 'Always consult a certified financial advisor before making investment decisions.',
      pt: 'Consulte sempre um assessor financeiro certificado antes de tomar decisões de investimento.',
      zh: '在做出投资决策之前，请务必咨询持证财务顾问。',
      fr: "Consultez toujours un conseiller financier certifié avant de prendre des décisions d'investissement.",
      it: "Consultare sempre un consulente finanziario certificato prima di prendere decisioni d'investimento.",
      hi: 'निवेश निर्णय लेने से पहले हमेशा प्रमाणित वित्तीय सलाहकार से परामर्श लें।',
      ar: 'استشر دائماً مستشاراً مالياً معتمداً قبل اتخاذ قرارات استثمارية.'
    },
    aviso_legal_cerrar: { es: '✕ Cerrar', en: '✕ Close', pt: '✕ Fechar', zh: '✕ 关闭', fr: '✕ Fermer', it: '✕ Chiudi', hi: '✕ बंद करें', ar: '✕ إغلاق' },

    // === PORTFOLIO ===

    // Header
    port_header_title: { es: 'Portfolio', en: 'Portfolio', pt: 'Portfólio', zh: '投资组合', fr: 'Portfolio', it: 'Portfolio', hi: 'Portfolio', ar: 'Portfolio' },
    port_valor_total: { es: 'VALOR TOTAL', en: 'TOTAL VALUE', pt: 'VALOR TOTAL', zh: '总价值', fr: 'VALEUR TOTALE', it: 'VALORE TOTALE', hi: 'कुल मूल्य', ar: 'القيمة الإجمالية' },
    port_period_24h: { es: '24 horas', en: '24 hours', pt: '24 horas', zh: '24小时', fr: '24 heures', it: '24 ore', hi: '24 घंटे', ar: '24 ساعة' },
    port_period_7d: { es: '7 días', en: '7 days', pt: '7 dias', zh: '7天', fr: '7 jours', it: '7 giorni', hi: '7 दिन', ar: '7 أيام' },
    port_period_1m: { es: '1 mes', en: '1 month', pt: '1 mês', zh: '1个月', fr: '1 mois', it: '1 mese', hi: '1 महीना', ar: 'شهر واحد' },
    port_period_3m: { es: '3 meses', en: '3 months', pt: '3 meses', zh: '3个月', fr: '3 mois', it: '3 mesi', hi: '3 महीने', ar: '3 أشهر' },
    port_period_1y: { es: '1 año', en: '1 year', pt: '1 ano', zh: '1年', fr: '1 an', it: '1 anno', hi: '1 वर्ष', ar: 'سنة واحدة' },
    port_period_buy: { es: 'Desde compra', en: 'Since purchase', pt: 'Desde compra', zh: '自购买', fr: "Depuis l'achat", it: "Dall'acquisto", hi: 'खरीद से', ar: 'منذ الشراء' },
    port_activos_label: { es: 'Activos', en: 'Assets', pt: 'Ativos', zh: '资产', fr: 'Actifs', it: 'Asset', hi: 'एसेट', ar: 'أصول' },
    port_mejor_24h: { es: '🏆 Mejor 24h', en: '🏆 Best 24h', pt: '🏆 Melhor 24h', zh: '🏆 最佳24h', fr: '🏆 Meilleur 24h', it: '🏆 Migliore 24h', hi: '🏆 श्रेष्ठ 24h', ar: '🏆 الأفضل 24س' },
    port_agregar_activos: { es: 'Agregar Activos ＋', en: 'Add Assets ＋', pt: 'Adicionar Ativos ＋', zh: '添加资产 ＋', fr: 'Ajouter Actifs ＋', it: 'Aggiungi Asset ＋', hi: 'एसेट जोड़ें ＋', ar: 'إضافة أصول ＋' },
    port_conv_btn: { es: '⇄ Conv.', en: '⇄ Conv.', pt: '⇄ Conv.', zh: '⇄ 换算', fr: '⇄ Conv.', it: '⇄ Conv.', hi: '⇄ कन्व.', ar: '⇄ تحويل' },

    // Modal Detalle
    port_detalle_title: { es: 'Detalle', en: 'Detail', pt: 'Detalhe', zh: '详情', fr: 'Détail', it: 'Dettaglio', hi: 'विवरण', ar: 'التفاصيل' },

    // Modal Agregar
    port_agregar_activo: { es: 'Agregar activo', en: 'Add asset', pt: 'Adicionar ativo', zh: '添加资产', fr: 'Ajouter un actif', it: 'Aggiungi asset', hi: 'एसेट जोड़ें', ar: 'إضافة أصل' },

    // Modal Conversor
    port_conversor_title: { es: 'Conversor', en: 'Converter', pt: 'Conversor', zh: '换算器', fr: 'Convertisseur', it: 'Convertitore', hi: 'कनवर्टर', ar: 'المحوّل' },
    port_conv_monto: { es: 'Monto', en: 'Amount', pt: 'Valor', zh: '金额', fr: 'Montant', it: 'Importo', hi: 'राशि', ar: 'المبلغ' },
    port_conv_de: { es: 'De', en: 'From', pt: 'De', zh: '从', fr: 'De', it: 'Da', hi: 'से', ar: 'من' },
    port_conv_a: { es: 'A', en: 'To', pt: 'Para', zh: '到', fr: 'À', it: 'A', hi: 'को', ar: 'إلى' },
    port_conv_resultado: { es: 'Resultado', en: 'Result', pt: 'Resultado', zh: '结果', fr: 'Résultat', it: 'Risultato', hi: 'परिणाम', ar: 'النتيجة' },
    port_conv_placeholder: { es: 'Ingresá un monto para convertir', en: 'Enter an amount to convert', pt: 'Insira um valor para converter', zh: '输入要换算的金额', fr: 'Entrez un montant à convertir', it: 'Inserisci un importo da convertire', hi: 'कनवर्ट करने के लिए राशि दर्ज करें', ar: 'أدخل مبلغاً للتحويل' },
    port_conv_loading: { es: 'Obteniendo precios...', en: 'Getting prices...', pt: 'Obtendo preços...', zh: '获取价格中...', fr: 'Obtention des prix...', it: 'Ottenimento prezzi...', hi: 'मूल्य प्राप्त हो रहे हैं...', ar: 'جلب الأسعار...' },
    port_conv_live: { es: 'Precios en vivo via Binance', en: 'Live prices via Binance', pt: 'Preços ao vivo via Binance', zh: '通过Binance实时价格', fr: 'Prix en direct via Binance', it: 'Prezzi live via Binance', hi: 'Binance से लाइव मूल्य', ar: 'أسعار مباشرة عبر Binance' },
    port_conv_offline: { es: 'Precios sin conexion (aprox)', en: 'Offline prices (approx)', pt: 'Preços offline (aprox)', zh: '离线价格（近似）', fr: 'Prix hors ligne (approx)', it: 'Prezzi offline (approx)', hi: 'ऑफ़लाइन मूल्य (अनुमानित)', ar: 'أسعار دون اتصال (تقريبية)' },

    // Asset Picker
    port_picker_title: { es: 'Seleccionar activo', en: 'Select asset', pt: 'Selecionar ativo', zh: '选择资产', fr: 'Sélectionner un actif', it: 'Seleziona asset', hi: 'एसेट चुनें', ar: 'اختر أصلاً' },
    port_picker_search_placeholder: { es: 'Buscar por nombre o ticker...', en: 'Search by name or ticker...', pt: 'Buscar por nome ou ticker...', zh: '按名称或代码搜索...', fr: 'Rechercher par nom ou ticker...', it: 'Cerca per nome o ticker...', hi: 'नाम या टिकर से खोजें...', ar: 'البحث بالاسم أو الرمز...' },
    port_picker_fiat: { es: 'Monedas Fiat', en: 'Fiat Currencies', pt: 'Moedas Fiat', zh: '法定货币', fr: 'Monnaies Fiat', it: 'Valute Fiat', hi: 'फिएट मुद्राएँ', ar: 'عملات ورقية' },
    port_picker_stocks: { es: 'Acciones USA', en: 'US Stocks', pt: 'Ações EUA', zh: '美股', fr: 'Actions US', it: 'Azioni USA', hi: 'अमेरिकी स्टॉक', ar: 'أسهم أمريكية' },

    // Estado vacío
    port_empty_title: { es: 'Tu portfolio esta vacio', en: 'Your portfolio is empty', pt: 'Seu portfólio está vazio', zh: '您的投资组合为空', fr: 'Votre portfolio est vide', it: 'Il tuo portfolio è vuoto', hi: 'आपका portfolio खाली है', ar: 'محفظتك فارغة' },
    port_empty_desc: { es: 'Agrega tu primer activo para empezar a seguir tu cartera en tiempo real', en: 'Add your first asset to start tracking your portfolio in real time', pt: 'Adicione seu primeiro ativo para começar a acompanhar seu portfólio em tempo real', zh: '添加您的第一个资产以开始实时跟踪您的投资组合', fr: 'Ajoutez votre premier actif pour commencer à suivre votre portefeuille en temps réel', it: 'Aggiungi il tuo primo asset per iniziare a seguire il tuo portafoglio in tempo reale', hi: 'रियल-टाइम में अपने portfolio को ट्रैक करने के लिए अपना पहला एसेट जोड़ें', ar: 'أضف أول أصل لبدء متابعة محفظتك في الوقت الحقيقي' },
    port_empty_btn: { es: '+ Agregar primer activo', en: '+ Add first asset', pt: '+ Adicionar primeiro ativo', zh: '+ 添加第一个资产', fr: '+ Ajouter le premier actif', it: '+ Aggiungi primo asset', hi: '+ पहला एसेट जोड़ें', ar: '+ إضافة أول أصل' },

    // Cuenta requerida
    port_need_account_title: { es: 'Necesitás una cuenta', en: 'You need an account', pt: 'Você precisa de uma conta', zh: '您需要一个账户', fr: 'Vous avez besoin d\'un compte', it: 'Hai bisogno di un account', hi: 'आपको एक खाता चाहिए', ar: 'تحتاج إلى حساب' },
    port_need_account_desc: { es: 'Para guardar activos reales, creá tu cuenta gratis.', en: 'To save real assets, create your free account.', pt: 'Para salvar ativos reais, crie sua conta grátis.', zh: '要保存真实资产，请创建免费账户。', fr: 'Pour sauvegarder des actifs réels, créez votre compte gratuit.', it: 'Per salvare asset reali, crea il tuo account gratuito.', hi: 'वास्तविक एसेट सहेजने के लिए मुफ़्त खाता बनाएँ।', ar: 'لحفظ أصول حقيقية، أنشئ حسابك المجاني.' },
    port_need_account_btn: { es: 'Crear cuenta gratis →', en: 'Create free account →', pt: 'Criar conta grátis →', zh: '创建免费账户 →', fr: 'Créer un compte gratuit →', it: 'Crea account gratuito →', hi: 'मुफ़्त खाता बनाएँ →', ar: 'إنشاء حساب مجاني ←' },
    port_need_account_login: { es: 'Ya tengo cuenta', en: 'I already have an account', pt: 'Já tenho conta', zh: '我已有账户', fr: "J'ai déjà un compte", it: 'Ho già un account', hi: 'मेरा खाता पहले से है', ar: 'لدي حساب بالفعل' },

    // Modal Agregar — campos
    port_search_placeholder: { es: 'Buscar ticker o nombre (ej: IBIT, HOOD, BTC...)', en: 'Search ticker or name (e.g.: IBIT, HOOD, BTC...)', pt: 'Buscar ticker ou nome (ex: IBIT, HOOD, BTC...)', zh: '搜索代码或名称（例：IBIT, HOOD, BTC...）', fr: 'Rechercher ticker ou nom (ex : IBIT, HOOD, BTC...)', it: 'Cerca ticker o nome (es: IBIT, HOOD, BTC...)', hi: 'टिकर या नाम खोजें (उदा: IBIT, HOOD, BTC...)', ar: 'البحث بالرمز أو الاسم (مثل: IBIT, HOOD, BTC...)' },
    port_cantidad_label: { es: 'Cantidad', en: 'Quantity', pt: 'Quantidade', zh: '数量', fr: 'Quantité', it: 'Quantità', hi: 'मात्रा', ar: 'الكمية' },
    port_cantidad_placeholder: { es: 'Ej: 0.5', en: 'E.g.: 0.5', pt: 'Ex: 0.5', zh: '例：0.5', fr: 'Ex : 0.5', it: 'Es: 0.5', hi: 'उदा: 0.5', ar: 'مثال: 0.5' },
    port_precio_compra_label: { es: 'Precio de compra (USD)', en: 'Purchase price (USD)', pt: 'Preço de compra (USD)', zh: '购买价格 (USD)', fr: "Prix d'achat (USD)", it: 'Prezzo di acquisto (USD)', hi: 'खरीद मूल्य (USD)', ar: 'سعر الشراء (USD)' },
    port_precio_placeholder: { es: 'Ej: 65000', en: 'E.g.: 65000', pt: 'Ex: 65000', zh: '例：65000', fr: 'Ex : 65000', it: 'Es: 65000', hi: 'उदा: 65000', ar: 'مثال: 65000' },
    port_preview_title: { es: '📊 VISTA PREVIA', en: '📊 PREVIEW', pt: '📊 PRÉ-VISUALIZAÇÃO', zh: '📊 预览', fr: '📊 APERÇU', it: '📊 ANTEPRIMA', hi: '📊 पूर्वावलोकन', ar: '📊 معاينة' },
    port_preview_precio_mercado: { es: 'Precio actual de mercado:', en: 'Current market price:', pt: 'Preço atual de mercado:', zh: '当前市场价格：', fr: 'Prix actuel du marché :', it: 'Prezzo attuale di mercato:', hi: 'वर्तमान बाज़ार मूल्य:', ar: 'سعر السوق الحالي:' },
    port_preview_valor_sumara: { es: 'Valor que sumará al portfolio:', en: 'Value to add to portfolio:', pt: 'Valor que somará ao portfólio:', zh: '将添加到投资组合的价值：', fr: 'Valeur ajoutée au portfolio :', it: 'Valore che si aggiungerà al portfolio:', hi: 'Portfolio में जुड़ने वाला मूल्य:', ar: 'القيمة المضافة إلى Portfolio:' },
    port_preview_pnl_inicial: { es: 'P&L inicial (vs precio compra):', en: 'Initial P&L (vs purchase price):', pt: 'P&L inicial (vs preço compra):', zh: '初始盈亏（对比购买价）：', fr: "P&L initial (vs prix d'achat) :", it: 'P&L iniziale (vs prezzo acquisto):', hi: 'प्रारंभिक P&L (खरीद मूल्य बनाम):', ar: 'P&L الأولي (مقابل سعر الشراء):' },

    // Búsqueda
    port_buscando: { es: 'Buscando...', en: 'Searching...', pt: 'Buscando...', zh: '搜索中...', fr: 'Recherche...', it: 'Ricerca...', hi: 'खोज रहे हैं...', ar: 'جارٍ البحث...' },
    port_sin_resultados: { es: 'Sin resultados para "', en: 'No results for "', pt: 'Sem resultados para "', zh: '没有找到"', fr: 'Aucun résultat pour "', it: 'Nessun risultato per "', hi: 'कोई परिणाम नहीं "', ar: 'لا نتائج لـ "' },
    port_cargando: { es: 'Cargando...', en: 'Loading...', pt: 'Carregando...', zh: '加载中...', fr: 'Chargement...', it: 'Caricamento...', hi: 'लोड हो रहा है...', ar: 'جارٍ التحميل...' },

    // Validaciones
    port_err_select_activo: { es: 'Seleccioná un activo de la lista', en: 'Select an asset from the list', pt: 'Selecione um ativo da lista', zh: '请从列表中选择资产', fr: 'Sélectionnez un actif de la liste', it: 'Seleziona un asset dalla lista', hi: 'सूची से एसेट चुनें', ar: 'اختر أصلاً من القائمة' },
    port_err_cantidad: { es: 'Ingresá una cantidad mayor a 0', en: 'Enter a quantity greater than 0', pt: 'Insira uma quantidade maior que 0', zh: '请输入大于0的数量', fr: 'Entrez une quantité supérieure à 0', it: 'Inserisci una quantità maggiore di 0', hi: '0 से अधिक मात्रा दर्ज करें', ar: 'أدخل كمية أكبر من 0' },
    port_err_precio: { es: 'Ingresá un precio de compra mayor a 0', en: 'Enter a purchase price greater than 0', pt: 'Insira um preço de compra maior que 0', zh: '请输入大于0的购买价格', fr: "Entrez un prix d'achat supérieur à 0", it: 'Inserisci un prezzo di acquisto maggiore di 0', hi: '0 से अधिक खरीद मूल्य दर्ज करें', ar: 'أدخل سعر شراء أكبر من 0' },

    // Modal Duplicados
    port_dupe_title_suffix: { es: 'ya está en tu portfolio', en: 'is already in your portfolio', pt: 'já está no seu portfólio', zh: '已在您的投资组合中', fr: 'est déjà dans votre portfolio', it: 'è già nel tuo portfolio', hi: 'पहले से आपके portfolio में है', ar: 'موجود بالفعل في محفظتك' },
    port_dupe_question: { es: '¿Qué querés hacer?', en: 'What do you want to do?', pt: 'O que você quer fazer?', zh: '您想怎么做？', fr: 'Que voulez-vous faire ?', it: 'Cosa vuoi fare?', hi: 'आप क्या करना चाहते हैं?', ar: 'ماذا تريد أن تفعل؟' },
    port_dupe_actual: { es: 'ACTUAL', en: 'CURRENT', pt: 'ATUAL', zh: '当前', fr: 'ACTUEL', it: 'ATTUALE', hi: 'वर्तमान', ar: 'الحالي' },
    port_precio_compra_short: { es: 'Precio compra', en: 'Purchase price', pt: 'Preço compra', zh: '购买价格', fr: "Prix d'achat", it: 'Prezzo acquisto', hi: 'खरीद मूल्य', ar: 'سعر الشراء' },
    port_dupe_nuevo: { es: 'NUEVO', en: 'NEW', pt: 'NOVO', zh: '新', fr: 'NOUVEAU', it: 'NUOVO', hi: 'नया', ar: 'جديد' },
    port_dupe_sumar: { es: '➕ Sumar al existente', en: '➕ Add to existing', pt: '➕ Somar ao existente', zh: '➕ 合并到现有', fr: "➕ Ajouter à l'existant", it: '➕ Somma al esistente', hi: '➕ मौजूद में जोड़ें', ar: '➕ إضافة إلى الموجود' },
    port_dupe_total: { es: 'Total:', en: 'Total:', pt: 'Total:', zh: '总计：', fr: 'Total :', it: 'Totale:', hi: 'कुल:', ar: 'المجموع:' },
    port_dupe_promedio: { es: 'Precio promedio ponderado:', en: 'Weighted avg price:', pt: 'Preço médio ponderado:', zh: '加权平均价格：', fr: 'Prix moyen pondéré :', it: 'Prezzo medio ponderato:', hi: 'भारित औसत मूल्य:', ar: 'متوسط السعر المرجح:' },
    port_dupe_reemplazar: { es: '↻ Reemplazar valores', en: '↻ Replace values', pt: '↻ Substituir valores', zh: '↻ 替换数值', fr: '↻ Remplacer les valeurs', it: '↻ Sostituisci valori', hi: '↻ मान बदलें', ar: '↻ استبدال القيم' },
    port_dupe_descarta: { es: 'Descarta lo anterior · Nuevo:', en: 'Discards previous · New:', pt: 'Descarta o anterior · Novo:', zh: '丢弃之前的 · 新：', fr: "Supprime l'ancien · Nouveau :", it: 'Scarta il precedente · Nuovo:', hi: 'पिछला हटाएँ · नया:', ar: 'تجاهل السابق · جديد:' },

    // Termómetro de Riesgo
    port_thermo_title: { es: '🌡️ Termómetro de Riesgo', en: '🌡️ Risk Thermometer', pt: '🌡️ Termômetro de Risco', zh: '🌡️ 风险温度计', fr: '🌡️ Thermomètre de Risque', it: '🌡️ Termometro di Rischio', hi: '🌡️ जोखिम थर्मामीटर', ar: '🌡️ مقياس المخاطر' },
    port_thermo_desc: { es: 'Muestra cómo está distribuido el capital de tu cartera según las señales activas de Cobrex IA:', en: 'Shows how your portfolio capital is distributed according to active Cobrex AI signals:', pt: 'Mostra como o capital do seu portfólio está distribuído segundo os sinais ativos da Cobrex IA:', zh: '显示您的投资组合资金如何根据Cobrex AI活跃信号分布：', fr: 'Montre comment le capital de votre portefeuille est réparti selon les signaux actifs Cobrex IA :', it: 'Mostra come il capitale del tuo portafoglio è distribuito secondo i segnali attivi di Cobrex IA:', hi: 'दिखाता है कि Cobrex AI सक्रिय सिग्नल के अनुसार आपका portfolio पूँजी कैसे वितरित है:', ar: 'يوضح كيف يتوزع رأس مال محفظتك وفقاً لإشارات Cobrex AI النشطة:' },
    port_signal_alcista: { es: 'ALCISTA', en: 'BULLISH', pt: 'ALTISTA', zh: '看涨', fr: 'HAUSSIER', it: 'RIALZISTA', hi: 'तेज़ी', ar: 'صاعد' },
    port_thermo_alcista_desc: { es: 'La IA ve momentum positivo: precio subiendo, volumen comprador. Alta probabilidad de suba en 24-48hs.', en: 'AI sees positive momentum: price rising, buying volume. High probability of increase in 24-48h.', pt: 'A IA vê momentum positivo: preço subindo, volume comprador. Alta probabilidade de alta em 24-48h.', zh: 'AI检测到正面动能：价格上涨，买入量增加。24-48小时内上涨概率高。', fr: "L'IA voit un momentum positif : prix en hausse, volume acheteur. Forte probabilité de hausse en 24-48h.", it: "L'IA vede momentum positivo: prezzo in salita, volume acquisti. Alta probabilità di rialzo in 24-48h.", hi: 'AI सकारात्मक गति देख रहा है: मूल्य बढ़ रहा है, खरीद मात्रा। 24-48 घंटे में वृद्धि की उच्च संभावना।', ar: 'الذكاء الاصطناعي يرى زخماً إيجابياً: السعر يرتفع، حجم شراء. احتمال ارتفاع عالٍ خلال 24-48 ساعة.' },
    port_signal_alta_conv: { es: 'ALTA CONV-IA', en: 'HIGH CONV-AI', pt: 'ALTA CONV-IA', zh: '高度AI收敛', fr: 'HAUTE CONV-IA', it: 'ALTA CONV-IA', hi: 'उच्च CONV-AI', ar: 'تقارب AI عالي' },
    port_thermo_conv_desc: { es: 'La señal más valiosa y rara. Máxima atención: movimiento fuerte inminente. Solo 1-2 activos por día reciben esta señal.', en: 'The most valuable and rare signal. Maximum attention: strong move imminent. Only 1-2 assets per day receive this signal.', pt: 'O sinal mais valioso e raro. Máxima atenção: movimento forte iminente. Apenas 1-2 ativos por dia recebem este sinal.', zh: '最有价值和稀有的信号。最高关注：即将出现强烈走势。每天仅1-2个资产收到此信号。', fr: 'Le signal le plus précieux et rare. Attention maximale : mouvement fort imminent. Seuls 1-2 actifs par jour reçoivent ce signal.', it: 'Il segnale più prezioso e raro. Massima attenzione: movimento forte imminente. Solo 1-2 asset al giorno ricevono questo segnale.', hi: 'सबसे मूल्यवान और दुर्लभ सिग्नल। अधिकतम ध्यान: मजबूत चाल आसन्न। प्रतिदिन केवल 1-2 एसेट को यह सिग्नल मिलता है।', ar: 'الإشارة الأكثر قيمة وندرة. انتباه أقصى: حركة قوية وشيكة. فقط 1-2 أصول يومياً تتلقى هذه الإشارة.' },
    port_signal_bajista: { es: 'BAJISTA', en: 'BEARISH', pt: 'BAIXISTA', zh: '看跌', fr: 'BAISSIER', it: 'RIBASSISTA', hi: 'मंदी', ar: 'هابط' },
    port_thermo_bajista_desc: { es: 'La IA ve momentum negativo: precio cayendo, volumen vendedor. Alta probabilidad de baja en 24-48hs.', en: 'AI sees negative momentum: price falling, selling volume. High probability of decline in 24-48h.', pt: 'A IA vê momentum negativo: preço caindo, volume vendedor. Alta probabilidade de queda em 24-48h.', zh: 'AI检测到负面动能：价格下跌，卖出量增加。24-48小时内下跌概率高。', fr: "L'IA voit un momentum négatif : prix en baisse, volume vendeur. Forte probabilité de baisse en 24-48h.", it: "L'IA vede momentum negativo: prezzo in calo, volume vendite. Alta probabilità di ribasso in 24-48h.", hi: 'AI नकारात्मक गति देख रहा है: मूल्य गिर रहा है, बिक्री मात्रा। 24-48 घंटे में गिरावट की उच्च संभावना।', ar: 'الذكاء الاصطناعي يرى زخماً سلبياً: السعر ينخفض، حجم بيع. احتمال انخفاض عالٍ خلال 24-48 ساعة.' },
    port_signal_sin_senal: { es: 'SIN SEÑAL', en: 'NO SIGNAL', pt: 'SEM SINAL', zh: '无信号', fr: 'SANS SIGNAL', it: 'SENZA SEGNALE', hi: 'कोई सिग्नल नहीं', ar: 'بدون إشارة' },
    port_thermo_sin_senal_desc: { es: 'No hay señal activa hoy para este activo. No es una alerta, simplemente el modelo no detectó nada destacable.', en: 'No active signal today for this asset. Not an alert, the model simply did not detect anything notable.', pt: 'Não há sinal ativo hoje para este ativo. Não é um alerta, simplesmente o modelo não detectou nada notável.', zh: '今天该资产没有活跃信号。这不是警报，只是模型未检测到任何值得注意的情况。', fr: "Pas de signal actif aujourd'hui pour cet actif. Ce n'est pas une alerte, le modèle n'a simplement rien détecté de notable.", it: "Nessun segnale attivo oggi per questo asset. Non è un avviso, semplicemente il modello non ha rilevato nulla di notevole.", hi: 'आज इस एसेट के लिए कोई सक्रिय सिग्नल नहीं। यह अलर्ट नहीं है, बस मॉडल ने कुछ उल्लेखनीय नहीं पाया।', ar: 'لا إشارة نشطة اليوم لهذا الأصل. ليس تنبيهاً، ببساطة لم يكتشف النموذج شيئاً ملحوظاً.' },
    port_entendido: { es: 'Entendido', en: 'Got it', pt: 'Entendido', zh: '明白了', fr: 'Compris', it: 'Capito', hi: 'समझ गया', ar: 'فهمت' },

    // Thermo Help
    port_thermo_help_title: { es: '🌡️ Cómo leer el Termómetro', en: '🌡️ How to read the Thermometer', pt: '🌡️ Como ler o Termômetro', zh: '🌡️ 如何解读温度计', fr: '🌡️ Comment lire le Thermomètre', it: '🌡️ Come leggere il Termometro', hi: '🌡️ थर्मामीटर कैसे पढ़ें', ar: '🌡️ كيف تقرأ المقياس' },
    port_thermo_help_verde: { es: '🟢 Verde — Alcista', en: '🟢 Green — Bullish', pt: '🟢 Verde — Altista', zh: '🟢 绿色 — 看涨', fr: '🟢 Vert — Haussier', it: '🟢 Verde — Rialzista', hi: '🟢 हरा — तेज़ी', ar: '🟢 أخضر — صاعد' },
    port_thermo_help_verde_desc: { es: 'Señal confirmada de suba. Buen momento para mantener o aumentar posición.', en: 'Confirmed upward signal. Good time to hold or increase position.', pt: 'Sinal confirmado de alta. Bom momento para manter ou aumentar posição.', zh: '确认的上涨信号。持有或增加仓位的好时机。', fr: 'Signal confirmé de hausse. Bon moment pour maintenir ou augmenter la position.', it: 'Segnale confermato di rialzo. Buon momento per mantenere o aumentare la posizione.', hi: 'वृद्धि का पुष्ट सिग्नल। स्थिति बनाए रखने या बढ़ाने का अच्छा समय।', ar: 'إشارة صعود مؤكدة. وقت مناسب للاحتفاظ أو زيادة المركز.' },
    port_thermo_help_rojo: { es: '🔴 Rojo — Bajista', en: '🔴 Red — Bearish', pt: '🔴 Vermelho — Baixista', zh: '🔴 红色 — 看跌', fr: '🔴 Rouge — Baissier', it: '🔴 Rosso — Ribassista', hi: '🔴 लाल — मंदी', ar: '🔴 أحمر — هابط' },
    port_thermo_help_rojo_desc: { es: 'Señal confirmada de caída. Evaluá reducir antes de que baje más.', en: 'Confirmed downward signal. Consider reducing before it drops further.', pt: 'Sinal confirmado de queda. Avalie reduzir antes que caia mais.', zh: '确认的下跌信号。考虑在进一步下跌前减仓。', fr: 'Signal confirmé de baisse. Envisagez de réduire avant que ça baisse davantage.', it: 'Segnale confermato di ribasso. Valuta di ridurre prima che scenda ancora.', hi: 'गिरावट का पुष्ट सिग्नल। और गिरने से पहले कम करने पर विचार करें।', ar: 'إشارة هبوط مؤكدة. فكر في التقليل قبل أن ينخفض أكثر.' },
    port_thermo_help_dorado: { es: '⚡ Dorado — Sin dirección', en: '⚡ Gold — No direction', pt: '⚡ Dourado — Sem direção', zh: '⚡ 金色 — 无方向', fr: '⚡ Doré — Sans direction', it: '⚡ Oro — Senza direzione', hi: '⚡ सुनहरा — दिशाहीन', ar: '⚡ ذهبي — بدون اتجاه' },
    port_thermo_help_dorado_desc: { es: 'Movimiento fuerte inminente sin confirmar. Esperá la señal — no operar todavía.', en: 'Strong unconfirmed move imminent. Wait for signal — do not trade yet.', pt: 'Movimento forte iminente sem confirmação. Espere o sinal — não opere ainda.', zh: '即将出现未确认的强烈走势。等待信号——暂不操作。', fr: 'Mouvement fort imminent non confirmé. Attendez le signal — ne pas opérer encore.', it: 'Movimento forte imminente non confermato. Aspetta il segnale — non operare ancora.', hi: 'बिना पुष्टि के मजबूत चाल आसन्न। सिग्नल की प्रतीक्षा करें — अभी ट्रेड न करें।', ar: 'حركة قوية وشيكة غير مؤكدة. انتظر الإشارة — لا تتداول بعد.' },
    port_thermo_help_gris: { es: '⚫ Gris — Sin señal', en: '⚫ Grey — No signal', pt: '⚫ Cinza — Sem sinal', zh: '⚫ 灰色 — 无信号', fr: '⚫ Gris — Sans signal', it: '⚫ Grigio — Senza segnale', hi: '⚫ ग्रे — कोई सिग्नल नहीं', ar: '⚫ رمادي — بدون إشارة' },
    port_thermo_help_gris_desc: { es: 'La IA no tiene datos suficientes hoy. Sin acción recomendada.', en: 'AI does not have enough data today. No recommended action.', pt: 'A IA não tem dados suficientes hoje. Sem ação recomendada.', zh: '今天AI没有足够数据。无推荐操作。', fr: "L'IA n'a pas assez de données aujourd'hui. Aucune action recommandée.", it: "L'IA non ha dati sufficienti oggi. Nessuna azione raccomandata.", hi: 'आज AI के पास पर्याप्त डेटा नहीं है। कोई अनुशंसित कार्रवाई नहीं।', ar: 'الذكاء الاصطناعي ليس لديه بيانات كافية اليوم. لا إجراء موصى به.' },
    port_thermo_help_footer: { es: 'El % indica cuánto de tu capital está en cada zona. Se actualiza con precios actuales.', en: 'The % indicates how much of your capital is in each zone. Updated with current prices.', pt: 'O % indica quanto do seu capital está em cada zona. Atualizado com preços atuais.', zh: '%表示您有多少资金在每个区域。按当前价格更新。', fr: 'Le % indique combien de votre capital est dans chaque zone. Mis à jour avec les prix actuels.', it: 'La % indica quanto del tuo capitale è in ogni zona. Aggiornato con i prezzi attuali.', hi: '% दर्शाता है कि आपकी कितनी पूँजी प्रत्येक ज़ोन में है। वर्तमान मूल्यों के साथ अपडेट।', ar: 'النسبة تشير إلى مقدار رأس مالك في كل منطقة. يتم التحديث بالأسعار الحالية.' },

    // Detalle activo — 52 semanas
    port_52w_zone_low: { es: 'Precio cerca del mínimo anual — zona históricamente baja', en: 'Price near annual low — historically low zone', pt: 'Preço perto da mínima anual — zona historicamente baixa', zh: '价格接近年度最低——历史低位区', fr: 'Prix proche du minimum annuel — zone historiquement basse', it: 'Prezzo vicino al minimo annuale — zona storicamente bassa', hi: 'वार्षिक न्यूनतम के पास — ऐतिहासिक रूप से निम्न ज़ोन', ar: 'السعر قرب أدنى مستوى سنوي — منطقة منخفضة تاريخياً' },
    port_52w_zone_mid: { es: 'Precio en zona media del rango anual', en: 'Price in the middle zone of annual range', pt: 'Preço na zona média do intervalo anual', zh: '价格处于年度区间中间', fr: 'Prix dans la zone médiane de la plage annuelle', it: 'Prezzo nella zona media del range annuale', hi: 'वार्षिक रेंज के मध्य ज़ोन में मूल्य', ar: 'السعر في المنطقة الوسطى للنطاق السنوي' },
    port_52w_zone_high: { es: 'Precio cerca del máximo anual — zona históricamente alta', en: 'Price near annual high — historically high zone', pt: 'Preço perto da máxima anual — zona historicamente alta', zh: '价格接近年度最高——历史高位区', fr: 'Prix proche du maximum annuel — zone historiquement haute', it: 'Prezzo vicino al massimo annuale — zona storicamente alta', hi: 'वार्षिक अधिकतम के पास — ऐतिहासिक रूप से उच्च ज़ोन', ar: 'السعر قرب أعلى مستوى سنوي — منطقة مرتفعة تاريخياً' },
    port_52w_min: { es: '↓ Mín:', en: '↓ Min:', pt: '↓ Mín:', zh: '↓ 最低:', fr: '↓ Min :', it: '↓ Min:', hi: '↓ न्यून:', ar: '↓ أدنى:' },
    port_52w_label: { es: '52 semanas', en: '52 weeks', pt: '52 semanas', zh: '52周', fr: '52 semaines', it: '52 settimane', hi: '52 सप्ताह', ar: '52 أسبوعاً' },
    port_52w_max: { es: '→ Máx:', en: '→ Max:', pt: '→ Máx:', zh: '→ 最高:', fr: '→ Max :', it: '→ Max:', hi: '→ अधि:', ar: '→ أعلى:' },
    port_52w_pct_range: { es: '% del rango anual', en: '% of annual range', pt: '% do intervalo anual', zh: '% 年度区间', fr: '% de la plage annuelle', it: '% del range annuale', hi: '% वार्षिक रेंज', ar: '% من النطاق السنوي' },

    // Detalle — señal IA
    port_detail_objetivo: { es: 'Objetivo', en: 'Target', pt: 'Objetivo', zh: '目标', fr: 'Objectif', it: 'Obiettivo', hi: 'लक्ष्य', ar: 'الهدف' },
    port_detail_stop_loss: { es: 'Stop Loss', en: 'Stop Loss', pt: 'Stop Loss', zh: 'Stop Loss', fr: 'Stop Loss', it: 'Stop Loss', hi: 'Stop Loss', ar: 'Stop Loss' },
    port_detail_upside: { es: 'Upside', en: 'Upside', pt: 'Upside', zh: '上行空间', fr: 'Upside', it: 'Upside', hi: 'Upside', ar: 'Upside' },
    port_detail_downside: { es: 'Downside', en: 'Downside', pt: 'Downside', zh: '下行风险', fr: 'Downside', it: 'Downside', hi: 'Downside', ar: 'Downside' },
    port_sin_senal_hoy: { es: 'Sin senal activa hoy', en: 'No active signal today', pt: 'Sem sinal ativo hoje', zh: '今天无活跃信号', fr: "Pas de signal actif aujourd'hui", it: 'Nessun segnale attivo oggi', hi: 'आज कोई सक्रिय सिग्नल नहीं', ar: 'لا إشارة نشطة اليوم' },

    // Detalle — grid info
    port_pnl_usd: { es: 'P&L USD', en: 'P&L USD', pt: 'P&L USD', zh: 'P&L USD', fr: 'P&L USD', it: 'P&L USD', hi: 'P&L USD', ar: 'P&L USD' },
    port_entrada: { es: 'Entrada', en: 'Entry', pt: 'Entrada', zh: '入场', fr: 'Entrée', it: 'Ingresso', hi: 'प्रवेश', ar: 'الدخول' },
    port_min_52sem: { es: '↓ Mín 52 sem.', en: '↓ Min 52 wk', pt: '↓ Mín 52 sem.', zh: '↓ 最低52周', fr: '↓ Min 52 sem.', it: '↓ Min 52 sett.', hi: '↓ न्यून 52 सप्त.', ar: '↓ أدنى 52 أسبوع' },
    port_max_52sem: { es: '→ Máx 52 sem.', en: '→ Max 52 wk', pt: '→ Máx 52 sem.', zh: '→ 最高52周', fr: '→ Max 52 sem.', it: '→ Max 52 sett.', hi: '→ अधि 52 सप्त.', ar: '→ أعلى 52 أسبوع' },

    // Simulador
    port_sim_title: { es: 'SIMULADOR DE ESCENARIOS', en: 'SCENARIO SIMULATOR', pt: 'SIMULADOR DE CENÁRIOS', zh: '情景模拟器', fr: 'SIMULATEUR DE SCÉNARIOS', it: 'SIMULATORE DI SCENARI', hi: 'परिदृश्य सिम्युलेटर', ar: 'محاكي السيناريوهات' },
    port_sim_label: { es: 'Si el precio cambia:', en: 'If price changes:', pt: 'Se o preço mudar:', zh: '如果价格变化：', fr: 'Si le prix change :', it: 'Se il prezzo cambia:', hi: 'यदि मूल्य बदलता है:', ar: 'إذا تغير السعر:' },
    port_sim_nuevo_precio: { es: 'Nuevo precio', en: 'New price', pt: 'Novo preço', zh: '新价格', fr: 'Nouveau prix', it: 'Nuovo prezzo', hi: 'नया मूल्य', ar: 'السعر الجديد' },
    port_sim_pnl_activo: { es: 'P&L del activo', en: 'Asset P&L', pt: 'P&L do ativo', zh: '资产盈亏', fr: "P&L de l'actif", it: "P&L dell'asset", hi: 'एसेट P&L', ar: 'P&L الأصل' },
    port_sim_impacto_total: { es: 'Impacto en portfolio total', en: 'Impact on total portfolio', pt: 'Impacto no portfólio total', zh: '对总投资组合的影响', fr: 'Impact sur le portfolio total', it: 'Impatto sul portfolio totale', hi: 'कुल portfolio पर प्रभाव', ar: 'التأثير على Portfolio الكلي' },
    port_compartir: { es: 'Compartir', en: 'Share', pt: 'Compartilhar', zh: '分享', fr: 'Partager', it: 'Condividi', hi: 'शेयर करें', ar: 'مشاركة' },

    // Eliminar
    port_confirm_eliminar: { es: '¿Eliminar este activo del portfolio?', en: 'Remove this asset from portfolio?', pt: 'Excluir este ativo do portfólio?', zh: '从投资组合中删除此资产？', fr: 'Supprimer cet actif du portfolio ?', it: 'Eliminare questo asset dal portfolio?', hi: 'इस एसेट को portfolio से हटाएँ?', ar: 'حذف هذا الأصل من Portfolio؟' },

    // Editar posición
    port_item_not_found: { es: 'Item no encontrado', en: 'Item not found', pt: 'Item não encontrado', zh: '未找到项目', fr: 'Élément non trouvé', it: 'Elemento non trovato', hi: 'आइटम नहीं मिला', ar: 'العنصر غير موجود' },
    port_editar_title: { es: 'Editar', en: 'Edit', pt: 'Editar', zh: '编辑', fr: 'Modifier', it: 'Modifica', hi: 'संपादित करें', ar: 'تعديل' },
    port_err_edit_values: { es: 'Cantidad y precio deben ser mayores a 0', en: 'Quantity and price must be greater than 0', pt: 'Quantidade e preço devem ser maiores que 0', zh: '数量和价格必须大于0', fr: 'Quantité et prix doivent être supérieurs à 0', it: 'Quantità e prezzo devono essere maggiori di 0', hi: 'मात्रा और मूल्य 0 से अधिक होने चाहिए', ar: 'الكمية والسعر يجب أن تكون أكبر من 0' },

    // Long Press
    port_lp_analisis: { es: 'Análisis IA completo', en: 'Full AI Analysis', pt: 'Análise IA completa', zh: '完整AI分析', fr: 'Analyse IA complète', it: 'Analisi IA completa', hi: 'पूर्ण AI विश्लेषण', ar: 'تحليل AI كامل' },
    port_lp_editar: { es: 'Editar', en: 'Edit', pt: 'Editar', zh: '编辑', fr: 'Modifier', it: 'Modifica', hi: 'संपादित करें', ar: 'تعديل' },
    port_lp_compartir: { es: 'Compartir', en: 'Share', pt: 'Compartilhar', zh: '分享', fr: 'Partager', it: 'Condividi', hi: 'शेयर करें', ar: 'مشاركة' },
    port_lp_confirmar_eliminar: { es: 'Eliminar', en: 'Delete', pt: 'Excluir', zh: '删除', fr: 'Supprimer', it: 'Eliminare', hi: 'हटाएँ', ar: 'حذف' },

    // === TERMÓMETRO VISUAL (barra + leyenda + mensajes) ===
    port_thermo_bar_title: { es: 'TERMÓMETRO DE RIESGO', en: 'RISK THERMOMETER', pt: 'TERMÔMETRO DE RISCO', zh: '风险温度计', fr: 'THERMOMÈTRE DE RISQUE', it: 'TERMOMETRO DI RISCHIO', hi: 'जोखिम थर्मामीटर', ar: 'مقياس المخاطر' },
    port_thermo_bar_subtitle: { es: 'CAPITAL POR SEÑAL IA', en: 'CAPITAL BY AI SIGNAL', pt: 'CAPITAL POR SINAL IA', zh: '按AI信号分配资金', fr: 'CAPITAL PAR SIGNAL IA', it: 'CAPITALE PER SEGNALE IA', hi: 'AI सिग्नल अनुसार पूँजी', ar: 'رأس المال حسب إشارة AI' },
    port_thermo_leg_alcista: { es: '📈 Alcista', en: '📈 Bullish', pt: '📈 Altista', zh: '📈 看涨', fr: '📈 Haussier', it: '📈 Rialzista', hi: '📈 तेज़ी', ar: '📈 صاعد' },
    port_thermo_leg_bajista: { es: '📉 Bajista', en: '📉 Bearish', pt: '📉 Baixista', zh: '📉 看跌', fr: '📉 Baissier', it: '📉 Ribassista', hi: '📉 मंदी', ar: '📉 هابط' },
    port_thermo_leg_sindir: { es: '⚡ Sin dirección', en: '⚡ No direction', pt: '⚡ Sem direção', zh: '⚡ 无方向', fr: '⚡ Sans direction', it: '⚡ Senza direzione', hi: '⚡ दिशाहीन', ar: '⚡ بدون اتجاه' },
    port_thermo_leg_sinsenal: { es: '⚫ Sin señal', en: '⚫ No signal', pt: '⚫ Sem sinal', zh: '⚫ 无信号', fr: '⚫ Sans signal', it: '⚫ Senza segnale', hi: '⚫ कोई सिग्नल नहीं', ar: '⚫ بدون إشارة' },
    port_thermo_msg_baj50: { es: '🔴 Revisá urgente — ', en: '🔴 Urgent review — ', pt: '🔴 Revise urgente — ', zh: '🔴 紧急检查 — ', fr: '🔴 Revue urgente — ', it: '🔴 Revisione urgente — ', hi: '🔴 तत्काल समीक्षा — ', ar: '🔴 مراجعة عاجلة — ' },
    port_thermo_msg_baj50_suf: { es: ' en baja confirmada.', en: ' in confirmed decline.', pt: ' em queda confirmada.', zh: ' 确认下跌中。', fr: ' en baisse confirmée.', it: ' in ribasso confermato.', hi: ' पुष्ट गिरावट में।', ar: ' في انخفاض مؤكد.' },
    port_thermo_msg_baj50_tip: { es: 'La IA confirmó caída. Evaluá reducir posición antes de que baje más.', en: 'AI confirmed decline. Consider reducing position before further drop.', pt: 'A IA confirmou queda. Avalie reduzir posição antes que caia mais.', zh: 'AI确认下跌。考虑在进一步下跌前减仓。', fr: "L'IA a confirmé la baisse. Envisagez de réduire la position avant que ça baisse davantage.", it: "L'IA ha confermato il ribasso. Valuta di ridurre la posizione prima di ulteriori cali.", hi: 'AI ने गिरावट की पुष्टि की। और गिरने से पहले स्थिति कम करने पर विचार करें।', ar: 'الذكاء الاصطناعي أكد الانخفاض. فكر في تقليل المركز قبل المزيد من الهبوط.' },
    port_thermo_msg_baj20: { es: '⚠️ Vigilar: ', en: '⚠️ Watch: ', pt: '⚠️ Vigiar: ', zh: '⚠️ 关注：', fr: '⚠️ Surveiller : ', it: '⚠️ Vigilare: ', hi: '⚠️ नज़र रखें: ', ar: '⚠️ مراقبة: ' },
    port_thermo_msg_baj20_suf: { es: ' con señal bajista.', en: ' with bearish signal.', pt: ' com sinal baixista.', zh: ' 有看跌信号。', fr: ' avec signal baissier.', it: ' con segnale ribassista.', hi: ' मंदी सिग्नल के साथ।', ar: ' مع إشارة هبوط.' },
    port_thermo_msg_baj20_tip: { es: 'Señal débil de baja. Monitorea de cerca antes de decidir.', en: 'Weak bearish signal. Monitor closely before deciding.', pt: 'Sinal fraco de queda. Monitore de perto antes de decidir.', zh: '弱看跌信号。密切关注后再决定。', fr: 'Signal baissier faible. Surveillez de près avant de décider.', it: 'Segnale ribassista debole. Monitora attentamente prima di decidere.', hi: 'कमज़ोर मंदी सिग्नल। निर्णय से पहले करीब से देखें।', ar: 'إشارة هبوط ضعيفة. راقب عن كثب قبل اتخاذ القرار.' },
    port_thermo_msg_alc50: { es: '🟢 Buen momento — ', en: '🟢 Good time — ', pt: '🟢 Bom momento — ', zh: '🟢 好时机 — ', fr: '🟢 Bon moment — ', it: '🟢 Buon momento — ', hi: '🟢 अच्छा समय — ', ar: '🟢 وقت مناسب — ' },
    port_thermo_msg_alc50_suf: { es: ' con momentum positivo.', en: ' with positive momentum.', pt: ' com momentum positivo.', zh: ' 正面动能。', fr: ' avec momentum positif.', it: ' con momentum positivo.', hi: ' सकारात्मक गति के साथ।', ar: ' مع زخم إيجابي.' },
    port_thermo_msg_alc50_tip: { es: 'La IA confirmó suba. Buen momento para mantener o aumentar posición.', en: 'AI confirmed rise. Good time to hold or increase position.', pt: 'A IA confirmou alta. Bom momento para manter ou aumentar posição.', zh: 'AI确认上涨。持有或增加仓位的好时机。', fr: "L'IA a confirmé la hausse. Bon moment pour maintenir ou augmenter la position.", it: "L'IA ha confermato il rialzo. Buon momento per mantenere o aumentare la posizione.", hi: 'AI ने वृद्धि की पुष्टि की। स्थिति बनाए रखने या बढ़ाने का अच्छा समय।', ar: 'الذكاء الاصطناعي أكد الارتفاع. وقت مناسب للاحتفاظ أو زيادة المركز.' },
    port_thermo_msg_hc40: { es: '⚡ Esperá señal antes de operar: ', en: '⚡ Wait for signal before trading: ', pt: '⚡ Espere sinal antes de operar: ', zh: '⚡ 等待信号再操作：', fr: '⚡ Attendez le signal avant d\'opérer : ', it: '⚡ Attendi il segnale prima di operare: ', hi: '⚡ ट्रेडिंग से पहले सिग्नल की प्रतीक्षा करें: ', ar: '⚡ انتظر الإشارة قبل التداول: ' },
    port_thermo_msg_hc40_tip: { es: 'La IA está monitoreando. Confirma dirección cuando el mercado define. Volvé mañana.', en: 'AI is monitoring. Direction confirms when market defines. Check back tomorrow.', pt: 'A IA está monitorando. Confirma direção quando o mercado definir. Volte amanhã.', zh: 'AI监控中。市场明确方向后确认。明天再看。', fr: "L'IA surveille. Direction confirmée quand le marché se définit. Revenez demain.", it: "L'IA sta monitorando. Conferma la direzione quando il mercato si definisce. Torna domani.", hi: 'AI निगरानी कर रहा है। बाज़ार तय करने पर दिशा की पुष्टि। कल फिर देखें।', ar: 'الذكاء الاصطناعي يراقب. يتأكد الاتجاه عندما يحدد السوق. عد غداً.' },
    port_thermo_msg_sin70: { es: '⚫ Sin datos suficientes hoy — no operar hasta nueva señal.', en: '⚫ Not enough data today — do not trade until new signal.', pt: '⚫ Sem dados suficientes hoje — não opere até novo sinal.', zh: '⚫ 今天数据不足——等待新信号再操作。', fr: "⚫ Pas assez de données aujourd'hui — ne pas opérer jusqu'au prochain signal.", it: '⚫ Dati insufficienti oggi — non operare fino a nuovo segnale.', hi: '⚫ आज पर्याप्त डेटा नहीं — नए सिग्नल तक ट्रेड न करें।', ar: '⚫ بيانات غير كافية اليوم — لا تتداول حتى إشارة جديدة.' },
    port_thermo_msg_sin70_tip: { es: 'La IA necesita más datos. Sin acción recomendada por ahora.', en: 'AI needs more data. No recommended action for now.', pt: 'A IA precisa de mais dados. Sem ação recomendada por enquanto.', zh: 'AI需要更多数据。暂无推荐操作。', fr: "L'IA a besoin de plus de données. Aucune action recommandée pour le moment.", it: "L'IA necessita più dati. Nessuna azione raccomandata per ora.", hi: 'AI को अधिक डेटा चाहिए। अभी कोई अनुशंसित कार्रवाई नहीं।', ar: 'الذكاء الاصطناعي يحتاج مزيداً من البيانات. لا إجراء موصى به حالياً.' },
    port_thermo_msg_mix: { es: ' — cartera con señales mixtas.', en: ' — portfolio with mixed signals.', pt: ' — carteira com sinais mistos.', zh: ' — 投资组合信号混合。', fr: ' — portefeuille avec signaux mixtes.', it: ' — portafoglio con segnali misti.', hi: ' — portfolio मिश्रित सिग्नल के साथ।', ar: ' — محفظة بإشارات مختلطة.' },
    port_thermo_msg_mix_tip: { es: 'Revisá cada activo individualmente antes de operar.', en: 'Review each asset individually before trading.', pt: 'Revise cada ativo individualmente antes de operar.', zh: '操作前逐一检查每个资产。', fr: 'Examinez chaque actif individuellement avant d\'opérer.', it: 'Rivedi ogni asset individualmente prima di operare.', hi: 'ट्रेडिंग से पहले प्रत्येक एसेट की अलग समीक्षा करें।', ar: 'راجع كل أصل على حدة قبل التداول.' },

    // === SORT / ORDENAR ===
    port_sort_title: { es: 'Ordenar por', en: 'Sort by', pt: 'Ordenar por', zh: '排序方式', fr: 'Trier par', it: 'Ordina per', hi: 'इसके अनुसार क्रमबद्ध', ar: 'ترتيب حسب' },
    port_sort_btn_prefix: { es: 'Ordenar:', en: 'Sort:', pt: 'Ordenar:', zh: '排序:', fr: 'Trier:', it: 'Ordina:', hi: 'क्रम:', ar: 'ترتيب:' },
    sort_valor: { es: 'Valor', en: 'Value', pt: 'Valor', zh: '价值', fr: 'Valeur', it: 'Valore', hi: 'मूल्य', ar: 'القيمة' },
    sort_valor_d: { es: 'Valor de mercado actual', en: 'Current market value', pt: 'Valor de mercado atual', zh: '当前市场价值', fr: 'Valeur de marché actuelle', it: 'Valore di mercato attuale', hi: 'वर्तमान बाज़ार मूल्य', ar: 'القيمة السوقية الحالية' },
    sort_pct_hoy: { es: '% Hoy', en: '% Today', pt: '% Hoje', zh: '% 今日', fr: "% Aujourd'hui", it: '% Oggi', hi: '% आज', ar: '% اليوم' },
    sort_pct_hoy_d: { es: 'Mayor cambio en 24 horas', en: 'Biggest change in 24 hours', pt: 'Maior mudança em 24 horas', zh: '24小时最大变化', fr: 'Plus grand changement en 24 heures', it: 'Maggior variazione in 24 ore', hi: '24 घंटे में सबसे बड़ा बदलाव', ar: 'أكبر تغيير خلال 24 ساعة' },
    sort_pnl_usd: { es: 'P&L $', en: 'P&L $', pt: 'P&L $', zh: 'P&L $', fr: 'P&L $', it: 'P&L $', hi: 'P&L $', ar: 'P&L $' },
    sort_pnl_usd_d: { es: 'Ganancia total absoluta desde compra', en: 'Total absolute gain since purchase', pt: 'Ganho total absoluto desde compra', zh: '自购买以来的总绝对收益', fr: "Gain total absolu depuis l'achat", it: "Guadagno totale assoluto dall'acquisto", hi: 'खरीद से कुल पूर्ण लाभ', ar: 'الربح الإجمالي المطلق منذ الشراء' },
    sort_pnl_pct: { es: 'P&L %', en: 'P&L %', pt: 'P&L %', zh: 'P&L %', fr: 'P&L %', it: 'P&L %', hi: 'P&L %', ar: 'P&L %' },
    sort_pnl_pct_d: { es: 'Ganancia total en % desde compra', en: 'Total % gain since purchase', pt: 'Ganho total em % desde compra', zh: '自购买以来的总百分比收益', fr: "Gain total en % depuis l'achat", it: "Guadagno totale in % dall'acquisto", hi: 'खरीद से कुल % लाभ', ar: 'نسبة الربح الإجمالية منذ الشراء' },
    sort_senal_ia: { es: 'Señal IA', en: 'AI Signal', pt: 'Sinal IA', zh: 'AI信号', fr: 'Signal IA', it: 'Segnale IA', hi: 'AI सिग्नल', ar: 'إشارة AI' },
    sort_senal_ia_d: { es: 'ALCISTA → ALTA CONV → BAJISTA', en: 'BULLISH → HIGH CONV → BEARISH', pt: 'ALTISTA → ALTA CONV → BAIXISTA', zh: '看涨 → 高收敛 → 看跌', fr: 'HAUSSIER → HAUTE CONV → BAISSIER', it: 'RIALZISTA → ALTA CONV → RIBASSISTA', hi: 'तेज़ी → उच्च CONV → मंदी', ar: 'صاعد → تقارب عالي → هابط' },
    sort_prob: { es: 'Probabilidad', en: 'Probability', pt: 'Probabilidade', zh: '概率', fr: 'Probabilité', it: 'Probabilità', hi: 'संभावना', ar: 'الاحتمالية' },
    sort_prob_d: { es: 'Mayor confianza IA arriba', en: 'Highest AI confidence on top', pt: 'Maior confiança IA em cima', zh: '最高AI置信度在前', fr: 'Plus haute confiance IA en haut', it: 'Maggiore fiducia IA in alto', hi: 'शीर्ष पर सबसे अधिक AI विश्वास', ar: 'أعلى ثقة AI في الأعلى' },
    sort_ticker: { es: 'Ticker', en: 'Ticker', pt: 'Ticker', zh: '代码', fr: 'Ticker', it: 'Ticker', hi: 'टिकर', ar: 'الرمز' },
    sort_ticker_d: { es: 'Alfabético (A → Z)', en: 'Alphabetical (A → Z)', pt: 'Alfabético (A → Z)', zh: '字母顺序 (A → Z)', fr: 'Alphabétique (A → Z)', it: 'Alfabetico (A → Z)', hi: 'वर्णानुक्रम (A → Z)', ar: 'أبجدي (A → Z)' },
    sort_fecha: { es: 'Fecha', en: 'Date', pt: 'Data', zh: '日期', fr: 'Date', it: 'Data', hi: 'तिथि', ar: 'التاريخ' },
    sort_fecha_d: { es: 'Orden de carga original', en: 'Original load order', pt: 'Ordem de carga original', zh: '原始加载顺序', fr: "Ordre de chargement original", it: 'Ordine di caricamento originale', hi: 'मूल लोड क्रम', ar: 'ترتيب التحميل الأصلي' },
    sort_default: { es: 'Default', en: 'Default', pt: 'Default', zh: '默认', fr: 'Défaut', it: 'Default', hi: 'डिफ़ॉल्ट', ar: 'افتراضي' },
    sort_default_d: { es: 'Orden del catálogo original', en: 'Original catalog order', pt: 'Ordem do catálogo original', zh: '原始目录顺序', fr: 'Ordre du catalogue original', it: 'Ordine del catalogo originale', hi: 'मूल कैटलॉग क्रम', ar: 'ترتيب الكتالوج الأصلي' },
    sort_precio: { es: 'Precio', en: 'Price', pt: 'Preço', zh: '价格', fr: 'Prix', it: 'Prezzo', hi: 'मूल्य', ar: 'السعر' },
    sort_precio_d: { es: 'Mayor precio arriba', en: 'Highest price on top', pt: 'Maior preço em cima', zh: '最高价格在前', fr: 'Prix le plus élevé en haut', it: 'Prezzo più alto in alto', hi: 'शीर्ष पर सबसे अधिक मूल्य', ar: 'أعلى سعر في الأعلى' },
    sort_pct_7d: { es: '% 7d', en: '% 7d', pt: '% 7d', zh: '% 7天', fr: '% 7j', it: '% 7g', hi: '% 7दि', ar: '% 7أيام' },
    sort_pct_7d_d: { es: 'Mayor cambio en 7 días', en: 'Biggest change in 7 days', pt: 'Maior mudança em 7 dias', zh: '7天最大变化', fr: 'Plus grand changement en 7 jours', it: 'Maggior variazione in 7 giorni', hi: '7 दिन में सबसे बड़ा बदलाव', ar: 'أكبر تغيير خلال 7 أيام' },
    sort_pct_30d: { es: '% 30d', en: '% 30d', pt: '% 30d', zh: '% 30天', fr: '% 30j', it: '% 30g', hi: '% 30दि', ar: '% 30يوم' },
    sort_pct_30d_d: { es: 'Mayor cambio en 30 días', en: 'Biggest change in 30 days', pt: 'Maior mudança em 30 dias', zh: '30天最大变化', fr: 'Plus grand changement en 30 jours', it: 'Maggior variazione in 30 giorni', hi: '30 दिन में सबसे बड़ा बदलाव', ar: 'أكبر تغيير خلال 30 يوماً' },
    sort_upside: { es: 'Upside', en: 'Upside', pt: 'Upside', zh: '上行空间', fr: 'Upside', it: 'Upside', hi: 'Upside', ar: 'Upside' },
    sort_upside_d: { es: 'Mayor % al objetivo', en: 'Highest % to target', pt: 'Maior % ao objetivo', zh: '最高目标百分比', fr: "Plus haut % vers l'objectif", it: "Più alto % all'obiettivo", hi: 'लक्ष्य तक सबसे अधिक %', ar: 'أعلى نسبة إلى الهدف' },
    sort_default_ia_d: { es: 'Orden por confianza IA', en: 'Order by AI confidence', pt: 'Ordem por confiança IA', zh: '按AI置信度排序', fr: 'Ordre par confiance IA', it: 'Ordine per fiducia IA', hi: 'AI विश्वास के अनुसार क्रम', ar: 'ترتيب حسب ثقة AI' },

    // === MERCADOS ===

    // Búsqueda
    mkt_search_placeholder: { es: 'Buscar cualquier activo... (IBIT, HOOD, MSTR, BTC...)', en: 'Search any asset... (IBIT, HOOD, MSTR, BTC...)', pt: 'Buscar qualquer ativo... (IBIT, HOOD, MSTR, BTC...)', zh: '搜索任何资产... (IBIT, HOOD, MSTR, BTC...)', fr: 'Rechercher un actif... (IBIT, HOOD, MSTR, BTC...)', it: 'Cerca qualsiasi asset... (IBIT, HOOD, MSTR, BTC...)', hi: 'कोई भी एसेट खोजें... (IBIT, HOOD, MSTR, BTC...)', ar: 'البحث عن أي أصل... (IBIT, HOOD, MSTR, BTC...)' },
    mkt_buscando: { es: 'Buscando...', en: 'Searching...', pt: 'Buscando...', zh: '搜索中...', fr: 'Recherche...', it: 'Ricerca...', hi: 'खोज रहे हैं...', ar: 'جارٍ البحث...' },
    mkt_sin_resultados: { es: 'Sin resultados para "', en: 'No results for "', pt: 'Sem resultados para "', zh: '没有找到"', fr: 'Aucun résultat pour "', it: 'Nessun risultato per "', hi: 'कोई परिणाम नहीं "', ar: 'لا نتائج لـ "' },
    mkt_tipo_cripto: { es: 'Cripto', en: 'Crypto', pt: 'Cripto', zh: '加密', fr: 'Crypto', it: 'Crypto', hi: 'क्रिप्टो', ar: 'كريبتو' },
    mkt_tipo_accion: { es: 'Accion', en: 'Stock', pt: 'Ação', zh: '股票', fr: 'Action', it: 'Azione', hi: 'स्टॉक', ar: 'سهم' },
    mkt_tipo_etf: { es: 'ETF', en: 'ETF', pt: 'ETF', zh: 'ETF', fr: 'ETF', it: 'ETF', hi: 'ETF', ar: 'ETF' },
    mkt_tipo_activo: { es: 'Activo', en: 'Asset', pt: 'Ativo', zh: '资产', fr: 'Actif', it: 'Asset', hi: 'एसेट', ar: 'أصل' },

    // Pin Modal
    mkt_pin_title: { es: 'Editar activos destacados', en: 'Edit featured assets', pt: 'Editar ativos destacados', zh: '编辑精选资产', fr: 'Modifier les actifs en vedette', it: 'Modifica asset in evidenza', hi: 'विशेष एसेट संपादित करें', ar: 'تعديل الأصول المميزة' },
    mkt_pin_desc: { es: 'Toc\u00E1 cualquier activo para fijarlo o quitarlo de los 4 destacados', en: 'Tap any asset to pin or unpin it from the 4 featured', pt: 'Toque qualquer ativo para fixar ou remover dos 4 destacados', zh: '点击任何资产将其固定或取消固定在4个精选中', fr: "Appuyez sur un actif pour l'\u00E9pingler ou le retirer des 4 en vedette", it: 'Tocca qualsiasi asset per fissarlo o rimuoverlo dai 4 in evidenza', hi: '4 विशेष में से पिन या अनपिन करने के लिए किसी एसेट पर टैप करें', ar: 'انقر على أي أصل لتثبيته أو إزالته من الأصول الأربعة المميزة' },
    mkt_listo: { es: 'Listo', en: 'Done', pt: 'Pronto', zh: '完成', fr: 'Terminé', it: 'Fatto', hi: 'हो गया', ar: 'تم' },

    // Tabs categorías
    mkt_tab_cripto: { es: 'Cripto', en: 'Crypto', pt: 'Cripto', zh: '加密', fr: 'Crypto', it: 'Crypto', hi: 'क्रिप्टो', ar: 'كريبتو' },
    mkt_tab_acciones: { es: 'Acciones', en: 'Stocks', pt: 'Ações', zh: '股票', fr: 'Actions', it: 'Azioni', hi: 'स्टॉक', ar: 'أسهم' },
    mkt_tab_stable: { es: 'Stable & DeFi', en: 'Stable & DeFi', pt: 'Stable & DeFi', zh: 'Stable & DeFi', fr: 'Stable & DeFi', it: 'Stable & DeFi', hi: 'Stable & DeFi', ar: 'Stable & DeFi' },
    mkt_tab_futuros: { es: 'Futuros', en: 'Futures', pt: 'Futuros', zh: '期货', fr: 'Futures', it: 'Futures', hi: 'फ्यूचर्स', ar: 'العقود الآجلة' },
    mkt_tab_commodities: { es: 'Commodities', en: 'Commodities', pt: 'Commodities', zh: '大宗商品', fr: 'Matières premières', it: 'Commodities', hi: 'कमोडिटीज़', ar: 'السلع' },
    mkt_tab_divisas: { es: 'Divisas', en: 'Currencies', pt: 'Moedas', zh: '外汇', fr: 'Devises', it: 'Valute', hi: 'मुद्राएँ', ar: 'العملات' },
    mkt_tab_etf: { es: 'ETF & Bonos', en: 'ETF & Bonds', pt: 'ETF & Títulos', zh: 'ETF & 债券', fr: 'ETF & Obligations', it: 'ETF & Obbligazioni', hi: 'ETF & बॉन्ड', ar: 'ETF & سندات' },

    // Sub-filtros países
    mkt_pais_usa: { es: 'EE.UU.', en: 'USA', pt: 'EUA', zh: '美国', fr: 'USA', it: 'USA', hi: 'अमेरिका', ar: 'أمريكا' },
    mkt_pais_arg: { es: 'Argentina', en: 'Argentina', pt: 'Argentina', zh: '阿根廷', fr: 'Argentine', it: 'Argentina', hi: 'अर्जेंटीना', ar: 'الأرجنتين' },
    mkt_pais_br: { es: 'Brasil', en: 'Brazil', pt: 'Brasil', zh: '巴西', fr: 'Brésil', it: 'Brasile', hi: 'ब्राज़ील', ar: 'البرازيل' },
    mkt_pais_eu: { es: 'Europa', en: 'Europe', pt: 'Europa', zh: '欧洲', fr: 'Europe', it: 'Europa', hi: 'यूरोप', ar: 'أوروبا' },
    mkt_pais_es: { es: 'España', en: 'Spain', pt: 'Espanha', zh: '西班牙', fr: 'Espagne', it: 'Spagna', hi: 'स्पेन', ar: 'إسبانيا' },
    mkt_pais_jp: { es: 'Japón', en: 'Japan', pt: 'Japão', zh: '日本', fr: 'Japon', it: 'Giappone', hi: 'जापान', ar: 'اليابان' },
    mkt_pais_cn: { es: 'China', en: 'China', pt: 'China', zh: '中国', fr: 'Chine', it: 'Cina', hi: 'चीन', ar: 'الصين' },

    // Timeframe
    mkt_tf_ahora: { es: 'Act. ahora', en: 'Updated now', pt: 'Atual. agora', zh: '已更新', fr: 'Mis à jour', it: 'Aggiornato', hi: 'अभी अपडेट', ar: 'محدّث الآن' },
    mkt_tf_7d: { es: 'Últimos 7d', en: 'Last 7d', pt: 'Últimos 7d', zh: '最近7天', fr: 'Derniers 7j', it: 'Ultimi 7g', hi: 'पिछले 7दि', ar: 'آخر 7 أيام' },
    mkt_tf_1m: { es: 'Último mes', en: 'Last month', pt: 'Último mês', zh: '上月', fr: 'Dernier mois', it: 'Ultimo mese', hi: 'पिछला महीना', ar: 'الشهر الماضي' },
    mkt_tf_3m: { es: 'Últimos 3m', en: 'Last 3mo', pt: 'Últimos 3m', zh: '最近3月', fr: 'Derniers 3m', it: 'Ultimi 3m', hi: 'पिछले 3 महीने', ar: 'آخر 3 أشهر' },
    mkt_tf_1y: { es: 'Último año', en: 'Last year', pt: 'Último ano', zh: '去年', fr: 'Dernière année', it: 'Ultimo anno', hi: 'पिछला वर्ष', ar: 'العام الماضي' },
    mkt_editar_orden: { es: 'Editar orden', en: 'Edit order', pt: 'Editar ordem', zh: '编辑顺序', fr: "Modifier l'ordre", it: "Modifica l'ordine", hi: 'क्रम संपादित करें', ar: 'تعديل الترتيب' },

    // Edit mode banner
    mkt_edit_instrucciones: { es: 'Arrastrá para reordenar · Tocá para ocultar', en: 'Drag to reorder · Tap to hide', pt: 'Arraste para reordenar · Toque para ocultar', zh: '拖动重新排序 · 点击隐藏', fr: 'Glissez pour réorganiser · Appuyez pour masquer', it: 'Trascina per riordinare · Tocca per nascondere', hi: 'क्रम बदलने के लिए खींचें · छिपाने के लिए टैप करें', ar: 'اسحب لإعادة الترتيب · انقر للإخفاء' },

    // Filtros IA
    mkt_ia_todo: { es: 'Todo', en: 'All', pt: 'Tudo', zh: '全部', fr: 'Tout', it: 'Tutto', hi: 'सभी', ar: 'الكل' },
    mkt_ia_alcista: { es: 'Alcista', en: 'Bullish', pt: 'Altista', zh: '看涨', fr: 'Haussier', it: 'Rialzista', hi: 'तेज़ी', ar: 'صاعد' },
    mkt_ia_bajista: { es: 'Bajista', en: 'Bearish', pt: 'Baixista', zh: '看跌', fr: 'Baissier', it: 'Ribassista', hi: 'मंदी', ar: 'هابط' },
    mkt_ia_conf: { es: 'Conf. IA', en: 'AI Conf.', pt: 'Conf. IA', zh: 'AI置信', fr: 'Conf. IA', it: 'Conf. IA', hi: 'AI विश्वास', ar: 'ثقة AI' },
    mkt_ia_cripto: { es: 'Cripto', en: 'Crypto', pt: 'Cripto', zh: '加密', fr: 'Crypto', it: 'Crypto', hi: 'क्रिप्टो', ar: 'كريبتو' },
    mkt_ia_acciones: { es: 'Acciones', en: 'Stocks', pt: 'Ações', zh: '股票', fr: 'Actions', it: 'Azioni', hi: 'स्टॉक', ar: 'أسهم' },
    mkt_ia_etf: { es: 'ETF', en: 'ETF', pt: 'ETF', zh: 'ETF', fr: 'ETF', it: 'ETF', hi: 'ETF', ar: 'ETF' },
    mkt_ia_metales: { es: 'Metales', en: 'Metals', pt: 'Metais', zh: '金属', fr: 'Métaux', it: 'Metalli', hi: 'धातुएँ', ar: 'معادن' },
    ia_impacto: { es: 'IMPACTO', en: 'IMPACT', pt: 'IMPACTO', zh: '影响', fr: 'IMPACT', it: 'IMPATTO', hi: 'प्रभाव', ar: 'التأثير' },
    imp_alto: { es: 'ALTO', en: 'HIGH', pt: 'ALTO', zh: '高', fr: 'ÉLEVÉ', it: 'ALTO', hi: 'उच्च', ar: 'مرتفع' },
    imp_medio: { es: 'MEDIO', en: 'MEDIUM', pt: 'MÉDIO', zh: '中', fr: 'MOYEN', it: 'MEDIO', hi: 'मध्यम', ar: 'متوسط' },
    imp_bajo: { es: 'BAJO', en: 'LOW', pt: 'BAIXO', zh: '低', fr: 'FAIBLE', it: 'BASSO', hi: 'निम्न', ar: 'منخفض' },
    ia_ev1_l: { es: 'EVENTO CRÍTICO - FED', en: 'CRITICAL EVENT - FED', pt: 'EVENTO CRÍTICO - FED', zh: '关键事件 - 美联储', fr: 'ÉVÉNEMENT CRITIQUE - FED', it: 'EVENTO CRITICO - FED', hi: 'महत्वपूर्ण घटना - FED', ar: 'حدث حاسم - الفيدرالي' },
    ia_ev1_t: { es: 'Reunión FOMC - Decisión de tasas de interés - Alto impacto en todos los mercados - Se espera pausa en subas - Mercados atentos a declaraciones de Powell', en: 'FOMC Meeting - Interest rate decision - High impact across all markets - Rate hike pause expected - Markets watching Powell statements', pt: 'Reunião FOMC - Decisão de taxas de juros - Alto impacto em todos os mercados - Pausa nas altas esperada - Mercados atentos às declarações de Powell', zh: 'FOMC会议 - 利率决议 - 对所有市场高影响 - 预计暂停加息 - 市场关注鲍威尔讲话', fr: 'Réunion FOMC - Décision sur les taux - Fort impact sur tous les marchés - Pause des hausses attendue - Marchés attentifs aux déclarations de Powell', it: 'Riunione FOMC - Decisione sui tassi - Alto impatto su tutti i mercati - Attesa pausa nei rialzi - Mercati attenti alle dichiarazioni di Powell', hi: 'FOMC बैठक - ब्याज दर निर्णय - सभी बाज़ारों पर उच्च प्रभाव - दर वृद्धि में विराम की उम्मीद - बाज़ार Powell के बयानों पर नज़र', ar: 'اجتماع FOMC - قرار أسعار الفائدة - تأثير كبير على جميع الأسواق - يُتوقع إيقاف رفع الفائدة - الأسواق تترقب تصريحات باول' },
    ia_ev2_l: { es: 'DATO MACRO - IPC EEUU', en: 'MACRO DATA - US CPI', pt: 'DADO MACRO - IPC EUA', zh: '宏观数据 - 美国CPI', fr: 'DONNÉE MACRO - IPC USA', it: 'DATO MACRO - IPC USA', hi: 'मैक्रो डेटा - US CPI', ar: 'بيانات كلية - مؤشر أسعار المستهلك الأمريكي' },
    ia_ev2_t: { es: 'Índice de Precios al Consumidor - Publicación 8:30 EST - Estimado 3.2% interanual - Impacto alto en bonos y acciones growth - Dato clave para política monetaria', en: 'Consumer Price Index - Release 8:30 EST - Estimated 3.2% YoY - High impact on bonds and growth stocks - Key data for monetary policy', pt: 'Índice de Preços ao Consumidor - Publicação 8:30 EST - Estimado 3,2% anual - Alto impacto em títulos e ações growth - Dado-chave para política monetária', zh: '消费者价格指数 - 8:30 EST发布 - 预计同比3.2% - 对债券和成长股高影响 - 货币政策关键数据', fr: 'Indice des Prix à la Consommation - Publication 8h30 EST - Estimé 3,2% en glissement annuel - Fort impact sur obligations et actions growth - Donnée clé pour la politique monétaire', it: 'Indice dei Prezzi al Consumo - Pubblicazione 8:30 EST - Stimato 3,2% annuo - Alto impatto su obbligazioni e azioni growth - Dato chiave per la politica monetaria', hi: 'उपभोक्ता मूल्य सूचकांक - प्रकाशन 8:30 EST - अनुमानित 3.2% वार्षिक - बॉन्ड और ग्रोथ स्टॉक्स पर उच्च प्रभाव - मौद्रिक नीति के लिए मुख्य डेटा', ar: 'مؤشر أسعار المستهلك - النشر 8:30 بتوقيت شرق أمريكا - متوقع 3.2% سنويًا - تأثير كبير على السندات وأسهم النمو - بيانات أساسية للسياسة النقدية' },
    ia_ev3_l: { es: 'EARNINGS - NVIDIA', en: 'EARNINGS - NVIDIA', pt: 'EARNINGS - NVIDIA', zh: '财报 - 英伟达', fr: 'RÉSULTATS - NVIDIA', it: 'EARNINGS - NVIDIA', hi: 'EARNINGS - NVIDIA', ar: 'أرباح - NVIDIA' },
    ia_ev3_t: { es: 'Resultados trimestrales NVDA Q1 2026 - EPS estimado 5.58 - Ingresos estimados 24.6B - Pre-mercado mañana - Alta volatilidad esperada sector tech', en: 'NVDA Q1 2026 quarterly results - Estimated EPS 5.58 - Estimated revenue 24.6B - Pre-market tomorrow - High volatility expected in tech sector', pt: 'Resultados trimestrais NVDA Q1 2026 - EPS estimado 5,58 - Receita estimada 24,6B - Pré-mercado amanhã - Alta volatilidade esperada no setor tech', zh: '英伟达2026财年Q1季度业绩 - 预计EPS 5.58 - 预计营收246亿 - 明日盘前 - 科技板块预计高波动', fr: 'Résultats trimestriels NVDA T1 2026 - BPA estimé 5,58 - Revenus estimés 24,6B - Pré-marché demain - Forte volatilité attendue secteur tech', it: 'Risultati trimestrali NVDA Q1 2026 - EPS stimato 5,58 - Ricavi stimati 24,6B - Pre-mercato domani - Alta volatilità attesa settore tech', hi: 'NVDA Q1 2026 तिमाही परिणाम - अनुमानित EPS 5.58 - अनुमानित राजस्व 24.6B - कल प्री-मार्केट - टेक सेक्टर में उच्च अस्थिरता की उम्मीद', ar: 'نتائج NVDA الفصلية للربع الأول 2026 - ربحية السهم المتوقعة 5.58 - الإيرادات المتوقعة 24.6 مليار - ما قبل السوق غدًا - تقلبات عالية متوقعة في قطاع التقنية' },
    mkt_ia_materias: { es: 'Mat. Primas', en: 'Raw Mat.', pt: 'Mat. Primas', zh: '原材料', fr: 'Mat. Premières', it: 'Mat. Prime', hi: 'कच्चा माल', ar: 'مواد خام' },
    mkt_ia_bonos: { es: 'Bonos', en: 'Bonds', pt: 'Títulos', zh: '债券', fr: 'Obligations', it: 'Obbligazioni', hi: 'बॉन्ड', ar: 'سندات' },

    // Banner Mercados status
    mkt_status_abierto: { es: 'ABIERTO', en: 'OPEN', pt: 'ABERTO', zh: '开市', fr: 'OUVERT', it: 'APERTO', hi: 'खुला', ar: 'مفتوح' },
    mkt_status_cerrado: { es: 'CERRADO', en: 'CLOSED', pt: 'FECHADO', zh: '休市', fr: 'FERMÉ', it: 'CHIUSO', hi: 'बंद', ar: 'مغلق' },
    mkt_edit_banner_title: { es: 'Mercados en banner', en: 'Markets in banner', pt: 'Mercados no banner', zh: 'Banner中的市场', fr: 'Marchés dans la bannière', it: 'Mercati nel banner', hi: 'बैनर में बाज़ार', ar: 'الأسواق في الشريط' },

    // Cobrex Pulse
    mkt_pulse_loading: { es: 'Calculando Cobrex PULSE\u2122...', en: 'Calculating Cobrex PULSE\u2122...', pt: 'Calculando Cobrex PULSE\u2122...', zh: '计算 Cobrex PULSE\u2122...', fr: 'Calcul Cobrex PULSE\u2122...', it: 'Calcolo Cobrex PULSE\u2122...', hi: 'Cobrex PULSE\u2122 गणना कर रहा है...', ar: 'جارٍ حساب Cobrex PULSE\u2122...' },
    mkt_pulse_ver_variables: { es: '\uD83D\uDCCA Ver variables', en: '\uD83D\uDCCA View variables', pt: '\uD83D\uDCCA Ver variáveis', zh: '\uD83D\uDCCA 查看变量', fr: '\uD83D\uDCCA Voir les variables', it: '\uD83D\uDCCA Vedi variabili', hi: '\uD83D\uDCCA वेरिएबल देखें', ar: '\uD83D\uDCCA عرض المتغيرات' },

    // Pulse educativas
    mkt_pulse_edu_panico: { es: 'Pánico extremo. Históricamente zonas de oportunidad para inversores de largo plazo.', en: 'Extreme panic. Historically opportunity zones for long-term investors.', pt: 'Pânico extremo. Historicamente zonas de oportunidade para investidores de longo prazo.', zh: '极度恐慌。历史上对长期投资者来说是机会区域。', fr: "Panique extrême. Historiquement des zones d'opportunité pour les investisseurs à long terme.", it: 'Panico estremo. Storicamente zone di opportunità per investitori a lungo termine.', hi: 'अत्यधिक दहशत। ऐतिहासिक रूप से दीर्घकालिक निवेशकों के लिए अवसर क्षेत्र।', ar: 'ذعر شديد. تاريخياً مناطق فرص للمستثمرين طويلي الأمد.' },
    mkt_pulse_edu_temor: { es: 'Temor generalizado. Los inversores están vendiendo. Posibles oportunidades si el contexto es sólido.', en: 'Widespread fear. Investors are selling. Possible opportunities if context is solid.', pt: 'Temor generalizado. Os investidores estão vendendo. Possíveis oportunidades se o contexto for sólido.', zh: '普遍恐惧。投资者正在抛售。如果背景稳固，可能有机会。', fr: 'Peur généralisée. Les investisseurs vendent. Opportunités possibles si le contexte est solide.', it: 'Timore generalizzato. Gli investitori stanno vendendo. Possibili opportunità se il contesto è solido.', hi: 'व्यापक भय। निवेशक बेच रहे हैं। यदि संदर्भ ठोस है तो संभावित अवसर।', ar: 'خوف عام. المستثمرون يبيعون. فرص محتملة إذا كان السياق قوياً.' },
    mkt_pulse_edu_equilibrado: { es: 'Mercado equilibrado. Ni euforia ni pánico. Momento ideal para analizar fundamentals.', en: 'Balanced market. Neither euphoria nor panic. Ideal time to analyze fundamentals.', pt: 'Mercado equilibrado. Nem euforia nem pânico. Momento ideal para analisar fundamentos.', zh: '市场均衡。既无狂热也无恐慌。分析基本面的理想时机。', fr: 'Marché équilibré. Ni euphorie ni panique. Moment idéal pour analyser les fondamentaux.', it: 'Mercato equilibrato. Né euforia né panico. Momento ideale per analizzare i fondamentali.', hi: 'संतुलित बाज़ार। न उत्साह न दहशत। फंडामेंटल विश्लेषण का आदर्श समय।', ar: 'سوق متوازن. لا نشوة ولا ذعر. وقت مثالي لتحليل الأساسيات.' },
    mkt_pulse_edu_optimismo: { es: 'Optimismo en el mercado. Precios pueden estar elevados. Considerar toma de ganancias.', en: 'Market optimism. Prices may be elevated. Consider taking profits.', pt: 'Otimismo no mercado. Preços podem estar elevados. Considere realizar lucros.', zh: '市场乐观。价格可能偏高。考虑获利了结。', fr: 'Optimisme du marché. Les prix peuvent être élevés. Envisager de prendre des bénéfices.', it: 'Ottimismo nel mercato. I prezzi potrebbero essere elevati. Considerare di prendere profitti.', hi: 'बाज़ार में आशावाद। मूल्य ऊँचे हो सकते हैं। लाभ लेने पर विचार करें।', ar: 'تفاؤل في السوق. الأسعار قد تكون مرتفعة. فكر في جني الأرباح.' },
    mkt_pulse_edu_euforia: { es: 'Euforia extrema. Alta probabilidad de corrección próxima. Máxima precaución.', en: 'Extreme euphoria. High probability of upcoming correction. Maximum caution.', pt: 'Euforia extrema. Alta probabilidade de correção próxima. Máxima precaução.', zh: '极度狂热。即将修正的概率高。最大限度谨慎。', fr: 'Euphorie extrême. Forte probabilité de correction prochaine. Prudence maximale.', it: 'Euforia estrema. Alta probabilità di correzione imminente. Massima cautela.', hi: 'अत्यधिक उत्साह। आगामी सुधार की उच्च संभावना। अधिकतम सावधानी।', ar: 'نشوة شديدة. احتمال تصحيح وشيك عالٍ. أقصى حذر.' },

    // Pulse Info modal
    mkt_pulse_info_title: { es: '\u26A1 Cobrex FEAR & GREED 14X\u2122', en: '\u26A1 Cobrex FEAR & GREED 14X\u2122', pt: '\u26A1 Cobrex FEAR & GREED 14X\u2122', zh: '\u26A1 Cobrex FEAR & GREED 14X\u2122', fr: '\u26A1 Cobrex FEAR & GREED 14X\u2122', it: '\u26A1 Cobrex FEAR & GREED 14X\u2122', hi: '\u26A1 Cobrex FEAR & GREED 14X\u2122', ar: '\u26A1 Cobrex FEAR & GREED 14X\u2122' },
    mkt_pulse_info_subtitle: { es: 'El índice de sentimiento más completo del mercado', en: 'The most comprehensive market sentiment index', pt: 'O índice de sentimento mais completo do mercado', zh: '最全面的市场情绪指数', fr: "L'indice de sentiment de marché le plus complet", it: "L'indice di sentiment di mercato più completo", hi: 'सबसे व्यापक बाज़ार भावना सूचकांक', ar: 'مؤشر معنويات السوق الأكثر شمولاً' },
    mkt_pulse_zonas_title: { es: 'Las 5 zonas:', en: 'The 5 zones:', pt: 'As 5 zonas:', zh: '5个区域：', fr: 'Les 5 zones :', it: 'Le 5 zone:', hi: '5 ज़ोन:', ar: 'المناطق الخمس:' },
    mkt_pulse_zona_miedo_ext: { es: '\uD83D\uDD34 0-20 Miedo Extremo', en: '\uD83D\uDD34 0-20 Extreme Fear', pt: '\uD83D\uDD34 0-20 Medo Extremo', zh: '\uD83D\uDD34 0-20 极度恐惧', fr: '\uD83D\uDD34 0-20 Peur Extrême', it: '\uD83D\uDD34 0-20 Paura Estrema', hi: '\uD83D\uDD34 0-20 अत्यधिक भय', ar: '\uD83D\uDD34 0-20 خوف شديد' },
    mkt_pulse_zona_miedo: { es: '\uD83D\uDFE0 21-40 Miedo', en: '\uD83D\uDFE0 21-40 Fear', pt: '\uD83D\uDFE0 21-40 Medo', zh: '\uD83D\uDFE0 21-40 恐惧', fr: '\uD83D\uDFE0 21-40 Peur', it: '\uD83D\uDFE0 21-40 Paura', hi: '\uD83D\uDFE0 21-40 भय', ar: '\uD83D\uDFE0 21-40 خوف' },
    mkt_pulse_zona_neutral: { es: '\uD83D\uDFE1 41-60 Neutral', en: '\uD83D\uDFE1 41-60 Neutral', pt: '\uD83D\uDFE1 41-60 Neutro', zh: '\uD83D\uDFE1 41-60 中性', fr: '\uD83D\uDFE1 41-60 Neutre', it: '\uD83D\uDFE1 41-60 Neutrale', hi: '\uD83D\uDFE1 41-60 तटस्थ', ar: '\uD83D\uDFE1 41-60 محايد' },
    mkt_pulse_zona_codicia: { es: '\uD83D\uDFE2 61-80 Codicia', en: '\uD83D\uDFE2 61-80 Greed', pt: '\uD83D\uDFE2 61-80 Ganância', zh: '\uD83D\uDFE2 61-80 贪婪', fr: '\uD83D\uDFE2 61-80 Avidité', it: '\uD83D\uDFE2 61-80 Avidità', hi: '\uD83D\uDFE2 61-80 लालच', ar: '\uD83D\uDFE2 61-80 جشع' },
    mkt_pulse_zona_codicia_ext: { es: '\uD83D\uDC9C 81-100 Codicia Extrema', en: '\uD83D\uDC9C 81-100 Extreme Greed', pt: '\uD83D\uDC9C 81-100 Ganância Extrema', zh: '\uD83D\uDC9C 81-100 极度贪婪', fr: '\uD83D\uDC9C 81-100 Avidité Extrême', it: '\uD83D\uDC9C 81-100 Avidità Estrema', hi: '\uD83D\uDC9C 81-100 अत्यधिक लालच', ar: '\uD83D\uDC9C 81-100 جشع شديد' },
    mkt_pulse_vars_title: { es: 'Variables activas (12 de 14):', en: 'Active variables (12 of 14):', pt: 'Variáveis ativas (12 de 14):', zh: '活跃变量（14个中的12个）：', fr: 'Variables actives (12 sur 14) :', it: 'Variabili attive (12 su 14):', hi: 'सक्रिय वेरिएबल (14 में से 12):', ar: 'متغيرات نشطة (12 من 14):' },
    mkt_pulse_th_variable: { es: 'VARIABLE', en: 'VARIABLE', pt: 'VARIÁVEL', zh: '变量', fr: 'VARIABLE', it: 'VARIABILE', hi: 'वेरिएबल', ar: 'المتغير' },
    mkt_pulse_th_fuente: { es: 'FUENTE', en: 'SOURCE', pt: 'FONTE', zh: '来源', fr: 'SOURCE', it: 'FONTE', hi: 'स्रोत', ar: 'المصدر' },
    mkt_pulse_th_peso: { es: 'PESO', en: 'WEIGHT', pt: 'PESO', zh: '权重', fr: 'POIDS', it: 'PESO', hi: 'भार', ar: 'الوزن' },
    mkt_pulse_th_valor: { es: 'VALOR', en: 'VALUE', pt: 'VALOR', zh: '值', fr: 'VALEUR', it: 'VALORE', hi: 'मान', ar: 'القيمة' },
    mkt_pulse_var_vix: { es: 'VIX volatilidad', en: 'VIX volatility', pt: 'VIX volatilidade', zh: 'VIX 波动率', fr: 'VIX volatilité', it: 'VIX volatilità', hi: 'VIX अस्थिरता', ar: 'VIX التقلب' },
    mkt_pulse_var_oro: { es: 'Oro GC=F', en: 'Gold GC=F', pt: 'Ouro GC=F', zh: '黄金 GC=F', fr: 'Or GC=F', it: 'Oro GC=F', hi: 'सोना GC=F', ar: 'ذهب GC=F' },
    mkt_pulse_var_plata: { es: 'Plata SI=F', en: 'Silver SI=F', pt: 'Prata SI=F', zh: '白银 SI=F', fr: 'Argent SI=F', it: 'Argento SI=F', hi: 'चाँदी SI=F', ar: 'فضة SI=F' },
    mkt_pulse_var_petroleo: { es: 'Petróleo CL=F', en: 'Oil CL=F', pt: 'Petróleo CL=F', zh: '石油 CL=F', fr: 'Pétrole CL=F', it: 'Petrolio CL=F', hi: 'तेल CL=F', ar: 'نفط CL=F' },
    mkt_pulse_var_cobre: { es: 'Cobre HG=F', en: 'Copper HG=F', pt: 'Cobre HG=F', zh: '铜 HG=F', fr: 'Cuivre HG=F', it: 'Rame HG=F', hi: 'तांबा HG=F', ar: 'نحاس HG=F' },
    mkt_pulse_var_geopolitica: { es: 'Geopolítica', en: 'Geopolitics', pt: 'Geopolítica', zh: '地缘政治', fr: 'Géopolitique', it: 'Geopolitica', hi: 'भू-राजनीति', ar: 'الجيوسياسة' },
    mkt_pulse_disclaimer: { es: '* Macro FED (FRED API) y Geopolítica (GDELT Project) activos son fallback estimados. 14 variables a cobertura completa en múltiples mercados.', en: '* Macro FED (FRED API) and Geopolitics (GDELT Project) are estimated fallbacks. 14 variables for full coverage across multiple markets.', pt: '* Macro FED (FRED API) e Geopolítica (GDELT Project) são fallbacks estimados. 14 variáveis para cobertura completa em múltiplos mercados.', zh: '* 宏观FED（FRED API）和地缘政治（GDELT Project）为估算后备。14个变量覆盖多个市场。', fr: '* Macro FED (FRED API) et Géopolitique (GDELT Project) sont des fallbacks estimés. 14 variables pour couverture complète sur multiples marchés.', it: '* Macro FED (FRED API) e Geopolitica (GDELT Project) sono fallback stimati. 14 variabili per copertura completa su mercati multipli.', hi: '* मैक्रो FED (FRED API) और भू-राजनीति (GDELT Project) अनुमानित फ़ॉलबैक हैं। एकाधिक बाज़ारों में पूर्ण कवरेज के लिए 14 वेरिएबल।', ar: '* Macro FED (FRED API) والجيوسياسة (GDELT Project) هي احتياطات تقديرية. 14 متغيراً لتغطية كاملة عبر أسواق متعددة.' },

    // Ver Variables popup
    mkt_vars_title: { es: 'Cobrex IA \u26A1 \u2014 10 VARIABLES', en: 'Cobrex AI \u26A1 \u2014 10 VARIABLES', pt: 'Cobrex IA \u26A1 \u2014 10 VARIÁVEIS', zh: 'Cobrex AI \u26A1 \u2014 10 个变量', fr: 'Cobrex IA \u26A1 \u2014 10 VARIABLES', it: 'Cobrex IA \u26A1 \u2014 10 VARIABILI', hi: 'Cobrex AI \u26A1 \u2014 10 वेरिएबल', ar: 'Cobrex AI \u26A1 \u2014 10 متغيرات' },
    mkt_vars_subtitle: { es: 'Motor de señales v7 \u2014 tiempo real', en: 'Signal engine v7 \u2014 real time', pt: 'Motor de sinais v7 \u2014 tempo real', zh: '信号引擎 v7 \u2014 实时', fr: 'Moteur de signaux v7 \u2014 temps réel', it: 'Motore segnali v7 \u2014 tempo reale', hi: 'सिग्नल इंजन v7 \u2014 रियल-टाइम', ar: 'محرك الإشارات v7 \u2014 الوقت الحقيقي' },
    mkt_vars_desc: { es: 'Cada señal es el resultado de puntuar 10 variables independientes. El score total determina la dirección y la probabilidad. Rango de probabilidad: 55%\u201388%.', en: 'Each signal is the result of scoring 10 independent variables. The total score determines direction and probability. Probability range: 55%\u201388%.', pt: 'Cada sinal é o resultado de pontuar 10 variáveis independentes. O score total determina a direção e a probabilidade. Faixa de probabilidade: 55%\u201388%.', zh: '每个信号是对10个独立变量评分的结果。总分决定方向和概率。概率范围：55%\u201388%。', fr: 'Chaque signal résulte de la notation de 10 variables indépendantes. Le score total détermine la direction et la probabilité. Plage de probabilité : 55%\u201388%.', it: 'Ogni segnale è il risultato della valutazione di 10 variabili indipendenti. Lo score totale determina direzione e probabilità. Range di probabilità: 55%\u201388%.', hi: 'प्रत्येक सिग्नल 10 स्वतंत्र वेरिएबल को स्कोर करने का परिणाम है। कुल स्कोर दिशा और संभावना निर्धारित करता है। संभावना रेंज: 55%\u201388%।', ar: 'كل إشارة هي نتيجة تسجيل 10 متغيرات مستقلة. المجموع يحدد الاتجاه والاحتمالية. نطاق الاحتمالية: 55%\u201388%.' },
    mkt_vars_mercado_ahora: { es: 'Mercado ahora:', en: 'Market now:', pt: 'Mercado agora:', zh: '当前市场：', fr: 'Marché maintenant :', it: 'Mercato ora:', hi: 'बाज़ार अभी:', ar: 'السوق الآن:' },
    mkt_vars_al_alza: { es: ' al alza', en: ' bullish', pt: ' em alta', zh: ' 看涨', fr: ' haussier', it: ' al rialzo', hi: ' तेज़ी', ar: ' صاعد' },
    mkt_vars_a_la_baja: { es: ' a la baja', en: ' bearish', pt: ' em baixa', zh: ' 看跌', fr: ' baissier', it: ' al ribasso', hi: ' मंदी', ar: ' هابط' },
    mkt_var1_label: { es: '1. Tendencia 24h', en: '1. 24h Trend', pt: '1. Tendência 24h', zh: '1. 24小时趋势', fr: '1. Tendance 24h', it: '1. Tendenza 24h', hi: '1. 24 घंटे का रुझान', ar: '1. اتجاه 24 ساعة' },
    mkt_var1_desc: { es: 'Variación % del precio en las últimas 24hs. Mide el momentum inmediato.', en: 'Price % change in last 24h. Measures immediate momentum.', pt: 'Variação % do preço nas últimas 24h. Mede o momentum imediato.', zh: '过去24小时价格变化百分比。衡量即时动能。', fr: 'Variation % du prix dans les dernières 24h. Mesure le momentum immédiat.', it: 'Variazione % del prezzo nelle ultime 24h. Misura il momentum immediato.', hi: 'पिछले 24 घंटे में मूल्य % परिवर्तन। तत्काल गति को मापता है।', ar: 'نسبة تغير السعر خلال 24 ساعة. يقيس الزخم الفوري.' },
    mkt_var2_label: { es: '2. RSI14 Real', en: '2. RSI14 Real', pt: '2. RSI14 Real', zh: '2. RSI14 实时', fr: '2. RSI14 Réel', it: '2. RSI14 Reale', hi: '2. RSI14 वास्तविक', ar: '2. RSI14 حقيقي' },
    mkt_var2_desc: { es: 'Índice de Fuerza Relativa de 14 períodos desde Binance/Yahoo. Detecta sobrecompra (>70) y sobreventa (<30).', en: 'Relative Strength Index of 14 periods from Binance/Yahoo. Detects overbought (>70) and oversold (<30).', pt: 'Índice de Força Relativa de 14 períodos via Binance/Yahoo. Detecta sobrecompra (>70) e sobrevenda (<30).', zh: '来自Binance/Yahoo的14期相对强弱指数。检测超买(>70)和超卖(<30)。', fr: "Indice de Force Relative de 14 périodes depuis Binance/Yahoo. Détecte le surachat (>70) et la survente (<30).", it: 'Indice di Forza Relativa a 14 periodi da Binance/Yahoo. Rileva ipercomprato (>70) e ipervenduto (<30).', hi: 'Binance/Yahoo से 14 अवधि RSI। अधिक खरीद (>70) और अधिक बिक्री (<30) का पता लगाता है।', ar: 'مؤشر القوة النسبية 14 فترة من Binance/Yahoo. يكتشف الشراء المفرط (>70) والبيع المفرط (<30).' },
    mkt_var3_label: { es: '3. Volumen Real', en: '3. Real Volume', pt: '3. Volume Real', zh: '3. 实时成交量', fr: '3. Volume Réel', it: '3. Volume Reale', hi: '3. वास्तविक मात्रा', ar: '3. الحجم الحقيقي' },
    mkt_var3_desc: { es: 'Ratio de volumen actual vs promedio de los últimos 5 días. Confirma si el movimiento tiene convicción.', en: 'Current volume ratio vs 5-day average. Confirms if the move has conviction.', pt: 'Razão do volume atual vs média dos últimos 5 dias. Confirma se o movimento tem convicção.', zh: '当前成交量与5日均量的比率。确认走势是否有力度。', fr: 'Ratio du volume actuel vs moyenne des 5 derniers jours. Confirme si le mouvement a de la conviction.', it: 'Rapporto volume attuale vs media ultimi 5 giorni. Conferma se il movimento ha convinzione.', hi: 'वर्तमान वॉल्यूम अनुपात बनाम 5-दिन औसत। पुष्टि करता है कि चाल में दृढ़ता है।', ar: 'نسبة الحجم الحالي مقابل متوسط 5 أيام. يؤكد ما إذا كانت الحركة ذات قناعة.' },
    mkt_var4_label: { es: '4. Volatilidad', en: '4. Volatility', pt: '4. Volatilidade', zh: '4. 波动率', fr: '4. Volatilité', it: '4. Volatilità', hi: '4. अस्थिरता', ar: '4. التقلب' },
    mkt_var4_desc: { es: 'Amplitud del rango diario (high\u2013low / precio). Alta volatilidad = mayor riesgo.', en: 'Daily range amplitude (high\u2013low / price). High volatility = higher risk.', pt: 'Amplitude do range diário (high\u2013low / preço). Alta volatilidade = maior risco.', zh: '日内区间幅度（最高-最低/价格）。高波动率=更高风险。', fr: 'Amplitude du range journalier (high\u2013low / prix). Haute volatilité = risque plus élevé.', it: 'Ampiezza del range giornaliero (high\u2013low / prezzo). Alta volatilità = maggior rischio.', hi: 'दैनिक रेंज आयाम (उच्च-निम्न / मूल्य)। उच्च अस्थिरता = अधिक जोखिम।', ar: 'سعة النطاق اليومي (أعلى-أدنى / السعر). تقلب عالٍ = مخاطر أعلى.' },
    mkt_var5_label: { es: '5. Correlación BTC/SPY', en: '5. BTC/SPY Correlation', pt: '5. Correlação BTC/SPY', zh: '5. BTC/SPY相关性', fr: '5. Corrélation BTC/SPY', it: '5. Correlazione BTC/SPY', hi: '5. BTC/SPY सहसंबंध', ar: '5. ارتباط BTC/SPY' },
    mkt_var5_desc: { es: 'Para cripto: correlación con BTC. Para acciones: con S&P500. Detecta arrastre sistémico.', en: 'For crypto: correlation with BTC. For stocks: with S&P500. Detects systemic drag.', pt: 'Para cripto: correlação com BTC. Para ações: com S&P500. Detecta arraste sistêmico.', zh: '加密：与BTC的相关性。股票：与S&P500的相关性。检测系统性拖累。', fr: 'Pour crypto : corrélation avec BTC. Pour actions : avec S&P500. Détecte le drag systémique.', it: 'Per crypto: correlazione con BTC. Per azioni: con S&P500. Rileva il trascinamento sistemico.', hi: 'क्रिप्टो: BTC के साथ सहसंबंध। स्टॉक: S&P500 के साथ। प्रणालीगत प्रभाव का पता लगाता है।', ar: 'للكريبتو: الارتباط مع BTC. للأسهم: مع S&P500. يكتشف السحب المنهجي.' },
    mkt_var6_label: { es: '6. Oro / Petróleo', en: '6. Gold / Oil', pt: '6. Ouro / Petróleo', zh: '6. 黄金/石油', fr: '6. Or / Pétrole', it: '6. Oro / Petrolio', hi: '6. सोना / तेल', ar: '6. ذهب / نفط' },
    mkt_var6_desc: { es: 'Precios de activos refugio. Oro alto = aversión al riesgo. Impacta según tipo de activo.', en: 'Safe-haven asset prices. High gold = risk aversion. Impact depends on asset type.', pt: 'Preços de ativos refúgio. Ouro alto = aversão ao risco. Impacta conforme tipo de ativo.', zh: '避险资产价格。黄金高=风险厌恶。影响取决于资产类型。', fr: "Prix des actifs refuges. Or élevé = aversion au risque. Impact selon le type d'actif.", it: "Prezzi degli asset rifugio. Oro alto = avversione al rischio. Impatto secondo tipo d'asset.", hi: 'सुरक्षित-आश्रय एसेट मूल्य। सोना ऊँचा = जोखिम से बचाव। एसेट प्रकार पर निर्भर।', ar: 'أسعار أصول الملاذ الآمن. ذهب مرتفع = تجنب المخاطر. التأثير حسب نوع الأصل.' },
    mkt_var7_label: { es: '7. Macro FED', en: '7. Macro FED', pt: '7. Macro FED', zh: '7. 宏观 FED', fr: '7. Macro FED', it: '7. Macro FED', hi: '7. मैक्रो FED', ar: '7. ماكرو FED' },
    mkt_var7_desc: { es: 'Eventos macro de alto impacto programados (FOMC, CPI, PBI). Incrementa incertidumbre.', en: 'Scheduled high-impact macro events (FOMC, CPI, GDP). Increases uncertainty.', pt: 'Eventos macro de alto impacto programados (FOMC, CPI, PIB). Aumenta incerteza.', zh: '计划中的高影响宏观事件（FOMC, CPI, GDP）。增加不确定性。', fr: 'Événements macro à fort impact programmés (FOMC, CPI, PIB). Augmente l\'incertitude.', it: 'Eventi macro ad alto impatto programmati (FOMC, CPI, PIL). Aumenta l\'incertezza.', hi: 'निर्धारित उच्च-प्रभाव मैक्रो इवेंट (FOMC, CPI, GDP)। अनिश्चितता बढ़ाता है।', ar: 'أحداث ماكرو عالية التأثير مجدولة (FOMC, CPI, GDP). تزيد عدم اليقين.' },
    mkt_var8_label: { es: '8. Earnings', en: '8. Earnings', pt: '8. Earnings', zh: '8. 财报', fr: '8. Earnings', it: '8. Earnings', hi: '8. Earnings', ar: '8. الأرباح' },
    mkt_var8_desc: { es: 'Reportes de resultados próximos. Históricamente elevan la volatilidad del activo.', en: 'Upcoming earnings reports. Historically increase asset volatility.', pt: 'Relatórios de resultados próximos. Historicamente elevam a volatilidade do ativo.', zh: '即将发布的财报。历史上会增加资产波动性。', fr: "Rapports de résultats à venir. Historiquement augmentent la volatilité de l'actif.", it: "Report di risultati imminenti. Storicamente aumentano la volatilità dell'asset.", hi: 'आगामी कमाई रिपोर्ट। ऐतिहासिक रूप से एसेट अस्थिरता बढ़ाती हैं।', ar: 'تقارير أرباح قادمة. تاريخياً تزيد تقلب الأصل.' },
    mkt_var9_label: { es: '9. MACD (12/26)', en: '9. MACD (12/26)', pt: '9. MACD (12/26)', zh: '9. MACD (12/26)', fr: '9. MACD (12/26)', it: '9. MACD (12/26)', hi: '9. MACD (12/26)', ar: '9. MACD (12/26)' },
    mkt_var9_desc: { es: 'Divergencia entre EMA12 y EMA26 calculada sobre los últimos 30 días de precios de cierre. Detecta cruces de momentum.', en: 'Divergence between EMA12 and EMA26 calculated over last 30 days of closing prices. Detects momentum crossovers.', pt: 'Divergência entre EMA12 e EMA26 calculada sobre os últimos 30 dias de preços de fechamento. Detecta cruzamentos de momentum.', zh: '基于最近30天收盘价计算的EMA12和EMA26之间的背离。检测动能交叉。', fr: 'Divergence entre EMA12 et EMA26 calculée sur les 30 derniers jours de prix de clôture. Détecte les croisements de momentum.', it: 'Divergenza tra EMA12 ed EMA26 calcolata sugli ultimi 30 giorni di prezzi di chiusura. Rileva crossover di momentum.', hi: 'पिछले 30 दिनों के बंद मूल्यों पर गणना की गई EMA12 और EMA26 के बीच विचलन। गति क्रॉसओवर का पता लगाता है।', ar: 'التباعد بين EMA12 وEMA26 محسوب على آخر 30 يوم من أسعار الإغلاق. يكتشف تقاطعات الزخم.' },
    mkt_var10_label: { es: '10. Soporte / Resist. 30d', en: '10. Support / Resist. 30d', pt: '10. Suporte / Resist. 30d', zh: '10. 支撑/阻力 30天', fr: '10. Support / Résist. 30j', it: '10. Supporto / Resist. 30g', hi: '10. सपोर्ट / रेज़िस्ट. 30दि', ar: '10. دعم / مقاومة 30 يوم' },
    mkt_var10_desc: { es: 'Distancia del precio actual al máximo y mínimo de los últimos 30 días. Detecta zonas de oferta y demanda técnica.', en: 'Distance from current price to 30-day high and low. Detects technical supply and demand zones.', pt: 'Distância do preço atual ao máximo e mínimo dos últimos 30 dias. Detecta zonas de oferta e demanda técnica.', zh: '当前价格与过去30天最高最低价的距离。检测技术供需区域。', fr: 'Distance du prix actuel au max et min des 30 derniers jours. Détecte les zones techniques d\'offre et demande.', it: 'Distanza del prezzo attuale dal massimo e minimo degli ultimi 30 giorni. Rileva zone di offerta e domanda tecnica.', hi: 'वर्तमान मूल्य से 30-दिन के उच्च और निम्न तक की दूरी। तकनीकी आपूर्ति और मांग क्षेत्रों का पता लगाता है।', ar: 'المسافة من السعر الحالي إلى أعلى وأدنى 30 يوماً. يكتشف مناطق العرض والطلب الفنية.' },

    // Long Press Mercados
    mkt_lp_precio: { es: 'Precio', en: 'Price', pt: 'Preço', zh: '价格', fr: 'Prix', it: 'Prezzo', hi: 'मूल्य', ar: 'السعر' },
    mkt_lp_objetivo_ia: { es: 'Objetivo IA', en: 'AI Target', pt: 'Objetivo IA', zh: 'AI目标', fr: 'Objectif IA', it: 'Obiettivo IA', hi: 'AI लक्ष्य', ar: 'هدف AI' },
    mkt_lp_senal_ia: { es: 'Señal IA ', en: 'AI Signal ', pt: 'Sinal IA ', zh: 'AI信号 ', fr: 'Signal IA ', it: 'Segnale IA ', hi: 'AI सिग्नल ', ar: 'إشارة AI ' },
    mkt_lp_quitar_fav: { es: '★ Quitar de Favoritos', en: '★ Remove from Favorites', pt: '★ Remover dos Favoritos', zh: '★ 从收藏中移除', fr: '★ Retirer des Favoris', it: '★ Rimuovi dai Preferiti', hi: '★ पसंदीदा से हटाएँ', ar: '★ إزالة من المفضلة' },
    mkt_lp_agregar_fav: { es: '★ Agregar a Favoritos', en: '★ Add to Favorites', pt: '★ Adicionar aos Favoritos', zh: '★ 添加到收藏', fr: '★ Ajouter aux Favoris', it: '★ Aggiungi ai Preferiti', hi: '★ पसंदीदा में जोड़ें', ar: '★ إضافة إلى المفضلة' },
    mkt_lp_agregar_portfolio: { es: 'Agregar a Portfolio', en: 'Add to Portfolio', pt: 'Adicionar ao Portfólio', zh: '添加到投资组合', fr: 'Ajouter au Portfolio', it: 'Aggiungi al Portfolio', hi: 'Portfolio में जोड़ें', ar: 'إضافة إلى Portfolio' },
    mkt_lp_cerrar: { es: 'Cerrar', en: 'Close', pt: 'Fechar', zh: '关闭', fr: 'Fermer', it: 'Chiudi', hi: 'बंद करें', ar: 'إغلاق' },

    // Futuros banner
    mkt_fut_suffix: { es: ' Fut', en: ' Fut', pt: ' Fut', zh: ' 期货', fr: ' Fut', it: ' Fut', hi: ' Fut', ar: ' آجل' },
    mkt_fut_edit_title: { es: 'Futuros en banner', en: 'Futures in banner', pt: 'Futuros no banner', zh: 'Banner中的期货', fr: 'Futures dans la bannière', it: 'Futures nel banner', hi: 'बैनर में फ्यूचर्स', ar: 'العقود الآجلة في الشريط' },

    // Otros
    mkt_copiado: { es: 'Copiado al portapapeles', en: 'Copied to clipboard', pt: 'Copiado para a área de transferência', zh: '已复制到剪贴板', fr: 'Copié dans le presse-papiers', it: 'Copiato negli appunti', hi: 'क्लिपबोर्ड पर कॉपी किया गया', ar: 'تم النسخ إلى الحافظة' },
    mkt_live_hace_s: { es: '· hace ', en: '· ', pt: '· há ', zh: '· ', fr: '· il y a ', it: '· ', hi: '· ', ar: '· منذ ' },
    mkt_live_hace_min: { es: ' min', en: ' min ago', pt: ' min', zh: ' 分钟前', fr: ' min', it: ' min fa', hi: ' मिनट पहले', ar: ' دقيقة' },

    // Gauge labels (cortos)
    mkt_gauge_miedo_ext: { es: 'Miedo Extremo', en: 'Extreme Fear', pt: 'Medo Extremo', zh: '极度恐惧', fr: 'Peur Extrême', it: 'Paura Estrema', hi: 'अत्यधिक भय', ar: 'خوف شديد' },
    mkt_gauge_miedo: { es: 'Miedo', en: 'Fear', pt: 'Medo', zh: '恐惧', fr: 'Peur', it: 'Paura', hi: 'भय', ar: 'خوف' },
    mkt_gauge_neutral: { es: 'Neutral', en: 'Neutral', pt: 'Neutro', zh: '中性', fr: 'Neutre', it: 'Neutrale', hi: 'तटस्थ', ar: 'محايد' },
    mkt_gauge_codicia: { es: 'Codicia', en: 'Greed', pt: 'Ganância', zh: '贪婪', fr: 'Avidité', it: 'Avidità', hi: 'लालच', ar: 'جشع' },
    mkt_gauge_codicia_ext: { es: 'Codicia Extrema', en: 'Extreme Greed', pt: 'Ganância Extrema', zh: '极度贪婪', fr: 'Avidité Extrême', it: 'Avidità Estrema', hi: 'अत्यधिक लालच', ar: 'جشع شديد' },

    // Variables Peso label
    mkt_vars_peso: { es: 'Peso', en: 'Weight', pt: 'Peso', zh: '权重', fr: 'Poids', it: 'Peso', hi: 'भार', ar: 'الوزن' },
    mkt_vars_peso_alta: { es: 'Alta', en: 'High', pt: 'Alta', zh: '高', fr: 'Élevé', it: 'Alto', hi: 'उच्च', ar: 'عالي' },
    mkt_vars_peso_media: { es: 'Media', en: 'Medium', pt: 'Média', zh: '中', fr: 'Moyen', it: 'Medio', hi: 'मध्यम', ar: 'متوسط' },

    // Pulse filter tabs
    mkt_pulse_cat_global: { es: 'GLOBAL', en: 'GLOBAL', pt: 'GLOBAL', zh: '全球', fr: 'GLOBAL', it: 'GLOBALE', hi: 'ग्लोबल', ar: 'عالمي' },
    mkt_pulse_cat_cripto: { es: 'CRIPTO', en: 'CRYPTO', pt: 'CRIPTO', zh: '加密', fr: 'CRYPTO', it: 'CRYPTO', hi: 'क्रिप्टो', ar: 'كريبتو' },
    mkt_pulse_cat_acciones: { es: 'ACCIONES', en: 'STOCKS', pt: 'AÇÕES', zh: '股票', fr: 'ACTIONS', it: 'AZIONI', hi: 'स्टॉक', ar: 'أسهم' },
    mkt_pulse_cat_comod: { es: 'COMOD', en: 'COMMOD', pt: 'COMOD', zh: '商品', fr: 'MAT.P', it: 'COMMOD', hi: 'कमोडि', ar: 'سلع' },
    mkt_pulse_cat_futuros: { es: 'FUTUROS', en: 'FUTURES', pt: 'FUTUROS', zh: '期货', fr: 'FUTURES', it: 'FUTURES', hi: 'फ्यूचर्स', ar: 'آجلة' },

    // === WATCHLIST ===

    wl_header_title: { es: 'Watchlist', en: 'Watchlist', pt: 'Watchlist', zh: '自选列表', fr: 'Watchlist', it: 'Watchlist', hi: 'Watchlist', ar: 'قائمة المتابعة' },
    wl_nueva_lista: { es: '+ Nueva lista', en: '+ New list', pt: '+ Nova lista', zh: '+ 新建列表', fr: '+ Nouvelle liste', it: '+ Nuova lista', hi: '+ नई सूची', ar: '+ قائمة جديدة' },
    wl_vacia_title: { es: 'Tu Watchlist esta vacia', en: 'Your Watchlist is empty', pt: 'Sua Watchlist está vazia', zh: '您的自选列表为空', fr: 'Votre Watchlist est vide', it: 'La tua Watchlist è vuota', hi: 'आपकी Watchlist खाली है', ar: 'قائمة المتابعة فارغة' },
    wl_vacia_desc: { es: 'Crea tu primera lista para seguir activos con senales IA en tiempo real', en: 'Create your first list to follow assets with real-time AI signals', pt: 'Crie sua primeira lista para acompanhar ativos com sinais IA em tempo real', zh: '创建您的第一个列表，实时跟踪AI信号资产', fr: 'Créez votre première liste pour suivre des actifs avec des signaux IA en temps réel', it: 'Crea la tua prima lista per seguire asset con segnali IA in tempo reale', hi: 'रियल-टाइम AI सिग्नल के साथ एसेट ट्रैक करने के लिए अपनी पहली सूची बनाएँ', ar: 'أنشئ قائمتك الأولى لمتابعة الأصول بإشارات AI في الوقت الحقيقي' },
    wl_crear_primera: { es: 'Crear primera lista', en: 'Create first list', pt: 'Criar primeira lista', zh: '创建第一个列表', fr: 'Créer la première liste', it: 'Crea prima lista', hi: 'पहली सूची बनाएँ', ar: 'إنشاء القائمة الأولى' },
    wl_nueva_lista_title: { es: 'Nueva lista', en: 'New list', pt: 'Nova lista', zh: '新建列表', fr: 'Nouvelle liste', it: 'Nuova lista', hi: 'नई सूची', ar: 'قائمة جديدة' },
    wl_nombre_label: { es: 'Nombre', en: 'Name', pt: 'Nome', zh: '名称', fr: 'Nom', it: 'Nome', hi: 'नाम', ar: 'الاسم' },
    wl_nombre_placeholder: { es: 'Ej: Criptos favoritas', en: 'E.g.: Favorite Cryptos', pt: 'Ex: Criptos favoritas', zh: '例：最爱的加密货币', fr: 'Ex : Cryptos favorites', it: 'Es: Crypto preferite', hi: 'उदा: पसंदीदा क्रिप्टो', ar: 'مثال: كريبتو مفضلة' },
    wl_color_label: { es: 'Color', en: 'Color', pt: 'Cor', zh: '颜色', fr: 'Couleur', it: 'Colore', hi: 'रंग', ar: 'اللون' },
    wl_marcar_principal: { es: 'Marcar como Lista Principal', en: 'Mark as Primary List', pt: 'Marcar como Lista Principal', zh: '标记为主列表', fr: 'Marquer comme Liste Principale', it: 'Segna come Lista Principale', hi: 'प्राथमिक सूची के रूप में चिह्नित करें', ar: 'تعيين كقائمة رئيسية' },
    wl_crear_lista: { es: 'Crear lista', en: 'Create list', pt: 'Criar lista', zh: '创建列表', fr: 'Créer la liste', it: 'Crea lista', hi: 'सूची बनाएँ', ar: 'إنشاء القائمة' },
    wl_agregar_activo: { es: 'Agregar activo', en: 'Add asset', pt: 'Adicionar ativo', zh: '添加资产', fr: 'Ajouter un actif', it: 'Aggiungi asset', hi: 'एसेट जोड़ें', ar: 'إضافة أصل' },
    wl_buscar_placeholder: { es: 'Buscar: BTC, AAPL, SPY...', en: 'Search: BTC, AAPL, SPY...', pt: 'Buscar: BTC, AAPL, SPY...', zh: '搜索：BTC, AAPL, SPY...', fr: 'Rechercher : BTC, AAPL, SPY...', it: 'Cerca: BTC, AAPL, SPY...', hi: 'खोजें: BTC, AAPL, SPY...', ar: 'بحث: BTC, AAPL, SPY...' },
    wl_activos_count: { es: ' activos', en: ' assets', pt: ' ativos', zh: ' 个资产', fr: ' actifs', it: ' asset', hi: ' एसेट', ar: ' أصول' },
    wl_comparar: { es: '⚖️ Comparar', en: '⚖️ Compare', pt: '⚖️ Comparar', zh: '⚖️ 比较', fr: '⚖️ Comparer', it: '⚖️ Confronta', hi: '⚖️ तुलना', ar: '⚖️ مقارنة' },
    wl_agregar: { es: '+ Agregar', en: '+ Add', pt: '+ Adicionar', zh: '+ 添加', fr: '+ Ajouter', it: '+ Aggiungi', hi: '+ जोड़ें', ar: '+ إضافة' },
    wl_seleccionados: { es: ' seleccionados — toca ⚖️ Comparar arriba', en: ' selected — tap ⚖️ Compare above', pt: ' selecionados — toque ⚖️ Comparar acima', zh: ' 已选 — 点击上方 ⚖️ 比较', fr: ' sélectionnés — touchez ⚖️ Comparer ci-dessus', it: ' selezionati — tocca ⚖️ Confronta sopra', hi: ' चयनित — ऊपर ⚖️ तुलना दबाएँ', ar: ' محدد — انقر ⚖️ مقارنة أعلاه' },
    wl_selecciona_2_5: { es: 'Selecciona 2 a 5 activos', en: 'Select 2 to 5 assets', pt: 'Selecione 2 a 5 ativos', zh: '选择2到5个资产', fr: 'Sélectionnez 2 à 5 actifs', it: 'Seleziona da 2 a 5 asset', hi: '2 से 5 एसेट चुनें', ar: 'اختر 2 إلى 5 أصول' },
    wl_lista_vacia: { es: 'Lista vacia', en: 'Empty list', pt: 'Lista vazia', zh: '空列表', fr: 'Liste vide', it: 'Lista vuota', hi: 'खाली सूची', ar: 'قائمة فارغة' },
    wl_agregar_primer: { es: 'Agregar primer activo', en: 'Add first asset', pt: 'Adicionar primeiro ativo', zh: '添加第一个资产', fr: 'Ajouter le premier actif', it: 'Aggiungi primo asset', hi: 'पहला एसेट जोड़ें', ar: 'إضافة أول أصل' },
    wl_delete_desc: { es: 'Se eliminaran todos los activos', en: 'All assets will be deleted', pt: 'Todos os ativos serão excluídos', zh: '所有资产将被删除', fr: 'Tous les actifs seront supprimés', it: 'Tutti gli asset verranno eliminati', hi: 'सभी एसेट हटा दिए जाएँगे', ar: 'سيتم حذف جميع الأصول' },
    wl_eliminar: { es: 'Eliminar', en: 'Delete', pt: 'Excluir', zh: '删除', fr: 'Supprimer', it: 'Elimina', hi: 'हटाएँ', ar: 'حذف' },
    wl_eliminar_lista: { es: 'Eliminar lista', en: 'Delete list', pt: 'Excluir lista', zh: '删除列表', fr: 'Supprimer la liste', it: 'Elimina lista', hi: 'सूची हटाएँ', ar: 'حذف القائمة' },
    wl_compartir_senal: { es: 'Compartir señal', en: 'Share signal', pt: 'Compartilhar sinal', zh: '分享信号', fr: 'Partager le signal', it: 'Condividi segnale', hi: 'सिग्नल शेयर करें', ar: 'مشاركة الإشارة' },
    wl_quitar_de_lista: { es: 'Quitar de esta lista', en: 'Remove from this list', pt: 'Remover desta lista', zh: '从此列表移除', fr: 'Retirer de cette liste', it: 'Rimuovi da questa lista', hi: 'इस सूची से हटाएँ', ar: 'إزالة من هذه القائمة' },
    wl_principal: { es: '⭐ PRINCIPAL', en: '⭐ PRIMARY', pt: '⭐ PRINCIPAL', zh: '⭐ 主要', fr: '⭐ PRINCIPALE', it: '⭐ PRINCIPALE', hi: '⭐ प्राथमिक', ar: '⭐ رئيسية' },
    wl_comparador_title: { es: '⚖️ Comparador Cobrex', en: '⚖️ Cobrex Comparator', pt: '⚖️ Comparador Cobrex', zh: '⚖️ Cobrex 比较器', fr: '⚖️ Comparateur Cobrex', it: '⚖️ Comparatore Cobrex', hi: '⚖️ Cobrex तुलनाकर्ता', ar: '⚖️ مقارن Cobrex' },
    wl_cambio: { es: 'Cambio', en: 'Change', pt: 'Variação', zh: '变化', fr: 'Variation', it: 'Variazione', hi: 'परिवर्तन', ar: 'التغيير' },
    wl_cmp_senal_ia: { es: 'Señal IA', en: 'AI Signal', pt: 'Sinal IA', zh: 'AI信号', fr: 'Signal IA', it: 'Segnale IA', hi: 'AI सिग्नल', ar: 'إشارة AI' },
    wl_cmp_probabilidad: { es: 'Probabilidad', en: 'Probability', pt: 'Probabilidade', zh: '概率', fr: 'Probabilité', it: 'Probabilità', hi: 'संभावना', ar: 'الاحتمالية' },
    wl_cmp_precio: { es: 'Precio', en: 'Price', pt: 'Preço', zh: '价格', fr: 'Prix', it: 'Prezzo', hi: 'मूल्य', ar: 'السعر' },
    wl_cmp_objetivo: { es: 'Objetivo', en: 'Target', pt: 'Objetivo', zh: '目标', fr: 'Objectif', it: 'Obiettivo', hi: 'लक्ष्य', ar: 'الهدف' },
    wl_cmp_stop: { es: 'Stop', en: 'Stop', pt: 'Stop', zh: 'Stop', fr: 'Stop', it: 'Stop', hi: 'Stop', ar: 'Stop' },
    wl_cmp_resumen: { es: 'Resumen', en: 'Summary', pt: 'Resumo', zh: '摘要', fr: 'Résumé', it: 'Riepilogo', hi: 'सारांश', ar: 'ملخص' },
    wl_mejor_performance: { es: '⭐ MEJOR PERFORMANCE', en: '⭐ BEST PERFORMANCE', pt: '⭐ MELHOR PERFORMANCE', zh: '⭐ 最佳表现', fr: '⭐ MEILLEURE PERFORMANCE', it: '⭐ MIGLIORE PERFORMANCE', hi: '⭐ सर्वश्रेष्ठ प्रदर्शन', ar: '⭐ أفضل أداء' },
    wl_variables_ia_10: { es: 'VARIABLES IA (10)', en: 'AI VARIABLES (10)', pt: 'VARIÁVEIS IA (10)', zh: 'AI变量 (10)', fr: 'VARIABLES IA (10)', it: 'VARIABILI IA (10)', hi: 'AI वेरिएबल (10)', ar: 'متغيرات AI (10)' },
    wl_compartir_comparacion: { es: '📤 Compartir comparación', en: '📤 Share comparison', pt: '📤 Compartilhar comparação', zh: '📤 分享比较', fr: '📤 Partager la comparaison', it: '📤 Condividi confronto', hi: '📤 तुलना शेयर करें', ar: '📤 مشاركة المقارنة' },
    wl_compartir_senal_de: { es: 'Compartir señal de', en: 'Share signal for', pt: 'Compartilhar sinal de', zh: '分享信号：', fr: 'Partager le signal de', it: 'Condividi segnale di', hi: 'सिग्नल शेयर करें:', ar: 'مشاركة إشارة' },
    wl_compartir_lista: { es: 'Compartir lista', en: 'Share list', pt: 'Compartilhar lista', zh: '分享列表', fr: 'Partager la liste', it: 'Condividi lista', hi: 'सूची शेयर करें', ar: 'مشاركة القائمة' },
    wl_activos_con_senales: { es: ' activos con señales IA', en: ' assets with AI signals', pt: ' ativos com sinais IA', zh: ' 个资产含AI信号', fr: ' actifs avec signaux IA', it: ' asset con segnali IA', hi: ' AI सिग्नल वाले एसेट', ar: ' أصول بإشارات AI' },
    wl_maximo_5: { es: 'Maximo 5 activos', en: 'Maximum 5 assets', pt: 'Máximo 5 ativos', zh: '最多5个资产', fr: 'Maximum 5 actifs', it: 'Massimo 5 asset', hi: 'अधिकतम 5 एसेट', ar: '5 أصول كحد أقصى' },
    wl_justificacion: { es: 'JUSTIFICACION DEL ANALISIS', en: 'ANALYSIS JUSTIFICATION', pt: 'JUSTIFICATIVA DA ANÁLISE', zh: '分析依据', fr: "JUSTIFICATION DE L'ANALYSE", it: "GIUSTIFICAZIONE DELL'ANALISI", hi: 'विश्लेषण का औचित्य', ar: 'مبررات التحليل' },
    wl_objetivo: { es: 'OBJETIVO', en: 'TARGET', pt: 'OBJETIVO', zh: '目标', fr: 'OBJECTIF', it: 'OBIETTIVO', hi: 'लक्ष्य', ar: 'الهدف' },
    wl_stop: { es: 'STOP', en: 'STOP', pt: 'STOP', zh: 'STOP', fr: 'STOP', it: 'STOP', hi: 'STOP', ar: 'STOP' },
    wl_variables_modelo: { es: 'VARIABLES DEL MODELO', en: 'MODEL VARIABLES', pt: 'VARIÁVEIS DO MODELO', zh: '模型变量', fr: 'VARIABLES DU MODÈLE', it: 'VARIABILI DEL MODELLO', hi: 'मॉडल वेरिएबल', ar: 'متغيرات النموذج' },
    wl_ult_cierre: { es: 'Ult.cierre', en: 'Prev.close', pt: 'Últ.fech.', zh: '昨收', fr: 'Clôt.préc.', it: 'Chius.prec.', hi: 'पिछला बंद', ar: 'إغلاق سابق' },
    wl_cancelar_modo: { es: '✕ Cancelar', en: '✕ Cancel', pt: '✕ Cancelar', zh: '✕ 取消', fr: '✕ Annuler', it: '✕ Annulla', hi: '✕ रद्द करें', ar: '✕ إلغاء' },

    // === IA / SEÑALES ===

    ia_senales_ia: { es: 'Señales IA', en: 'AI Signals', pt: 'Sinais IA', zh: 'AI信号', fr: 'Signaux IA', it: 'Segnali IA', hi: 'AI सिग्नल', ar: 'إشارات AI' },
    ia_ahora: { es: '· ahora', en: '· now', pt: '· agora', zh: '· 现在', fr: '· maintenant', it: '· ora', hi: '· अभी', ar: '· الآن' },
    ia_alcistas: { es: 'ALCISTAS', en: 'BULLISH', pt: 'ALTISTAS', zh: '看涨', fr: 'HAUSSIERS', it: 'RIALZISTI', hi: 'तेज़ी', ar: 'صاعدة' },
    ia_bajistas: { es: 'BAJISTAS', en: 'BEARISH', pt: 'BAIXISTAS', zh: '看跌', fr: 'BAISSIERS', it: 'RIBASSISTI', hi: 'मंदी', ar: 'هابطة' },
    ia_mi_portfolio: { es: '💼 Mi Portfolio', en: '💼 My Portfolio', pt: '💼 Meu Portfólio', zh: '💼 我的投资组合', fr: '💼 Mon Portfolio', it: '💼 Il mio Portfolio', hi: '💼 मेरा Portfolio', ar: '💼 Portfolio الخاص بي' },
    ia_variables_btn: { es: '🔍 Variables', en: '🔍 Variables', pt: '🔍 Variáveis', zh: '🔍 变量', fr: '🔍 Variables', it: '🔍 Variabili', hi: '🔍 वेरिएबल', ar: '🔍 متغيرات' },
    ia_eventos_del_dia: { es: 'EVENTOS DEL DIA', en: "TODAY'S EVENTS", pt: 'EVENTOS DO DIA', zh: '今日事件', fr: "ÉVÉNEMENTS DU JOUR", it: 'EVENTI DEL GIORNO', hi: 'आज की घटनाएँ', ar: 'أحداث اليوم' },
    ia_justificacion: { es: 'JUSTIFICACION DEL ANALISIS', en: 'ANALYSIS JUSTIFICATION', pt: 'JUSTIFICATIVA DA ANÁLISE', zh: '分析依据', fr: "JUSTIFICATION DE L'ANALYSE", it: "GIUSTIFICAZIONE DELL'ANALISI", hi: 'विश्लेषण का औचित्य', ar: 'مبررات التحليل' },
    ia_variables_modelo: { es: 'VARIABLES DEL MODELO', en: 'MODEL VARIABLES', pt: 'VARIÁVEIS DO MODELO', zh: '模型变量', fr: 'VARIABLES DU MODÈLE', it: 'VARIABILI DEL MODELLO', hi: 'मॉडल वेरिएबल', ar: 'متغيرات النموذج' },
    ia_vars_alcistas: { es: 'alcistas', en: 'bullish', pt: 'altistas', zh: '看涨', fr: 'haussiers', it: 'rialzisti', hi: 'तेज़ी', ar: 'صاعدة' },
    ia_vars_bajistas: { es: 'bajistas', en: 'bearish', pt: 'baixistas', zh: '看跌', fr: 'baissiers', it: 'ribassisti', hi: 'मंदी', ar: 'هابطة' },
    ia_otros_escenarios: { es: 'OTROS ESCENARIOS', en: 'OTHER SCENARIOS', pt: 'OUTROS CENÁRIOS', zh: '其他情景', fr: 'AUTRES SCÉNARIOS', it: 'ALTRI SCENARI', hi: 'अन्य परिदृश्य', ar: 'سيناريوهات أخرى' },
    ia_compartir_senal: { es: '📤 Compartir senal', en: '📤 Share signal', pt: '📤 Compartilhar sinal', zh: '📤 分享信号', fr: '📤 Partager le signal', it: '📤 Condividi segnale', hi: '📤 सिग्नल शेयर करें', ar: '📤 مشاركة الإشارة' },
    ia_compartir_senal_de: { es: 'Compartir señal', en: 'Share signal', pt: 'Compartilhar sinal', zh: '分享信号', fr: 'Partager le signal', it: 'Condividi segnale', hi: 'सिग्नल शेयर करें', ar: 'مشاركة الإشارة' },
    ia_subtitulo: { es: 'SENALES IA - ORDENADAS POR PROBABILIDAD', en: 'AI SIGNALS - ORDERED BY PROBABILITY', pt: 'SINAIS IA - ORDENADOS POR PROBABILIDADE', zh: 'AI信号 - 按概率排序', fr: 'SIGNAUX IA - CLASSÉS PAR PROBABILITÉ', it: 'SEGNALI IA - ORDINATI PER PROBABILITÀ', hi: 'AI सिग्नल - संभावना के अनुसार', ar: 'إشارات AI - مرتبة حسب الاحتمالية' },
    ia_contexto_tendencia: { es: 'CONTEXTO TENDENCIA', en: 'TREND CONTEXT', pt: 'CONTEXTO TENDÊNCIA', zh: '趋势背景', fr: 'CONTEXTE TENDANCE', it: 'CONTESTO TENDENZA', hi: 'ट्रेंड संदर्भ', ar: 'سياق الاتجاه' },

    // Formatos variables IA
    fmt_baja: { es: 'baja', en: 'low', pt: 'baixa', zh: '低', fr: 'faible', it: 'bassa', hi: 'कम', ar: 'منخفض' },
    fmt_alta: { es: 'alta', en: 'high', pt: 'alta', zh: '高', fr: 'élevée', it: 'alta', hi: 'उच्च', ar: 'مرتفع' },
    fmt_normal: { es: 'normal', en: 'normal', pt: 'normal', zh: '正常', fr: 'normal', it: 'normale', hi: 'सामान्य', ar: 'طبيعي' },
    fmt_positiva: { es: 'positiva', en: 'positive', pt: 'positiva', zh: '正', fr: 'positive', it: 'positiva', hi: 'सकारात्मक', ar: 'إيجابي' },
    fmt_negativa: { es: 'negativa', en: 'negative', pt: 'negativa', zh: '负', fr: 'négative', it: 'negativa', hi: 'नकारात्मक', ar: 'سلبي' },
    fmt_neutral: { es: 'neutral', en: 'neutral', pt: 'neutro', zh: '中性', fr: 'neutre', it: 'neutrale', hi: 'तटस्थ', ar: 'محايد' },
    fmt_favorable: { es: 'favorable', en: 'favorable', pt: 'favorável', zh: '有利', fr: 'favorable', it: 'favorevole', hi: 'अनुकूल', ar: 'ملائم' },
    fmt_adverso: { es: 'adverso', en: 'adverse', pt: 'adverso', zh: '不利', fr: 'défavorable', it: 'avverso', hi: 'प्रतिकूल', ar: 'معاكس' },
    fmt_evento_activo: { es: 'evento activo', en: 'active event', pt: 'evento ativo', zh: '活跃事件', fr: 'événement actif', it: 'evento attivo', hi: 'सक्रिय घटना', ar: 'حدث نشط' },
    fmt_sin_eventos: { es: 'sin eventos', en: 'no events', pt: 'sem eventos', zh: '无事件', fr: 'aucun événement', it: 'nessun evento', hi: 'कोई घटना नहीं', ar: 'لا أحداث' },
    fmt_proximos: { es: 'próximos', en: 'upcoming', pt: 'próximos', zh: '即将', fr: 'à venir', it: 'prossimi', hi: 'आगामी', ar: 'قادم' },
    fmt_sin_reporte: { es: 'sin reporte', en: 'no report', pt: 'sem relatório', zh: '无报告', fr: 'aucun rapport', it: 'nessun rapporto', hi: 'कोई रिपोर्ट नहीं', ar: 'لا تقارير' },
    fmt_alcista: { es: 'alcista', en: 'bullish', pt: 'altista', zh: '看涨', fr: 'haussier', it: 'rialzista', hi: 'तेज़ी', ar: 'صاعد' },
    fmt_bajista: { es: 'bajista', en: 'bearish', pt: 'baixista', zh: '看跌', fr: 'baissier', it: 'ribassista', hi: 'मंदी', ar: 'هابط' },
    fmt_prom: { es: 'prom.', en: 'avg.', pt: 'méd.', zh: '均', fr: 'moy.', it: 'med.', hi: 'औसत', ar: 'متوسط' },
    cerca_soporte: { es: 'cerca soporte', en: 'near support', pt: 'perto do suporte', zh: '接近支撑', fr: 'près du support', it: 'vicino supporto', hi: 'सपोर्ट के करीब', ar: 'قريب من الدعم' },
    cerca_resistencia: { es: 'cerca resist.', en: 'near resist.', pt: 'perto da resist.', zh: '接近阻力', fr: 'près de la résist.', it: 'vicino resist.', hi: 'रेज़िस्ट. के करीब', ar: 'قريب من المقاومة' },
    zona_media_ia: { es: 'zona media', en: 'mid zone', pt: 'zona média', zh: '中间区域', fr: 'zone médiane', it: 'zona media', hi: 'मध्य ज़ोन', ar: 'منطقة وسطى' },

    // === ALERTAS ===

    // Banner WhatsApp
    al_wa_title: { es: 'Alertas por WhatsApp', en: 'WhatsApp Alerts', pt: 'Alertas por WhatsApp', zh: 'WhatsApp提醒', fr: 'Alertes WhatsApp', it: 'Avvisi WhatsApp', hi: 'WhatsApp अलर्ट', ar: 'تنبيهات WhatsApp' },
    al_wa_conectado: { es: 'WhatsApp conectado', en: 'WhatsApp connected', pt: 'WhatsApp conectado', zh: 'WhatsApp已连接', fr: 'WhatsApp connecté', it: 'WhatsApp connesso', hi: 'WhatsApp कनेक्ट', ar: 'WhatsApp متصل' },
    al_wa_popup_title: { es: 'WhatsApp Alertas', en: 'WhatsApp Alerts', pt: 'WhatsApp Alertas', zh: 'WhatsApp提醒', fr: 'WhatsApp Alertes', it: 'WhatsApp Avvisi', hi: 'WhatsApp अलर्ट', ar: 'تنبيهات WhatsApp' },
    al_wa_popup_desc: { es: 'Proximamente podras recibir alertas automaticas por WhatsApp. Te avisaremos cuando este disponible.', en: 'Soon you will be able to receive automatic alerts via WhatsApp. We will notify you when available.', pt: 'Em breve você poderá receber alertas automáticas por WhatsApp. Avisaremos quando estiver disponível.', zh: '您很快就能通过WhatsApp接收自动提醒。可用时我们会通知您。', fr: 'Bientôt vous pourrez recevoir des alertes automatiques par WhatsApp. Nous vous préviendrons quand disponible.', it: 'Presto potrai ricevere avvisi automatici via WhatsApp. Ti avviseremo quando disponibile.', hi: 'जल्द ही आप WhatsApp से स्वचालित अलर्ट प्राप्त कर सकेंगे। उपलब्ध होने पर हम सूचित करेंगे।', ar: 'قريباً ستتمكن من تلقي تنبيهات تلقائية عبر WhatsApp. سنخبرك عند توفرها.' },

    // Resumen
    al_alertas_on: { es: 'ALERTAS ON', en: 'ALERTS ON', pt: 'ALERTAS ON', zh: '已开启', fr: 'ALERTES ON', it: 'AVVISI ON', hi: 'अलर्ट ON', ar: 'تنبيهات ON' },
    al_activos_upper: { es: 'ACTIVOS', en: 'ASSETS', pt: 'ATIVOS', zh: '资产', fr: 'ACTIFS', it: 'ASSET', hi: 'एसेट', ar: 'أصول' },

    // Filtro ALERTAS SOBRE
    al_alertas_sobre: { es: 'ALERTAS SOBRE', en: 'ALERTS FOR', pt: 'ALERTAS SOBRE', zh: '提醒范围', fr: 'ALERTES SUR', it: 'AVVISI SU', hi: 'अलर्ट:', ar: 'تنبيهات حول' },
    al_mi_portfolio: { es: 'Mi Portfolio', en: 'My Portfolio', pt: 'Meu Portfólio', zh: '我的投资组合', fr: 'Mon Portfolio', it: 'Il mio Portfolio', hi: 'मेरा Portfolio', ar: 'Portfolio الخاص بي' },
    al_mi_watchlist: { es: 'Mi Watchlist', en: 'My Watchlist', pt: 'Minha Watchlist', zh: '我的自选列表', fr: 'Ma Watchlist', it: 'La mia Watchlist', hi: 'मेरी Watchlist', ar: 'قائمة المتابعة' },
    al_todos: { es: 'Todos (350)', en: 'All (350)', pt: 'Todos (350)', zh: '全部 (350)', fr: 'Tous (350)', it: 'Tutti (350)', hi: 'सभी (350)', ar: 'الكل (350)' },

    // Motor IA + Pulse buttons
    al_motor_ia: { es: 'Motor IA', en: 'AI Engine', pt: 'Motor IA', zh: 'AI引擎', fr: 'Moteur IA', it: 'Motore IA', hi: 'AI इंजन', ar: 'محرك AI' },
    al_10_variables: { es: '10 variables', en: '10 variables', pt: '10 variáveis', zh: '10个变量', fr: '10 variables', it: '10 variabili', hi: '10 वेरिएबल', ar: '10 متغيرات' },
    al_14_variables: { es: '14 variables', en: '14 variables', pt: '14 variáveis', zh: '14个变量', fr: '14 variables', it: '14 variabili', hi: '14 वेरिएबल', ar: '14 متغيرات' },

    // Sección Alertas IA
    al_sec_ia: { es: 'Alertas IA', en: 'AI Alerts', pt: 'Alertas IA', zh: 'AI提醒', fr: 'Alertes IA', it: 'Avvisi IA', hi: 'AI अलर्ट', ar: 'تنبيهات AI' },
    al_sec_ia_desc: { es: 'Motor IA — 10 variables', en: 'AI Engine — 10 variables', pt: 'Motor IA — 10 variáveis', zh: 'AI引擎 — 10个变量', fr: 'Moteur IA — 10 variables', it: 'Motore IA — 10 variabili', hi: 'AI इंजन — 10 वेरिएबल', ar: 'محرك AI — 10 متغيرات' },
    al_ia_cambio: { es: 'Cambio de senal', en: 'Signal change', pt: 'Mudança de sinal', zh: '信号变化', fr: 'Changement de signal', it: 'Cambio segnale', hi: 'सिग्नल बदलाव', ar: 'تغيير الإشارة' },
    al_ia_cambio_desc: { es: 'Cuando un activo cambia de ALCISTA a BAJISTA o viceversa', en: 'When an asset changes from BULLISH to BEARISH or vice versa', pt: 'Quando um ativo muda de ALTISTA a BAIXISTA ou vice-versa', zh: '当资产从看涨变为看跌或反之', fr: "Quand un actif passe de HAUSSIER à BAISSIER ou inversement", it: 'Quando un asset cambia da RIALZISTA a RIBASSISTA o viceversa', hi: 'जब कोई एसेट तेज़ी से मंदी या विपरीत बदलता है', ar: 'عندما يتغير أصل من صاعد إلى هابط أو العكس' },
    al_ia_alta: { es: 'Alta Conviccion', en: 'High Conviction', pt: 'Alta Convicção', zh: '高确信度', fr: 'Haute Conviction', it: 'Alta Convinzione', hi: 'उच्च विश्वास', ar: 'ثقة عالية' },
    al_ia_alta_desc: { es: 'Cuando la IA detecta senal de maxima conviccion (85-88%)', en: 'When AI detects maximum conviction signal (85-88%)', pt: 'Quando a IA detecta sinal de máxima convicção (85-88%)', zh: '当AI检测到最高确信度信号 (85-88%)', fr: "Quand l'IA détecte un signal de conviction maximale (85-88%)", it: "Quando l'IA rileva segnale di massima convinzione (85-88%)", hi: 'जब AI अधिकतम विश्वास सिग्नल पाता है (85-88%)', ar: 'عندما يكتشف AI إشارة قناعة قصوى (85-88%)' },
    al_ia_umbral: { es: 'Umbral probabilidad', en: 'Probability threshold', pt: 'Limiar de probabilidade', zh: '概率阈值', fr: 'Seuil de probabilité', it: 'Soglia probabilità', hi: 'संभावना सीमा', ar: 'عتبة الاحتمالية' },
    al_ia_umbral_desc: { es: 'Alerta cuando la probabilidad supera el umbral configurado', en: 'Alert when probability exceeds configured threshold', pt: 'Alerta quando a probabilidade supera o limiar configurado', zh: '当概率超过配置的阈值时提醒', fr: "Alerte quand la probabilité dépasse le seuil configuré", it: 'Avviso quando la probabilità supera la soglia configurata', hi: 'जब संभावना कॉन्फ़िगर सीमा से अधिक हो', ar: 'تنبيه عندما تتجاوز الاحتمالية العتبة المحددة' },
    al_ia_portfolio: { es: 'Senal en Portfolio', en: 'Signal in Portfolio', pt: 'Sinal no Portfólio', zh: 'Portfolio中的信号', fr: 'Signal dans Portfolio', it: 'Segnale nel Portfolio', hi: 'Portfolio में सिग्नल', ar: 'إشارة في Portfolio' },
    al_ia_portfolio_desc: { es: 'Nueva senal IA en activos de tu cartera personal', en: 'New AI signal on assets in your personal portfolio', pt: 'Novo sinal IA em ativos da sua carteira pessoal', zh: '您个人投资组合中资产的新AI信号', fr: 'Nouveau signal IA sur les actifs de votre portefeuille personnel', it: 'Nuovo segnale IA su asset del tuo portafoglio personale', hi: 'आपके व्यक्तिगत portfolio एसेट में नया AI सिग्नल', ar: 'إشارة AI جديدة على أصول محفظتك الشخصية' },

    // Sección Alertas PULSE
    al_sec_pulse: { es: 'Alertas PULSE', en: 'PULSE Alerts', pt: 'Alertas PULSE', zh: 'PULSE提醒', fr: 'Alertes PULSE', it: 'Avvisi PULSE', hi: 'PULSE अलर्ट', ar: 'تنبيهات PULSE' },
    al_sec_pulse_desc: { es: 'Cobrex Pulse — 14 variables macro', en: 'Cobrex Pulse — 14 macro variables', pt: 'Cobrex Pulse — 14 variáveis macro', zh: 'Cobrex Pulse — 14个宏观变量', fr: 'Cobrex Pulse — 14 variables macro', it: 'Cobrex Pulse — 14 variabili macro', hi: 'Cobrex Pulse — 14 मैक्रो वेरिएबल', ar: 'Cobrex Pulse — 14 متغيراً اقتصادياً' },
    al_pulse_zona: { es: 'Cambio de zona', en: 'Zone change', pt: 'Mudança de zona', zh: '区域变化', fr: 'Changement de zone', it: 'Cambio zona', hi: 'ज़ोन बदलाव', ar: 'تغيير المنطقة' },
    al_pulse_zona_desc: { es: 'Cuando Pulse cambia de zona (Miedo Extremo / Neutral / Codicia)', en: 'When Pulse changes zone (Extreme Fear / Neutral / Greed)', pt: 'Quando Pulse muda de zona (Medo Extremo / Neutro / Ganância)', zh: '当Pulse变换区域（极度恐惧/中性/贪婪）', fr: 'Quand Pulse change de zone (Peur Extrême / Neutre / Avidité)', it: 'Quando Pulse cambia zona (Paura Estrema / Neutrale / Avidità)', hi: 'जब Pulse ज़ोन बदलता है (अत्यधिक भय / तटस्थ / लालच)', ar: 'عندما يتغير Pulse للمنطقة (خوف شديد / محايد / جشع)' },
    al_pulse_cat: { es: 'Por categoria', en: 'By category', pt: 'Por categoria', zh: '按类别', fr: 'Par catégorie', it: 'Per categoria', hi: 'श्रेणी के अनुसार', ar: 'حسب الفئة' },
    al_pulse_cat_desc: { es: 'Alerta por categoria: Cripto, Acciones, Futuros, Commodities', en: 'Alert by category: Crypto, Stocks, Futures, Commodities', pt: 'Alerta por categoria: Cripto, Ações, Futuros, Commodities', zh: '按类别提醒：加密、股票、期货、商品', fr: 'Alerte par catégorie : Crypto, Actions, Futures, Matières premières', it: 'Avviso per categoria: Crypto, Azioni, Futures, Commodities', hi: 'श्रेणी अलर्ट: क्रिप्टो, स्टॉक, फ्यूचर्स, कमोडिटीज़', ar: 'تنبيه حسب الفئة: كريبتو، أسهم، آجلة، سلع' },
    al_pulse_thermo: { es: 'Termometro de Riesgo', en: 'Risk Thermometer', pt: 'Termômetro de Risco', zh: '风险温度计', fr: 'Thermomètre de Risque', it: 'Termometro di Rischio', hi: 'जोखिम थर्मामीटर', ar: 'مقياس المخاطر' },
    al_pulse_thermo_desc: { es: 'Cuando tu portfolio entra en zona de riesgo segun IA', en: 'When your portfolio enters a risk zone according to AI', pt: 'Quando seu portfólio entra em zona de risco segundo IA', zh: '当您的投资组合根据AI进入风险区域', fr: "Quand votre portfolio entre en zone de risque selon l'IA", it: "Quando il tuo portfolio entra in zona di rischio secondo l'IA", hi: 'जब AI के अनुसार आपका portfolio जोखिम ज़ोन में प्रवेश करता है', ar: 'عندما تدخل محفظتك منطقة خطر وفقاً لـ AI' },

    // Sección Alertas Precio
    al_sec_precio: { es: 'Alertas de Precio', en: 'Price Alerts', pt: 'Alertas de Preço', zh: '价格提醒', fr: 'Alertes de Prix', it: 'Avvisi Prezzo', hi: 'मूल्य अलर्ट', ar: 'تنبيهات السعر' },
    al_sec_precio_desc: { es: 'Monitoreo de precios en tiempo real', en: 'Real-time price monitoring', pt: 'Monitoramento de preços em tempo real', zh: '实时价格监控', fr: 'Surveillance des prix en temps réel', it: 'Monitoraggio prezzi in tempo reale', hi: 'रियल-टाइम मूल्य निगरानी', ar: 'مراقبة الأسعار في الوقت الحقيقي' },
    al_precio_obj: { es: 'Precio objetivo', en: 'Target price', pt: 'Preço alvo', zh: '目标价格', fr: 'Prix objectif', it: 'Prezzo obiettivo', hi: 'लक्ष्य मूल्य', ar: 'السعر المستهدف' },
    al_precio_obj_desc: { es: 'Cuando un activo alcanza el precio target que definiste', en: 'When an asset reaches the target price you set', pt: 'Quando um ativo atinge o preço alvo que você definiu', zh: '当资产达到您设定的目标价格', fr: "Quand un actif atteint le prix cible que vous avez défini", it: 'Quando un asset raggiunge il prezzo target che hai definito', hi: 'जब कोई एसेट आपके सेट लक्ष्य मूल्य पर पहुँचता है', ar: 'عندما يصل أصل إلى السعر المستهدف الذي حددته' },
    al_precio_var: { es: 'Variacion brusca', en: 'Sharp variation', pt: 'Variação brusca', zh: '剧烈波动', fr: 'Variation brusque', it: 'Variazione brusca', hi: 'तीव्र भिन्नता', ar: 'تغير حاد' },
    al_precio_var_desc: { es: 'Sube o baja mas del % configurado en 24hs', en: 'Rises or falls more than configured % in 24h', pt: 'Sobe ou desce mais do % configurado em 24h', zh: '24小时内涨跌超过配置的百分比', fr: 'Monte ou descend de plus du % configuré en 24h', it: 'Sale o scende più del % configurato in 24h', hi: '24 घंटे में कॉन्फ़िगर % से अधिक बढ़ता या गिरता है', ar: 'يرتفع أو ينخفض أكثر من النسبة المحددة خلال 24 ساعة' },
    al_precio_maxmin: { es: 'Nuevo maximo/minimo', en: 'New high/low', pt: 'Novo máximo/mínimo', zh: '新高/低', fr: 'Nouveau max/min', it: 'Nuovo massimo/minimo', hi: 'नया उच्च/निम्न', ar: 'ارتفاع/انخفاض جديد' },
    al_precio_maxmin_desc: { es: 'Nuevo maximo o minimo de 52 semanas', en: 'New 52-week high or low', pt: 'Novo máximo ou mínimo de 52 semanas', zh: '新的52周最高或最低', fr: 'Nouveau maximum ou minimum de 52 semaines', it: 'Nuovo massimo o minimo di 52 settimane', hi: '52 सप्ताह का नया उच्च या निम्न', ar: 'ارتفاع أو انخفاض جديد لـ 52 أسبوعاً' },

    // Sección Alertas Eventos
    al_sec_eventos: { es: 'Alertas de Eventos', en: 'Event Alerts', pt: 'Alertas de Eventos', zh: '事件提醒', fr: "Alertes d'Événements", it: 'Avvisi Eventi', hi: 'इवेंट अलर्ट', ar: 'تنبيهات الأحداث' },
    al_sec_eventos_desc: { es: 'Calendario economico y corporativo', en: 'Economic and corporate calendar', pt: 'Calendário econômico e corporativo', zh: '经济和企业日历', fr: 'Calendrier économique et corporatif', it: 'Calendario economico e aziendale', hi: 'आर्थिक और कॉर्पोरेट कैलेंडर', ar: 'التقويم الاقتصادي والشركات' },
    al_ev_fomc_desc: { es: 'Decisiones de tasas de interes de la Reserva Federal', en: 'Federal Reserve interest rate decisions', pt: 'Decisões de taxas de juros do Federal Reserve', zh: '美联储利率决议', fr: "Décisions de taux d'intérêt de la Réserve Fédérale", it: 'Decisioni sui tassi di interesse della Federal Reserve', hi: 'फेडरल रिजर्व की ब्याज दर निर्णय', ar: 'قرارات أسعار الفائدة للاحتياطي الفيدرالي' },
    al_ev_cpi_desc: { es: 'Publicacion de datos de inflacion y crecimiento', en: 'Inflation and growth data release', pt: 'Publicação de dados de inflação e crescimento', zh: '通胀和增长数据发布', fr: "Publication des données d'inflation et de croissance", it: 'Pubblicazione dati inflazione e crescita', hi: 'मुद्रास्फीति और विकास डेटा जारी', ar: 'نشر بيانات التضخم والنمو' },
    al_ev_apertura: { es: 'Apertura mercados', en: 'Market open', pt: 'Abertura mercados', zh: '市场开盘', fr: 'Ouverture des marchés', it: 'Apertura mercati', hi: 'बाज़ार खुलना', ar: 'افتتاح الأسواق' },
    al_ev_apertura_desc: { es: 'Notificacion cuando abren los mercados globales', en: 'Notification when global markets open', pt: 'Notificação quando os mercados globais abrem', zh: '全球市场开盘通知', fr: "Notification à l'ouverture des marchés mondiaux", it: 'Notifica quando i mercati globali aprono', hi: 'वैश्विक बाज़ार खुलने पर सूचना', ar: 'إشعار عند افتتاح الأسواق العالمية' },
    al_ev_earnings: { es: 'Earnings portfolio', en: 'Portfolio earnings', pt: 'Earnings portfólio', zh: 'Portfolio财报', fr: 'Earnings portfolio', it: 'Earnings portfolio', hi: 'Portfolio earnings', ar: 'أرباح Portfolio' },
    al_ev_earnings_desc: { es: 'Reportes de resultados trimestrales de activos en tu cartera', en: 'Quarterly earnings reports of assets in your portfolio', pt: 'Relatórios de resultados trimestrais de ativos em sua carteira', zh: '您投资组合中资产的季度财报', fr: 'Rapports de résultats trimestriels des actifs de votre portefeuille', it: 'Report trimestrali degli asset nel tuo portafoglio', hi: 'आपके portfolio एसेट की तिमाही कमाई रिपोर्ट', ar: 'تقارير أرباح ربع سنوية لأصول محفظتك' },
    al_ev_gdelt: { es: 'Geopolitica GDELT', en: 'Geopolitics GDELT', pt: 'Geopolítica GDELT', zh: '地缘政治 GDELT', fr: 'Géopolitique GDELT', it: 'Geopolitica GDELT', hi: 'भू-राजनीति GDELT', ar: 'الجيوسياسة GDELT' },
    al_ev_gdelt_desc: { es: 'Eventos geopoliticos de alto impacto detectados por GDELT', en: 'High-impact geopolitical events detected by GDELT', pt: 'Eventos geopolíticos de alto impacto detectados pelo GDELT', zh: 'GDELT检测到的高影响地缘政治事件', fr: "Événements géopolitiques à fort impact détectés par GDELT", it: 'Eventi geopolitici ad alto impatto rilevati da GDELT', hi: 'GDELT द्वारा पाए गए उच्च-प्रभाव भू-राजनीतिक इवेंट', ar: 'أحداث جيوسياسية عالية التأثير مكتشفة بواسطة GDELT' },

    // Zonas Pulse
    al_zonas_pulse: { es: 'Zonas Cobrex Pulse', en: 'Cobrex Pulse Zones', pt: 'Zonas Cobrex Pulse', zh: 'Cobrex Pulse 区域', fr: 'Zones Cobrex Pulse', it: 'Zone Cobrex Pulse', hi: 'Cobrex Pulse ज़ोन', ar: 'مناطق Cobrex Pulse' },

    // Alertas activas
    al_activas_ahora: { es: 'ALERTAS ACTIVAS AHORA', en: 'ACTIVE ALERTS NOW', pt: 'ALERTAS ATIVAS AGORA', zh: '当前活跃提醒', fr: 'ALERTES ACTIVES MAINTENANT', it: 'AVVISI ATTIVI ORA', hi: 'अभी सक्रिय अलर्ट', ar: 'تنبيهات نشطة الآن' },
    al_filter_todas: { es: 'Todas', en: 'All', pt: 'Todas', zh: '全部', fr: 'Toutes', it: 'Tutte', hi: 'सभी', ar: 'الكل' },
    al_filter_ia: { es: '🤖 IA', en: '🤖 AI', pt: '🤖 IA', zh: '🤖 AI', fr: '🤖 IA', it: '🤖 IA', hi: '🤖 AI', ar: '🤖 AI' },
    al_filter_precio: { es: '💰 Precio', en: '💰 Price', pt: '💰 Preço', zh: '💰 价格', fr: '💰 Prix', it: '💰 Prezzo', hi: '💰 मूल्य', ar: '💰 السعر' },
    al_filter_pulse: { es: '💓 Pulse', en: '💓 Pulse', pt: '💓 Pulse', zh: '💓 Pulse', fr: '💓 Pulse', it: '💓 Pulse', hi: '💓 Pulse', ar: '💓 Pulse' },
    al_sin_alertas: { es: 'Sin alertas activas', en: 'No active alerts', pt: 'Sem alertas ativas', zh: '无活跃提醒', fr: 'Aucune alerte active', it: 'Nessun avviso attivo', hi: 'कोई सक्रिय अलर्ट नहीं', ar: 'لا تنبيهات نشطة' },
    al_sin_alertas_desc: { es: 'Las alertas aparecen aca cuando se activan', en: 'Alerts appear here when triggered', pt: 'Os alertas aparecem aqui quando são ativados', zh: '触发时提醒将显示在此', fr: 'Les alertes apparaissent ici quand elles se déclenchent', it: 'Gli avvisi appaiono qui quando si attivano', hi: 'ट्रिगर होने पर अलर्ट यहाँ दिखाई देंगे', ar: 'التنبيهات تظهر هنا عند تفعيلها' },
    al_sin_alertas_filtro: { es: 'Sin alertas en este filtro', en: 'No alerts in this filter', pt: 'Sem alertas neste filtro', zh: '此筛选无提醒', fr: 'Aucune alerte dans ce filtre', it: 'Nessun avviso in questo filtro', hi: 'इस फ़िल्टर में कोई अलर्ट नहीं', ar: 'لا تنبيهات في هذا الفلتر' },
    al_proba_filtros: { es: 'Proba cambiando filtros o umbrales', en: 'Try changing filters or thresholds', pt: 'Tente mudar filtros ou limiares', zh: '尝试更改筛选或阈值', fr: 'Essayez de changer les filtres ou seuils', it: 'Prova a cambiare filtri o soglie', hi: 'फ़िल्टर या सीमा बदलकर देखें', ar: 'جرب تغيير الفلاتر أو العتبات' },

    // Sub-filtros
    al_sub_todas_ia: { es: 'Todas IA', en: 'All AI', pt: 'Todas IA', zh: '全部AI', fr: 'Toutes IA', it: 'Tutte IA', hi: 'सभी AI', ar: 'كل AI' },
    al_sub_alta_conv: { es: '⚡ Alta Conv', en: '⚡ High Conv', pt: '⚡ Alta Conv', zh: '⚡ 高确信', fr: '⚡ Haute Conv', it: '⚡ Alta Conv', hi: '⚡ उच्च विश्वास', ar: '⚡ ثقة عالية' },
    al_sub_cambio: { es: '📉 Cambio', en: '📉 Change', pt: '📉 Mudança', zh: '📉 变化', fr: '📉 Changement', it: '📉 Cambio', hi: '📉 बदलाव', ar: '📉 تغيير' },
    al_sub_umbral: { es: '🎯 Umbral', en: '🎯 Threshold', pt: '🎯 Limiar', zh: '🎯 阈值', fr: '🎯 Seuil', it: '🎯 Soglia', hi: '🎯 सीमा', ar: '🎯 عتبة' },
    al_sub_portfolio: { es: '💼 Portfolio', en: '💼 Portfolio', pt: '💼 Portfólio', zh: '💼 Portfolio', fr: '💼 Portfolio', it: '💼 Portfolio', hi: '💼 Portfolio', ar: '💼 Portfolio' },
    al_sub_todos_precio: { es: 'Todos Precio', en: 'All Price', pt: 'Todos Preço', zh: '全部价格', fr: 'Tous Prix', it: 'Tutti Prezzo', hi: 'सभी मूल्य', ar: 'كل السعر' },
    al_sub_variacion: { es: '📈 Variacion', en: '📈 Variation', pt: '📈 Variação', zh: '📈 波动', fr: '📈 Variation', it: '📈 Variazione', hi: '📈 भिन्नता', ar: '📈 تغير' },
    al_sub_rsi: { es: '🔺 RSI', en: '🔺 RSI', pt: '🔺 RSI', zh: '🔺 RSI', fr: '🔺 RSI', it: '🔺 RSI', hi: '🔺 RSI', ar: '🔺 RSI' },
    al_sub_todos_pulse: { es: 'Todos Pulse', en: 'All Pulse', pt: 'Todos Pulse', zh: '全部Pulse', fr: 'Tous Pulse', it: 'Tutti Pulse', hi: 'सभी Pulse', ar: 'كل Pulse' },
    al_sub_zona: { es: '🔴 Zona', en: '🔴 Zone', pt: '🔴 Zona', zh: '🔴 区域', fr: '🔴 Zone', it: '🔴 Zona', hi: '🔴 ज़ोन', ar: '🔴 منطقة' },
    al_sub_categoria: { es: '📊 Categoria', en: '📊 Category', pt: '📊 Categoria', zh: '📊 类别', fr: '📊 Catégorie', it: '📊 Categoria', hi: '📊 श्रेणी', ar: '📊 فئة' },

    // Info modal
    al_info_alertas_activas: { es: 'Alertas activas', en: 'Active alerts', pt: 'Alertas ativas', zh: '活跃提醒', fr: 'Alertes actives', it: 'Avvisi attivi', hi: 'सक्रिय अलर्ट', ar: 'تنبيهات نشطة' },
    al_info_monitoreando: { es: 'Monitoreando', en: 'Monitoring', pt: 'Monitorando', zh: '监控中', fr: 'Surveillance de', it: 'Monitoraggio di', hi: 'निगरानी:', ar: 'مراقبة' },
    al_info_activos_monitoreados: { es: 'Activos monitoreados', en: 'Monitored assets', pt: 'Ativos monitorados', zh: '被监控资产', fr: 'Actifs surveillés', it: 'Asset monitorati', hi: 'निगरानी में एसेट', ar: 'أصول مراقَبة' },
    al_info_todos_activos: { es: 'Todos los activos', en: 'All assets', pt: 'Todos os ativos', zh: '所有资产', fr: 'Tous les actifs', it: 'Tutti gli asset', hi: 'सभी एसेट', ar: 'جميع الأصول' },
    al_alertas_suffix: { es: ' alertas', en: ' alerts', pt: ' alertas', zh: ' 个提醒', fr: ' alertes', it: ' avvisi', hi: ' अलर्ट', ar: ' تنبيهات' },

    // Vars modal
    al_vars_ia_subtitle: { es: '10 variables de analisis por activo', en: '10 analysis variables per asset', pt: '10 variáveis de análise por ativo', zh: '每个资产10个分析变量', fr: "10 variables d'analyse par actif", it: '10 variabili di analisi per asset', hi: 'प्रति एसेट 10 विश्लेषण वेरिएबल', ar: '10 متغيرات تحليل لكل أصل' },
    al_vars_pulse_subtitle: { es: '14 variables macro del mercado global', en: '14 global market macro variables', pt: '14 variáveis macro do mercado global', zh: '全球市场14个宏观变量', fr: '14 variables macro du marché mondial', it: '14 variabili macro del mercato globale', hi: 'वैश्विक बाज़ार के 14 मैक्रो वेरिएबल', ar: '14 متغيراً اقتصادياً للسوق العالمي' },
    al_peso_alto: { es: 'Peso Alto', en: 'High Weight', pt: 'Peso Alto', zh: '高权重', fr: 'Poids Élevé', it: 'Peso Alto', hi: 'उच्च भार', ar: 'وزن عالي' },
    al_peso_medio: { es: 'Peso Medio', en: 'Medium Weight', pt: 'Peso Médio', zh: '中权重', fr: 'Poids Moyen', it: 'Peso Medio', hi: 'मध्यम भार', ar: 'وزن متوسط' },

    // === ONBOARDING ===
    ob_comenzar: { es: 'Comenzar', en: 'Get started', pt: 'Começar', zh: '开始', fr: 'Commencer', it: 'Inizia', hi: 'शुरू करें', ar: 'البدء' },
    ob_siguiente: { es: 'Siguiente', en: 'Next', pt: 'Próximo', zh: '下一步', fr: 'Suivant', it: 'Avanti', hi: 'अगला', ar: 'التالي' },
    ob_ver_planes: { es: 'Ver Planes', en: 'View Plans', pt: 'Ver Planos', zh: '查看方案', fr: 'Voir les Plans', it: 'Vedi Piani', hi: 'योजनाएँ देखें', ar: 'عرض الخطط' },
    ob_empezar_gratis: { es: 'Empezar gratis', en: 'Start free', pt: 'Começar grátis', zh: '免费开始', fr: 'Commencer gratuitement', it: 'Inizia gratis', hi: 'मुफ़्त में शुरू करें', ar: 'ابدأ مجاناً' },
    ob_crear_cuenta: { es: 'Crear cuenta gratis', en: 'Create free account', pt: 'Criar conta grátis', zh: '创建免费账户', fr: 'Créer un compte gratuit', it: 'Crea account gratuito', hi: 'मुफ़्त खाता बनाएँ', ar: 'إنشاء حساب مجاني' },
    ob_ya_tengo_cuenta: { es: 'Ya tengo cuenta', en: 'I have an account', pt: 'Já tenho conta', zh: '我已有账户', fr: "J'ai déjà un compte", it: 'Ho già un account', hi: 'मेरा पहले से खाता है', ar: 'لديّ حساب بالفعل' },
    pw_bienvenido: { es: '¡Bienvenido', en: 'Welcome', pt: 'Bem-vindo', zh: '欢迎', fr: 'Bienvenue', it: 'Benvenuto', hi: 'स्वागत है', ar: 'مرحباً' },
    pw_cobrex_listo: { es: '! Cobrex está listo.', en: '! Cobrex is ready.', pt: '! O Cobrex está pronto.', zh: '！Cobrex 已就绪。', fr: ' ! Cobrex est prêt.', it: '! Cobrex è pronto.', hi: '! Cobrex तैयार है।', ar: '! Cobrex جاهز.' },
    pw_editar_orden: { es: ' Editar orden', en: ' Edit order', pt: ' Editar ordem', zh: ' 编辑顺序', fr: ' Modifier l\'ordre', it: ' Modifica ordine', hi: ' क्रम संपादित करें', ar: ' تعديل الترتيب' },
    pw_listo: { es: ' Listo', en: ' Done', pt: ' Pronto', zh: ' 完成', fr: ' Terminé', it: ' Fatto', hi: ' पूर्ण', ar: ' تم' },
    pw_ult_cierre: { es: 'Últ. cierre', en: 'Last close', pt: 'Últ. fech.', zh: '上次收盘', fr: 'Dernière clôture', it: 'Ultima chiusura', hi: 'अंतिम बंद', ar: 'آخر إغلاق' },
    pw_act_ahora: { es: 'Act. ahora', en: 'Now', pt: 'Agora', zh: '现在', fr: 'Maintenant', it: 'Adesso', hi: 'अभी', ar: 'الآن' },
    pw_ultimos_7d: { es: 'Últimos 7d', en: 'Last 7d', pt: 'Últimos 7d', zh: '近7天', fr: '7 derniers j', it: 'Ultimi 7g', hi: 'पिछले 7द', ar: 'آخر 7 أيام' },
    pw_ultimo_mes: { es: 'Último mes', en: 'Last month', pt: 'Último mês', zh: '上个月', fr: 'Dernier mois', it: 'Ultimo mese', hi: 'पिछला महीना', ar: 'الشهر الماضي' },
    pw_ultimos_3m: { es: 'Últimos 3m', en: 'Last 3mo', pt: 'Últimos 3m', zh: '近3月', fr: '3 derniers mois', it: 'Ultimi 3m', hi: 'पिछले 3मा', ar: 'آخر 3 أشهر' },
    pw_ultimo_anio: { es: 'Último año', en: 'Last year', pt: 'Último ano', zh: '去年', fr: 'Dernière année', it: 'Ultimo anno', hi: 'पिछला साल', ar: 'العام الماضي' },
    pw_safari_pwa: { es: 'Agregá Cobrex a la pantalla de inicio desde Safari.', en: 'Add Cobrex to your home screen from Safari.', pt: 'Adicione o Cobrex à tela inicial pelo Safari.', zh: '通过 Safari 将 Cobrex 添加到主屏幕。', fr: 'Ajoutez Cobrex à l\'écran d\'accueil depuis Safari.', it: 'Aggiungi Cobrex alla schermata Home da Safari.', hi: 'Safari से Cobrex को होम स्क्रीन पर जोड़ें।', ar: 'أضف Cobrex إلى الشاشة الرئيسية من Safari.' },
    pw_alertas_activas_t: { es: 'Cobrex - Alertas Activas', en: 'Cobrex - Alerts Active', pt: 'Cobrex - Alertas Ativos', zh: 'Cobrex - 提醒已启用', fr: 'Cobrex - Alertes activées', it: 'Cobrex - Avvisi attivi', hi: 'Cobrex - अलर्ट सक्रिय', ar: 'Cobrex - التنبيهات مفعّلة' },
    pw_recibiras_alertas: { es: 'Recibirás alertas de precio.', en: 'You\'ll receive price alerts.', pt: 'Você receberá alertas de preço.', zh: '您将收到价格提醒。', fr: 'Vous recevrez des alertes de prix.', it: 'Riceverai avvisi di prezzo.', hi: 'आपको मूल्य अलर्ट मिलेंगे।', ar: 'ستتلقى تنبيهات الأسعار.' },
    pw_activas: { es: 'Activas', en: 'Active', pt: 'Ativas', zh: '已启用', fr: 'Activées', it: 'Attive', hi: 'सक्रिय', ar: 'مفعّلة' },
    pw_activar: { es: 'Activar', en: 'Activate', pt: 'Ativar', zh: '启用', fr: 'Activer', it: 'Attiva', hi: 'सक्रिय करें', ar: 'تفعيل' },
    pw_alerta_disp: { es: 'ALERTA - ', en: 'ALERT - ', pt: 'ALERTA - ', zh: '提醒 - ', fr: 'ALERTE - ', it: 'AVVISO - ', hi: 'अलर्ट - ', ar: 'تنبيه - ' },
    pw_obteniendo_precios: { es: 'Obteniendo precios...', en: 'Fetching prices...', pt: 'Obtendo preços...', zh: '正在获取价格...', fr: 'Récupération des prix...', it: 'Recupero prezzi...', hi: 'मूल्य प्राप्त हो रहे हैं...', ar: 'جارٍ جلب الأسعار...' },
    pw_precios_vivo: { es: 'Precios en vivo vía Binance', en: 'Live prices via Binance', pt: 'Preços ao vivo via Binance', zh: '通过 Binance 实时价格', fr: 'Prix en direct via Binance', it: 'Prezzi live via Binance', hi: 'Binance के माध्यम से लाइव मूल्य', ar: 'أسعار مباشرة عبر Binance' },
    pw_precios_offline: { es: 'Precios sin conexión (aprox)', en: 'Offline prices (approx)', pt: 'Preços offline (aprox)', zh: '离线价格（约）', fr: 'Prix hors ligne (approx)', it: 'Prezzi offline (circa)', hi: 'ऑफ़लाइन मूल्य (लगभग)', ar: 'أسعار دون اتصال (تقريبية)' },
    pw_cargando: { es: 'Cargando...', en: 'Loading...', pt: 'Carregando...', zh: '加载中...', fr: 'Chargement...', it: 'Caricamento...', hi: 'लोड हो रहा है...', ar: 'جارٍ التحميل...' },
    pw_sel_activo: { es: 'Seleccioná un activo de la lista', en: 'Select an asset from the list', pt: 'Selecione um ativo da lista', zh: '从列表中选择一个资产', fr: 'Sélectionnez un actif dans la liste', it: 'Seleziona un asset dalla lista', hi: 'सूची से एक एसेट चुनें', ar: 'اختر أصلاً من القائمة' },
    pw_cantidad_0: { es: 'Ingresá una cantidad mayor a 0', en: 'Enter an amount greater than 0', pt: 'Insira uma quantidade maior que 0', zh: '输入大于 0 的数量', fr: 'Entrez une quantité supérieure à 0', it: 'Inserisci una quantità maggiore di 0', hi: '0 से अधिक मात्रा दर्ज करें', ar: 'أدخل كمية أكبر من 0' },
    pw_precio_0: { es: 'Ingresá un precio de compra mayor a 0', en: 'Enter a purchase price greater than 0', pt: 'Insira um preço de compra maior que 0', zh: '输入大于 0 的购买价格', fr: 'Entrez un prix d\'achat supérieur à 0', it: 'Inserisci un prezzo d\'acquisto maggiore di 0', hi: '0 से अधिक खरीद मूल्य दर्ज करें', ar: 'أدخل سعر شراء أكبر من 0' },
    pw_ingresa_nombre: { es: 'Ingresá un nombre', en: 'Enter a name', pt: 'Insira um nome', zh: '输入名称', fr: 'Entrez un nom', it: 'Inserisci un nome', hi: 'एक नाम दर्ज करें', ar: 'أدخل اسماً' },
    pw_copiado: { es: 'Copiado', en: 'Copied', pt: 'Copiado', zh: '已复制', fr: 'Copié', it: 'Copiato', hi: 'कॉपी किया गया', ar: 'تم النسخ' },
    pw_quitar_lista: { es: '¿Quitar {x} de la lista?', en: 'Remove {x} from the list?', pt: 'Remover {x} da lista?', zh: '从列表中移除 {x}？', fr: 'Retirer {x} de la liste ?', it: 'Rimuovere {x} dalla lista?', hi: 'सूची से {x} हटाएं?', ar: 'إزالة {x} من القائمة؟' },
    pw_completa_campos: { es: 'Completá todos los campos', en: 'Fill in all fields', pt: 'Preencha todos os campos', zh: '请填写所有字段', fr: 'Remplissez tous les champs', it: 'Compila tutti i campi', hi: 'सभी फ़ील्ड भरें', ar: 'املأ كل الحقول' },
    pw_ingresando: { es: 'Ingresando...', en: 'Signing in...', pt: 'Entrando...', zh: '登录中...', fr: 'Connexion...', it: 'Accesso...', hi: 'साइन इन हो रहा है...', ar: 'جارٍ الدخول...' },
    pw_creando_cuenta: { es: 'Creando cuenta...', en: 'Creating account...', pt: 'Criando conta...', zh: '正在创建账户...', fr: 'Création du compte...', it: 'Creazione account...', hi: 'खाता बन रहा है...', ar: 'جارٍ إنشاء الحساب...' },
    pw_cuenta_creada: { es: '¡Cuenta creada!', en: 'Account created!', pt: 'Conta criada!', zh: '账户已创建！', fr: 'Compte créé !', it: 'Account creato!', hi: 'खाता बन गया!', ar: 'تم إنشاء الحساب!' },
    pw_error_sesion: { es: 'Error: sesión no iniciada', en: 'Error: not signed in', pt: 'Erro: sessão não iniciada', zh: '错误：未登录', fr: 'Erreur : non connecté', it: 'Errore: sessione non avviata', hi: 'त्रुटि: साइन इन नहीं', ar: 'خطأ: لم يتم تسجيل الدخول' },
    pw_servicio_no_disp: { es: 'Servicio no disponible', en: 'Service unavailable', pt: 'Serviço indisponível', zh: '服务不可用', fr: 'Service indisponible', it: 'Servizio non disponibile', hi: 'सेवा अनुपलब्ध', ar: 'الخدمة غير متاحة' },
    pw_completa_email_pass: { es: 'Completá email y contraseña', en: 'Enter email and password', pt: 'Preencha email e senha', zh: '请输入邮箱和密码', fr: 'Saisissez email et mot de passe', it: 'Inserisci email e password', hi: 'ईमेल और पासवर्ड दर्ज करें', ar: 'أدخل البريد وكلمة المرور' },
    pw_pass_min6: { es: 'La contraseña debe tener al menos 6 caracteres', en: 'Password must be at least 6 characters', pt: 'A senha deve ter pelo menos 6 caracteres', zh: '密码至少需 6 个字符', fr: 'Le mot de passe doit comporter au moins 6 caractères', it: 'La password deve avere almeno 6 caratteri', hi: 'पासवर्ड कम से कम 6 अक्षरों का हो', ar: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل' },
    pw_obteniendo_tasas: { es: 'Obteniendo tasas...', en: 'Fetching rates...', pt: 'Obtendo taxas...', zh: '正在获取汇率...', fr: 'Récupération des taux...', it: 'Recupero tassi...', hi: 'दरें प्राप्त हो रही हैं...', ar: 'جارٍ جلب الأسعار...' },
    pw_no_tasa: { es: 'No se pudo obtener la tasa', en: 'Could not fetch the rate', pt: 'Não foi possível obter a taxa', zh: '无法获取汇率', fr: 'Impossible d\'obtenir le taux', it: 'Impossibile ottenere il tasso', hi: 'दर प्राप्त नहीं हो सकी', ar: 'تعذّر جلب السعر' },
    pw_invitado: { es: 'Invitado', en: 'Guest', pt: 'Convidado', zh: '访客', fr: 'Invité', it: 'Ospite', hi: 'अतिथि', ar: 'ضيف' },
    pw_sin_cuenta: { es: 'Sin cuenta', en: 'No account', pt: 'Sem conta', zh: '无账户', fr: 'Aucun compte', it: 'Nessun account', hi: 'कोई खाता नहीं', ar: 'لا يوجد حساب' },
    pw_pass_no_coinciden: { es: 'Las contraseñas no coinciden', en: 'Passwords don\'t match', pt: 'As senhas não coincidem', zh: '密码不匹配', fr: 'Les mots de passe ne correspondent pas', it: 'Le password non coincidono', hi: 'पासवर्ड मेल नहीं खाते', ar: 'كلمتا المرور غير متطابقتين' },
    pw_nombre_actualizado: { es: 'Nombre actualizado', en: 'Name updated', pt: 'Nome atualizado', zh: '名称已更新', fr: 'Nom mis à jour', it: 'Nome aggiornato', hi: 'नाम अपडेट किया गया', ar: 'تم تحديث الاسم' },
    pw_error_guardar: { es: 'Error al guardar', en: 'Error saving', pt: 'Erro ao salvar', zh: '保存出错', fr: 'Erreur d\'enregistrement', it: 'Errore nel salvataggio', hi: 'सहेजने में त्रुटि', ar: 'خطأ في الحفظ' },
    pw_celular_guardado: { es: 'Celular guardado', en: 'Phone saved', pt: 'Celular salvo', zh: '手机号已保存', fr: 'Téléphone enregistré', it: 'Telefono salvato', hi: 'फ़ोन सहेजा गया', ar: 'تم حفظ الهاتف' },
    pw_sin_celular: { es: 'Sin celular cargado', en: 'No phone added', pt: 'Sem celular cadastrado', zh: '未添加手机号', fr: 'Aucun téléphone ajouté', it: 'Nessun telefono inserito', hi: 'कोई फ़ोन नहीं जोड़ा', ar: 'لا يوجد هاتف مُضاف' },
    pw_borrar_alertas: { es: '¿Borrar {n} alerta(s) del historial?', en: 'Delete {n} alert(s) from history?', pt: 'Excluir {n} alerta(s) do histórico?', zh: '从历史中删除 {n} 条提醒？', fr: 'Supprimer {n} alerte(s) de l\'historique ?', it: 'Eliminare {n} avviso/i dalla cronologia?', hi: 'इतिहास से {n} अलर्ट हटाएं?', ar: 'حذف {n} تنبيه من السجل؟' },
    pw_pasate_pro: { es: 'Pasate a PRO', en: 'Upgrade to PRO', pt: 'Mude para PRO', zh: '升级到 PRO', fr: 'Passez à PRO', it: 'Passa a PRO', hi: 'PRO में अपग्रेड करें', ar: 'الترقية إلى PRO' },
    pw_pasate_elite: { es: 'Pasate a ELITE', en: 'Upgrade to ELITE', pt: 'Mude para ELITE', zh: '升级到 ELITE', fr: 'Passez à ELITE', it: 'Passa a ELITE', hi: 'ELITE में अपग्रेड करें', ar: 'الترقية إلى ELITE' },
    pw_plan_ahora: { es: '✓ Tu plan ahora es: {p} — ¡bienvenido!', en: '✓ Your plan is now: {p} — welcome!', pt: '✓ Seu plano agora é: {p} — bem-vindo!', zh: '✓ 您的当前计划：{p} — 欢迎！', fr: '✓ Votre forfait est maintenant : {p} — bienvenue !', it: '✓ Il tuo piano ora è: {p} — benvenuto!', hi: '✓ आपका प्लान अब है: {p} — स्वागत है!', ar: '✓ خطتك الآن: {p} — مرحباً!' },
    pw_elegi_plan: { es: 'Elegí tu plan', en: 'Choose your plan', pt: 'Escolha seu plano', zh: '选择您的计划', fr: 'Choisissez votre forfait', it: 'Scegli il tuo piano', hi: 'अपना प्लान चुनें', ar: 'اختر خطتك' },
    pw_sin_resultados: { es: 'Sin resultados', en: 'No results', pt: 'Sem resultados', zh: '无结果', fr: 'Aucun résultat', it: 'Nessun risultato', hi: 'कोई परिणाम नहीं', ar: 'لا نتائج' },
    al_tg_title: { es: 'Alertas por Telegram', en: 'Telegram alerts', pt: 'Alertas pelo Telegram', zh: 'Telegram 提醒', fr: 'Alertes Telegram', it: 'Avvisi Telegram', hi: 'Telegram अलर्ट', ar: 'تنبيهات Telegram' },
    al_tg_desc: { es: 'Conectá el bot para recibir tus alertas al instante', en: 'Connect the bot to get your alerts instantly', pt: 'Conecte o bot para receber seus alertas na hora', zh: '连接机器人即时接收提醒', fr: 'Connectez le bot pour recevoir vos alertes instantanément', it: 'Collega il bot per ricevere gli avvisi all\'istante', hi: 'तुरंत अलर्ट पाने के लिए बॉट कनेक्ट करें', ar: 'اربط البوت لتصلك التنبيهات فوراً' },
    al_tg_btn: { es: 'Conectar', en: 'Connect', pt: 'Conectar', zh: '连接', fr: 'Connecter', it: 'Collega', hi: 'कनेक्ट', ar: 'ربط' },
    al_ca_titulo: { es: 'Nueva alerta', en: 'New alert', pt: 'Novo alerta', zh: '新建提醒', fr: 'Nouvelle alerte', it: 'Nuovo avviso', hi: 'नया अलर्ट', ar: 'تنبيه جديد' },
    al_ca_sube: { es: 'Sube', en: 'Up', pt: 'Sobe', zh: '上涨', fr: 'Hausse', it: 'Sale', hi: 'ऊपर', ar: 'صعود' },
    al_ca_baja: { es: 'Baja', en: 'Down', pt: 'Cai', zh: '下跌', fr: 'Baisse', it: 'Scende', hi: 'नीचे', ar: 'هبوط' },
    al_ca_precio_obj: { es: 'Precio objetivo', en: 'Target price', pt: 'Preço-alvo', zh: '目标价', fr: 'Prix cible', it: 'Prezzo obiettivo', hi: 'लक्ष्य मूल्य', ar: 'السعر المستهدف' },
    al_ca_variacion: { es: 'Variación %', en: 'Change %', pt: 'Variação %', zh: '变动 %', fr: 'Variation %', it: 'Variazione %', hi: 'परिवर्तन %', ar: 'تغيّر %' },
    al_ca_actual: { es: 'Precio actual', en: 'Current price', pt: 'Preço atual', zh: '当前价', fr: 'Prix actuel', it: 'Prezzo attuale', hi: 'वर्तमान मूल्य', ar: 'السعر الحالي' },
    al_ca_objetivo: { es: 'Se dispara en', en: 'Triggers at', pt: 'Dispara em', zh: '触发于', fr: 'Se déclenche à', it: 'Si attiva a', hi: 'इस पर ट्रिगर', ar: 'يُفعّل عند' },
    al_ca_crear: { es: 'Crear alerta', en: 'Create alert', pt: 'Criar alerta', zh: '创建提醒', fr: 'Créer l\'alerte', it: 'Crea avviso', hi: 'अलर्ट बनाएं', ar: 'إنشاء تنبيه' },
    al_ca_creada: { es: '✓ Alerta creada', en: '✓ Alert created', pt: '✓ Alerta criado', zh: '✓ 提醒已创建', fr: '✓ Alerte créée', it: '✓ Avviso creato', hi: '✓ अलर्ट बन गया', ar: '✓ تم إنشاء التنبيه' },
    al_ca_login: { es: 'Iniciá sesión para crear alertas', en: 'Sign in to create alerts', pt: 'Entre para criar alertas', zh: '登录以创建提醒', fr: 'Connectez-vous pour créer des alertes', it: 'Accedi per creare avvisi', hi: 'अलर्ट बनाने के लिए साइन इन करें', ar: 'سجّل الدخول لإنشاء التنبيهات' },
    al_ca_invalido: { es: 'Ingresá un valor válido', en: 'Enter a valid value', pt: 'Insira um valor válido', zh: '请输入有效值', fr: 'Entrez une valeur valide', it: 'Inserisci un valore valido', hi: 'मान्य मान दर्ज करें', ar: 'أدخل قيمة صحيحة' },
    al_crear_alerta_menu: { es: 'Crear alerta de precio', en: 'Create price alert', pt: 'Criar alerta de preço', zh: '创建价格提醒', fr: 'Créer une alerte de prix', it: 'Crea avviso di prezzo', hi: 'मूल्य अलर्ट बनाएं', ar: 'إنشاء تنبيه سعر' },
  };

  // ═══ FUNCIONES PÚBLICAS ═══

  function t(key) {
    var entry = T[key];
    if (!entry) return key;
    return entry[_lang] || entry.es || key;
  }

  function getLang() { return _lang; }

  function setLang(code) {
    _lang = code;
    localStorage.setItem('aurex_lang', code);
    applyTranslations();
    _listeners.forEach(function(fn) { fn(code); });
  }

  function onLangChange(fn) {
    _listeners.push(fn);
    return function() { _listeners = _listeners.filter(function(f) { return f !== fn; }); };
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      var attr = el.getAttribute('data-i18n-attr');
      if (attr === 'placeholder') {
        el.placeholder = t(key);
      } else if (attr === 'value') {
        el.value = t(key);
      } else {
        el.textContent = t(key);
      }
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-html');
      el.innerHTML = t(key);
    });
  }

  // ═══ EXPORTS ═══
  window._i18n = { t: t, getLang: getLang, setLang: setLang, onLangChange: onLangChange, applyTranslations: applyTranslations, T: T };
  window.t = t;

  document.addEventListener('DOMContentLoaded', function() {
    applyTranslations();
  });

})();
