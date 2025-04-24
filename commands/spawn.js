module.exports = {
  name: "spawnpokemon",
  alias: ["spawnpoke", "spawnpkmn"],
  category: "pokemon",
  desc: "Spawns a random Pokémon with its image (20m cooldown)",
  async run({ sock, m }) {
    const chatId = m.chat;
    const cooldown = 20 * 60 * 1000; // 20 minutes in ms

    global.spawnedPokemon = global.spawnedPokemon || {};
    global.spawnCooldown = global.spawnCooldown || {};

    // Cooldown check
    const lastUsed = global.spawnCooldown[chatId] || 0;
    const now = Date.now();
    if (now - lastUsed < cooldown) {
      const minutesLeft = Math.ceil((cooldown - (now - lastUsed)) / 60000);
      return await sock.sendMessage(chatId, {
        text: `⏳ You must wait *${minutesLeft} minutes* before spawning again.`,
      }, { quoted: m });
    }

    try {
      const pokeId = Math.floor(Math.random() * 898) + 1;
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeId}`);
      const data = await res.json();

      const name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
      const image = data.sprites.other['official-artwork'].front_default;

      if (!image) {
        return await sock.sendMessage(chatId, {
          text: `❌ Failed to load image for ${name}.`
        }, { quoted: m });
      }

      global.spawnedPokemon[chatId] = { name: name.toLowerCase(), image };
      global.spawnCooldown[chatId] = now;

      await sock.sendMessage(chatId, {
        image: { url: image },
        caption: `✨ A wild *${name}* appeared!\n\nType *.catch ${name}* to catch it!`
      }, { quoted: m });

    } catch (err) {
      console.error("Spawn Error:", err);
      await sock.sendMessage(chatId, {
        text: "❌ Could not spawn a Pokémon right now. Try again later."
      }, { quoted: m });
    }
  }
};
