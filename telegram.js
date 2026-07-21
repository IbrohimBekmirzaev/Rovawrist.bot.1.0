const fs = require('fs');
const os = require('os');
const path = require('path');
require('dotenv').config();

const DATA_DIR = path.join(__dirname, 'data');
const STATE_FILE = path.join(DATA_DIR, 'bot-state.json');
const GLOBAL_RUNTIME_DIR = path.join(process.env.LOCALAPPDATA || os.homedir(), 'RovawristBotRuntime');
const POLLING_LOCK_HEARTBEAT_MS = 10000;
const POLLING_LOCK_STALE_MS = 45000;
const ASSETS_DIR = path.join(__dirname, 'assets');
const PRODUCT_SHOWCASE_IMAGE = path.join(ASSETS_DIR, 'rovawrist-showcase.jpg');
const REQUIRED_CHANNELS = [
    {
        username: process.env.REQUIRED_CHANNEL_1_USERNAME || '@Rovawirst',
        url: process.env.REQUIRED_CHANNEL_1_URL || 'https://t.me/Rovawirst',
        label: process.env.REQUIRED_CHANNEL_1_LABEL || '♻️ 1-KANAL'
    },
    {
        username: process.env.REQUIRED_CHANNEL_2_USERNAME || '',
        url: process.env.REQUIRED_CHANNEL_2_URL || '',
        label: process.env.REQUIRED_CHANNEL_2_LABEL || '♻️ 2-KANAL'
    },
    {
        username: process.env.REQUIRED_CHANNEL_3_USERNAME || '',
        url: process.env.REQUIRED_CHANNEL_3_URL || '',
        label: process.env.REQUIRED_CHANNEL_3_LABEL || '♻️ 3-KANAL'
    },
    {
        username: process.env.REQUIRED_CHANNEL_4_USERNAME || '',
        url: process.env.REQUIRED_CHANNEL_4_URL || '',
        label: process.env.REQUIRED_CHANNEL_4_LABEL || '♻️ 4-KANAL'
    }
].filter((channel) => channel.username && channel.url);

const TOPIC_KEYS = ['start', 'support', 'unanswered', 'orders', 'error'];
const TOPIC_NAMES = {
    start: 'Start',
    support: 'Support',
    unanswered: 'Javob berilmaganlar',
    orders: 'Buyurtmalar',
    error: 'Error'
};

const TOPIC_COLORS = {
    start: 7322096,
    support: 9367192,
    unanswered: 16766590,
    orders: 16766590,
    error: 16749490
};

const PRODUCT_CATALOG = {
    prod1: {
        label: 'Qora rangli',
        orderLabel: 'ROVA - Qora rangli',
        imagePath: path.join(ASSETS_DIR, 'rovawrist-black.jpg')
    },
    prod2: {
        label: 'Pushti rangli',
        orderLabel: 'ROVA - Pushti rangli',
        imagePath: path.join(ASSETS_DIR, 'rovawrist-pink.png')
    }
};

const PRODUCT_PRICE_USD = '45$';
const PRODUCT_PRICE_UZS = '560 000 so‘m';
const PRODUCT_PRICE_TEXT = `${PRODUCT_PRICE_USD} / ${PRODUCT_PRICE_UZS}`;
const PRODUCT_DELIVERY_NOTE = 'Yetkazib berish to‘lovi alohida.';
const PAYMENT_IMAGE = path.join(ASSETS_DIR, 'payment-instructions.png');
const PAYMENT_UZCARD = '5614 6814 2200 4352';
const PAYMENT_VISA = '4790 9122 3315 1390';
const PAYMENT_CARD_HOLDER = 'IZBASAROV DIOR TIMUROVICH';
const MAIN_MENU_BUTTON_ORDER = 'Buyurtma berish';
const MAIN_MENU_BUTTON_SUPPORT = 'Support';
const PRODUCT_CALLBACK_PREFIX = 'order:';
const SUPPORTED_LANGUAGES = ['uz', 'ru', 'en'];
const LANGUAGE_BUTTONS = {
    uz: 'O‘zbek',
    ru: 'Русский',
    en: 'English'
};
const PRODUCT_COPY = {
    uz: {
        greeting: 'Salom',
        menuOrder: 'Buyurtma berish',
        menuSupport: 'Support',
        joinChannelPrompt: '❗ Botdan foydalanish uchun quyida keltirilgan kanallarga a’zo bo‘ling va "tekshirish" tugmasiga bosing. 👇',
        checkSubscriptionButton: 'Tekshirish',
        subscriptionConfirmed: 'A’zolik tasdiqlandi.',
        subscriptionRequired: 'Davom etish uchun kanalga a’zo bo‘ling.',
        channelAccessError: 'Bot kanal a’zolarini tekshira olmayapti. Botni kanalga admin qiling.',
        productTitle: 'ROVA braslet',
        priceLabel: 'Narxi',
        noteLabel: 'Eslatma',
        deliveryNote: 'Yetkazib berish to‘lovi alohida.',
        colorBlack: 'Qora rangli',
        colorPink: 'Pushti rangli',
        prompt: 'Pastdagi tugmalardan rangni tanlang.',
        orderAccepted: 'Buyurtmangiz qabul qilindi',
        operatorFollowUp: 'Operator siz bilan tez orada bog‘lanadi.',
        notFound: 'Mahsulot topilmadi.',
        callbackAccepted: 'Buyurtma qabul qilindi.',
        supportPrompt: 'Support uchun pastdagi tugmadan foydalaning.',
        welcome: 'ROVA braslet buyurtma qilish uchun pastdagi tugmani bosing.',
        phonePrompt: 'Telefon raqamingizni yozing yoki pastdagi tugma orqali avtomatik yuboring.',
        phoneExample: 'Masalan: <code>+998 90 123 45 67</code>',
        sharePhoneButton: '📞 Raqamni yuborish',
        invalidPhonePrompt: 'Telefon raqam noto‘g‘ri. Iltimos, <code>+998 90 123 45 67</code> yoki boshqa xalqaro formatda yuboring, yoxud tugma orqali ulashing.',
        fullNamePrompt: 'Endi ism va familiyangizni yuboring.',
        invalidFullNamePrompt: 'Ism va familiya noto‘g‘ri. Iltimos, faqat harflar bilan to‘liq ism va familiyangizni yuboring.',
        addressPrompt: 'Yetkazib berish uchun manzilni yuboring:\n\n📝 Aniq manzilingizni matn ko‘rinishida yozing,\n\nYOKI\n\n📎 xabar oynasidagi qog‘oz qisqich belgisini bosing → <b>Location</b> ni tanlang → xaritada kerakli nuqtani bosib/surib belgilang → <b>Send Selected Location</b> tugmasini bosing.\n\n<i>(Eslatma: pastdagi «📍 Joriy joylashuvni yuborish» tugmasi hozir turgan joyingizni yuboradi, boshqa manzilni emas.)</i>',
        locationButton: '📍 Joriy joylashuvni yuborish',
        invalidAddressPrompt: 'Manzil noto‘g‘ri. Iltimos, ko‘cha, uy raqami va kerak bo‘lsa mo‘ljal bilan aniq manzil yuboring.',
        locationSaved: 'Kartadan aniq lokatsiya qabul qilindi.',
        paymentCaption: 'Quyidagi kartalardan biriga to‘lovni amalga oshiring.',
        paymentDoneButton: '✅ To‘lov qildim',
        copyUzcardButton: '📋 Uzcard nusxalash',
        copyVisaButton: '📋 Visa nusxalash',
        paymentProofPrompt: 'To‘lov chekini screenshot yoki PDF ko‘rinishida yuboring.',
        paymentProofAccepted: '✅ To‘lov qilindi statusi qo‘yildi. Administrator to‘lovni tekshiradi.',
        features: [
            'ROVA',
            'Suv o‘tkazmaydi',
            'Pulsni real vaqt rejimida o‘lchaydi',
            'Qondagi kislorod darajasi (SpO2)',
            'EKG funksiyasi bor',
            'Uyqu tahlili: chuqur, yengil va umumiy',
            'Tana tarkibi tahlili (body composition)',
            'Tana harorati',
            'Qadam, masofa va kaloriya',
            'Qo‘ng‘iroq va xabar bildirishnomalari',
            'Ilova: G Band (iOS 13+ / Android 8+, Bluetooth 5.3)'
        ]
    },
    ru: {
        greeting: 'Здравствуйте',
        menuOrder: 'Заказать',
        menuSupport: 'Поддержка',
        joinChannelPrompt: '❗ Чтобы пользоваться ботом, подпишитесь на каналы ниже и нажмите кнопку "Проверить". 👇',
        checkSubscriptionButton: 'Проверить',
        subscriptionConfirmed: 'Подписка подтверждена.',
        subscriptionRequired: 'Для продолжения подпишитесь на канал.',
        channelAccessError: 'Бот не может проверить участников канала. Сделайте бота администратором канала.',
        productTitle: 'Браслет ROVA',
        priceLabel: 'Цена',
        noteLabel: 'Примечание',
        deliveryNote: 'Стоимость доставки оплачивается отдельно.',
        colorBlack: 'Черный',
        colorPink: 'Розовый',
        prompt: 'Выберите цвет кнопками ниже.',
        orderAccepted: 'Ваш заказ принят',
        operatorFollowUp: 'Оператор скоро свяжется с вами.',
        notFound: 'Товар не найден.',
        callbackAccepted: 'Заказ принят.',
        supportPrompt: 'Для поддержки используйте кнопку ниже.',
        welcome: 'Нажмите кнопку ниже, чтобы заказать браслет ROVA.',
        phonePrompt: 'Отправьте свой номер телефона текстом или автоматически через кнопку ниже.',
        phoneExample: 'Например: <code>+998 90 123 45 67</code>',
        sharePhoneButton: '📞 Отправить номер',
        invalidPhonePrompt: 'Неверный номер. Отправьте его в формате <code>+998 90 123 45 67</code> или в другом международном формате, либо через кнопку ниже.',
        fullNamePrompt: 'Теперь отправьте имя и фамилию.',
        invalidFullNamePrompt: 'Имя и фамилия указаны неверно. Пожалуйста, отправьте полные имя и фамилию только буквами.',
        addressPrompt: 'Отправьте адрес доставки:\n\n📝 Напишите точный адрес текстом,\n\nЛИБО\n\n📎 нажмите значок скрепки рядом с полем ввода → выберите <b>Location</b> → отметьте нужную точку на карте (нажатием или перетаскиванием) → нажмите <b>Send Selected Location</b>.\n\n<i>(Кнопка «📍 Отправить текущую геолокацию» ниже отправляет именно ваше текущее местоположение, а не выбранный адрес.)</i>',
        locationButton: '📍 Отправить текущую геолокацию',
        invalidAddressPrompt: 'Адрес указан неверно. Пожалуйста, отправьте точный адрес с улицей, номером дома и при необходимости ориентиром.',
        locationSaved: 'Точная геолокация получена.',
        paymentCaption: 'Оплатите заказ на одну из карт ниже.',
        paymentDoneButton: '✅ Я оплатил',
        copyUzcardButton: '📋 Скопировать Uzcard',
        copyVisaButton: '📋 Скопировать Visa',
        paymentProofPrompt: 'Отправьте чек оплаты в виде скриншота или PDF.',
        paymentProofAccepted: '✅ Статус оплаты установлен. Администратор проверит оплату.',
        features: [
            'ROVA',
            'Водонепроницаемый',
            'Пульс в реальном времени',
            'Кислород в крови (SpO2)',
            'ЭКГ',
            'Анализ сна: глубокий, легкий и общий',
            'Состав тела (body composition)',
            'Температура тела',
            'Шаги, дистанция и калории',
            'Уведомления о звонках и сообщениях',
            'Приложение: G Band (iOS 13+ / Android 8+, Bluetooth 5.3)'
        ]
    },
    en: {
        greeting: 'Hello',
        menuOrder: 'Place order',
        menuSupport: 'Support',
        joinChannelPrompt: '❗ To use the bot, join the channels below and press "Check". 👇',
        checkSubscriptionButton: 'Check',
        subscriptionConfirmed: 'Subscription confirmed.',
        subscriptionRequired: 'Please join the channel to continue.',
        channelAccessError: 'The bot cannot verify channel members. Make the bot a channel admin.',
        productTitle: 'ROVA bracelet',
        priceLabel: 'Price',
        noteLabel: 'Note',
        deliveryNote: 'Delivery fee is charged separately.',
        colorBlack: 'Black',
        colorPink: 'Pink',
        prompt: 'Choose a color using the buttons below.',
        orderAccepted: 'Your order has been accepted',
        operatorFollowUp: 'Our operator will contact you soon.',
        notFound: 'Product not found.',
        callbackAccepted: 'Order accepted.',
        supportPrompt: 'Use the button below for support.',
        welcome: 'Press the button below to order the ROVA bracelet.',
        phonePrompt: 'Send your phone number as text or share it automatically using the button below.',
        phoneExample: 'Example: <code>+998 90 123 45 67</code>',
        sharePhoneButton: '📞 Share phone',
        invalidPhonePrompt: 'Invalid phone number. Please send it as <code>+998 90 123 45 67</code> or another international format, or share it using the button below.',
        fullNamePrompt: 'Now send your first and last name.',
        invalidFullNamePrompt: 'Name is invalid. Please send your full first and last name using letters only.',
        addressPrompt: 'Send your delivery address:\n\n📝 Type your exact address as text,\n\nOR\n\n📎 tap the paperclip icon next to the message box → choose <b>Location</b> → tap or drag the pin to the exact spot on the map → tap <b>Send Selected Location</b>.\n\n<i>(The "📍 Send current location" button below sends your current position, not a chosen address.)</i>',
        locationButton: '📍 Send current location',
        invalidAddressPrompt: 'Address is invalid. Please send a clear address with street, house number, and landmark if needed.',
        locationSaved: 'Exact map location received.',
        paymentCaption: 'Please complete the payment to one of the cards below.',
        paymentDoneButton: '✅ I paid',
        copyUzcardButton: '📋 Copy Uzcard',
        copyVisaButton: '📋 Copy Visa',
        paymentProofPrompt: 'Send the payment receipt as a screenshot or PDF.',
        paymentProofAccepted: '✅ Payment status saved. The administrator will verify the payment.',
        features: [
            'ROVA',
            'Water resistant',
            'Real-time heart rate',
            'Blood oxygen (SpO2)',
            'ECG',
            'Sleep analysis: deep, light, and total',
            'Body composition analysis',
            'Body temperature',
            'Steps, distance, and calories',
            'Call and message notifications',
            'App: G Band (iOS 13+ / Android 8+, Bluetooth 5.3)'
        ]
    }
};

const INTERNATIONAL_PHONE_PATTERN = /^\+\d{7,15}$/;
const SUBSCRIPTION_CACHE_TTL_MS = 10 * 60 * 1000;

const defaultState = {
    startedUsers: {},
    userLanguages: {},
    pendingStartPayloads: {},
    pendingActions: {},
    orderSessions: {},
    supportSessions: {},
    messageArchiveByChat: {},
    supportMessageMap: {},
    topicsByGroup: {},
    lastUpdateId: 0
};

function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}

function ensureParentDir(filePath) {
    const directory = path.dirname(filePath);

    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
}

function loadState() {
    ensureDataDir();

    if (!fs.existsSync(STATE_FILE)) {
        return { ...defaultState };
    }

    try {
        const parsed = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
        return {
            ...defaultState,
            ...parsed,
            startedUsers: parsed.startedUsers || {},
            userLanguages: parsed.userLanguages || {},
            pendingStartPayloads: parsed.pendingStartPayloads || {},
            pendingActions: parsed.pendingActions || {},
            orderSessions: parsed.orderSessions || {},
            supportSessions: parsed.supportSessions || {},
            messageArchiveByChat: parsed.messageArchiveByChat || {},
            supportMessageMap: parsed.supportMessageMap || {},
            topicsByGroup: parsed.topicsByGroup || {}
        };
    } catch (error) {
        console.error('Bot state faylini oqishda xatolik, fayl buzilgan bo‘lishi mumkin:', error);

        try {
            fs.copyFileSync(STATE_FILE, `${STATE_FILE}.corrupted-${Date.now()}`);
            console.error(`Buzilgan fayl tekshirish uchun saqlandi: ${STATE_FILE}.corrupted-${Date.now()}`);
        } catch {}

        return { ...defaultState };
    }
}

let pendingStateRef = null;
let stateSaveTimer = null;
let isStateWriteInFlight = false;
let shouldSaveStateAgain = false;

function atomicWriteFileSync(filePath, data) {
    ensureParentDir(filePath);
    const tempPath = `${filePath}.tmp-${process.pid}`;
    fs.writeFileSync(tempPath, data, 'utf8');
    fs.renameSync(tempPath, filePath);
}

function atomicWriteFile(filePath, data, callback) {
    ensureParentDir(filePath);
    const tempPath = `${filePath}.tmp-${process.pid}`;

    fs.writeFile(tempPath, data, 'utf8', (writeError) => {
        if (writeError) {
            callback(writeError);
            return;
        }

        fs.rename(tempPath, filePath, callback);
    });
}

function flushStateWriteAsync() {
    if (isStateWriteInFlight || !pendingStateRef) {
        return;
    }

    isStateWriteInFlight = true;
    const payload = JSON.stringify(pendingStateRef, null, 2);

    atomicWriteFile(STATE_FILE, payload, (error) => {
        isStateWriteInFlight = false;

        if (error) {
            console.error('Bot state faylini yozishda xatolik:', error);
        }

        if (shouldSaveStateAgain) {
            shouldSaveStateAgain = false;
            flushStateWriteAsync();
        }
    });
}

function saveState(state) {
    ensureDataDir();
    pendingStateRef = state;

    if (isStateWriteInFlight) {
        shouldSaveStateAgain = true;
        return;
    }

    if (stateSaveTimer) {
        return;
    }

    stateSaveTimer = setTimeout(() => {
        stateSaveTimer = null;
        flushStateWriteAsync();
    }, 40);
}

function flushStateSync(state = pendingStateRef) {
    if (!state) {
        return;
    }

    ensureDataDir();

    if (stateSaveTimer) {
        clearTimeout(stateSaveTimer);
        stateSaveTimer = null;
    }

    atomicWriteFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function readJsonFile(filePath) {
    if (!fs.existsSync(filePath)) {
        return null;
    }

    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
        return null;
    }
}

function writeJsonFile(filePath, data) {
    ensureParentDir(filePath);
    atomicWriteFileSync(filePath, JSON.stringify(data, null, 2));
}

process.on('beforeExit', () => flushStateSync());
process.on('SIGINT', () => {
    flushStateSync();
});
process.on('SIGTERM', () => {
    flushStateSync();
});

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseTimestampMs(value) {
    if (!value) {
        return 0;
    }

    const timestamp = new Date(value).getTime();
    return Number.isFinite(timestamp) ? timestamp : 0;
}

function escapeHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function cleanText(value, maxLength = 800) {
    if (typeof value !== 'string') {
        return '';
    }

    return value.replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function toIdString(value) {
    return String(value || '');
}

function hasRealConfigValue(value) {
    if (typeof value !== 'string') {
        return false;
    }

    const normalized = value.trim();

    if (!normalized) {
        return false;
    }

    return !normalized.startsWith('PASTE_YOUR_');
}

function nowUzbekistan() {
    const formatter = new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Tashkent'
    });

    const parts = formatter.formatToParts(new Date());
    const getPart = (type) => parts.find((part) => part.type === type)?.value || '';

    return `${getPart('day')}/${getPart('month')}/${getPart('year')} ${getPart('hour')}:${getPart('minute')}:${getPart('second')}`;
}

function getFullName(user = {}) {
    return cleanText([user.first_name, user.last_name].filter(Boolean).join(' '), 120) || 'Nomaʼlum';
}

function getUsername(user = {}) {
    return user.username ? `@${user.username}` : 'Yoʻq';
}

function getProductLabel(productKey = '') {
    return PRODUCT_CATALOG[productKey]?.orderLabel || 'Tanlanmagan';
}

function getProductButtonLabel(productKey = '') {
    return PRODUCT_CATALOG[productKey]?.label || '';
}

function getProductImagePath(productKey = '') {
    return PRODUCT_CATALOG[productKey]?.imagePath || '';
}

function normalizeLanguage(language = '') {
    const normalized = cleanText(String(language || ''), 10).toLowerCase();

    if (SUPPORTED_LANGUAGES.includes(normalized)) {
        return normalized;
    }

    if (normalized.startsWith('ru')) {
        return 'ru';
    }

    if (normalized.startsWith('en')) {
        return 'en';
    }

    if (normalized.startsWith('uz')) {
        return 'uz';
    }

    return 'uz';
}

function getLanguageCopy(language = 'uz') {
    return PRODUCT_COPY[normalizeLanguage(language)];
}

function normalizePhone(phone) {
    const digits = String(phone || '').replace(/\D/g, '');

    if (digits.startsWith('998') && digits.length >= 12) {
        return `+${digits.slice(0, 12)}`;
    }

    if (digits.length === 9) {
        return `+998${digits}`;
    }

    if (digits.length >= 7 && digits.length <= 15) {
        return `+${digits}`;
    }

    return String(phone || '').trim();
}

function isValidPhone(phone) {
    return INTERNATIONAL_PHONE_PATTERN.test(normalizePhone(phone));
}

function isValidFullName(value) {
    const normalized = cleanText(value, 120);

    if (normalized.length < 5 || normalized.length > 80) {
        return false;
    }

    if (!/[\p{L}]/u.test(normalized) || /[0-9]/.test(normalized)) {
        return false;
    }

    if (!/^[\p{L}\s'"`’ʻʼ-]+$/u.test(normalized)) {
        return false;
    }

    const words = normalized
        .split(/\s+/)
        .map((word) => word.replace(/['"`’ʻʼ-]/g, ''))
        .filter(Boolean);

    return words.length >= 2 && words.every((word) => word.length >= 2);
}

function isValidAddress(value) {
    const normalized = cleanText(value, 180);

    if (normalized.length < 8 || normalized.length > 180) {
        return false;
    }

    if (!/[\p{L}]/u.test(normalized)) {
        return false;
    }

    if (!/^[\p{L}\d\s,./#'"`’ʻʼ-]+$/u.test(normalized)) {
        return false;
    }

    const usefulParts = normalized
        .split(/\s+/)
        .map((part) => part.replace(/[^-\p{L}\d]/gu, ''))
        .filter(Boolean);

    return usefulParts.length >= 2;
}

function getStartPayload(message = {}) {
    const text = cleanText(message.text || '', 160);
    const match = text.match(/^\/start(?:@\w+)?\s+(.+)$/i);

    return cleanText(match?.[1] || '', 120).toLowerCase();
}

function resolveProductKey(value = '') {
    const normalized = cleanText(value, 80).toLowerCase();

    if (['1', 'prod1', 'qora', 'qora rangli', 'black'].includes(normalized)) {
        return 'prod1';
    }

    if (['2', 'prod2', 'pushti', 'pushti rangli', 'pink'].includes(normalized)) {
        return 'prod2';
    }

    return '';
}

function getMessageTypeLabel(message = {}) {
    if (message.text) return 'Matn';
    if (message.photo) return 'Rasm';
    if (message.video) return 'Video';
    if (message.animation) return 'GIF';
    if (message.document) return 'Fayl';
    if (message.audio) return 'Audio';
    if (message.voice) return 'Ovozli xabar';
    if (message.video_note) return 'Video note';
    if (message.sticker) return 'Sticker';
    if (message.contact) return 'Kontakt';
    if (message.location) return 'Lokatsiya';
    if (message.venue) return 'Manzil';
    if (message.poll) return 'Soʻrovnoma';
    if (message.dice) return 'Dice';
    return 'Boshqa turdagi xabar';
}

function getSupportMessageHeadline(message = {}) {
    if (message.photo) return '🖼 <b>Foydalanuvchi rasmi</b>';
    if (message.video) return '🎥 <b>Foydalanuvchi videosi</b>';
    if (message.animation) return '🎞 <b>Foydalanuvchi GIF xabari</b>';
    if (message.document) return '📎 <b>Foydalanuvchi fayli</b>';
    if (message.audio) return '🎵 <b>Foydalanuvchi audiosi</b>';
    if (message.voice) return '🎤 <b>Foydalanuvchi ovozli xabari</b>';
    if (message.video_note) return '📹 <b>Foydalanuvchi video note xabari</b>';
    if (message.sticker) return '🌟 <b>Foydalanuvchi stickeri</b>';
    if (message.contact) return '📞 <b>Foydalanuvchi kontakti</b>';
    if (message.location) return '📍 <b>Foydalanuvchi lokatsiyasi</b>';
    if (message.venue) return '📌 <b>Foydalanuvchi manzili</b>';
    if (message.poll) return '📊 <b>Foydalanuvchi so‘rovnomasi</b>';
    if (message.dice) return '🎲 <b>Foydalanuvchi dice xabari</b>';
    return '💬 <b>Foydalanuvchi xabari</b>';
}

function getSupportMessageBody(message = {}) {
    if (message.text) {
        return cleanText(message.text, 3500);
    }

    if (message.caption) {
        return cleanText(message.caption, 3500);
    }

    if (message.contact) {
        return cleanText([
            [message.contact.first_name, message.contact.last_name].filter(Boolean).join(' ').trim(),
            message.contact.phone_number || ''
        ].filter(Boolean).join('\n'), 3500);
    }

    if (message.venue) {
        return cleanText([
            message.venue.title || '',
            message.venue.address || '',
            message.venue.location
                ? `${Number(message.venue.location.latitude).toFixed(6)}, ${Number(message.venue.location.longitude).toFixed(6)}`
                : ''
        ].filter(Boolean).join('\n'), 3500);
    }

    if (message.location) {
        return cleanText(
            `${Number(message.location.latitude).toFixed(6)}, ${Number(message.location.longitude).toFixed(6)}`,
            3500
        );
    }

    if (message.poll) {
        return cleanText(message.poll.question || '', 3500);
    }

    if (message.dice) {
        return cleanText(`${message.dice.emoji || ''} ${message.dice.value || ''}`.trim(), 3500);
    }

    return '';
}

function isCaptionableSupportMessage(message = {}) {
    return Boolean(
        message.photo ||
        message.video ||
        message.animation ||
        message.document ||
        message.audio ||
        message.voice
    );
}

function buildStartLog(user, userCount) {
    const language = cleanText(user.language_code || 'Nomaʼlum', 20);
    const premium = user.is_premium ? 'Ha' : 'Yoʻq';

    return [
        `[${nowUzbekistan()}]`,
        '/start bosildi',
        '',
        `👤 ✨ <b>${escapeHtml(getFullName(user))}</b> ✨`,
        `🔗 ${escapeHtml(getUsername(user))}`,
        `🆔 <code>${escapeHtml(String(user.id || ''))}</code>`,
        `UID: <code>${escapeHtml(String(user.id || ''))}</code>`,
        `🌐 Til: ${escapeHtml(language)}`,
        `⭐ Premium: ${escapeHtml(premium)}`,
        `${userCount}- foydalanuvchi`
    ].join('\n');
}

function buildSupportMeta(user, message) {
    const textPreview = cleanText(message.text || message.caption || '', 240);

    return [
        `🆘 <b>Support soʻrov</b>`,
        `⏰ ${escapeHtml(nowUzbekistan())}`,
        `👤 ${escapeHtml(getFullName(user))}`,
        `🔗 ${escapeHtml(getUsername(user))}`,
        `🆔 <code>${escapeHtml(String(user.id || ''))}</code>`,
        `📦 Xabar turi: ${escapeHtml(getMessageTypeLabel(message))}`,
        textPreview ? `💬 ${escapeHtml(textPreview)}` : '💬 Matnsiz media xabar'
    ].join('\n');
}

function buildPendingStatusMeta(record = {}) {
    return [
        `${escapeHtml(record.statusLabel || '⏳ Javob berilmagan')}`,
        `${escapeHtml(record.categoryLabel || '🆘 Support soʻrov')}`,
        `⏰ ${escapeHtml(record.createdAtLabel || nowUzbekistan())}`,
        `👤 ${escapeHtml(record.fullName || 'Nomaʼlum')}`,
        `🔗 ${escapeHtml(record.username || 'Yoʻq')}`,
        `🆔 <code>${escapeHtml(String(record.userId || ''))}</code>`,
        `📦 Xabar turi: ${escapeHtml(record.messageType || 'Matn')}`,
        record.preview ? `💬 ${escapeHtml(record.preview)}` : '💬 Matnsiz media xabar'
    ].join('\n');
}

function buildSupportLogMessage(record = {}, options = {}) {
    const bodyLimit = options.forCaption ? 180 : 2600;
    const body = cleanText(record.body || '', bodyLimit);

    return [
        `<b>${escapeHtml(record.statusLabel || '⏳ Javob berilmagan')}</b>`,
        `<b>${escapeHtml(record.categoryLabel || '🆘 Support soʻrov')}</b>`,
        record.messageHeadline || '💬 <b>Foydalanuvchi xabari</b>',
        `⏰ ${escapeHtml(record.createdAtLabel || nowUzbekistan())}`,
        `👤 ${escapeHtml(record.fullName || 'Nomaʼlum')}`,
        `🔗 ${escapeHtml(record.username || 'Yoʻq')}`,
        `🆔 <code>${escapeHtml(String(record.userId || ''))}</code>`,
        `UID: <code>${escapeHtml(String(record.userId || ''))}</code>`,
        '',
        body ? `<pre>${escapeHtml(body)}</pre>` : '💬 Matnsiz media xabar'
    ].join('\n');
}

function buildOrderLog(order, extra = {}) {
    const locationCoordinates = order.location
        ? `${Number(order.location.latitude).toFixed(6)}, ${Number(order.location.longitude).toFixed(6)}`
        : '';

    return [
        `🛍 <b>Yangi buyurtma</b>`,
        `⏰ ${escapeHtml(nowUzbekistan())}`,
        `👤 ${escapeHtml(order.fullName)}`,
        `📞 ${escapeHtml(order.phone)}`,
        `⌚ ${escapeHtml(order.productLabel)}`,
        `💵 ${escapeHtml(PRODUCT_PRICE_TEXT)} (${escapeHtml(PRODUCT_DELIVERY_NOTE)})`,
        `📍 ${escapeHtml(order.address || order.city || 'Yoʻq')}`,
        locationCoordinates ? `🧭 <code>${escapeHtml(locationCoordinates)}</code>` : '',
        `📝 ${escapeHtml(order.message || 'Yoʻq')}`,
        `🌐 Manba: ${escapeHtml(extra.source || 'Sayt')}`,
        extra.telegramUserId ? `🆔 Telegram UID: <code>${escapeHtml(String(extra.telegramUserId))}</code>` : '',
        extra.telegramUsername ? `🔗 Telegram: ${escapeHtml(extra.telegramUsername)}` : '',
        extra.ipAddress ? `🧭 IP: <code>${escapeHtml(extra.ipAddress)}</code>` : '',
        extra.userAgent ? `💻 User-Agent: ${escapeHtml(cleanText(extra.userAgent, 300))}` : ''
    ].filter(Boolean).join('\n');
}

function getMainMenuReplyMarkup(language = 'uz') {
    const copy = getLanguageCopy(language);

    return {
        inline_keyboard: [
            [{ text: copy.menuOrder, callback_data: 'menu:buy' }],
            [{ text: copy.menuSupport, callback_data: 'menu:support' }],
            SUPPORTED_LANGUAGES.map((lang) => ({
                text: LANGUAGE_BUTTONS[lang],
                callback_data: `lang:${lang}`
            }))
        ]
    };
}

function getPhoneReplyMarkup(language = 'uz') {
    const copy = getLanguageCopy(language);

    return {
        keyboard: [
            [{ text: copy.sharePhoneButton, request_contact: true }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
        is_persistent: false,
        input_field_placeholder: copy.phoneExample.replace(/<[^>]+>/g, '')
    };
}

function getInputReplyMarkup() {
    return {
        remove_keyboard: true
    };
}

function getAddressReplyMarkup(language = 'uz') {
    return {
        keyboard: [
            [{ text: getLanguageCopy(language).locationButton, request_location: true }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
        is_persistent: false
    };
}

function getPaymentCaption(language = 'uz') {
    const copy = getLanguageCopy(language);

    return [
        `💳 <b>Uzcard</b>`,
        `<code>${escapeHtml(PAYMENT_UZCARD)}</code>`,
        '',
        `💳 <b>Visa</b>`,
        `<code>${escapeHtml(PAYMENT_VISA)}</code>`,
        '',
        `👤 <b>Karta egasi</b>`,
        escapeHtml(PAYMENT_CARD_HOLDER),
        '',
        escapeHtml(copy.paymentCaption)
    ].join('\n');
}

function getPaymentInlineKeyboard(language = 'uz') {
    const copy = getLanguageCopy(language);

    return {
        inline_keyboard: [
            [
                { text: copy.copyUzcardButton, copy_text: { text: PAYMENT_UZCARD } }
            ],
            [
                { text: copy.copyVisaButton, copy_text: { text: PAYMENT_VISA } }
            ],
            [
                { text: copy.paymentDoneButton, callback_data: 'payment:done' }
            ]
        ]
    };
}

function getSubscriptionInlineKeyboard(language = 'uz') {
    const copy = getLanguageCopy(language);
    return {
        inline_keyboard: [
            ...REQUIRED_CHANNELS.map((channel) => ([
                { text: channel.label, url: channel.url }
            ])),
            [
                { text: `✅ ${copy.checkSubscriptionButton}`, callback_data: 'channel:check' }
            ],
            SUPPORTED_LANGUAGES.map((lang) => ({
                text: LANGUAGE_BUTTONS[lang],
                callback_data: `lang:${lang}`
            }))
        ]
    };
}

function getProductInlineKeyboard(language = 'uz') {
    const copy = getLanguageCopy(language);

    return {
        inline_keyboard: [[
            { text: copy.colorBlack, callback_data: `${PRODUCT_CALLBACK_PREFIX}prod1` },
            { text: copy.colorPink, callback_data: `${PRODUCT_CALLBACK_PREFIX}prod2` }
        ]]
    };
}

function buildProductShowcaseCaption(language = 'uz') {
    const copy = getLanguageCopy(language);

    return [
        `⌚ <b>${escapeHtml(copy.productTitle)}</b>`,
        `💵 ${escapeHtml(copy.priceLabel)}: <b>${escapeHtml(PRODUCT_PRICE_TEXT)}</b>`,
        `📦 ${escapeHtml(copy.noteLabel)}: ${escapeHtml(copy.deliveryNote)}`,
        '',
        ...copy.features.map((line) => `• ${escapeHtml(line)}`),
        '',
        escapeHtml(copy.prompt)
    ].join('\n');
}

function getAllLocalizedValues(fieldName) {
    return ['uz']
        .map((language) => getLanguageCopy(language)[fieldName])
        .filter(Boolean)
        .map((value) => cleanText(value, 120).toLowerCase());
}

function translateErrorTitle(title = '') {
    const normalizedTitle = String(title || '').trim();

    const titleMap = {
        'Unhandled Promise rejection': 'Promise ichida ushlanmagan xatolik',
        'Uncaught exception': 'Ushlanmagan dastur xatoligi',
        'Bot polling toʻxtab qoldi': 'Bot polling jarayoni toʻxtab qoldi',
        'getUpdates polling xatosi': 'getUpdates polling xatosi',
        'Telegram botni ishga tushirishda xatolik': 'Telegram botni ishga tushirishda xatolik',
        'Bot xabarini qayta ishlashda xatolik': 'Bot xabarini qayta ishlashda xatolik',
        'Admin javobini foydalanuvchiga yuborishda xatolik': 'Admin javobini foydalanuvchiga yuborishda xatolik'
    };

    return titleMap[normalizedTitle] || normalizedTitle || 'Nomaʼlum xatolik';
}

function translateTelegramErrorText(value = '') {
    const text = String(value || '').trim();

    if (!text) {
        return 'Nomaʼlum xatolik';
    }

    return text
        .replace(
            /Conflict: terminated by other getUpdates request; make sure that only one bot instance is running/gi,
            'Konflikt: boshqa `getUpdates` soʻrovi botni band qilgan. Faqat bitta bot nusxasi ishlayotganiga ishonch hosil qiling.'
        )
        .replace(
            /Forbidden: bot was blocked by the user/gi,
            'Taqiqlangan: foydalanuvchi botni bloklagan.'
        )
        .replace(
            /Forbidden: bot can't initiate conversation with a user/gi,
            'Taqiqlangan: bot foydalanuvchi bilan birinchi bo‘lib suhbat boshlay olmaydi.'
        )
        .replace(
            /Forbidden: bot is not a member of the channel chat/gi,
            'Taqiqlangan: bot kanal yoki guruh aʼzosi emas.'
        )
        .replace(
            /Unauthorized/gi,
            'Ruxsat yo‘q: Telegram bot token noto‘g‘ri yoki eskirgan.'
        )
        .replace(
            /Bad Request: chat not found/gi,
            'Notoʻgʻri soʻrov: chat topilmadi.'
        )
        .replace(
            /Bad Request: message thread not found/gi,
            'Notoʻgʻri soʻrov: mavzu bo‘limi topilmadi.'
        )
        .replace(
            /Bad Request: message to reply not found/gi,
            'Notoʻgʻri soʻrov: javob beriladigan xabar topilmadi.'
        )
        .replace(
            /Bad Request: message is not modified/gi,
            'Notoʻgʻri soʻrov: xabar o‘zgarmagan.'
        )
        .replace(
            /Too Many Requests: retry after (\d+)/gi,
            'Juda ko‘p so‘rov yuborildi. $1 soniyadan keyin qayta urinib ko‘ring.'
        )
        .replace(
            /ETELEGRAM: 429 Too Many Requests: retry after (\d+)/gi,
            'Juda ko‘p so‘rov yuborildi. $1 soniyadan keyin qayta urinib ko‘ring.'
        )
        .replace(
            /fetch failed/gi,
            'Tarmoq so‘rovi bajarilmadi.'
        )
        .replace(
            /The operation was aborted/gi,
            'So‘rov vaqti tugagani uchun to‘xtatildi.'
        )
        .replace(
            /timeout/gi,
            'vaqt tugashi'
        )
        .replace(
            /terminated by other getUpdates request/gi,
            'boshqa `getUpdates` so‘rovi tomonidan to‘xtatildi'
        );
}

function buildErrorMessage(title, error, meta = {}) {
    const normalizedTitle = translateErrorTitle(title);
    const readableMessage = translateTelegramErrorText(error?.message || String(error || 'Nomaʼlum xato'));
    const stack = cleanText(
        translateTelegramErrorText(error?.stack || error?.message || String(error || 'Nomaʼlum xato')),
        1600
    );
    const metaText = cleanText(JSON.stringify(meta), 1000);

    return [
        `🚨 <b>${escapeHtml(normalizedTitle)}</b>`,
        `⏰ ${escapeHtml(nowUzbekistan())}`,
        `⚠️ ${escapeHtml(readableMessage)}`,
        metaText ? `📎 ${escapeHtml(metaText)}` : '',
        stack ? `📚 <code>${escapeHtml(stack)}</code>` : ''
    ].filter(Boolean).join('\n');
}

function createError(message, code) {
    const error = new Error(message);
    error.code = code;
    return error;
}

function isPollingConflictError(error) {
    return String(error?.message || '').includes('terminated by other getUpdates request');
}

function isTransientNetworkError(error) {
    const message = String(error?.message || '').toLowerCase();
    const causeCode = String(error?.cause?.code || error?.code || '').toUpperCase();

    return (
        causeCode === 'TELEGRAM_NETWORK_ERROR' ||
        causeCode === 'UND_ERR_CONNECT_TIMEOUT' ||
        causeCode === 'ETIMEDOUT' ||
        causeCode === 'ECONNRESET' ||
        causeCode === 'EAI_AGAIN' ||
        causeCode === 'ENOTFOUND' ||
        message.includes('fetch failed') ||
        message.includes('timeout') ||
        message.includes('aborted')
    );
}

function isUnauthorizedError(error) {
    const message = String(error?.message || '').toLowerCase();
    return message.includes('unauthorized') || message.includes('token noto');
}

function normalizeTelegramError(method, error) {
    if (!error) {
        return createError(`${method} so‘rovida nomaʼlum xatolik yuz berdi.`, 'TELEGRAM_API_ERROR');
    }

    if (error.code && error.message) {
        return error;
    }

    if (isTransientNetworkError(error)) {
        return createError(
            `Telegram serveriga ulanishda vaqtinchalik muammo yuz berdi (${method}). Iltimos, keyinroq qayta urinib ko‘ring.`,
            'TELEGRAM_NETWORK_ERROR'
        );
    }

    return createError(
        translateTelegramErrorText(error.message || `${method} so‘rovida xatolik yuz berdi.`),
        'TELEGRAM_API_ERROR'
    );
}

class TelegramRuntime {
    constructor() {
        this.state = loadState();
        this.token = process.env.TELEGRAM_BOT_TOKEN || '';
        this.logGroupId = process.env.TELEGRAM_LOG_GROUP_ID || '';
        this.legacyOrderChatId = process.env.TELEGRAM_CHAT_ID || '';
        this.legacyOrderThreadId = process.env.TELEGRAM_THREAD_ID || '';
        this.envTopicIds = {
            start: process.env.TELEGRAM_TOPIC_START_ID || '',
            support: process.env.TELEGRAM_TOPIC_SUPPORT_ID || '',
            unanswered: process.env.TELEGRAM_TOPIC_UNANSWERED_ID || '194',
            orders: process.env.TELEGRAM_TOPIC_ORDERS_ID || '',
            error: process.env.TELEGRAM_TOPIC_ERROR_ID || ''
        };
        this.isInitialized = false;
        this.isPolling = false;
        this.processHandlersBound = false;
        this.botInfo = null;
        this.topicIds = {};
        this.initPromise = null;
        this.hasPollingLock = false;
        this.pollingLockHeartbeatTimer = null;
        this.pollingLockFile = path.join(GLOBAL_RUNTIME_DIR, 'telegram-poll.lock.json');
        this.subscriptionCache = new Map();
        this.fileBufferCache = new Map();
        this.recentUserActions = new Map();
        this.recentUiDispatches = new Map();
    }

    hasBotToken() {
        return hasRealConfigValue(this.token) && this.token.includes(':');
    }

    canUseForumTopics() {
        return this.hasBotToken() && hasRealConfigValue(this.logGroupId);
    }

    getApiUrl(method) {
        return `https://api.telegram.org/bot${this.token}/${method}`;
    }

    async apiCall(method, payload = {}, timeoutMs = 30000) {
        if (!this.token) {
            throw new Error('Telegram bot token topilmadi.');
        }

        const maxAttempts = 2;

        for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
            try {
                const response = await fetch(this.getApiUrl(method), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload),
                    signal: AbortSignal.timeout(timeoutMs)
                });

                const result = await response.json().catch(() => ({}));

                if (!response.ok || !result.ok) {
                    throw createError(
                        translateTelegramErrorText(result.description || `${method} soʻrovida xatolik yuz berdi.`),
                        'TELEGRAM_API_ERROR'
                    );
                }

                return result.result;
            } catch (error) {
                const normalizedError = normalizeTelegramError(method, error);

                if (attempt < maxAttempts && isTransientNetworkError(normalizedError)) {
                    await sleep(1200 * attempt);
                    continue;
                }

                throw normalizedError;
            }
        }

        throw createError(`${method} so‘rovida nomaʼlum xatolik yuz berdi.`, 'TELEGRAM_API_ERROR');
    }

    async apiMultipartCall(method, formData, timeoutMs = 60000) {
        if (!this.token) {
            throw new Error('Telegram bot token topilmadi.');
        }

        const maxAttempts = 2;

        for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
            try {
                const response = await fetch(this.getApiUrl(method), {
                    method: 'POST',
                    body: formData,
                    signal: AbortSignal.timeout(timeoutMs)
                });

                const result = await response.json().catch(() => ({}));

                if (!response.ok || !result.ok) {
                    throw createError(
                        translateTelegramErrorText(result.description || `${method} soʻrovida xatolik yuz berdi.`),
                        'TELEGRAM_API_ERROR'
                    );
                }

                return result.result;
            } catch (error) {
                const normalizedError = normalizeTelegramError(method, error);

                if (attempt < maxAttempts && isTransientNetworkError(normalizedError)) {
                    await sleep(1200 * attempt);
                    continue;
                }

                throw normalizedError;
            }
        }

        throw createError(`${method} so‘rovida nomaʼlum xatolik yuz berdi.`, 'TELEGRAM_API_ERROR');
    }

    async init() {
        if (this.isInitialized) {
            return this;
        }

        if (this.initPromise) {
            await this.initPromise;
            return this;
        }

        if (!this.hasBotToken()) {
            console.log('Telegram bot token topilmadi, bot qismi ishga tushirilmadi.');
            this.isInitialized = true;
            return this;
        }

        this.initPromise = (async () => {
            this.botInfo = await this.apiCall('getMe');
            await this.ensureTopics();
            this.bindProcessHandlers();
            this.startPolling();
            this.isInitialized = true;
            console.log(`Telegram bot tayyor: @${this.botInfo.username}`);
        })().catch(async (error) => {
            this.isInitialized = false;
            if (!isUnauthorizedError(error) && error?.code !== 'TELEGRAM_POLLING_LOCKED') {
                await this.reportErrorDirect('Telegram botni ishga tushirishda xatolik', error, {
                    stage: 'init'
                });
            }
            throw error;
        }).finally(() => {
            this.initPromise = null;
        });

        await this.initPromise;
        return this;
    }

    bindProcessHandlers() {
        if (this.processHandlersBound) {
            return;
        }

        this.processHandlersBound = true;

        process.on('unhandledRejection', async (error) => {
            await this.reportErrorDirect('Unhandled Promise rejection', error);
        });

        process.on('uncaughtException', async (error) => {
            await this.reportErrorDirect('Uncaught exception', error);
        });

        process.on('SIGINT', () => {
            this.stopPolling();
            this.releasePollingLock();
            process.exit(0);
        });

        process.on('SIGTERM', () => {
            this.stopPolling();
            this.releasePollingLock();
            process.exit(0);
        });

        process.on('exit', () => {
            this.stopPolling();
            this.releasePollingLock();
        });
    }

    getGroupStateKey() {
        return this.logGroupId ? toIdString(this.logGroupId) : '';
    }

    async ensureTopics() {
        if (!this.canUseForumTopics()) {
            return;
        }

        const groupKey = this.getGroupStateKey();
        const storedTopics = this.state.topicsByGroup[groupKey] || {};
        const resolvedTopics = {};

        for (const topicKey of TOPIC_KEYS) {
            resolvedTopics[topicKey] = Number(this.envTopicIds[topicKey] || storedTopics[topicKey] || 0) || 0;
        }

        for (const topicKey of TOPIC_KEYS) {
            if (resolvedTopics[topicKey]) {
                continue;
            }

            // Topic ID berilmagan bo‘lsa, bot o‘zi yaratib oladi.
            const createdTopic = await this.apiCall('createForumTopic', {
                chat_id: this.logGroupId,
                name: TOPIC_NAMES[topicKey],
                icon_color: TOPIC_COLORS[topicKey]
            });

            resolvedTopics[topicKey] = Number(createdTopic.message_thread_id);
        }

        this.state.topicsByGroup[groupKey] = resolvedTopics;
        this.topicIds = resolvedTopics;
        saveState(this.state);
    }

    async sendText(chatId, text, options = {}) {
        const payload = {
            chat_id: chatId,
            text,
            parse_mode: options.parseMode || 'HTML',
            disable_web_page_preview: true
        };

        if (options.threadId) {
            payload.message_thread_id = Number(options.threadId);
        }

        if (options.replyToMessageId) {
            payload.reply_parameters = {
                message_id: Number(options.replyToMessageId)
            };
        }

        if (options.replyMarkup) {
            payload.reply_markup = options.replyMarkup;
        }

        const sentMessage = await this.apiCall('sendMessage', payload);
        this.rememberArchivedMessage(chatId, {
            sender: 'bot',
            type: 'text',
            text: cleanText(text, 1000),
            messageId: sentMessage?.message_id || 0
        });
        return sentMessage;
    }

    readFileCached(filePath) {
        const cached = this.fileBufferCache.get(filePath);

        if (cached) {
            return cached;
        }

        const buffer = fs.readFileSync(filePath);
        this.fileBufferCache.set(filePath, buffer);
        return buffer;
    }

    async sendPhoto(chatId, filePath, options = {}) {
        if (!fs.existsSync(filePath)) {
            throw new Error(`Rasm fayli topilmadi: ${filePath}`);
        }

        const formData = new FormData();
        formData.append('chat_id', String(chatId));
        formData.append('photo', new Blob([this.readFileCached(filePath)]), path.basename(filePath));

        if (options.caption) {
            formData.append('caption', options.caption);
        }

        if (options.parseMode !== false) {
            formData.append('parse_mode', options.parseMode || 'HTML');
        }

        if (options.threadId) {
            formData.append('message_thread_id', String(Number(options.threadId)));
        }

        if (options.replyToMessageId) {
            formData.append('reply_parameters', JSON.stringify({
                message_id: Number(options.replyToMessageId)
            }));
        }

        if (options.replyMarkup) {
            formData.append('reply_markup', JSON.stringify(options.replyMarkup));
        }

        const sentMessage = await this.apiMultipartCall('sendPhoto', formData, 60000);
        this.rememberArchivedMessage(chatId, {
            sender: 'bot',
            type: 'photo',
            text: cleanText(options.caption || path.basename(filePath), 1000),
            messageId: sentMessage?.message_id || 0
        });
        return sentMessage;
    }

    async sendLocation(chatId, latitude, longitude, options = {}) {
        const payload = {
            chat_id: chatId,
            latitude: Number(latitude),
            longitude: Number(longitude)
        };

        if (options.threadId) {
            payload.message_thread_id = Number(options.threadId);
        }

        if (options.replyToMessageId) {
            payload.reply_parameters = {
                message_id: Number(options.replyToMessageId)
            };
        }

        const sentMessage = await this.apiCall('sendLocation', payload);
        this.rememberArchivedMessage(chatId, {
            sender: 'bot',
            type: 'location',
            text: `${Number(latitude)}, ${Number(longitude)}`,
            messageId: sentMessage?.message_id || 0
        });
        return sentMessage;
    }

    async sendMediaGroup(chatId, mediaItems, options = {}) {
        const formData = new FormData();
        const media = mediaItems.map((item, index) => {
            if (!fs.existsSync(item.filePath)) {
                throw new Error(`Rasm fayli topilmadi: ${item.filePath}`);
            }

            const fileKey = `media_${index}`;
            formData.append(fileKey, new Blob([this.readFileCached(item.filePath)]), path.basename(item.filePath));

            return {
                type: 'photo',
                media: `attach://${fileKey}`
            };
        });

        formData.append('chat_id', String(chatId));
        formData.append('media', JSON.stringify(media));

        if (options.threadId) {
            formData.append('message_thread_id', String(Number(options.threadId)));
        }

        return this.apiMultipartCall('sendMediaGroup', formData, 60000);
    }

    async copyMessage(targetChatId, sourceChatId, messageId, options = {}) {
        const payload = {
            chat_id: targetChatId,
            from_chat_id: sourceChatId,
            message_id: messageId
        };

        if (options.threadId) {
            payload.message_thread_id = Number(options.threadId);
        }

        if (options.replyToMessageId) {
            payload.reply_parameters = {
                message_id: Number(options.replyToMessageId)
            };
        }

        if (options.caption) {
            payload.caption = options.caption;
        }

        if (options.parseMode !== false) {
            payload.parse_mode = options.parseMode || 'HTML';
        }

        return this.apiCall('copyMessage', payload);
    }

    async sendTopicMessage(topicKey, text) {
        if (!this.canUseForumTopics()) {
            throw new Error('Forum group sozlamalari topilmadi.');
        }

        const threadId = this.topicIds[topicKey];

        if (!threadId) {
            throw new Error(`${topicKey} topic ID topilmadi.`);
        }

        return this.sendText(this.logGroupId, text, { threadId });
    }

    async sendTopicLocation(topicKey, location, options = {}) {
        if (!this.canUseForumTopics()) {
            throw new Error('Forum group sozlamalari topilmadi.');
        }

        const threadId = this.topicIds[topicKey];

        if (!threadId) {
            throw new Error(`${topicKey} topic ID topilmadi.`);
        }

        return this.sendLocation(this.logGroupId, location.latitude, location.longitude, {
            ...options,
            threadId
        });
    }

    async answerCallbackQuery(callbackQueryId, options = {}) {
        return this.apiCall('answerCallbackQuery', {
            callback_query_id: callbackQueryId,
            text: options.text || '',
            show_alert: Boolean(options.showAlert)
        });
    }

    async deleteMessage(chatId, messageId) {
        return this.apiCall('deleteMessage', {
            chat_id: chatId,
            message_id: Number(messageId)
        });
    }

    async editMessageCaption(chatId, messageId, caption, replyMarkup) {
        return this.apiCall('editMessageCaption', {
            chat_id: chatId,
            message_id: messageId,
            caption,
            parse_mode: 'HTML',
            reply_markup: replyMarkup
        });
    }

    async editMessageText(chatId, messageId, text, replyMarkup) {
        return this.apiCall('editMessageText', {
            chat_id: chatId,
            message_id: messageId,
            text,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: replyMarkup
        });
    }

    async getChatMember(chatId, userId) {
        return this.apiCall('getChatMember', {
            chat_id: chatId,
            user_id: Number(userId)
        });
    }

    async isUserSubscribedToRequiredChannelsCached(userId) {
        const key = toIdString(userId);
        const cached = this.subscriptionCache.get(key);
        const now = Date.now();

        if (cached && cached.expiresAt > now) {
            return cached.subscribed;
        }

        const subscribed = await this.isUserSubscribedToRequiredChannels(userId);
        this.subscriptionCache.set(key, { subscribed, expiresAt: now + SUBSCRIPTION_CACHE_TTL_MS });
        return subscribed;
    }

    setSubscriptionCache(userId, subscribed) {
        this.subscriptionCache.set(toIdString(userId), {
            subscribed: Boolean(subscribed),
            expiresAt: Date.now() + SUBSCRIPTION_CACHE_TTL_MS
        });
    }

    async isUserSubscribedToRequiredChannels(userId) {
        for (const channel of REQUIRED_CHANNELS) {
            try {
                const member = await this.getChatMember(channel.username, userId);

                if (!['creator', 'administrator', 'member'].includes(member?.status)) {
                    return false;
                }
            } catch (error) {
                const message = String(error?.message || '').toLowerCase();

                if (message.includes('member list is inaccessible')) {
                    throw createError(
                        `${channel.username} kanalida a’zolar ro‘yxati yopiq yoki botda ruxsat yo‘q.`,
                        'TELEGRAM_CHANNEL_MEMBER_LIST_INACCESSIBLE'
                    );
                }

                if (
                    message.includes('user not found') ||
                    message.includes('chat not found') ||
                    message.includes('participant_id_invalid')
                ) {
                    return false;
                }

                throw error;
            }
        }

        return true;
    }

    async sendMainMenu(chatId, user = {}) {
        if (this.getOrderSession(user.id) || this.isInSupportSession(user.id)) {
            return null;
        }

        if (this.isDuplicateUiDispatch(chatId, 'main-menu')) {
            return null;
        }

        const language = this.getUserLanguage(user.id);
        const copy = getLanguageCopy(language);

        await this.sendInlineFlowText(chatId, [
            `${escapeHtml(copy.greeting)}, <b>${escapeHtml(getFullName(user))}</b>!`,
            '',
            escapeHtml(copy.welcome),
            escapeHtml(copy.supportPrompt)
        ].join('\n'), getMainMenuReplyMarkup(language));
    }

    async ensureSubscriptionOrPrompt(chatId, user = {}, pendingAction = 'menu') {
        const language = this.getUserLanguage(user.id);
        const copy = getLanguageCopy(language);

        try {
            if (await this.isUserSubscribedToRequiredChannelsCached(user.id)) {
                this.setPendingAction(user.id, pendingAction);
                return true;
            }
        } catch (error) {
            if (error?.code === 'TELEGRAM_CHANNEL_MEMBER_LIST_INACCESSIBLE') {
                await this.sendInlineFlowText(chatId, copy.channelAccessError, getSubscriptionInlineKeyboard(language));
                return false;
            }

            throw error;
        }

        this.clearOrderSession(user.id);
        this.setSupportSession(user.id, false);
        this.setPendingAction(user.id, pendingAction);
        await this.sendInlineFlowText(chatId, [
            escapeHtml(copy.joinChannelPrompt),
        ].join('\n'), getSubscriptionInlineKeyboard(language));
        return false;
    }

    async sendProductShowcase(chatId, user = {}) {
        const language = this.getUserLanguage(user.id);

        await this.sendFlowPhoto(chatId, PRODUCT_SHOWCASE_IMAGE, {
            caption: buildProductShowcaseCaption(language),
            replyMarkup: getProductInlineKeyboard(language)
        });
    }

    async sendPaymentInstructions(chatId, user = {}) {
        const language = this.getUserLanguage(user.id);

        await this.sendInlineFlowPhoto(
            chatId,
            PAYMENT_IMAGE,
            getPaymentCaption(language),
            getPaymentInlineKeyboard(language)
        );
    }

    async remindOrderStep(chatId, user = {}) {
        const session = this.getOrderSession(user.id);

        if (!session) {
            return false;
        }

        const language = this.getUserLanguage(user.id);
        const copy = getLanguageCopy(language);

        if (session.step === 'phone') {
            await this.sendFlowText(chatId, [
                copy.phonePrompt,
                copy.phoneExample
            ].join('\n\n'), {
                replyMarkup: getPhoneReplyMarkup(language)
            });
            return true;
        }

        if (session.step === 'fullName') {
            await this.sendFlowText(chatId, copy.fullNamePrompt, {
                replyMarkup: getInputReplyMarkup()
            });
            return true;
        }

        if (session.step === 'address') {
            await this.sendFlowText(chatId, copy.addressPrompt, {
                replyMarkup: getAddressReplyMarkup(language)
            });
            return true;
        }

        return false;
    }

    async continuePendingAction(chatId, user = {}) {
        const pendingPayload = this.getPendingStartPayload(user.id);
        const pendingAction = this.getPendingAction(user.id) || (pendingPayload ? 'buy' : 'menu');

        this.setPendingStartPayload(user.id, '');
        this.setPendingAction(user.id, '');

        if (pendingPayload === 'buy_prod1') {
            await this.startOrderFlow(chatId, user, 'prod1');
            return;
        }

        if (pendingPayload === 'buy_prod2') {
            await this.startOrderFlow(chatId, user, 'prod2');
            return;
        }

        if (pendingPayload === 'buy' || pendingAction === 'buy') {
            await this.startOrderFlow(chatId, user);
            return;
        }

        if (pendingAction === 'support') {
            if (!this.canUseForumTopics() || !this.topicIds.support) {
                await this.sendMainMenu(chatId, user);
                return;
            }

            this.clearOrderSession(user.id);
            this.setSupportSession(user.id, true);
            await this.sendFlowText(chatId, [
                `Support rejimi yoqildi.`,
                `Endi matn, rasm, video, audio, fayl yoki ovozli xabar yuborishingiz mumkin.`,
                `Tugatish uchun /cancel ni bosing.`
            ].join('\n'), {
                replyMarkup: getInputReplyMarkup()
            });
            return;
        }

        await this.sendMainMenu(chatId, user);
    }

    async sendWebsiteOrder(order, extra = {}) {
        const orderText = buildOrderLog(order, extra);

        if (this.canUseForumTopics() && this.topicIds.orders) {
            const sentMessage = await this.sendTopicMessage('orders', orderText);

            if (order.location?.latitude && order.location?.longitude) {
                await this.sendTopicLocation('orders', order.location, {
                    replyToMessageId: sentMessage?.message_id
                });
            }

            return sentMessage;
        }

        if (this.token && this.legacyOrderChatId) {
            const sentMessage = await this.sendText(
                this.legacyOrderChatId,
                orderText,
                { threadId: this.legacyOrderThreadId || undefined }
            );

            if (order.location?.latitude && order.location?.longitude) {
                await this.sendLocation(
                    this.legacyOrderChatId,
                    order.location.latitude,
                    order.location.longitude,
                    {
                        threadId: this.legacyOrderThreadId || undefined,
                        replyToMessageId: sentMessage?.message_id
                    }
                );
            }

            return sentMessage;
        }

        throw createError('Buyurtmalar uchun Telegram chat yoki forum topic sozlanmagan.', 'TELEGRAM_ORDER_TARGET_MISSING');
    }

    async reportErrorDirect(title, error, meta = {}) {
        console.error(`${translateErrorTitle(title)}: ${error?.message || error}`);

        if (!this.hasBotToken()) {
            return;
        }

        try {
            if (this.canUseForumTopics() && this.topicIds.error) {
                await this.sendTopicMessage('error', buildErrorMessage(title, error, meta));
            } else if (this.legacyOrderChatId) {
                await this.sendText(this.legacyOrderChatId, buildErrorMessage(title, error, meta), {
                    threadId: this.legacyOrderThreadId || undefined
                });
            }
        } catch (reportingError) {
            console.error('Error topicga yozishda ham xatolik:', reportingError);
        }
    }

    async reportError(title, error, meta = {}) {
        return this.reportErrorDirect(title, error, meta);
    }

    isProcessAlive(pid) {
        if (!pid || Number(pid) <= 0) {
            return false;
        }

        try {
            process.kill(Number(pid), 0);
            return true;
        } catch {
            return false;
        }
    }

    isPollingLockFresh(lockData) {
        if (!lockData?.pid) {
            return false;
        }

        const heartbeatAt = parseTimestampMs(lockData.heartbeatAt || lockData.acquiredAt);

        if (!heartbeatAt) {
            return false;
        }

        return Date.now() - heartbeatAt <= POLLING_LOCK_STALE_MS;
    }

    startPollingLockHeartbeat() {
        if (this.pollingLockHeartbeatTimer || !this.hasPollingLock) {
            return;
        }

        this.pollingLockHeartbeatTimer = setInterval(() => {
            try {
                const currentLock = readJsonFile(this.pollingLockFile);

                if (!currentLock || Number(currentLock.pid) !== process.pid) {
                    return;
                }

                writeJsonFile(this.pollingLockFile, {
                    ...currentLock,
                    pid: process.pid,
                    heartbeatAt: new Date().toISOString()
                });
            } catch (error) {
                console.error('Polling lock heartbeat yozishda xatolik:', error?.message || error);
            }
        }, POLLING_LOCK_HEARTBEAT_MS);

        if (typeof this.pollingLockHeartbeatTimer.unref === 'function') {
            this.pollingLockHeartbeatTimer.unref();
        }
    }

    stopPollingLockHeartbeat() {
        if (!this.pollingLockHeartbeatTimer) {
            return;
        }

        clearInterval(this.pollingLockHeartbeatTimer);
        this.pollingLockHeartbeatTimer = null;
    }

    acquirePollingLock() {
        const currentLock = readJsonFile(this.pollingLockFile);

        if (
            currentLock?.pid &&
            Number(currentLock.pid) !== process.pid &&
            this.isProcessAlive(currentLock.pid) &&
            this.isPollingLockFresh(currentLock)
        ) {
            return false;
        }

        writeJsonFile(this.pollingLockFile, {
            pid: process.pid,
            acquiredAt: new Date().toISOString(),
            heartbeatAt: new Date().toISOString()
        });

        this.hasPollingLock = true;
        this.startPollingLockHeartbeat();
        return true;
    }

    getPollingLockOwner() {
        const currentLock = readJsonFile(this.pollingLockFile);

        if (
            currentLock?.pid &&
            Number(currentLock.pid) !== process.pid &&
            this.isProcessAlive(currentLock.pid) &&
            this.isPollingLockFresh(currentLock)
        ) {
            return currentLock;
        }

        return null;
    }

    releasePollingLock() {
        this.stopPollingLockHeartbeat();

        if (!this.hasPollingLock) {
            return;
        }

        const currentLock = readJsonFile(this.pollingLockFile);

        if (currentLock?.pid === process.pid && fs.existsSync(this.pollingLockFile)) {
            fs.unlinkSync(this.pollingLockFile);
        }

        this.hasPollingLock = false;
    }

    startPolling() {
        if (this.isPolling || !this.hasBotToken()) {
            return true;
        }

        if (!this.acquirePollingLock()) {
            const owner = this.getPollingLockOwner();
            throw createError(
                `Telegram polling boshqa process tomonidan band${owner?.pid ? ` (PID: ${owner.pid})` : ''}. Avval eski bot processini to‘xtating.`,
                'TELEGRAM_POLLING_LOCKED'
            );
        }

        this.isPolling = true;
        this.pollLoop().catch(async (error) => {
            this.isPolling = false;
            this.releasePollingLock();
            await this.reportError('Bot polling toʻxtab qoldi', error);
        });
        return true;
    }

    stopPolling() {
        this.isPolling = false;
        this.releasePollingLock();
    }

    async pollLoop() {
        let offset = Number(this.state.lastUpdateId || 0) + 1;

        while (this.isPolling) {
            try {
                const updates = await this.apiCall('getUpdates', {
                    offset,
                    timeout: 30,
                    allowed_updates: ['message', 'callback_query']
                }, 40000);

                for (const update of updates) {
                    offset = update.update_id + 1;

                    if (update.message) {
                        await this.handleMessage(update.message);
                    }

                    if (update.callback_query) {
                        await this.handleCallbackQuery(update.callback_query);
                    }

                    this.state.lastUpdateId = update.update_id;
                    saveState(this.state);
                }
            } catch (error) {
                if (isPollingConflictError(error)) {
                    this.isPolling = false;
                    this.releasePollingLock();
                    console.warn('Telegram polling conflict aniqlandi. Bu instance pollingni to‘xtatdi.');
                    break;
                }

                if (isTransientNetworkError(error)) {
                    console.warn(`Telegram polling vaqtincha ulanmay qoldi: ${error.message}`);
                    await sleep(5000);
                    continue;
                }

                await this.reportError('getUpdates polling xatosi', error);
                await sleep(5000);
            }
        }
    }

    isPrivateMessage(message) {
        return message?.chat?.type === 'private';
    }

    isSupportTopicMessage(message) {
        return (
            this.canUseForumTopics() &&
            toIdString(message?.chat?.id) === toIdString(this.logGroupId) &&
            [Number(this.topicIds.support || 0), Number(this.topicIds.unanswered || 0)].includes(
                Number(message?.message_thread_id || 0)
            )
        );
    }

    isTextMatch(message, variants) {
        const text = cleanText(message?.text || '', 120).toLowerCase();
        return variants.includes(text);
    }

    isCommand(message, commandNames) {
        const text = cleanText(message?.text || '', 120).toLowerCase();
        return commandNames.some((command) => text === `/${command}` || text.startsWith(`/${command}@`));
    }

    getUserCount() {
        return Object.keys(this.state.startedUsers).length;
    }

    getUserLanguage(userId, fallbackLanguage = 'uz') {
        const storedLanguage = this.state.userLanguages[toIdString(userId)];
        return normalizeLanguage(storedLanguage || fallbackLanguage);
    }

    setUserLanguage(userId, language) {
        this.state.userLanguages[toIdString(userId)] = normalizeLanguage(language);
        saveState(this.state);
    }

    getPendingStartPayload(userId) {
        return cleanText(this.state.pendingStartPayloads[toIdString(userId)] || '', 120).toLowerCase();
    }

    setPendingStartPayload(userId, payload = '') {
        const key = toIdString(userId);
        const normalizedPayload = cleanText(payload, 120).toLowerCase();

        if (normalizedPayload) {
            this.state.pendingStartPayloads[key] = normalizedPayload;
        } else {
            delete this.state.pendingStartPayloads[key];
        }

        saveState(this.state);
    }

    getPendingAction(userId) {
        return cleanText(this.state.pendingActions[toIdString(userId)] || '', 120).toLowerCase();
    }

    setPendingAction(userId, action = '') {
        const key = toIdString(userId);
        const normalizedAction = cleanText(action, 120).toLowerCase();

        if (normalizedAction) {
            this.state.pendingActions[key] = normalizedAction;
        } else {
            delete this.state.pendingActions[key];
        }

        saveState(this.state);
    }

    async sendFlowText(chatId, text, options = {}) {
        return this.sendText(chatId, text, options);
    }

    async sendFlowPhoto(chatId, filePath, options = {}) {
        return this.sendPhoto(chatId, filePath, options);
    }

    async sendInlineFlowText(chatId, text, inlineMarkup, options = {}) {
        return this.sendText(chatId, text, {
            ...options,
            replyMarkup: inlineMarkup
        });
    }

    async sendInlineFlowPhoto(chatId, filePath, caption, inlineMarkup, options = {}) {
        return this.sendPhoto(chatId, filePath, {
            ...options,
            caption,
            replyMarkup: inlineMarkup
        });
    }

    resetActiveFlows(userId) {
        this.clearOrderSession(userId);
        this.setSupportSession(userId, false);
        this.setPendingAction(userId, '');
    }

    getOrderSession(userId) {
        return this.state.orderSessions[toIdString(userId)] || null;
    }

    setOrderSession(userId, session) {
        this.state.orderSessions[toIdString(userId)] = session;
        saveState(this.state);
    }

    clearOrderSession(userId) {
        delete this.state.orderSessions[toIdString(userId)];
        saveState(this.state);
    }

    isInSupportSession(userId) {
        return Boolean(this.state.supportSessions[toIdString(userId)]);
    }

    setSupportSession(userId, isActive) {
        const key = toIdString(userId);

        if (isActive) {
            this.state.supportSessions[key] = true;
        } else {
            delete this.state.supportSessions[key];
        }

        saveState(this.state);
    }

    isDuplicateUserAction(userId, actionKey, ttlMs = 4000) {
        const key = `${toIdString(userId)}:${actionKey}`;
        const now = Date.now();
        const lastSeenAt = this.recentUserActions.get(key) || 0;

        if (lastSeenAt && now - lastSeenAt < ttlMs) {
            return true;
        }

        this.recentUserActions.set(key, now);
        return false;
    }

    isDuplicateUiDispatch(chatId, dispatchKey, ttlMs = 2500) {
        const key = `${toIdString(chatId)}:${dispatchKey}`;
        const now = Date.now();
        const lastSentAt = this.recentUiDispatches.get(key) || 0;

        if (lastSentAt && now - lastSentAt < ttlMs) {
            return true;
        }

        this.recentUiDispatches.set(key, now);
        return false;
    }

    rememberArchivedMessage(chatId, payload = {}) {
        const chatKey = toIdString(chatId);

        if (chatKey.startsWith('-')) {
            return;
        }

        const history = Array.isArray(this.state.messageArchiveByChat[chatKey])
            ? this.state.messageArchiveByChat[chatKey]
            : [];

        history.push({
            at: new Date().toISOString(),
            ...payload
        });

        this.state.messageArchiveByChat[chatKey] = history.slice(-300);
        saveState(this.state);
    }

    rememberSupportMessage(messageId, mapping = {}) {
        const normalizedMapping = {
            ...mapping,
            userId: toIdString(mapping.userId || '')
        };

        this.state.supportMessageMap[toIdString(messageId)] = {
            ...normalizedMapping,
            createdAt: normalizedMapping.createdAt || Date.now()
        };

        const entries = Object.entries(this.state.supportMessageMap);

        if (entries.length > 2000) {
            entries
                .sort((a, b) => a[1].createdAt - b[1].createdAt)
                .slice(0, entries.length - 1200)
                .forEach(([messageKey]) => {
                    delete this.state.supportMessageMap[messageKey];
                });
        }

        saveState(this.state);
    }

    async handleMessage(message) {
        try {
            if (this.isPrivateMessage(message)) {
                await this.handlePrivateMessage(message);
                return;
            }

            if (this.isSupportTopicMessage(message)) {
                await this.handleSupportTopicReply(message);
            }
        } catch (error) {
            await this.reportError('Bot xabarini qayta ishlashda xatolik', error, {
                chatId: message?.chat?.id,
                messageId: message?.message_id
            });
        }
    }

    async handleCallbackQuery(callbackQuery) {
        const callbackData = cleanText(callbackQuery?.data || '', 120);

        if (callbackData.startsWith('lang:')) {
            const selectedLanguage = normalizeLanguage(callbackData.slice('lang:'.length));
            const userId = callbackQuery.from?.id;
            const chatId = callbackQuery.message?.chat?.id;
            const messageId = callbackQuery.message?.message_id;

            this.setUserLanguage(userId, selectedLanguage);

            await this.answerCallbackQuery(callbackQuery.id, {
                text: LANGUAGE_BUTTONS[selectedLanguage] || 'OK'
            });

            if (!chatId || !messageId) {
                return;
            }

            const copy = getLanguageCopy(selectedLanguage);

            try {
                if (await this.isUserSubscribedToRequiredChannelsCached(userId)) {
                    await this.editMessageText(chatId, messageId, [
                        `${escapeHtml(copy.greeting)}, <b>${escapeHtml(getFullName(callbackQuery.from || {}))}</b>!`,
                        '',
                        escapeHtml(copy.welcome),
                        escapeHtml(copy.supportPrompt)
                    ].join('\n'), getMainMenuReplyMarkup(selectedLanguage));
                } else {
                    await this.editMessageText(
                        chatId,
                        messageId,
                        escapeHtml(copy.joinChannelPrompt),
                        getSubscriptionInlineKeyboard(selectedLanguage)
                    );
                }
            } catch (error) {
                if (!String(error?.message || '').includes('zgarmagan')) {
                    await this.reportError('Til almashtirishda xatolik', error, {
                        callbackQueryId: callbackQuery?.id
                    });
                }
            }
            return;
        }

        if (callbackData === 'menu:buy' || callbackData === 'menu:support') {
            const pendingAction = callbackData === 'menu:buy' ? 'buy' : 'support';

            await this.answerCallbackQuery(callbackQuery.id);

            if (!callbackQuery.message?.chat?.id) {
                return;
            }

            if (!await this.ensureSubscriptionOrPrompt(callbackQuery.message.chat.id, callbackQuery.from || {}, pendingAction)) {
                return;
            }

            if (pendingAction === 'buy') {
                await this.startOrderFlow(callbackQuery.message.chat.id, callbackQuery.from || {});
                return;
            }

            if (!this.canUseForumTopics() || !this.topicIds.support) {
                await this.sendInlineFlowText(callbackQuery.message.chat.id, [
                    `Support bo‘limi hozircha sozlanmagan.`,
                    `Iltimos, keyinroq qayta urinib ko‘ring.`
                ].join('\n'), getMainMenuReplyMarkup(this.getUserLanguage(callbackQuery.from?.id)));
                return;
            }

            this.resetActiveFlows(callbackQuery.from?.id);
            this.setSupportSession(callbackQuery.from?.id, true);
            this.setPendingAction(callbackQuery.from?.id, 'support');

            await this.sendFlowText(callbackQuery.message.chat.id, [
                `Support rejimi yoqildi.`,
                `Endi matn, rasm, video, audio, fayl yoki ovozli xabar yuborishingiz mumkin.`,
                `Tugatish uchun /cancel ni bosing.`
            ].join('\n'), {
                replyMarkup: getInputReplyMarkup()
            });
            return;
        }

        if (callbackData === 'payment:done') {
            const language = this.getUserLanguage(callbackQuery.from?.id);
            const copy = getLanguageCopy(language);

            await this.answerCallbackQuery(callbackQuery.id);

            if (!callbackQuery.message?.chat?.id) {
                return;
            }

            this.resetActiveFlows(callbackQuery.from?.id);
            this.setSupportSession(callbackQuery.from?.id, true);
            this.setPendingAction(callbackQuery.from?.id, 'payment-proof');

            await this.sendFlowText(callbackQuery.message.chat.id, copy.paymentProofPrompt, {
                replyMarkup: getInputReplyMarkup()
            });
            return;
        }

        if (callbackData === 'channel:check') {
            const language = this.getUserLanguage(callbackQuery.from?.id);
            const copy = getLanguageCopy(language);

            try {
                const isSubscribed = await this.isUserSubscribedToRequiredChannels(callbackQuery.from?.id);

                if (!isSubscribed) {
                    this.setSubscriptionCache(callbackQuery.from?.id, false);
                    await this.answerCallbackQuery(callbackQuery.id, {
                        text: copy.subscriptionRequired,
                        showAlert: true
                    });
                    return;
                }

                this.setSubscriptionCache(callbackQuery.from?.id, true);

            await this.answerCallbackQuery(callbackQuery.id, {
                text: copy.subscriptionConfirmed
            });

                if (callbackQuery.message?.chat?.id) {
                    await this.continuePendingAction(callbackQuery.message.chat.id, callbackQuery.from || {});
                }
            } catch (error) {
                if (error?.code === 'TELEGRAM_CHANNEL_MEMBER_LIST_INACCESSIBLE') {
                    await this.answerCallbackQuery(callbackQuery.id, {
                        text: copy.channelAccessError,
                        showAlert: true
                    });
                    return;
                }

                await this.reportError('Bot xabarini qayta ishlashda xatolik', error, {
                    callbackQueryId: callbackQuery?.id,
                    checkType: 'channel-subscription'
                });
            }
            return;
        }

        if (!callbackData.startsWith(PRODUCT_CALLBACK_PREFIX)) {
            await this.answerCallbackQuery(callbackQuery.id);
            return;
        }

        const productKey = callbackData.slice(PRODUCT_CALLBACK_PREFIX.length);
        const language = this.getUserLanguage(callbackQuery.from?.id);
        const copy = getLanguageCopy(language);

        if (!PRODUCT_CATALOG[productKey]) {
            await this.answerCallbackQuery(callbackQuery.id, {
                text: copy.notFound,
                showAlert: true
            });
            return;
        }

        try {
            const isSubscribed = await this.isUserSubscribedToRequiredChannelsCached(callbackQuery.from?.id);

            if (!isSubscribed) {
                this.setPendingStartPayload(callbackQuery.from?.id, `buy_${productKey}`);
                this.setPendingAction(callbackQuery.from?.id, 'buy');
                await this.answerCallbackQuery(callbackQuery.id, {
                    text: copy.subscriptionRequired,
                    showAlert: true
                });

                if (callbackQuery.message?.chat?.id) {
                    await this.ensureSubscriptionOrPrompt(callbackQuery.message.chat.id, callbackQuery.from || {}, 'buy');
                }
                return;
            }

            await this.answerCallbackQuery(callbackQuery.id, {
                text: copy.callbackAccepted
            });

            if (!callbackQuery.message?.chat?.id) {
                return;
            }

            await this.startOrderFlow(
                callbackQuery.message?.chat?.id,
                callbackQuery.from || {},
                productKey
            );
        } catch (error) {
            if (error?.code === 'TELEGRAM_CHANNEL_MEMBER_LIST_INACCESSIBLE') {
                await this.answerCallbackQuery(callbackQuery.id, {
                    text: copy.channelAccessError,
                    showAlert: true
                });
                return;
            }

            await this.reportError('Bot xabarini qayta ishlashda xatolik', error, {
                callbackQueryId: callbackQuery?.id,
                productKey
            });
        }
    }

    async startOrderFlow(chatId, user, productKey = '') {
        const resolvedProductKey = getProductLabel(productKey) !== 'Tanlanmagan' ? productKey : '';
        const language = this.getUserLanguage(user.id);
        const copy = getLanguageCopy(language);

        this.resetActiveFlows(user.id);

        if (!resolvedProductKey) {
            await this.sendProductShowcase(chatId, user);
            return;
        }

        this.setOrderSession(user.id, {
            step: 'phone',
            order: {
                product: resolvedProductKey,
                productLabel: getProductLabel(resolvedProductKey)
            }
        });

        await this.sendFlowText(chatId, [
            `Tanlandi: <b>${escapeHtml(getProductLabel(resolvedProductKey))}</b>`,
            `💵 ${escapeHtml(copy.priceLabel)}: <b>${escapeHtml(PRODUCT_PRICE_TEXT)}</b>`,
            `📦 ${escapeHtml(copy.noteLabel)}: ${escapeHtml(copy.deliveryNote)}`,
            '',
            copy.phonePrompt,
            copy.phoneExample
        ].join('\n'), {
            replyMarkup: getPhoneReplyMarkup(language)
        });
    }

    async continueOrderFlow(message) {
        const user = message.from || {};
        const session = this.getOrderSession(user.id);
        const language = this.getUserLanguage(user.id);
        const copy = getLanguageCopy(language);

        if (!session) {
            return false;
        }

        const chatId = message.chat.id;
        const text = cleanText(message.text || message.caption || '', 500);
        const contact = message.contact || null;
        const location = message.location || message.venue?.location || null;
        const venue = message.venue || null;
        const removeUserReply = async () => {};

        if (session.step === 'address' && location) {
            const venueAddress = cleanText([venue?.title, venue?.address].filter(Boolean).join(', '), 180);

            session.order.address = venueAddress || copy.locationSaved;
            session.order.city = venueAddress || copy.locationSaved;
            session.order.location = {
                latitude: Number(location.latitude),
                longitude: Number(location.longitude)
            };
            session.order.message = '';

            await this.sendWebsiteOrder(session.order, {
                source: 'Telegram bot',
                telegramUserId: user.id,
                telegramUsername: getUsername(user)
            });

            this.clearOrderSession(user.id);
            await removeUserReply();
            await this.sendPaymentInstructions(chatId, user);
            return true;
        }

        if (!text) {
            if (contact && session.step === 'phone') {
                const normalizedContactPhone = normalizePhone(contact.phone_number || '');

                if (!isValidPhone(normalizedContactPhone)) {
                    await removeUserReply();
                    await this.sendFlowText(
                        chatId,
                        [copy.phonePrompt, copy.phoneExample, copy.invalidPhonePrompt].join('\n\n'),
                        {
                            replyMarkup: getPhoneReplyMarkup(language)
                        }
                    );
                    return true;
                }

                session.step = 'fullName';
                session.order.phone = normalizedContactPhone;
                this.setOrderSession(user.id, session);
                await removeUserReply();
                await this.sendFlowText(chatId, copy.fullNamePrompt, {
                    replyMarkup: getInputReplyMarkup()
                });
                return true;
            }

            await removeUserReply();
            await this.sendFlowText(chatId, session.step === 'address'
                ? copy.addressPrompt
                : 'Buyurtma davom etishi uchun matn ko‘rinishida javob yuboring.', {
                replyMarkup: session.step === 'address'
                    ? getAddressReplyMarkup(language)
                    : session.step === 'phone'
                        ? getPhoneReplyMarkup(language)
                        : getInputReplyMarkup()
            });
            return true;
        }

        if (session.step === 'phone') {
            const normalizedPhone = normalizePhone(text);

            if (!isValidPhone(normalizedPhone)) {
                await removeUserReply();
                await this.sendFlowText(chatId, [
                    copy.phonePrompt,
                    copy.phoneExample,
                    copy.invalidPhonePrompt
                ].join('\n\n'), {
                    replyMarkup: getPhoneReplyMarkup(language)
                });
                return true;
            }

            session.step = 'fullName';
            session.order.phone = normalizedPhone;
            this.setOrderSession(user.id, session);
            await removeUserReply();
            await this.sendFlowText(chatId, copy.fullNamePrompt, {
                replyMarkup: getInputReplyMarkup()
            });
            return true;
        }

        if (session.step === 'fullName') {
            if (!isValidFullName(text)) {
                await removeUserReply();
                await this.sendFlowText(chatId, copy.invalidFullNamePrompt, {
                    replyMarkup: getInputReplyMarkup()
                });
                return true;
            }

            session.step = 'address';
            session.order.fullName = text;
            this.setOrderSession(user.id, session);
            await removeUserReply();
            await this.sendFlowText(chatId, copy.addressPrompt, {
                replyMarkup: getAddressReplyMarkup(language)
            });
            return true;
        }

        if (session.step === 'address') {
            if (!isValidAddress(text)) {
                await removeUserReply();
                await this.sendFlowText(chatId, `${copy.addressPrompt}\n\n${copy.invalidAddressPrompt}`, {
                    replyMarkup: getAddressReplyMarkup(language)
                });
                return true;
            }

            session.order.address = text;
            session.order.city = text;
            session.order.location = null;
            session.order.message = '';

            await this.sendWebsiteOrder(session.order, {
                source: 'Telegram bot',
                telegramUserId: user.id,
                telegramUsername: getUsername(user)
            });

            this.clearOrderSession(user.id);
            await removeUserReply();
            await this.sendPaymentInstructions(chatId, user);
            return true;
        }

        return false;
    }

    async handlePrivateMessage(message) {
        const user = message.from || {};
        const userId = toIdString(user.id);
        const startPayload = getStartPayload(message);

        this.rememberArchivedMessage(message.chat.id, {
            sender: 'user',
            type: getMessageTypeLabel(message).toLowerCase(),
            text: cleanText(message.text || message.caption || message.contact?.phone_number || message.venue?.address || '', 1000),
            messageId: message.message_id || 0
        });

        if (this.isCommand(message, ['start'])) {
            if (this.isDuplicateUserAction(user.id, 'start')) {
                return;
            }

            this.setUserLanguage(user.id, 'uz');
            this.state.startedUsers[userId] = {
                id: user.id,
                firstName: user.first_name || '',
                lastName: user.last_name || '',
                username: user.username || '',
                languageCode: user.language_code || '',
                lastStartedAt: new Date().toISOString()
            };

            saveState(this.state);

            if (this.canUseForumTopics() && this.topicIds.start) {
                await this.sendTopicMessage('start', buildStartLog(user, this.getUserCount()));
            }

            this.setPendingStartPayload(user.id, startPayload);
            const pendingAction = 'buy';
            this.setPendingAction(user.id, pendingAction);

            if (await this.ensureSubscriptionOrPrompt(message.chat.id, user, pendingAction)) {
                await this.continuePendingAction(message.chat.id, user);
            }
            return;
        }

        if (await this.continueOrderFlow(message)) {
            return;
        }

        if (this.getOrderSession(user.id)) {
            await this.remindOrderStep(message.chat.id, user);
            return;
        }

        if (this.isInSupportSession(user.id)) {
            await this.forwardSupportMessage(message);
            return;
        }

        const buyTextMatches = ['buyurtma', 'buyurtma berish', 'zakaz', 'order', 'buy', ...getAllLocalizedValues('menuOrder')];
        const supportTextMatches = ['admin', 'help', 'halp', 'support', 'yordam', ...getAllLocalizedValues('menuSupport')];

        if (
            this.isCommand(message, ['buy']) ||
            this.isTextMatch(message, buyTextMatches)
        ) {
            if (!await this.ensureSubscriptionOrPrompt(message.chat.id, user, 'buy')) {
                return;
            }

            await this.startOrderFlow(message.chat.id, user);
            return;
        }

        const hasActiveFlow = Boolean(this.getOrderSession(user.id)) || this.isInSupportSession(user.id);

        if (!hasActiveFlow && !await this.ensureSubscriptionOrPrompt(message.chat.id, user, 'menu')) {
            return;
        }

        const directProductKey = resolveProductKey(message.text || '');

        if (directProductKey) {
            await this.startOrderFlow(message.chat.id, user, directProductKey);
            return;
        }

        if (
            this.isCommand(message, ['admin', 'help', 'halp']) ||
            this.isTextMatch(message, supportTextMatches)
        ) {
            if (!this.canUseForumTopics() || !this.topicIds.support) {
                await this.sendInlineFlowText(message.chat.id, [
                    `Support bo‘limi hozircha sozlanmagan.`,
                    `Iltimos, keyinroq qayta urinib ko‘ring.`
                ].join('\n'), getMainMenuReplyMarkup(this.getUserLanguage(user.id)));
                return;
            }

            this.resetActiveFlows(user.id);
            this.setSupportSession(user.id, true);
            this.setPendingAction(user.id, 'support');

            await this.sendFlowText(message.chat.id, [
                `Support rejimi yoqildi.`,
                `Endi matn, rasm, video, audio, fayl yoki ovozli xabar yuborishingiz mumkin.`,
                `Tugatish uchun /cancel ni bosing.`
            ].join('\n'), {
                replyMarkup: getInputReplyMarkup()
            });
            return;
        }

        if (this.isCommand(message, ['cancel'])) {
            this.resetActiveFlows(user.id);
            await this.sendInlineFlowText(
                message.chat.id,
                'Faol support yoki buyurtma rejimi bekor qilindi.',
                getMainMenuReplyMarkup(this.getUserLanguage(user.id))
            );
            return;
        }

        await this.sendMainMenu(message.chat.id, user);
    }

    async forwardSupportMessage(message) {
        if (!this.canUseForumTopics() || !this.topicIds.unanswered) {
            throw new Error('Support topic sozlanmagan.');
        }

        try {
            const currentAction = this.getPendingAction(message.from?.id);
            const categoryLabel = currentAction === 'payment-proof' ? '💳 To‘lov cheki' : '🆘 Support soʻrov';
            const body = getSupportMessageBody(message);
            const metaRecord = {
                statusLabel: '⏳ Javob berilmagan',
                categoryLabel,
                createdAtLabel: nowUzbekistan(),
                fullName: getFullName(message.from || {}),
                username: getUsername(message.from || {}),
                userId: message.from?.id || '',
                messageType: getMessageTypeLabel(message),
                preview: cleanText(body, 240),
                body,
                messageHeadline: getSupportMessageHeadline(message)
            };

            let mapping = null;

            if (message.text) {
                const sent = await this.sendText(
                    this.logGroupId,
                    buildSupportLogMessage(metaRecord),
                    { threadId: this.topicIds.unanswered }
                );

                mapping = {
                    userId: message.chat.id,
                    copiedMessageId: sent.message_id,
                    statusMessageId: sent.message_id,
                    statusRenderMode: 'text',
                    metaRecord
                };
            } else if (isCaptionableSupportMessage(message)) {
                const copied = await this.copyMessage(
                    this.logGroupId,
                    message.chat.id,
                    message.message_id,
                    {
                        threadId: this.topicIds.unanswered,
                        caption: buildSupportLogMessage(metaRecord, { forCaption: true })
                    }
                );

                mapping = {
                    userId: message.chat.id,
                    copiedMessageId: copied.message_id,
                    statusMessageId: copied.message_id,
                    statusRenderMode: 'caption',
                    metaRecord
                };
            } else {
                const meta = await this.sendText(
                    this.logGroupId,
                    buildSupportLogMessage(metaRecord),
                    { threadId: this.topicIds.unanswered }
                );

                const copied = await this.copyMessage(
                    this.logGroupId,
                    message.chat.id,
                    message.message_id,
                    {
                        threadId: this.topicIds.unanswered,
                        replyToMessageId: meta.message_id,
                        parseMode: false
                    }
                );

                mapping = {
                    userId: message.chat.id,
                    copiedMessageId: copied.message_id,
                    statusMessageId: meta.message_id,
                    statusRenderMode: 'text',
                    metaRecord
                };
            }

            this.rememberSupportMessage(mapping.copiedMessageId, mapping);

            if (mapping.statusMessageId && mapping.statusMessageId !== mapping.copiedMessageId) {
                this.rememberSupportMessage(mapping.statusMessageId, mapping);
            }

            if (currentAction === 'payment-proof') {
                this.setSupportSession(message.from?.id, false);
                this.setPendingAction(message.from?.id, '');
                await this.sendInlineFlowText(
                    message.chat.id,
                    getLanguageCopy(this.getUserLanguage(message.from?.id)).paymentProofAccepted,
                    getMainMenuReplyMarkup(this.getUserLanguage(message.from?.id))
                );
                return;
            }

            await this.sendText(message.chat.id, 'Xabaringiz support bo‘limiga yuborildi. Admin javobi shu yerga keladi.');
        } catch (error) {
            try {
                await this.sendText(
                    message.chat.id,
                    'Support xabarini yuborishda vaqtinchalik muammo yuz berdi. Iltimos, birozdan keyin qayta urinib ko‘ring.'
                );
            } catch {}

            throw error;
        }
    }

    async handleSupportTopicReply(message) {
        if (!message.reply_to_message || message.from?.is_bot) {
            return;
        }

        const mapping = this.state.supportMessageMap[toIdString(message.reply_to_message.message_id)];

        if (!mapping?.userId) {
            return;
        }

        try {
            await this.copyMessage(mapping.userId, message.chat.id, message.message_id);

            if (mapping.statusMessageId && mapping.metaRecord) {
                const updatedRecord = {
                    ...mapping.metaRecord,
                    statusLabel: '✅ Javob berildi'
                };

                if (mapping.statusRenderMode === 'caption') {
                    await this.editMessageCaption(
                        this.logGroupId,
                        mapping.statusMessageId,
                        buildSupportLogMessage(updatedRecord, { forCaption: true }),
                        {}
                    ).catch(() => {});
                } else {
                    await this.editMessageText(
                        this.logGroupId,
                        mapping.statusMessageId,
                        buildSupportLogMessage(updatedRecord),
                        {}
                    ).catch(() => {});
                }
            }
        } catch (error) {
            await this.reportError('Admin javobini foydalanuvchiga yuborishda xatolik', error, {
                supportMessageId: message.message_id,
                replyToMessageId: message.reply_to_message.message_id,
                targetUserId: mapping.userId
            });
        }
    }
}

const telegramRuntime = new TelegramRuntime();

async function initTelegramRuntime() {
    return telegramRuntime.init();
}

async function sendWebsiteOrder(order, extra = {}) {
    await telegramRuntime.init();
    return telegramRuntime.sendWebsiteOrder(order, extra);
}

async function reportError(title, error, meta = {}) {
    await telegramRuntime.init();
    return telegramRuntime.reportError(title, error, meta);
}

module.exports = {
    initTelegramRuntime,
    sendWebsiteOrder,
    reportError
};
