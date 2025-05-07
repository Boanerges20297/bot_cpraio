require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if(!TOKEN) {
  console.error('TELEGRAM_BOT_TOKEN não está definido nas variáveis de ambiente.');
  process.exit(1);
}

// Inicializa o bot com o token e opções (polling para desenvolvimento local)
const bot = new TelegramBot(TOKEN, { polling: true });

// Responde a qualquer mensagem de texto
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  console.log(`Recebido no chat ${chatId}: ${messageText}`);

  // Cria a mensagem de resposta
  const responseText = `Você disse: ${messageText}`;

  // Envia a mensagem de volta para o mesmo chat
  bot.sendMessage(chatId, responseText);
});

console.log('Bot iniciado (polling ativo para teste local)...');