const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");
const { performance } = require("perf_hooks");
const os = require("os");

const botname = "BeltahBot";
const developer = "Ishaq Ibrahim";
const github = "https://github.com/IshaqIbrahim";
const prefix = "."; // Change this to your actual bot prefix

async function menuCommand(sock, chatId, message, command, args, isCreator, isGroup, pushName) {
  const uptime = () => {
    let totalSeconds = process.uptime();
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const time = moment().tz("Africa/Nairobi").format("HH:mm:ss");
  const date = moment().tz("Africa/Nairobi").format("DD/MM/YYYY");

  const menu = `
🌟 *${botname} Main Menu*
────────────────────
📆 Date: ${date}
🕒 Time: ${time}
⚡ Uptime: ${uptime()}
👤 User: ${pushName || 'Guest'}
${isGroup ? "👥 Group Chat" : "💬 Private Chat"}

🛠️ *General Commands*
├⏺️ ${prefix}menu
├📝 ${prefix}ping
├🗣️ ${prefix}chatbot [on/off]
├🎭 ${prefix}character
├📊 ${prefix}status
├📥 ${prefix}download [yt/tiktok/etc.]

🎉 *Fun & Games*
├🎲 ${prefix}truth
├🔥 ${prefix}dare
├😂 ${prefix}joke
├❤️ ${prefix}romantic

📸 *Media Tools*
├🖼️ ${prefix}sticker
├🎵 ${prefix}tomp3
├📽️ ${prefix}tovideo
├🗣️ ${prefix}ptt

🔐 *Admin Only*
${isCreator ? `├💥 ${prefix}shutdown
├🔄 ${prefix}restart
├🛡️ ${prefix}ban
├✅ ${prefix}unban` : "🔒 Admin only"}

📎 *Extras*
├📂 ${prefix}help
├👨‍💻 ${prefix}owner
├🌐 ${github}

────────────────────
🤖 *${botname}* by ${developer}
`;

  await sock.sendMessage(chatId, { text: menu }, { quoted: message });
}

module.exports = { menuCommand };