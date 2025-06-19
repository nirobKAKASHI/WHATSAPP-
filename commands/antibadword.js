const { handleAntiBadwordCommand } = require('../lib/antibadword');
const isAdminHelper = require('../lib/isAdmin');

async function antibadwordCommand(sock, chatId, message, senderId, isSenderAdmin) {
  try {
    if (!isSenderAdmin) {
      await sock.sendMessage(chatId, {
        text: '🚫 *This command is for group admins only!*',
        quoted: message
      });
      return;
    }

    // Extract badword text from message
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
    const match = text.split(' ').slice(1).join(' ');

    await handleAntiBadwordCommand(sock, chatId, message, match);
    
  } catch (error) {
    console.error('❌ Error in antibadword command:', error);
    await sock.sendMessage(chatId, {
      text: '⚠️ *Oops! Something went wrong while processing antibadword command.*',
      quoted: message
    });
  }
}

module.exports = antibadwordCommand;