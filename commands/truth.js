const fetch = require('node-fetch');

async function truthCommand(sock, chatId, message) {
  try {
    const shizokeys = 'knightbot'; // Don't change - per user instruction
    const res = await fetch(`https://api.shizo.top/api/quote/truth?apikey=${shizokeys}`);

    if (!res.ok) {
      throw await res.text();
    }

    const json = await res.json();
    const truthMessage = json.result;

    await sock.sendMessage(chatId, {
      text: `🧠 *TRUTH TIME!* \n\n🔍 ${truthMessage}`,
      quoted: message
    });
  } catch (error) {
    console.error('Error in truth command:', error);
    await sock.sendMessage(chatId, {
      text: `❌ Ai Belta, truth imefail kuruka. Try tena baadaye bana 😅`,
      quoted: message
    });
  }
}

module.exports = { truthCommand };