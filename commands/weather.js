module.exports = async function (sock, chatId, city) {
    try {
        if (!city) {
            await sock.sendMessage(chatId, { text: "> 🌍 ᴘʟᴇᴀꜱᴇ ᴛʏᴘᴇ: .ᴡᴇᴀᴛʜᴇʀ <ʟᴏᴄᴀᴛɪᴏɴ>" });
            return;
        }

        const res = await fetch(`http://wttr.in/${encodeURIComponent(city)}?format=j1`);
        const data = await res.json();

        if (!data?.current_condition?.[0]) {
            await sock.sendMessage(chatId, { text: "> ❌ ᴄᴏᴜʟᴅɴ'ᴛ ꜰɪɴᴅ ᴡᴇᴀᴛʜᴇʀ ᴅᴀᴛᴀ." });
            return;
        }

        const c = data.current_condition[0];
        const loc = data.nearest_area[0].areaName[0].value;
        const country = data.nearest_area[0].country[0].value;
        let localtime = data.time_zone?.[0]?.localtime || c.localObsDateTime || "????-??-?? ??:??";
        localtime = localtime.replace(/(AM|PM)$/i, "").trim();

        const [dateStr, timeStr] = localtime.split(" ");
        const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let dayText = "Unknown";
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            const [y, m, d] = dateStr.split("-").map(Number);
            const dayObj = new Date(Date.UTC(y, m - 1, d));
            dayText = weekday[dayObj.getUTCDay()];
        }

        const tomorrow = data.weather?.[1];
        const forecast = tomorrow?.hourly?.[4]
            ? {
                condition: tomorrow.hourly[4].weatherDesc[0].value,
                min: tomorrow.mintempC,
                max: tomorrow.maxtempC,
                chance: tomorrow.hourly[4].chanceofrain,
            }
            : null;

        const weatherText = `
> 🃏 *ᴡᴇᴀᴛʜᴇʀ ɪɴ ${loc}, ${country}*
> 🗓️ ${dayText} | 🕒 ${timeStr}
> ──────────────────────
> 🌤️ ᴄᴏɴᴅɪᴛɪᴏɴ: ${c.weatherDesc[0].value}
> 🌡️ ᴛᴇᴍᴘ: ${c.temp_C}°C / ${c.temp_F}°F
> 🥵 ꜰᴇᴇʟꜱ ʟɪᴋᴇ: ${c.FeelsLikeC}°C
> 💧 ʜᴜᴍɪᴅɪᴛʏ: ${c.humidity}%
> 💨 ᴡɪɴᴅ: ${c.windspeedKmph} km/h (${c.winddir16Point})
> ☁️ ᴄʟᴏᴜᴅ ᴄᴏᴠᴇʀ: ${c.cloudcover}%
> 👁️ ᴠɪꜱɪʙɪʟɪᴛʏ: ${c.visibility} km
> 📈 ᴘʀᴇꜱꜱᴜʀᴇ: ${c.pressure} MB
> 🔆 ᴜᴠ ɪɴᴅᴇx: ${c.uvIndex}
> ──────────────────────
> 📅 *ᴛᴏᴍᴏʀʀᴏᴡ’ꜱ ꜰᴏʀᴇᴄᴀꜱᴛ*
> 🌡️ ᴍɪɴ/ᴍᴀx: ${forecast?.min ?? "—"}°C / ${forecast?.max ?? "—"}°C
> 🌥️ ᴄᴏɴᴅɪᴛɪᴏɴ: ${forecast?.condition ?? "—"}
> 🌧️ ʀᴀɪɴ ᴄʜᴀɴᴄᴇ: ${forecast?.chance ?? "—"}%
        `.trim();

        await sock.sendMessage(chatId, { text: weatherText });
    } catch (error) {
        console.error('Error fetching weather:', error);
        await sock.sendMessage(chatId, { text: '> ❌ ᴇʀʀᴏʀ ꜰᴇᴛᴄʜɪɴɢ ᴡᴇᴀᴛʜᴇʀ ᴅᴀᴛᴀ.' });
    }
};
