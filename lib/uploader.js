/**
 * BeltahBot 🔺 Universal File Uploader
 * Replaces Sharp/Telegra.ph/etc. with Uguu uploader.
 * Supports: image, audio, video, webp, doc, etc.
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

/**
 * Upload any file to Beltah CDN (Uguu.se)
 * @param {string} filePath - Full path to local file
 * @returns {Promise<string>} - Direct file URL
 */
async function uploadFileToBeltahCDN(filePath) {
  const form = new FormData();
  form.append('files[]', fs.createReadStream(filePath));

  try {
    const response = await axios.post('https://uguu.se/upload.php', form, {
      headers: {
        ...form.getHeaders(),
        'User-Agent': 'BeltahBotUploader/1.0'
      }
    });

    if (response.data?.files?.[0]) {
      return response.data.files[0];
    } else {
      throw new Error('⚠️ Upload failed: Invalid server response');
    }
  } catch (err) {
    throw new Error(`🚫 Upload failed: ${err.message}`);
  }
}

module.exports = uploadFileToBeltahCDN;