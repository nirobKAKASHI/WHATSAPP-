const { handleAntilinkCommand } = require('../lib/antilink');
const isAdminHelper = require('../lib/isAdmin');

async function antilinkCommand(sock, chatId, message, senderId, isSenderAdmin) {
  try {
    // Admin check
    if (!isSenderAdmin) {
      await sock.sendMessage(chatId, {
        text: '🚫 *This command is for group admins only!*',
        quoted: message
      });
      return;
    }

    // Get text after command (e.g., enable/disable)
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
    const commandArgs = text.split(' ').slice(1).join(' ').toLowerCase();

    if (!commandArgs) {
      await sock.sendMessage(chatId, {
        text: '⚙️ *Usage:* `.antilink on` or `.antilink off`',
        quoted: message
      });
      return;
    }

    const result = await handleAntilinkCommand(sock, chatId, message, commandArgs);

    await sock.sendMessage(chatId, {
      text: `✅ *Antilink setting updated:*\n${result}`,
      quoted: message
    });

  } catch (error) {
    console.error('❌ Error in antilink command:', error);
    await sock.sendMessage(chatId, {
      text: '⚠️ *Oops! An error occurred while processing the antilink command.*',
      quoted: message
    });
  }
}

module.exports = antilinkCommand;