require('dotenv').config();

const http = require('http');
const { initTelegramRuntime } = require('./telegram');

function startHealthServer() {
    const port = process.env.PORT || 3000;

    const server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('OK');
    });

    server.listen(port, () => {
        console.log(`Health-check server ${port}-portda ishga tushdi.`);
    });
}

async function bootstrap() {
    startHealthServer();
    await initTelegramRuntime();
}

bootstrap().catch((error) => {
    console.error('Telegram botni ishga tushirishda xatolik:', error?.message || error);
    process.exitCode = error?.code === 'TELEGRAM_POLLING_LOCKED' ? 0 : 1;
});
