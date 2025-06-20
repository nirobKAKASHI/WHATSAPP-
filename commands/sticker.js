const {
  downloadMediaMessage
} = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

module.exports = {
  name: 'sticker',
  alias: ['stik', 'skt'],
  desc: '🎭 Tuma picha ama video, nitakurushia stika safi kabisa!',
  category: 'media',
  use: '<reply image/video>',
  cooldown: 5,
  async execute(m, sock, text, args) {
    try {
      const quoted = m.quoted ? m.quoted : m;
      const mime = (quoted.msg || quoted).mimetype || '';

      if (!mime.includes('image') && !mime.includes('video')) {
        return m.reply('⚠️ Bro, reply na picha ama video fupi ndo nikutengenezee sticker 🔄');
      }

      m.reply('⏳ Weka tu hapo, Belta anaandaa stika yako...');

      const mediaPath = path.join(__dirname, '../../temp', `${Date.now()}`);
      const extension = mime.includes('image') ? '.jpg' : '.mp4';
      const inputPath = mediaPath + extension;
      const outputPath = mediaPath + '.webp';

      // Download media
      const mediaBuffer = await downloadMediaMessage(quoted, 'buffer', {}, { reuploadRequest: sock });
      fs.writeFileSync(inputPath, mediaBuffer);

      // Convert to WebP using GIMP or fallback (ffmpeg)
      if (mime.includes('image')) {
        exec(`gimp -i -b '(let* ((img (car (gimp-file-load RUN-NONINTERACTIVE "${inputPath}" "${inputPath}"))) (drawable (car (gimp-image-get-active-layer img)))) (file-webp-save RUN-NONINTERACTIVE img drawable "${outputPath}" "${outputPath}" 0 1 0 0))' -b '(gimp-quit 0)'`, async (err) => {
          if (err || !fs.existsSync(outputPath)) {
            console.error('GIMP error:', err);
            return m.reply('💔 Pole boss, stika imekata kutengenezwa. Try tena baadaye.');
          }

          const stickerBuffer = fs.readFileSync(outputPath);
          await sock.sendMessage(m.chat, {
            sticker: stickerBuffer
          }, { quoted: m });

          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);
        });

      } else if (mime.includes('video')) {
        // Limit video duration
        exec(`ffmpeg -i "${inputPath}" -vf "scale=320:320:force_original_aspect_ratio=decrease" -t 8 -r 15 -an -c:v libwebp -loop 0 -preset default -y "${outputPath}"`, async (err) => {
          if (err || !fs.existsSync(outputPath)) {
            console.error('FFmpeg error:', err);
            return m.reply('😵‍💫 Aki video yako imegoma kubadilika. Hakikisha haizidi 8 seconds!');
          }

          const stickerBuffer = fs.readFileSync(outputPath);
          await sock.sendMessage(m.chat, {
            sticker: stickerBuffer
          }, { quoted: m });

          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);
        });
      }

    } catch (error) {
      console.error('Sticker command error:', error);
      m.reply('😢 Belta ameshindwa kutengeneza hii stika. Jaribu tena bro!');
    }
  }
};