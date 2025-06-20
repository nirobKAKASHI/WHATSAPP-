const fs = require('fs');
const path = require('path');
const os = require('os');

const channelInfo = {
  contextInfo: {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '120363161513685998@newsletter',
      newsletterName: 'BeltahBot 📢',
      serverMessageId: -1
    }
  }
};

async function clearSessionCommand(sock, chatId, msg) {
  try {
    // ✅ Only owner can use this
    if (!msg.key.fromMe) {
      await sock.sendMessage(chatId, {
        text: '❌ Hii command ni ya admin tu, bro! Usicheze na fire 😤',
        ...channelInfo
      });
      return;
    }

    const sessionDir = path.join(__dirname, '../session');

    if (!fs.existsSync(sessionDir)) {
      await sock.sendMessage(chatId, {
        text: '⚠️ Hakuna session directory ilipatikana. Already clean boss!',
        ...channelInfo
      });
      return;
    }

    let filesCleared = 0;
    let errors = 0;
    let errorDetails = [];

    // 🔄 Start process
    await sock.sendMessage(chatId, {
      text: '🧹 Beltah anasafisha ma session files zako... relax! 🚀',
      ...channelInfo
    });

    const files = fs.readdirSync(sessionDir);

    let appStateSyncCount = 0;
    let preKeyCount = 0;

    for (const file of files) {
      if (file.startsWith('app-state-sync-')) appStateSyncCount++;
      if (file.startsWith('pre-key-')) preKeyCount++;
    }

    for (const file of files) {
      if (file === 'creds.json') continue; // ⚠️ Skip creds.json
      try {
        const filePath = path.join(sessionDir, file);
        fs.unlinkSync(filePath);
        filesCleared++;
      } catch (err) {
        errors++;
        errorDetails.push(`❌ ${file}: ${err.message}`);
      }
    }

    const message =
      '✅ *Session files cleared successfully!*\n\n' +
      '📊 *Statistics:*\n' +
      `• Total files cleared: ${filesCleared}\n` +
      `• App state sync files: ${appStateSyncCount}\n` +
      `• Pre-key files: ${preKeyCount}\n` +
      (errors > 0
        ? `⚠️ *Errors encountered:* ${errors}\n${errorDetails.join('\n')}`
        : '');

    await sock.sendMessage(chatId, {
      text: message,
      ...channelInfo
    });

  } catch (error) {
    console.error('⚠️ Error in clearSessionCommand:', error);
    await sock.sendMessage(chatId, {
      text: '🚨 Nimekwama kusafisha sessions. Jaribu tena baadae!',
      ...channelInfo
    });
  }
}

module.exports = { clearSessionCommand };