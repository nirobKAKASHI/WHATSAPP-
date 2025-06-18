const axios = require('axios');
const maker = require('mumaker');

async function textmakerCommand(sock, chatId, message, args, type) {
  try {
    const text = args.join(' ');
    if (!text) {
      return await sock.sendMessage(chatId, {
        text: "📝 Ebu type the text you want me to design, bro. Si uache blank bana 😅",
        quoted: message
      });
    }

    let result;
    switch (type) {
      case 'glitch':
        result = await maker.textpro("https://textpro.me/create-impressive-glitch-text-effects-online-1027.html", text);
        break;
      case 'glow':
        result = await maker.textpro("https://textpro.me/create-light-glow-sliced-text-effect-online-1068.html", text);
        break;
      case 'graffiti':
        result = await maker.textpro("https://textpro.me/create-cool-graffiti-text-effect-online-1010.html", text);
        break;
      case 'neon':
        result = await maker.textpro("https://textpro.me/neon-light-text-effect-online-882.html", text);
        break;
      case 'sketch':
        result = await maker.textpro("https://textpro.me/create-a-sketch-text-effect-online-1044.html", text);
        break;
      case 'metal':
        result = await maker.textpro("https://textpro.me/create-metallic-text-glow-online-1040.html", text);
        break;
      case 'joker':
        result = await maker.textpro("https://textpro.me/create-a-joker-text-effect-online-1016.html", text);
        break;
      case 'blackpink':
        result = await maker.textpro("https://textpro.me/create-blackpink-logo-style-online-1001.html", text);
        break;
      case 'horror':
        result = await maker.textpro("https://textpro.me/horror-blood-text-effect-online-883.html", text);
        break;
      case 'bear':
        result = await maker.textpro("https://textpro.me/online-black-and-white-bear-mascot-logo-creation-1012.html", text);
        break;
      default:
        return await sock.sendMessage(chatId, {
          text: "⚠️ Aje sasa? Hiyo style haiko. Try something like `neon`, `glow`, `graffiti`, etc.",
          quoted: message
        });
    }

    await sock.sendMessage(chatId, {
      image: { url: result },
      caption: `✅ *BeltahBot imekusort, boss!*\n🎨 *Style:* ${type}\n🧾 *Text:* ${text}`,
      quoted: message
    });

  } catch (error) {
    console.error('🚨 Error in textmaker command:', error);
    await sock.sendMessage(chatId, {
      text: "😢 Aki mazee, kuna error kwa kutengeneza text. Try tena after a few mins, ama badilisha style kidogo.",
      quoted: message
    });
  }
}

module.exports = textmakerCommand;

/*⚡ BeltahBot — Stay fresh with your style */
/*🔥 Edited by Ishaq Ibrahim */