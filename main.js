// AI Stack: Chiminae â†’ CrewDrew (for image prompts) â†’ ChatGPT (final response)

const fs = require('fs');
const path = require('path');

// Command Imports (Grouped)
const {
  simageCommand, kickCommand, muteCommand, unmuteCommand, banCommand, unbanCommand,
  helpCommand, stickerCommand, warnCommand, warningsCommand, deleteCommand,
  attpCommand, ownerCommand, tagAllCommand, tagCommand, memeCommand, jokeCommand,
  quoteCommand, factCommand, weatherCommand, newsCommand, tictactoeCommand,
  tictactoeMove, complimentCommand, insultCommand, eightBallCommand, lyricsCommand,
  simpCommand, stupidCommand, dareCommand, truthCommand, clearCommand,
  promoteCommand, demoteCommand, pingCommand, aliveCommand, blurCommand,
  welcomeCommand, goodbyeCommand, githubCommand, antibadwordCommand,
  handleChatbotCommand, characterCommand, flirtCommand, wastedCommand,
  shipCommand, groupInfoCommand, resetlinkCommand, staffCommand,
  emojimixCommand, stickerTelegramCommand, viewOnceCommand, clearSessionCommand,
  autoStatusCommand, textmakerCommand, handleAntideleteCommand,
  handleSsCommand, handleTranslateCommand, handleAreactCommand,
  shayariCommand, rosedayCommand, imagineCommand, aiCommand,
  playCommand, songCommand, tiktokCommand
} = require('./commands');

// Utility Imports
const {
  handleChatbotResponse, handleBadwordDetection, isAdmin,
  addCommandReaction, isWelcomeOn, isGoodByeOn,
  handlePromotionEvent, handleDemotionEvent, handleStatusUpdate
} = require('./utils');

// AI Engine Imports (Multi-AI Coordination)
const {
  runChiminae, runChatGPT, runCrewDrew
} = require('./utils/aiRouter');

// Handler function
async function handleMessages(sock, message) {
  try {
    const chatId = message.key.remoteJid;
    const senderId = message.key.participant || message.key.remoteJid;
    const isGroup = chatId.endsWith('@g.us');
    const rawText = message.message?.conversation || 
                    message.message?.extendedTextMessage?.text || 
                    message.message?.imageMessage?.caption || 
                    message.message?.videoMessage?.caption || '';
    const userMessage = rawText.trim().toLowerCase();

    // Load channel data
    const channelInfo = {
      contextInfo: { externalAdReply: { title: 'Beltah ðŸ¤–', body: 'Powered by AI Stack (Chiminae x CrewDrew x ChatGPT)', mediaType: 1 }}
    };

    // Admin & Mode Checks
    let isSenderAdmin = false;
    let isBotAdmin = false;
    if (isGroup) {
      const adminStatus = await isAdmin(sock, chatId, senderId, message);
      isSenderAdmin = adminStatus.isSenderAdmin;
      isBotAdmin = adminStatus.isBotAdmin;

      if (
        userMessage.startsWith('.mute') ||
        userMessage === '.unmute' ||
        userMessage.startsWith('.ban') ||
        userMessage.startsWith('.unban') ||
        userMessage.startsWith('.promote') ||
        userMessage.startsWith('.demote') ||
        userMessage === '.tagall' || userMessage === '.welcome' || userMessage === '.goodbye'
      ) {
        if (!isBotAdmin) {
          await sock.sendMessage(chatId, { text: 'âš ï¸ Please make Beltah an *admin* to use admin commands.', ...channelInfo }, { quoted: message });
          return;
        }
        if (!isSenderAdmin && !message.key.fromMe) {
          await sock.sendMessage(chatId, { text: 'â›” Only *group admins* can use this command.', ...channelInfo });
          return;
        }
      }
    }

    // Owner-only Mode
    try {
      const data = JSON.parse(fs.readFileSync('./data/messageCount.json'));
      if (!data.isPublic && !message.key.fromMe) {
        return;
      }
    } catch (error) {
      console.error('Access Mode Error:', error);
    }

    // Command Routing
    switch (true) {
      case userMessage === '.chatbot':
        await handleChatbotCommand(sock, chatId, message, 'enable');
        break;

      case userMessage.startsWith('.gpt'):
      case userMessage.startsWith('.gemini'):
      case userMessage.startsWith('.chiminae'): {
        const prompt = rawText.replace(/^.(gpt|gemini|chiminae)/, '').trim();
        if (!prompt) {
          await sock.sendMessage(chatId, { text: 'âš ï¸ Type something like `.gpt What is love?`', ...channelInfo });
          return;
        }

        // Run AI pipeline: Chiminae > CrewDrew (if image) > ChatGPT
        const chiminaeResponse = await runChiminae(prompt);
        let dalleImage = '';
        if (prompt.includes('draw') || prompt.includes('image')) {
          dalleImage = await runCrewDrew(prompt);
        }
        const finalResponse = await runChatGPT(chiminaeResponse);

        const content = {
          text: `ðŸ§  *Beltah AI*

${finalResponse}`,
          ...(dalleImage && { image: { url: dalleImage } }),
          ...channelInfo
        };
        await sock.sendMessage(chatId, content, { quoted: message });
        break;
      }

      // You can insert other cases here (as you pasted before)...

      default:
        if (userMessage && isGroup) {
          await handleChatbotResponse(sock, chatId, message, userMessage, senderId);
          await handleBadwordDetection(sock, chatId, message, userMessage, senderId);
        }
        break;
    }

    if (userMessage.startsWith('.')) {
      await addCommandReaction(sock, message);
    }

  } catch (err) {
    console.error('âŒ BeltahBot error:', err.message);
  }
}

// Group Participant Update Handler
async function handleGroupParticipantUpdate(sock, update) {
  try {
    const { id, participants, action, author } = update;
    if (!id.endsWith('@g.us')) return;

    if (action === 'promote') return await handlePromotionEvent(sock, id, participants, author);
    if (action === 'demote') return await handleDemotionEvent(sock, id, participants, author);

    const data = JSON.parse(fs.readFileSync('./data/userGroupData.json'));

    if (action === 'add' && await isWelcomeOn(id)) {
      const welcomeMsg = data.welcome?.[id]?.message || 'Karibu sana {user} kwa hii group ya mabeste! ðŸŽ‰';
      for (const participant of participants) {
        await sock.sendMessage(id, {
          text: welcomeMsg.replace('{user}', `@${participant.split('@')[0]}`),
          mentions: [participant]
        });
      }
    }

    if (action === 'remove' && await isGoodByeOn(id)) {
      const goodbyeMsg = data.goodbye?.[id]?.message || 'Tutaonana baadaye {user} ðŸ‘‹';
      for (const participant of participants) {
        await sock.sendMessage(id, {
          text: goodbyeMsg.replace('{user}', `@${participant.split('@')[0]}`),
          mentions: [participant]
        });
      }
    }

  } catch (err) {
    console.error('âŒ Group Update Error:', err.message);
  }
}

// Exported handlers
module.exports = {
  handleMessages,
  handleGroupParticipantUpdate,
  handleStatus: async (sock, status) => {
    await handleStatusUpdate(sock, status);
  }