const { fetchBuffer } = require('../lib/myfunc');
const axios = require('axios');

async function imagineCommand(sock, chatId, message) {
    try {
        const prompt = message.message?.conversation?.trim() || 
                      message.message?.extendedTextMessage?.text?.trim() || '';

        const imagePrompt = prompt.slice(8).trim(); // Remove ".imagine" or prefix

        if (!imagePrompt) {
            await sock.sendMessage(chatId, {
                text: '🧠 Beltah AI needs a description!\n\n_Example_: `.imagine a flying car in Nairobi at sunset 🌇`'
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, {
            text: '🎨 *Beltah AI* is cooking your art... kaende polepole 😎...'
        }, { quoted: message });

        // Enhance the prompt
        const enhancedPrompt = enhancePrompt(imagePrompt);

        // 🔁 Simulating call to CrewDrew (image AI) — replace below URL with actual image generation endpoint if needed
        const response = await axios.get(`https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}`, {
            responseType: 'arraybuffer'
        });

        const imageBuffer = Buffer.from(response.data);

        await sock.sendMessage(chatId, {
            image: imageBuffer,
            caption: `🖼️ *Beltah's Creation for*: "${imagePrompt}"\n\n_Powered by CrewDrew x ChatGPT_`
        }, { quoted: message });

    } catch (error) {
        console.error('🔥 Error in BeltahBot imagine command:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Beltah AI failed kuleta hiyo picha. Try again later ama toa prompt ingine bana.'
        }, { quoted: message });
    }
}

// Enhance prompts for better visual quality
function enhancePrompt(prompt) {
    const qualityEnhancers = [
        'high quality', 'detailed', 'masterpiece', 'best quality',
        'ultra realistic', '4k', 'highly detailed',
        'professional photography', 'cinematic lighting', 'sharp focus'
    ];
    const numEnhancers = Math.floor(Math.random() * 2) + 3;
    const selected = qualityEnhancers.sort(() => 0.5 - Math.random()).slice(0, numEnhancers);
    return `${prompt}, ${selected.join(', ')}`;
}

module.exports = imagineCommand;