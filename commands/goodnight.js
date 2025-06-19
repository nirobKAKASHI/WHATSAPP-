const fetch = require('node-fetch');

async function goodnightCommand(sock, chatId, message) {
  try {
    const shizokeys = 'knightbot';
    const res = await fetch(`https://api.shizo.top/api/quote/gnsd?apikey=${shizokeys}`);

    if (!res.ok) {
      throw new Error('API response not okay');
    }

    const json = await res.json();
    const goodnightMessage = json.result || '🌙 Goodnight! Rest well and dream big. – From Beltah 💫';

    await sock.sendMessage(chatId, {
      text: `💤 *Beltah says:* ${goodnightMessage}`,
      quoted: message
    });

  } catch (error) {
    console.error('Error in goodnight command:', error);

    await sock.sendMessage(chatId, {
      text: '❌ Oops! Beltah couldn’t get a goodnight message right now. Try again later!',
      quoted: message
    });
  }
}

module.exports = { goodnightCommand };