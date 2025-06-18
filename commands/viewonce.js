const fs = require('fs');
const fetch = require('node-fetch');
const { imageToWebp } = require('some-image-lib'); // adjust to your actual import

async function newoneCommand(sock, chatId, message, args, quoted) {
  try {
    // 🔁 Check valid context & args
    if (!quoted || !quoted.imageMessage) {
      return await sock.sendMessage(chatId, {
        text: "❌ Reply to an image na use `.newone <snapcaption>` kuweka caption!",
        quoted: message
      });
    }
    if (!args.length) {
      return await sock.sendMessage(chatId, {
        text: "⚠️ Oya, unachoma caption? Use `.newone This is lit!`",
        quoted: message
      });
    }

    const caption = args.join(' ');
    const media = quoted.imageMessage;
    await sock.sendMessage(chatId, { text: "⏳ Chill, BeltahBot iko processing picha yako..." });

    // 📥 Download the image
    const stream = await downloadMediaMessage(
      { key: quoted.key, message: media },
      'buffer',
      {},
      { reuploadRequest: sock.updateMediaMessage }
    );
    if (!stream) throw new Error("No image stream");

    // 🖼️ Convert & add caption watermark
    const watermarked = await imageToWebp(stream, { caption, footer: 'By BeltahBot' });

    // 📤 Send result
    await sock.sendMessage(chatId, {
      image: watermarked,
      caption: `✅ Here is your new image, boss!`,
      quoted: message
    });

  } catch (err) {
    console.error("❗ Error in newone command:", err);
    await sock.sendMessage(chatId, {
      text: "🚫 Kitu kimeanguka processing hii picha. Jaribu tena baadaye!",
      quoted: message
    });
  }
}

module.exports = { newoneCommand };