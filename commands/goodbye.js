const { handleGoodbye } = require('../lib/welcome');

async function goodbyeCommand(sock, chatId, message, match) {
  // Only allow this in group chats
  if (!chatId.endsWith('@g.us')) {
    await sock.sendMessage(chatId, {
      text: '🚫 Sorry fam, the goodbye command only works in groups. Try it in the squad chat 😎'
    });
    return;
  }

  // Get text after the command
  const text =
    message.message?.conversation ||
    message.message?.extendedTextMessage?.text ||
    '';

  const matchText = text.split(' ').slice(1).join(' ').trim();

  await handleGoodbye(sock, chatId, message, matchText);
}

module.exports = goodbyeCommand;