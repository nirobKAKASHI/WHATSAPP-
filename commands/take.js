const fs = require('fs');
const path = require('path');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const webp = require('node-webpmux');
const crypto = require('crypto');

async function takeCommand(sock, chatId, message, args) {
  try {
    // 🔁 Check if message is a reply to a sticker
    const quotedMessage = message.message?.extendedTextMessage?.contextInfo;
    if (!quotedMessage?.stickerMessage) {
      await sock.sendMessage(chatId, {
        text: `❌ Reply to a sticker with *.take <packname>* kuedit metadata.`,
      });
      return;
    }

    // 📦 Get the packname or set default
    const packname = args.join(' ') || 'Beltah Bot 💌';

    try {
      // 📥 Download the sticker
      const stickerBuffer = await downloadMediaMessage(
        { key: message.message.extendedTextMessage.contextInfo.stanzaId, message: quotedMessage },
        'buffer',
        {},
        { logger: console, reuploadRequest: sock.updateMediaMessage }
      );

      if (!stickerBuffer) {
        await sock.sendMessage(chatId, { text: `❌ Failed to download sticker!` });
        return;
      }

      // 🛠 Add metadata using webpmux
      const img = new webp.Image();
      await img.load(stickerBuffer);

      const json = {
        'sticker-pack-id': crypto.randomBytes(32).toString('hex'),
        'sticker-pack-name': packname,
        'emojis': ['🔥'],
      };

      const exifAttr = Buffer.from([
        0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00,
        0x07, 0x00, 0x01, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00
      ]);

      const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf-8');
      const exif = Buffer.concat([exifAttr, jsonBuffer]);
      exif.writeUIntLE(jsonBuffer.length, 14, 4);

      img.exif = exif;

      const finalBuffer = await img.save(null);

      await sock.sendMessage(chatId, {
        sticker: finalBuffer
      });

    } catch (error) {
      console.error('⚠️ Sticker processing error:', error);
      await sock.sendMessage(chatId, {
        text: `⚠️ Error while processing the sticker! Jaribu tena.`
      });
    }

  } catch (error) {
    console.error('⚠️ General error in takeCommand:', error);
    await sock.sendMessage(chatId, {
      text: `⚠️ Kuna error bana. Retry hiyo command.`
    });
  }
}

module.exports = takeCommand;