async function githubCommand(sock, chatId) {

    const repoInfo = `*🤖 BeltahBot MD*\n

📁 *GitHub Repository:*

🔗 https://github.com/Toxicant1/BeltahBot-MD

_💫 Star the repo if you vibe with Beltah!_

🔒 *Bot Locked to:* +254741819582

`;

    try {

        await sock.sendMessage(chatId, {

            text: repoInfo,

            contextInfo: {

                forwardingScore: 1,

                isForwarded: true,

                externalAdReply: {

                    title: "BeltahBot on GitHub",

                    body: "Fully Custom WhatsApp Bot by Ishaq",

                    mediaType: 1,

                    renderLargerThumbnail: true,

                    thumbnailUrl: "https://i.imgur.com/dI4xslD.jpg", // Optional: your bot logo image link

                    sourceUrl: "https://github.com/Toxicant1/BeltahBot-MD"

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