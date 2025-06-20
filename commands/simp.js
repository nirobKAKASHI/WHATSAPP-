module.exports = async function simpCommand(sock, chatId, quotedMsg, mentionedJid, sender) {
    try {
        // Identify target (quoted, mentioned, or sender)
        let who = quotedMsg
            ? quotedMsg.sender
            : mentionedJid?.[0]
                ? mentionedJid[0]
                : sender;

        const number = who.split('@')[0];

        // Simulated simp level (random)
        const simpLevel = Math.floor(Math.random() * 50) + 50; // between 50% and 100%
        const remarks = [
            "Ebu relax boss 😹",
            "You're deep in the simp zone 💘",
            "Unaweza enda love rehab 😭",
            "Kumbe wewe ni top tier simp 😍",
            "Hii level ya kupenda imezidi bana 🔥"
        ];
        const randomRemark = remarks[Math.floor(Math.random() * remarks.length)];

        // Send fun simp result
        await sock.sendMessage(chatId, {
            text: `🫦 *BeltahBot SimpMeter™*\n\n@${number} is *${simpLevel}% SIMP* 🔥\n${randomRemark}`,
            mentions: [who]
        }, { quoted: quotedMsg });

    } catch (err) {
        console.error('🔥 Error in BeltahBot simp command:', err);
        await sock.sendMessage(chatId, {
            text: `❌ *BeltahBot:* Siwezi ku-calculate SIMP level sa hii. Try tena baadaye bana 😓`
        }, { quoted: quotedMsg });
    }
};