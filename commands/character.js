const axios = require('axios');
const { channelInfo } = require('../lib/messageConfig');

async function characterCommand(sock, chatId, message) {
  let userToAnalyze;

  // Check for mentioned users
  if (message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
    userToAnalyze = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
  }
  // Check for replied message
  else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
    userToAnalyze = message.message.extendedTextMessage.contextInfo.participant;
  }

  // If no user found
  if (!userToAnalyze) {
    await sock.sendMessage(chatId, {
      text: '👀 Please mention someone or reply to their message to analyze their character!',
      ...channelInfo
    });
    return;
  }

  try {
    // Try fetching profile picture
    let profilePic;
    try {
      profilePic = await sock.profilePictureUrl(userToAnalyze, 'image');
    } catch {
      profilePic = 'https://i.imgur.com/2wxGhpf.jpg'; // Default image
    }

    // Traits list
    const traits = [
      'Intelligent', 'Creative', 'Determined', 'Ambitious', 'Caring', 'Charismatic',
      'Confident', 'Empathetic', 'Energetic', 'Friendly', 'Generous', 'Honest',
      'Humorous', 'Imaginative', 'Independent', 'Kind', 'Logical', 'Loyal',
      'Optimistic', 'Passionate', 'Patient', 'Persistent', 'Reliable', 'Resourceful',
      'Sincere', 'Thoughtful', 'Understanding', 'Versatile', 'Wise'
    ];

    // Get 3-5 random traits
    const numTraits = Math.floor(Math.random() * 3) + 3;
    const selectedTraits = [];
    while (selectedTraits.length < numTraits) {
      const trait = traits[Math.floor(Math.random() * traits.length)];
      if (!selectedTraits.includes(trait)) {
        selectedTraits.push(trait);
      }
    }

    // Generate trait percentages
    const traitPercents = selectedTraits.map(trait => {
      const percent = Math.floor(Math.random() * 41) + 60;
      return `${trait}: ${percent}%`;
    });

    // Overall rating (out of 100)
    const overall = Math.floor(Math.random() * 21) + 80;

    const analysis = `🧠 *Character Analysis by BELTAH*\n\n👤 *User:* @${userToAnalyze.split('@')[0]}\n📊 *Key Traits:*\n${traitPercents.join('\n')}\n\n💯 *Overall Rating:* ${overall}/100\n\n📌 _Note: This is just a fun analysis. Don’t take it too seriously!_`;

    // Send the result
    await sock.sendMessage(chatId, {
      image: { url: profilePic },
      caption: analysis,
      mentions: [userToAnalyze],
      ...channelInfo
    });

  } catch (error) {
    console.error('[CHARACTER CMD ERROR]', error);
    await sock.sendMessage(chatId, {
      text: '⚠️ Failed to analyze character! Try again later.',
      ...channelInfo
    });
  }
}

module.exports = characterCommand;