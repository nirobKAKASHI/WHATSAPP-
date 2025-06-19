const axios = require('axios');

module.exports = async function quoteCommand(sock, chatId, message) {
    try {
        // Try public quote API
        const res = await axios.get('https://api.quotable.io/random');

        const quote = res.data.content;
        const author = res.data.author;

        const quoteMessage = `📝 *Quote of the moment*\n\n_"${quote}"_\n\n— *${author}*`;

        await sock.sendMessage(chatId, { text: quoteMessage }, { quoted: message });

    } catch (error) {
        console.error('🔥 Error in BeltahBot quote command:', error);

        // Fallback to hardcoded quotes if API fails
        const fallbackQuotes = [
            `"Success sio bahati, ni juhudi na consistency 💪"`,
            `"Hustle silently, results ziongee loud 🔥"`,
            `"Life ni safari, enjoy the ride 🚗💨"`,
            `"Kama haujashindwa, haujajaribu vya kutosha 😤"`,
            `"Chapa kazi, God ata-open doors 🛐🚪"`
        ];
        const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];

        await sock.sendMessage(chatId, {
            text: `📝 *Beltah's fallback wisdom:*\n\n_${randomQuote}_`
        }, { quoted: message });
    }
};