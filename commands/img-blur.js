const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const Jimp = require('jimp');
const axios = require('axios');
const FormData = require('form-data');

async function blurCommand(sock, chatId, message, quotedMessage) {
  try {
    let imageBuffer;

    // STEP 1: Get the image to blur
    if (quotedMessage) {
      if (!quotedMessage.imageMessage) {
        await sock.sendMessage(chatId, {
          text: '❌ Tafadhali reply kwa picha ama tumia caption `.blur` kwa image message.'
        });
        return;
      }

      const quoted = {
        message: {
          imageMessage: quotedMessage.imageMessage
        }
      };

      imageBuffer = await downloadMediaMessage(quoted, 'buffer', {}, {});
    } else if (message.message?.imageMessage) {
      imageBuffer = await downloadMediaMessage(message, 'buffer', {}, {});
    } else {
      await sock.sendMessage(chatId, {
        text: '❌ Reply kwa image ama tuma image na caption `.blur`'
      });
      return;
    }

    // STEP 2: Process image with Jimp
    const image = await Jimp.read(imageBuffer);
    image
      .resize(800, Jimp.AUTO)      // Resize to width max 800px
      .blur(10)                    // Apply blur
      .quality(80);                // Reduce size & optimize

    const blurredBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);

    // STEP 3: Upload to uguu.se CDN
    const form = new FormData();
    form.append('files[]', blurredBuffer, { filename: 'blurred.jpg' });

    const uploadResponse = await axios.post('https://uguu.se/upload.php', form, {
      headers: {
        ...form.getHeaders(),
        'User-Agent': 'BeltahBot'
      }
    });

    const fileUrl = uploadResponse.data.files[0]; // This is the public URL

    // STEP 4: Send public link via WhatsApp
    await sock.sendMessage(chatId, {
      text: `✅ *Blurred Image Link:*\n${fileUrl}`,
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363161513058998@newsletter',
          newsletterName: 'BeltahBot',
          serverMessageId: -1
        }
      }
    });

  } catch (error) {
    console.error('Error in blur command:', error);
    await sock.sendMessage(chatId, {
      text: '❌ Failed to blur or upload image. Jaribu tena baadaye.'
    });
  }
}

module.exports = blurCommand;