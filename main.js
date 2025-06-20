// Author: Ishaq Ibrahim
// Command: .menu
// AI Stack: Gminae × CrewDrew × ChatGPT

const fs = require('fs');
const path = require('path');

module.exports = async (sock, chatId, message) => {
  try {
    // Path to the voice intro
    const voicePath = path.join(__dirname, '../assets/audio/mp3/beltah_intro_voice_ready.mp3');

    // Path to the menu image
    const imagePath = path.join(__dirname, '../assets/media/beltah_menu.jpg'); // Customize your image path here

    // Send voice intro first (if available)
    if (fs.existsSync(voicePath)) {
      await sock.sendMessage(chatId, {
        audio: fs.readFileSync(voicePath),
        mimetype: 'audio/mpeg',
        ptt: true
      }, { quoted: message });
    }

    // Send menu image with caption
    if (fs.existsSync(imagePath)) {
      await sock.sendMessage(chatId, {
        image: fs.readFileSync(imagePath),
        caption:
`📜 *BELTAHBOT COMMANDS MENU* 🔥

✨ *Bot Status:* Live ✅
🔗 *AI Stack:* Gminae × CrewDrew × ChatGPT
👑 *Owner:* Ishaq Ibrahim

🛠️ *Bot Info:*
.alive | .ping | .menu | .owner | .staff

🎮 *Fun & Games:*
.joke | .meme | .quote | .dare | .truth | .insult | .flirt | .simp | .compliment | .8ball

🎭 *Media Tools:*
.play | .song | .tiktok | .lyrics | .blur | .sticker | .attp | .emojimix | .textmaker

🌐 *Chat & AI:*
.ai | .chatbot | .character | .imagine | .translate | .shayari

👥 *Group Commands:*
.tagall | .mute | .unmute | .ban | .unban | .kick | .promote | .demote | .welcome | .goodbye | .groupinfo | .resetlink

⚙️ *Admin/Mods:*
.warn | .warnings | .delete | .clear | .clearsession | .antibadword | .antidelete | .autostatus

📡 *Extras:*
.github | .weather | .news | .wasted | .ship | .ss | .viewonce

_Try one leo, Beltah iko radaa! 😎_`,
      }, { quoted: message });
    } else {
      await sock.sendMessage(chatId, {
        text: '⚠️ Menu image haiko. Check your `/assets/media/beltah_menu.jpg` file.',
      }, { quoted: message });
    }

  } catch (error) {
    console.error('🔥 Error in menuCommand:', error);
    await sock.sendMessage(chatId, {
      text: '😓 Aki menu imefail ku-load. Check logs.',
    }, { quoted: message });
  }
};
