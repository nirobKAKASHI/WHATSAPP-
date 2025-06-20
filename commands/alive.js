const settings = require("../settings");

async function aliveCommand(sock, chatId, message) {
  try {
    const message1 =
      `*🤖 BeltaHBot is Active!*\n\n` +
      `*🎯 Version:* ${settings.version}\n` +
      `*📡 Status:* Online\n` +
      `*🌐 Mode:* Public\n\n` +
      `*✨ Features:*\n` +
      `🔹 AI Fusion (ChatGPT + Gemini + Claude)\n` +
      `🔹 Group Management\n` +
      `🔹 Antilink Protection\n` +
      `🔹 Fun & Utility Commands\n` +
      `🔹 Media Tools\n` +
      `🔹 Owner Commands\n\n` +
      `📌 Type *.menu* to view all commands.\n` +
      `👑 Powered by *BeltaHBot*`;

    await sock.sendMessage(chatId, {
      text: message1,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363161513685998@newsletter',
          newsletterName: 'BeltaHBot Official',
          serverMessageId: -1
        }
      },
      quoted: message
    });

  } catch (error) {
    console.error('Error in alive command:', error);
    await sock.sendMessage(chatId, {
      text: '✅ BeltaHBot is alive and running!',
      quoted: message
    });
  }
}

module.exports = aliveCommand;