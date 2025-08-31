const axios = require("axios");

async function animeCommand(sock, chatId, message, args) {
    const query = args && args.length ? args.join(" ") : "";
    if (!query) {
        await sock.sendMessage(
            chatId,
            { text: "📺 Usage: .anime <name>\n> ex: .anime solo leveling" },
            { quoted: message }
        );
        return;
    }

    try {
        const res = await axios.get(
            `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1`
        );
        const json = res.data;

        if (!json.data?.length) {
            await sock.sendMessage(
                chatId,
                { text: "❌ Anime not found." },
                { quoted: message }
            );
            return;
        }

        const ani = json.data[0];

        // Format date
        const airedFrom = ani.aired?.from
            ? new Date(ani.aired.from).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
              })
            : "?";
        const airedTo = ani.aired?.to
            ? new Date(ani.aired.to).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
              })
            : "Present";

        const caption = `
> 📺 *${ani.title}*
> 🌐 *ᴀʟɪᴀꜱ*: ${[ani.title_english, ani.title_synonyms?.join(", "), ani.title_japanese].filter(Boolean).join(" / ") || "-"}
> 🎬 *ᴛʏᴘᴇ*: ${ani.type || "-"}
> 📊 *ꜱᴄᴏʀᴇ*: ${ani.score || "-"} (by ${ani.scored_by?.toLocaleString() || "?"} users)
> ⭐ *ʀᴀɴᴋ*: ${ani.rank || "-"} | *ᴘᴏᴘᴜʟᴀʀɪᴛʏ*: ${ani.popularity || "-"}
> 📦 *ᴇᴘɪꜱᴏᴅᴇꜱ*: ${ani.episodes || "?"}
> ⏱️ *ᴅᴜʀᴀᴛɪᴏɴ*: ${ani.duration || "-"}
> 🎭 *ɢᴇɴʀᴇꜱ*: ${ani.genres?.map((g) => g.name).join(", ") || "-"}
> 🎥 *ꜱᴛᴜᴅɪᴏꜱ*: ${ani.studios?.map((s) => s.name).join(", ") || "-"}
> 📆 *ꜱᴛᴀᴛᴜꜱ*: ${ani.status || "-"}
> 🗓️ *ᴀɪʀᴇᴅ*: ${airedFrom} → ${airedTo}
> 👥 *ᴍᴇᴍʙᴇʀꜱ*: ${ani.members?.toLocaleString() || "-"}
> ❤️ *ꜰᴀᴠᴏʀɪᴛᴇꜱ*: ${ani.favorites?.toLocaleString() || "-"}
> ━━━━━━━━━━━━━━━━━━
> 📝 *ꜱʏɴᴏᴘꜱɪꜱ*:
${ani.synopsis ? ani.synopsis.substring(0, 600) + (ani.synopsis.length > 600 ? "..." : "") : "No synopsis available."}
> 🔗 ${ani.url}
        `.trim();

        await sock.sendMessage(
            chatId,
            {
                image: { url: ani.images?.jpg?.large_image_url || ani.images?.jpg?.image_url },
                caption,
            },
            { quoted: message }
        );
    } catch (err) {
        console.error("Error in anime command:", err);
        await sock.sendMessage(
            chatId,
            { text: "❌ An error occurred while fetching anime info." },
            { quoted: message }
        );
    }
}

module.exports = { animeCommand };
