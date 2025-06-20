const fetch = require('node-fetch');

async function rosedayCommand(sock, chatId, message) {
  try {
    const shizokeys = 'knightbot'; // API key stays unchanged
    const res = await fetch(`https://api.shizo.top/quote/roseday?apikey=${shizokeys}`);

    if (!res.ok) {
      throw await res.text();
    }

    const json = await res.json();
    const rosedayMessage = json.result;

    // Send the roseday message
    await sock.sendMessage(chatId, {
      text: `🌹 *Rose Day Special!* 🌹\n\n${rosedayMessage}`,
      quoted: message
    });

  } catch (error) {
    console.error('Error in roseday command:', error);
    await sock.sendMessage(chatId, {
      text: `❌ Aki nimekwama kupata *Rose Day quote* 😢\nJaribu tena baadae bro!`,
      quoted: message
    });
  }
}

module.exports = { rosedayCommand };