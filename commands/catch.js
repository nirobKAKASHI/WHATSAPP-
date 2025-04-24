module.exports = {
  name: "catch",
  alias: ["catchpoke", "catchpokemon"],
  category: "pokemon",
  desc: "Catch the currently spawned Pokémon",
  async run({ sock, m, text }) {
    global.spawnedPokemon = global.spawnedPokemon || {};
    global.userPokedex = global.userPokedex || {};

    const chatId = m.chat;
    const userId = m.sender;
    const spawned = global.spawnedPokemon[chatId];

    if (!spawned) {
      return await sock.sendMessage(chatId, {
        text: "❌ There's no Pokémon to catch right now!",
      }, { quoted: m });
    }

    if (!text) {
      return await sock.sendMessage(chatId, {
        text: `📝 Usage: *.catch ${spawned.name}*`
      }, { quoted: m });
    }

    if (text.toLowerCase() !== spawned.name.toLowerCase()) {
      return await sock.sendMessage(chatId, {
        text: `❌ That's not the correct Pokémon! Try again.`,
      }, { quoted: m });
    }

    // Catch success
    delete global.spawnedPokemon[chatId];
    global.userPokedex[userId] = global.userPokedex[userId] || { party: [], pc: [] };

    const userData = global.userPokedex[userId];
    const totalTeam = userData.party.length + userData.pc.length;

    if (userData.party.length < 6) {
      userData.party.push(spawned.name);
    } else {
      userData.pc.push(spawned.name);
    }

    await sock.sendMessage(chatId, {
      image: { url: spawned.image },
      caption: `🎉 You caught *${spawned.name}*!\n${
        userData.party.length <= 6
          ? "Added to your party!"
          : "Party full — sent to your PC!"
      }`,
    }, { quoted: m });
  },
};
