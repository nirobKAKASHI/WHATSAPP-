const fs = require('fs');
const { channelInfo } = require('../lib/messageConfig');

async function banCommand(sock, chatId, message) {
  let userToBan;

  // Check for mentioned users
  if (message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
    userToBan = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
  }
  // Check for replied message
  else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
    userToBan = message.message.extendedTextMessage.contextInfo.participant;
  }

  // If no user found
  if (!userToBan) {
    await sock.sendMessage(chatId, {
      text: 'Please mention the user or reply to their message to ban!',
      ...channelInfo
    });
    return;
  }

  try {
    const filePath = './data/banned.json';
    let bannedUsers = [];

    // Load or create ban list
    if (fs.existsSync(filePath)) {
      bannedUsers = JSON.parse(fs.readFileSync(filePath));
    }

    // Add if not already banned
    if (!bannedUsers.includes(userToBan)) {
      bannedUsers.push(userToBan);
      fs.writeFileSync(filePath, JSON.stringify(bannedUsers, null, 2));

      await sock.sendMessage(chatId, {
        text: `✅ Successfully banned @${userToBan.split('@')[0]}!`,
        mentions: [userToBan],
        ...channelInfo
      });
    } else {
      await sock.sendMessage(chatId, {
        text: `⚠️ @${userToBan.split('@')[0]} is already banned.`,
        mentions: [userToBan],
        ...channelInfo
      });
    }
  } catch (error) {
    console.error('[BAN CMD ERROR]', error);
    await sock.sendMessage(chatId, {
      text: '❌ Failed to ban user!',
      ...channelInfo
    });
  }
}

module.exports = banCommand;