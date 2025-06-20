const yts = require('yt-search');
const axios = require('axios');

async function playCommand(sock, chatId, message) {
  try {
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
    const searchQuery = text.split(' ').slice(1).join(' ').trim();

    if (!searchQuery) {
      return await sock.sendMessage(chatId, {
        text: "🎵 Niambie jina ya wimbo unataka kudownload aje?"
      });
    }

    // Search for the song
    const { videos } = await yts(searchQuery);
    if (!videos || videos.length === 0) {
      return await sock.sendMessage(chatId, {
        text: "😔 Hakuna wimbo kama huo nimepata, jaribu jina tofauti."
      });
    }

    // Send loading message
    await sock.sendMessage(chatId, {
      text: "_⏳ Subiri kidogo... BeltahBot anakuletea mziki yako..._"
    });

    // Get the first video result
    const video = videos[0];
    const urlYt = video.url;

    // Fetch audio data from API
    const response = await axios.get(`https://apis-keith.vercel.app/download/dlmp3?url=${urlYt}`);
    const data = response.data;

    if (!data || !data.status || !data.result || !data.result.downloadUrl) {
      return await sock.sendMessage(chatId, {
        text: "❌ Imeshindikana kudownload audio. Try tena baadaye boss."
      });
    }

    const audioUrl = data.result.downloadUrl;
    const title = data.result.title;

    // Send the audio
    await sock.sendMessage(chatId, {
      audio: { url: audioUrl },
      mimetype: "audio/mpeg",
      fileName: `${title}.mp3`
    }, { quoted: message });

  } catch (error) {
    console.error('Error in playCommand:', error);
    await sock.sendMessage(chatId, {
      text: "❌ Imeshindikana kudownload mziki. Jaribu tena baadaye."
    });
  }
}

module.exports = playCommand;

/*⚙️ Powered by BeltahBot*/
/*💡 Customized by Ishaq Ibrahim*/