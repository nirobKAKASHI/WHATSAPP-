/**
 * BeltahBot - A WhatsApp Bot
 * Copyright (c) 2024 Ishaq Ibrahim
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the MIT License.
 *
 * Credits:
 * - Baileys Library by @adiwajshing
 * - Pair Code implementation inspired by TechGod1418 & Doxeon
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

function ffmpeg(buffer, args = [], ext = '', ext2 = '') {
  return new Promise(async (resolve, reject) => {
    try {
      const tmp = path.join(__dirname, '../database', +new Date + ext);
      const out = tmp + '.' + ext2;
      await fs.promises.writeFile(tmp, buffer);
      spawn('ffmpeg', ['-y', '-i', tmp, ...args, out])
        .on('error', reject)
        .on('close', async (code) => {
          try {
            await fs.promises.unlink(tmp);
            if (code === 0) return resolve(await fs.promises.readFile(out));
            await fs.promises.unlink(out);
            reject(new Error('FFmpeg failed'));
          } catch (e) {
            reject(e);
          }
        });
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Convert Audio to Playable WhatsApp Audio
 * @param {Buffer} buffer Audio Buffer
 * @param {string} ext File Extension
 */
function toAudio(buffer, ext) {
  return ffmpeg(buffer, [
    '-vn',
    '-c:a', 'libopus',
    '-b:a', '128k',
    '-vbr', 'on',
    '-compression_level', '10'
  ], ext, 'opus');
}

/**
 * Convert Audio to WhatsApp PTT (Push-To-Talk)
 * @param {Buffer} buffer Audio Buffer
 * @param {string} ext File Extension
 */
function toPTT(buffer, ext) {
  return ffmpeg(buffer, [
    '-vn',
    '-c:a', 'libopus',
    '-b:a', '128k',
    '-vbr', 'on',
    '-compression_level', '10'
  ], ext, 'opus');
}

/**
 * Convert Audio to Video (for sticker, etc.)
 * @param {Buffer} buffer Video Buffer
 * @param {string} ext File Extension
 */
function toVideo(buffer, ext) {
  return ffmpeg(buffer, [
    '-c:v', 'libx264',
    '-crf', '28',
    '-ab', '128k',
    '-ar', '44100',
    '-vf', 'scale=512:-1',
    '-preset', 'slow'
  ], ext, 'mp4');
}

module.exports = {
  toAudio,
  toPTT,
  toVideo,
  ffmpeg
};