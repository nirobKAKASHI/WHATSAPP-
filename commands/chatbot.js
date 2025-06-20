const axios = require('axios');
const { channelInfo } = require('../lib/messageConfig');

function removeEmojis(text) {
  return text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])+/, '').trim();
}

async function characterCommand(sock, chatId, message) {
  let userToAnalyze;

  if (message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
    userToAnalyze = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
  } else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
    userToAnalyze = message.message.extendedTextMessage.contextInfo.participant;
  }

  if (!userToAnalyze) {
    await sock.sendMessage(chatId, {
      text: '⚡ Tag mtu ama reply kwa message yao, si unajua Beltah anataka character ya mtu fulani bro 🤔',
      ...channelInfo
    });
    return;
  }

  try {
    let profilePic;
    try {
      profilePic = await sock.profilePictureUrl(userToAnalyze, 'image');
    } catch {
      profilePic = 'https://i.imgur.com/2wxGhpf.jpg';
    }

    const traits = [
      'Creative', 'Ambitious', 'Confident', 'Caring', 'Energetic',
      'Loyal', 'Honest', 'Funny', 'Smart', 'Kind',
      'Independent', 'Optimistic', 'Sincere', 'Charming', 'Focused',
      'Supportive', 'Adventurous', 'Chill', 'Organized', 'Social'
    ];

    const numTraits = Math.floor(Math.random() * 3) + 3;
    const selectedTraits = [];
    while (selectedTraits.length < numTraits) {
      const trait = traits[Math.floor(Math.random() * traits.length)];
      if (!selectedTraits.includes(trait)) {
        selectedTraits.push(trait);
      }
    }

    const traitPercents = selectedTraits.map(trait => {
      const percent = Math.floor(Math.random() * 41) + 60;
      return `➤ ${trait}: *${percent}%*`;
    });

    const overall = Math.floor(Math.random() * 21) + 80;

    const responses = [
      '😮‍💨 Huyu ni fire emoji ya mtaa, no kizzi!',
      '🔥 Bro ako na vibe ya “huyo ni wa keep” straight up.',
      '😂 Hapa kuna character ya mtu hucheka hadi unalia!',
      '🤯 Energy ya huyu mtu ni next level, kama uko na stress muite tu.',
      '😎 Huyu ni OG, akitembea mtaa inatulia venye iko.',
      '💅 Character iko clean, ni kama aliwashwa na soft life.',
      '🥰 Ukiangalia huyu, roho inatulia kama playlist ya Sauti Sol.',
      '💔 Mrembo lakini anapenda kutesa akili ya watu.',
      '👑 Huyu anabeba crown ya “vibez na viwango” bila kupambana.',
      '📌 Hatari! Huyu mtu ni bundle ya jokes, charm na moyo soft.'
    ];

    const randomComment = responses[Math.floor(Math.random() * responses.length)];

    const analysis = `*🔍 BeltahBot - Vibe Ya Character Check!*\n\n👤 *User:* @${userToAnalyze.split('@')[0]}\n${randomComment}\n\n📊 *Key Traits:*\n${traitPercents.join('\n')}\n\n💯 *Overall Rating:* *${overall}/100*\n\n🧠 _Relax tu, hii ni character ya mtaa ya Beltah. Usichukulie serious bana._`;

    await sock.sendMessage(chatId, {
      image: { url: profilePic },
      caption: analysis,
      mentions: [userToAnalyze],
      ...channelInfo
    });

  } catch (error) {
    console.error('[CHARACTER CMD ERROR]', error);
    await sock.sendMessage(chatId, {
      text: '😬 Beltah amestuck kwa traffic ya vibes. Try again later!',
      ...channelInfo
    });
  }
}

module.exports = characterCommand;