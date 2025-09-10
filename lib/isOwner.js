
// isOwnerOrSudo.js

const settings = require('../settings');
const { isSudo } = require('./index');

// Helper: convert number to WhatsApp JID
function numberToJid(number) {
    // Ensure it's only digits, no spaces/symbols
    return number.replace(/\D/g, '') + "@s.whatsapp.net";
}

async function isOwnerOrSudo(senderId) {
    // Owner JID banano
    const ownerJid = numberToJid(settings.ownerNumber);

    if (senderId === ownerJid) return true;

    try {
        return await isSudo(senderId);
    } catch (e) {
        return false;
    }
}

module.exports = isOwnerOrSudo;
