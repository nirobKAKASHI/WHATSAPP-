module.exports = {
  name: "pc",
  category: "pokemon",
  desc: "View Pokémon stored in PC",
  async run({ sock, m }) {
    global.userPokedex = global.userPokedex || {};
    const user = global.userPokedex[m.sender];

    if (!user || user.pc.length === 0) {
      return sock.sendMessage(m.chat, { text: "💾 Your PC is empty!" }, { quoted: m });
    }

    let msg = `💽 *Pokémon in your PC:*\n\n`;
    user.pc.forEach((name, i) => {
      msg += `${i + 1}. ${name.charAt(0).toUpperCase() + name.slice(1)}\n`;
    });

    sock.sendMessage(m.chat, { text: msg }, { quoted: m });
  },
};
