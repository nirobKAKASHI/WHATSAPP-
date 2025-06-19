// Author: Ishaq Ibrahim

// AI Stack: Gminae × CrewDrew × ChatGPT

const fs = require('fs');

const path = require('path');

const { downloadMediaMessage } = require('@whiskeysockets/baileys');

// Command Imports

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

  shipCommand, groupInfoCommand, resetlinkCommand, staffCommand, emojimixCommand,

  stickerTelegramCommand, viewOnceCommand, clearSessionCommand, autoStatusCommand,

  textmakerCommand, handleAntideleteCommand, handleSsCommand, handleTranslateCommand,

  handleAreactCommand, shayariCommand, rosedayCommand, imagineCommand,

  aiCommand, playCommand, songCommand, tiktokCommand

} = require('./commands');

// Utility Imports

const {

  handleChatbotResponse, handleBadwordDetection, isAdmin, addCommandReaction,

  isWelcomeOn, isGoodByeOn, handlePromotionEvent, handleDemotionEvent,

  handleStatusUpdate

} = require('./utils');

// AI Engine Imports

const { runGminae, runChatGPT, runCrewDrew } = require('./utils/aiRouter');

// ✅ Main Message Handler

async function handleMessages(sock, message) {

  try {

    const chatId = message.key.remoteJid;

    const senderId = message.key.participant || chatId;

    const isGroup = chatId.endsWith('@g.us');

    const rawText = message.message?.conversation ||

                    message.message?.extendedTextMessage?.text ||

                    message.message?.imageMessage?.caption ||

                    message.message?.videoMessage?.caption || '';

    const userMessage = rawText.trim().toLowerCase();

    const channelInfo = {

      contextInfo: {

        externalAdReply: {

          title: 'Beltah 🤖',

          body: 'Powered by Beltah AI Stack (Gminae × CrewDrew × ChatGPT)',

          mediaType: 1

        }

      }

    };

    let isSenderAdmin = false;

    let isBotAdmin = false;

    if (isGroup) {

      const adminStatus = await isAdmin(sock, chatId, senderId, message);

      isSenderAdmin = adminStatus.isSenderAdmin;

      isBotAdmin = adminStatus.isBotAdmin;

      if (

        userMessage.startsWith('.mute') || userMessage === '.unmute' ||

        userMessage.startsWith('.ban') || userMessage === '.unban' ||

        userMessage.startsWith('.promote') || userMessage.startsWith('.demote') ||

        userMessage === '.tagall' || userMessage === '.welcome' || userMessage === '.goodbye'

      ) {

        if (!isBotAdmin) {

          await sock.sendMessage(chatId, { text: '⚠️ Please make *Beltah* an admin first.', ...channelInfo }, { quoted: message });

          return;

        }

        if (!isSenderAdmin && !message.key.fromMe) {

          await sock.sendMessage(chatId, { text: '🚫 Hii command ni ya *admin pekee*.', ...channelInfo });

          return;

        }

      }

    }

    // You can continue handling commands here...

    // Example:

    // if (userMessage.startsWith('.ping')) await pingCommand(sock, chatId, message);

  } catch (error) {

    console.error('⚠️ Error in handleMessages:', error);

  }

}