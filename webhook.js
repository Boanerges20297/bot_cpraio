// api/webhook.js
const TelegramBot = require('node-telegram-bot-api'); // Importa a biblioteca 'node-telegram-bot-api', que facilita a interação com a API do Telegram Bot.

const TOKEN = process.env.TELEGRAM_BOT_TOKEN; // Lê o valor da variável de ambiente chamada 'TELEGRAM_BOT_TOKEN'. É onde armazenaremos o token do nosso bot de forma segura na Vercel.

if (!TOKEN) { // Verifica se a variável de ambiente TOKEN não está definida (é nula ou vazia).
    console.error('Erro: A variável de ambiente TELEGRAM_BOT_TOKEN não está definida.'); // Se o token não estiver definido, exibe uma mensagem de erro no console do servidor.
}

// Inicializa o bot (sem polling para webhook)
const bot = new TelegramBot(TOKEN); // Cria uma nova instância do bot Telegram utilizando o token. No modo webhook, este objeto será usado principalmente para enviar respostas.

module.exports = async (req, res) => { // Define a função principal que será executada pela Vercel quando receber uma requisição. 'req' é o objeto de requisição (contém os dados da requisição) e 'res' é o objeto de resposta (usado para enviar dados de volta). 'async' indica que a função pode conter operações assíncronas (como a chamada para a API do Telegram).
    if (req.method === 'POST') { // Verifica se o método da requisição HTTP é POST. O Telegram envia as atualizações (novas mensagens, comandos, etc.) para o webhook usando o método POST.
        try {
            const update = req.body; // Obtém o corpo da requisição (os dados enviados pelo Telegram) e o armazena na variável 'update'. Este corpo conterá um objeto JSON com as informações da atualização.
            console.log('Recebido (webhook):', update); // Imprime no console do servidor (logs da Vercel) o objeto 'update' recebido do Telegram. Isso é útil para depuração.

            if (update.message && update.message.text) { // Verifica se a atualização contém um objeto 'message' e se esse objeto 'message' possui a propriedade 'text' (o conteúdo da mensagem de texto).
                const chatId = update.message.chat.id; // Extrai o ID do chat de onde a mensagem foi enviada. Este ID é necessário para enviar uma resposta de volta para o mesmo chat.
                const messageText = update.message.text; // Extrai o texto da mensagem enviada pelo usuário.

                const responseText = `Você disse (via webhook): ${messageText}`; // Cria a mensagem de resposta que o bot irá enviar de volta.

                if (TOKEN) { // Verifica novamente se o TOKEN está definido antes de tentar enviar uma mensagem.
                    await bot.sendMessage(chatId, responseText); // Utiliza o método 'sendMessage' da biblioteca 'node-telegram-bot-api' para enviar a mensagem de resposta para o 'chatId'. 'await' pausa a execução da função até que esta operação assíncrona seja concluída.
                } else {
                    console.warn('Token do bot não está disponível, não foi possível enviar a mensagem.'); // Se o token não estiver definido, exibe um aviso no console e não tenta enviar a mensagem.
                }
            }

            res.status(200).send('OK'); // Envia uma resposta HTTP com status 200 (OK) para o Telegram, indicando que a atualização foi recebida e processada com sucesso. É importante responder rapidamente ao Telegram.
        } catch (error) { 
            console.error('Erro ao processar webhook:', error); // Imprime no console do servidor o erro ocorrido durante o processamento do webhook.
            res.status(500).send('Erro no servidor'); // Envia uma resposta HTTP com status 500 (Erro Interno do Servidor) para o Telegram em caso de falha no processamento.
        }
    } else { // Se a requisição não for um POST (por exemplo, um GET acessando diretamente a URL do webhook).
        res.status(200).send('Olá do seu bot Telegram (via webhook)!'); // Envia uma resposta HTTP 200 com uma mensagem simples para indicar que o endpoint do webhook está ativo.
    }
};