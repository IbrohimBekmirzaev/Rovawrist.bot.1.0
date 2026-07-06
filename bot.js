require('dotenv').config();

const { initTelegramRuntime } = require('./telegram');

async function bootstrap() {
    await initTelegramRuntime();
}

bootstrap().catch((error) => {
    console.error('Telegram botni ishga tushirishda xatolik:', error?.message || error);
    process.exitCode = error?.code === 'TELEGRAM_POLLING_LOCKED' ? 0 : 1;
});
