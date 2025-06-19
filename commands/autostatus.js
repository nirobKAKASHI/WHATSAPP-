const fs = require('fs');
const { updateProfileStatus } = require('./myfunc');

// Long list of rotating BELTAH-style statuses
const statusMessages = [
  "💬 Ready to chat",
  "📡 Scanning network...",
  "⚙️ BELTAH System Running",
  "🔐 Encrypted Mode: ON",
  "💻 System Uptime Stable",
  "🤖 AI Core Active",
  "🔍 Monitoring traffic...",
  "✅ Online",
  "⏳ Busy, please wait...",
  "📶 Connected to BELTAH Mainframe",
  "🧠 Neural Engine Synced",
  "🔁 Auto-Response Protocol Ready",
  "🚀 BELTAH OS Booted",
  "🔄 Data loop processing...",
  "🛡️ Firewall Secured",
  "🧬 Intelligence Mode Enabled",
  "🔧 Maintenance window scheduled",
  "🌐 Listening on secure ports...",
  "📊 Live Logs: Active",
  "👁️ BELTAH Surveillance Online"
];

// Helper to get current formatted date & time
function getDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
  const time = now.toLocaleTimeString('en-GB'); // Format: HH:MM:SS
  return `${date} ${time}`;
}

// Main loop function
async function startAutoStatusLoop() {
  setInterval(async () => {
    try {
      const baseMessage = statusMessages[Math.floor(Math.random() * statusMessages.length)];
      const fullStatus = `${baseMessage} | ${getDateTime()}`;
      await updateProfileStatus(fullStatus);
      console.log(`[AutoStatus] Updated to: ${fullStatus}`);
    } catch (err) {
      console.error('[AutoStatus] Failed:', err);
    }
  }, 60 * 1000); // Update every 60 seconds
}

module.exports = startAutoStatusLoop; 