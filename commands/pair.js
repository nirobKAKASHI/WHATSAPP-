const axios = require('axios');
const fs = require('fs');
const fetch = require('node-fetch');

async function pairCommand(sock, chatId, message, m) {
  try {
    if (!m.quoted) {
      return await sock.sendMessage(chatId, {
        text: "💔 Oya, unataka ku-pair na nani? Reply kwa message ya mtu basi.",
        contextInfo: {
          forwardingScore: 1,
          isForwarded: true,
          mentionedJid: [m.sender],
          externalAdReply: {
            title: "BeltahBot ❤️",
            body: "Pairing Mode",
            mediaType: 1,
            previewType: "PHOTO",
            thumbnailUrl: null,
            renderLargerThumbnail: true
          }
        }
      });
    }

    const number = m.quoted.sender.split('@')[0];
    if (!/^\d+$/.test(number) || number.length < 9) {
      return await sock.sendMessage(chatId, {
        text: "😅 Bro, hiyo number si legit. Reply na message ya mtu halisi.",
        contextInfo: {
          forwardingScore: 1,
          isForwarded: true,
          mentionedJid: [m.sender],
          externalAdReply: {
            title: "BeltahBot ❤️",
            body: "Pairing Mode",
            mediaType: 1,
            previewType: "PHOTO",
            thumbnailUrl: null,
            renderLargerThumbnail: true
          }
        }
      });
    }

    await sock.sendMessage(chatId, {
      text: "⏳ Subiri kidogo... BeltahBot anacheki match yenu kama ni real love ama heartbreak inakuja 😬",
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        mentionedJid: [m.sender],
        externalAdReply: {
          title: "BeltahBot ❤️",
          body: "Match Processing...",
          mediaType: 1,
          previewType: "PHOTO",
          thumbnailUrl: null,
          renderLargerThumbnail: true
        }
      }
    });

    const response = await axios.get(`https://kingapis.xyz/api/pair?name=${number}&name2=${m.sender}`);
    if (!response.data || response.data.code !== 200) {
      throw new Error("Server haijibu vile inafaa.");
    }

    const { msg } = response.data;
    await sock.sendMessage(chatId, {
      text: `💞 ${msg}`,
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        mentionedJid: [m.sender, m.quoted.sender],
        externalAdReply: {
          title: "BeltahBot ❤️",
          body: "Match Results 🔥",
          mediaType: 1,
          previewType: "PHOTO",
          thumbnailUrl: null,
          renderLargerThumbnail: true
        }
      }
    });

  } catch (error) {
    console.error(error);
    await sock.sendMessage(chatId, {
      text: "🚫 Kumekuwa na error brathe, jaribu tena baadaye tu. Labda server ime-blow fuse 😵",
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        mentionedJid: [m.sender],
        externalAdReply: {
          title: "BeltahBot ❤️",
          body: "Error Mode 😓",
          mediaType: 1,
          previewType: "PHOTO",
          thumbnailUrl: null,
          renderLargerThumbnail: true
        }
      }
    });
  }
}

module.exports = pairCommand;

/*💘 Powered by BeltahBot | Customized by Ishaq Ibrahim*/