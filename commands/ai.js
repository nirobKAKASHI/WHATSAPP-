const axios = require('axios');
const fetch = require('node-fetch');

async function aiCommand(sock, chatId, message) {
  try {
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text;

    if (!text) {
      return await sock.sendMessage(chatId, {
        text: 'Please provide a question after .ai command\n\nExample: *.ai What is HTML?*',
      });
    }

    // Extract command and query
    const parts = text.trim().split(' ');
    const command = parts[0].toLowerCase(); // .ai
    const query = parts.slice(1).join(' ');

    if (!query) {
      return await sock.sendMessage(chatId, {
        text: '❌ Please provide a question after the command.',
      });
    }

    // Show thinking/loading message
    await sock.sendMessage(chatId, {
      react: { text: '🧠', key: message.key },
    });

    // === Step 1: Ask all three AIs ===
    const encoded = encodeURIComponent(query);
    const responses = {};

    try {
      responses.gpt = await axios.get(`https://api.safone.me/chatgpt?q=${encoded}`);
    } catch {
      responses.gpt = { data: { result: 'GPT failed to respond.' } };
    }

    try {
      responses.gemini = await axios.get(`https://vid.glitch.me/gemini?q=${encoded}`);
    } catch {
      responses.gemini = { data: { result: 'Gemini failed to respond.' } };
    }

    try {
      responses.claude = await axios.get(`https://api.example.com/claude?q=${encoded}`);
    } catch {
      responses.claude = { data: { result: 'Claude failed to respond.' } };
    }

    // === Step 2: Ask ChatGPT to summarize ===
    const mergePrompt = `
You are BeltaHBot. Three different AI models answered this question: "${query}"

🟢 GPT: ${responses.gpt?.data?.result}
🔵 Gemini: ${responses.gemini?.data?.result}
🟣 Claude: ${responses.claude?.data?.result}

Now give the best final answer by combining or selecting the most helpful info from the above.
`;

    const final = await axios.get(`https://api.safone.me/chatgpt?q=${encodeURIComponent(mergePrompt)}`);
    const finalAnswer = final.data?.result || '⚠️ Unable to generate final response.';

    // === Step 3: Send answer back ===
    await sock.sendMessage(chatId, {
      text: `🤖 *BeltaHBot AI Answer:*\n\n${finalAnswer}`,
      quoted: message
    });

  } catch (error) {
    console.error('[AI Fusion Error]', error);
    await sock.sendMessage(chatId, {
      text: '❌ An error occurred. Please try again later.',
      contextInfo: {
        mentionedJid: [message.key.participant || message.key.remoteJid],
        quotedMessage: message.message
      }
    });
  }
}

module.exports = aiCommand;