async function githubCommand(sock, chatId) {
    const repoInfo = `*🤖 Beltah Bot*\n
📁 *GitHub Repository:*
https://github.com/yourusername/BeltahBot

_⭐ Star the repo if you love Beltah!_
`;

    try {
        await sock.sendMessage(chatId, {
            text: repoInfo,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363161513685998@newsletter',
                    newsletterName: 'Beltah Bot',
                    serverMessageId: -1
                }
            }
        });
    } catch (error) {
        console.error('Error in github command:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching repository info.'
        });
    }
}

module.exports = githubCommand;