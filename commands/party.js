module.exports = {
  name: "party",
  category: "pokemon",
  desc: "View your current Pokémon party",
  async run({ sock, m }) {
    global.userPokedex = global.userPokedex || {};
    const user = global.userPokedex[m.sender];

    if (!user || user.party.length === 0) {
      return sock.sendMessage(m.chat, { text: "🚫 Your party is empty!" }, { quoted: m });
    }

    let msg = `🎒 *Your Party Pokémon:*\n\n`;
    user.party.forEach((name, i) => {
      msg += `${i + 1}. ${name.charAt(0).toUpperCase() + name.slice(1)}\n`;
    });

    sock.sendMessage(m.chat, { text: msg }, { quoted: m });
  },
};
