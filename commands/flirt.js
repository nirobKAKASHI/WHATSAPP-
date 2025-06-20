const fetch = require('node-fetch');

async function flirtCommand(sock, chatId, message) {
  try {
    const shizokeys = 'knightbot';
    const res = await fetch(`https://api.shizo.top/api/quote/flirt?apikey=${shizokeys}`);

    if (!res.ok) throw await res.text();

    const json = await res.json();
    const flirtMessage = json.result;

    // 🥰 Send the flirt message
    await sock.sendMessage(chatId, {
      text: `💘 *Beltah Flirt Vibes:* _${flirtMessage}_ 😚`,
      quoted: message,
    });

  } catch (error) {
    console.error('❌ Error in flirt command:', error);
    await sock.sendMessage(chatId, {
      text: `🚫 Aki bado sijaget pick-up line! Jaribu tena baadaye 😭`,
      quoted: message,
    });
  }
}

module.exports = { flirtCommand };