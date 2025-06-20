const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');
const { fromBuffer } = require('file-type');

// 🔧 BeltahBot Helper: delay for async stuff
exports.sleep = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 🔍 BeltahBot: fetch URL metadata (like site title)
exports.metaData = async (url) => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    return {
      title: $('title').text(),
      desc: $('meta[name="description"]').attr('content'),
    };
  } catch (err) {
    console.error('⚠️ Meta fetch error:', err.message);
    return null;
  }
};

// 🧠 Parse user info from message
exports.extractUser = async (msg) => {
  const sender = msg.key.participant || msg.key.remoteJid;
  const username = msg.pushName || '👤 User';
  return { sender, username };
};

// 📤 File uploader via Telegra.ph
exports.uploadFile = async (buffer, filename) => {
  try {
    const form = new FormData();
    form.append('file', buffer, filename);

    const res = await axios.post('https://telegra.ph/upload', form, {
      headers: form.getHeaders()
    });

    if (res.data.error) throw res.data.error;
    return 'https://telegra.ph' + res.data[0].src;

  } catch (err) {
    console.error('❌ Upload error:', err.message);
    return null;
  }
};

// 📥 Quick downloader from buffer
exports.saveBufferToFile = async (buffer, name) => {
  const type = await fromBuffer(buffer);
  const filename = `${name}.${type.ext}`;
  fs.writeFileSync(filename, buffer);
  return filename;
};

// 🛠️ Return file type (ext, mime)
exports.getFileType = async (buffer) => {
  try {
    const type = await fromBuffer(buffer);
    return { ext: type.ext, mime: type.mime };
  } catch (err) {
    console.error('❗ File type error:', err.message);
    return { ext: 'bin', mime: 'application/octet-stream' };
  }
};

// 🧠 Helper to format uptime
exports.formatUptime = (ms) => {
  let h = Math.floor(ms / 3600000);
  let m = Math.floor((ms % 3600000) / 60000);
  let s = Math.floor((ms % 60000) / 1000);
  return `${h}h ${m}m ${s}s`;
};

// 📦 Convert bytes to readable format
exports.toReadableSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};