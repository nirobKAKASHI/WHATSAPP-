const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
const os = require('os');
const axios = require('axios');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

const botname = 'BeltahBot';
const developer = 'Ishaq Ibra™rahim';
const github = 'https://github.com/hmhrm/Ihaq.Irabhan.ILsaqIbbrrah';

async function menuCommand(sock, chatId, message, command, args, isCreator, isGroup, pushname) {
  const uptime = () => {
    let seconds = process.uptime();
    let pad = (s) => (s < 10 ? '0' + s : s);
    let hrs = Math.floor(seconds / (60 * 60));
    let mins = Math.floor((seconds % (60 * 60)) / 60);
    let secs = Math.floor(seconds % 60);
    return `${pad(hrs)}h ${pad(mins)}m ${pad(secs)}s`;
  };

  const menuImageUrl = 'https://i.imgur.com/Zh5VbLz.jpg'; // you can replace with your own CDN-uploaded URL

  const caption = `
🌟 *${botname} Main Menu* 🌟

👤 *Bot Info*
  ➥ Name: ${botname}
  ➥ Developer: ${developer}
  ➥ Uptime: ${uptime()}
  ➥ GitHub: ${github}

👥 *Group Chat*
  ⦿ .tagall
  ⦿ .hidetag
  ⦿ .setdesc
  ⦿ .group open|close

💬 *Private Chat*
  ⦿ .chatbot
  ⦿ .profile
  ⦿ .whoami

⚙️ *General Commands*
  ⦿ .help
  ⦿ .menu
  ⦿ .info
  ⦿ .support

🎮 *Fun & Games*
  ⦿ .truth
  ⦿ .dare
  ⦿ .couple
  ⦿ .quote
  ⦿ .joke
  ⦿ .roast

🛠️ *Media Tools*
  ⦿ .tomp3
  ⦿ .tovideo
  ⦿ .img2url
  ⦿ .download
  ⦿ .blur

🔒 *Admin Only*
  ⦿ .ban
  ⦿ .unban
  ⦿ .clear
  ⦿ .block
  ⦿ .shutdown

📦 *Extract & Convert*
  ⦿ .unzip
  ⦿ .merge
  ⦿ .convert
  ⦿ .ocr
  ⦿ .web2pdf

📌 *Extra Links*
  ➥ Help: .owner
  ➥ Report Bug: .bug
  ➥ Join Group: .join

_Made with ❤️ by ${developer}_
  `;

  try {
    await sock.sendMessage(chatId, {
      image: { url: menuImageUrl },
      caption,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: `${botname} by ${developer}`,
          body: "Powered by OpenAI",
          thumbnailUrl: menuImageUrl,
          mediaType: 1,
          renderLargerThumbnail: true,
          showAdAttribution: true,
          sourceUrl: github
        }
      }
    }, { quoted: message });
  } catch (err) {
    console.error('Menu Error:', err);
    await sock.sendMessage(chatId, {
      text: '⚠️ Error loading menu. Try again later.'
    }, { quoted: message });
  }
}

module.exports = { menuCommand };