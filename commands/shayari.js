const fetch = require('node-fetch');

async function shayariCommand(sock, chatId, message) {
  try {
    // 🔄 Fetch Shayari from the API
    const response = await fetch('https://api.shizo.top/api/quote/shayari?apikey=beltahbot');
    const data = await response.json();

    if (!data || !data.result) {
      throw new Error('Hakuna data ya Shayari kutoka kwa API 💔');
    }

    const buttons = [
      { buttonId: '.shayari', buttonText: { displayText: '📝 Shayari Nyingine' }, type: 1 },
      { buttonId: '.roseday', buttonText: { displayText: '🌹 Rose Day Vibes' }, type: 1 }
    ];

    await sock.sendMessage(chatId, {
      text: `💌 *Beltah Shayari Drop!* 💌\n\n${data.result}`,
      buttons,
      headerType: 1
    }, { quoted: message });

  } catch (error) {
    console.error('⚠️ Error in shayari command:', error);
    await sock.sendMessage(chatId, {
      text: '😓 Ndio hii imekataa kufetch Shayari. Jaribu tena baadaye bana...',
    }, { quoted: message });
  }
}

module.exports = { shayariCommand };