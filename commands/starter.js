module.exports = function handlePokemonCommands(msg) {
    const text = msg.body.toLowerCase();

    if (text === '/starter') {
        return msg.reply(
            '🎮 Choose your starter:\n🔥 Charmander\n🌱 Bulbasaur\n💧 Squirtle\n\nType `/choose <name>` to pick!'
        );
    }

    if (text.startsWith('/choose')) {
        const chosen = text.split(' ')[1];
        const starters = ['charmander', 'bulbasaur', 'squirtle'];
        if (starters.includes(chosen)) {
            return msg.reply(`✅ You chose ${chosen.charAt(0).toUpperCase() + chosen.slice(1)}!`);
        } else {
            return msg.reply('❌ Invalid choice! Use `/choose charmander`, `/choose bulbasaur`, or `/choose squirtle`');
        }
    }
};
