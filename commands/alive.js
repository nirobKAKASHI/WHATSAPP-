// Author: Ishaq Ibrahim
// Command: .alive
// AI Stack: Gminae × CrewDrew × ChatGPT

const fs = require('fs');
const path = require('path');
const settings = require('../settings');

async function aliveCommand(sock, chatId, message) {
  try {
    // ✅ Voice intro path
    const introPath = path.join(__dirname, '../assets/audio/mp3/beltah_intro_voice_ready.mp3');

    // 🎤 Send intro voice if available
    if (fs.existsSync(introPath)) {
      await sock.sendMessage(chatId, {
        audio: fs.readFileSync(introPath),
        mimetype: 'audio/mpeg',
        ptt: true,
      }, { quoted: message });
    } else {
      await sock.sendMessage(chatId, {
        text: '⚠️ Voice intro haijapatikana! Check `assets/audio/mp3/` folder.',
      }, { quoted: message });
    }

    // 🟢 Alive text
    const message1 =
      '*✅ BeltahBot is Active!*\n\n' +
      `📡 *Status:* Online\n` +
      `🔓 *Mode:* Public\n` +
      `🚀 *Features:*\n` +
      `• AI Fusion (ChatGPT + Gemini + Claude)\n` +
      `• Group Management\n` +
      `• Antilink Protection\n` +
      `• Fun & Utility Commands\n` +
      `• Media Tools\n` +
      `• Owner Commands\n\n` +
      `📜 Type *.menu* kuview kila kitu.\n` +
      `⚡ Powered by *BeltahBot*`;

    await sock.sendMessage(chatId, {
      text: message1,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363161513685990@newsletter',
          newsletterName: 'BeltahBot Official',
          serverMessageId: -1,
        },
      },
    }, { quoted: message });

  } catch (error) {
    console.error('❌ Error in alive command:', error);
    await sock.sendMessage(chatId, {
      text: '⚠️ BeltahBot is alive but kuna error bana.',
    }, { quoted: message });
  }
}

module.exports = aliveCommand;
