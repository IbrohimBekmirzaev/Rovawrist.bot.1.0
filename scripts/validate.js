'use strict';

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env');
const envExamplePath = path.join(rootDir, '.env.example');

if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, quiet: true });
}

const requiredFiles = [
    'bot.js',
    'telegram.js',
    'README.md',
    '.env.example',
    path.join('assets', 'rovawrist-showcase.jpg'),
    path.join('assets', 'rovawrist-black.jpg'),
    path.join('assets', 'rovawrist-pink.png')
];

const requiredEnvKeys = [
    'TELEGRAM_BOT_TOKEN',
    'TELEGRAM_LOG_GROUP_ID',
    'TELEGRAM_TOPIC_START_ID',
    'TELEGRAM_TOPIC_SUPPORT_ID',
    'TELEGRAM_TOPIC_UNANSWERED_ID',
    'TELEGRAM_TOPIC_ORDERS_ID',
    'TELEGRAM_TOPIC_ERROR_ID',
    'REQUIRED_CHANNEL_1_USERNAME',
    'REQUIRED_CHANNEL_1_URL'
];

function isPlaceholder(value = '') {
    const normalized = String(value).trim();
    return (
        !normalized ||
        normalized.includes('your_bot_token_here') ||
        normalized.includes('123456789:') ||
        normalized.startsWith('PASTE_YOUR_')
    );
}

function ensureNodeVersion() {
    const major = Number(process.versions.node.split('.')[0] || 0);

    if (major < 18) {
        throw new Error(`Node.js 18+ talab qilinadi. Joriy versiya: ${process.versions.node}`);
    }
}

function checkFiles() {
    const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(rootDir, file)));

    if (missing.length > 0) {
        throw new Error(`Quyidagi fayllar topilmadi: ${missing.join(', ')}`);
    }
}

function checkEnvExample() {
    const exampleContent = fs.readFileSync(envExamplePath, 'utf8');
    const missingKeys = requiredEnvKeys.filter((key) => !exampleContent.includes(`${key}=`));

    if (missingKeys.length > 0) {
        throw new Error(`.env.example ichida quyidagi kalitlar yetishmaydi: ${missingKeys.join(', ')}`);
    }
}

function checkRuntimeEnv() {
    if (!fs.existsSync(envPath)) {
        console.log('.env topilmadi, runtime env tekshiruvi o‘tkazilmadi.');
        return;
    }

    const missing = requiredEnvKeys.filter((key) => isPlaceholder(process.env[key]));

    if (missing.length > 0) {
        throw new Error(`.env ichida quyidagi kalitlarni to‘ldirish kerak: ${missing.join(', ')}`);
    }
}

function main() {
    ensureNodeVersion();
    checkFiles();
    checkEnvExample();
    checkRuntimeEnv();
    console.log('Validation muvaffaqiyatli yakunlandi.');
}

main();
