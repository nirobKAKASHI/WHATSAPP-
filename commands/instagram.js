const { igdl } = require('ruhend-scraper');

// To avoid duplicate processing
const processedMessages = new Set();

async function instagramCommand(sock, chatId, message) {
  try {
    // Skip if already processed
    if (processedMessages.has(message.key.id)) return;

    // Store the message ID
    processedMessages.add(message.key.id);

    // Auto-remove after 5 minutes
    setTimeout(() => {
      processedMessages.delete(message.key.id);
    }, 5 * 60 * 1000);

    const text = message.message?.conversation ||
                 message.message?.extendedTextMessage?.text || '';

    if (!text) {
      return await sock.sendMessage(chatId, {
        text: '📎 Yo! Drop the Insta link first so I can fetch it for you 📥',
        quoted: message
      });
    }

    // Instagram link patterns
    const instagramPatterns = [
      /https?:\/\/(www\.)?instagram\.com\/[^\s]+/,
      /https?:\/\/(www\.)?instagr\.am\/[^\s]+/
    ];

    const isValidUrl = instagramPatterns.some(pattern => pattern.test(text));

    if (!isValidUrl) {
      return await sock.sendMessage(chatId, {
        text: '🚫 That doesn’t look like a valid Instagram link. Gimme a proper post, reel or video link 😅',
        quoted: message
      });
    }

    // React to show it’s working
    await sock.sendMessage(chatId, {
      react: { text: '⏬', key: message.key }
    });

    const downloadData = await igdl(text);

    if (!downloadData || !downloadData.data || downloadData.data.length === 0) {
      return await sock.sendMessage(chatId, {
        text: '😓 Couldn’t find anything at that link. Try another one maybe?',
        quoted: message
      });
    }

    const mediaData = downloadData.data;
    for (let i = 0; i < Math.min(2, mediaData.length); i++) {
      const media = mediaData[i];
      const mediaUrl = media.url;

      const isVideo = /\.(mp4|mov|avi|mkv|webm)$/i.test(mediaUrl) ||
                      media.type === 'video' ||
                      text.includes('/reel/') ||
                      text.includes('/tv/');

      if (isVideo) {
        await sock.sendMessage(chatId, {
          video: { url: mediaUrl },
          mimetype: 'video/mp4',
          caption: '🎬 DOWNLOADED BY BELTAH',
          quoted: message
        });
      } else {
        await sock.sendMessage(chatId, {
          image: { url: mediaUrl },
          caption: '📸 DOWNLOADED BY BELTAH',
          quoted: message
        });
      }
    }

  } catch (error) {
    console.error('[ERROR - Instagram CMD]', error);
    await sock.sendMessage(chatId, {
      text: '❌ Oops! Something went wrong while downloading that Insta post.',
      quoted: message
    });
  }
}

module.exports = instagramCommand;