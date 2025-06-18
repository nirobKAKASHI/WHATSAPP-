const fetch = require('node-fetch');

async function dareCommand(sock, chatId, message) {
  try {
    const shizokeys = 'knightbot';
    const res = await fetch(`https://api.shizo.top/api/quote/dare?apikey=${shizokeys}`);

    if (!res.ok) {
      throw new Error(await res.text());
    }

    const json = await res.json();
    const dareMessage = json.result;

    await sock.sendMessage(chatId, {
      text: `😈 *Dare Time!* \n\n👉🏽 _${dareMessage}_\n\n🔥 Cheza kama wewe!`,
      quoted: message,
    });

  } catch (error) {
    console.error('Error in dare command:', error);
    await sock.sendMessage(chatId, {
      text: '❌ Eish! Dare haikuweza kupatikana. Try tena baadaye!',
      quoted: message,
    });
  }
}

module.exports = { dareCommand };
