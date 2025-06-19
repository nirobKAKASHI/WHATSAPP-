/**
   * Anti-link system for BeltahBot
   * Licensed under MIT
   * Edited by Ishaq Ibrahim
**/

const {
  smsg,
  getGroupAdmins
} = require('./functions')
const {
  downloadMediaMessage
} = require('@whiskeysockets/baileys')
const fs = require('fs')
const {
  exec
} = require('child_process')

module.exports = BeltahBot = async (client, m, chatUpdate, store) => {
  try {
    const {
      body,
      isGroup,
      sender,
      groupMetadata,
      participants,
      isAdmins,
      isBotAdmins,
      isCreator,
      reply,
      antiLink
    } = m

    if (!isGroup) return

    const groupAdmins = getGroupAdmins(participants)
    const botNumber = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const isBotAdmin = groupAdmins.includes(botNumber)

    const linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i
    const isLink = linkRegex.test(body)

    if (antiLink) {
      if (!isBotAdmins) return reply("😒 Acha mzaha! BeltahBot si admin kwa hii group.")
      if (!isAdmins && !isCreator) return reply("🚫 Huwezi fanya hivo bro! Ni admins tu wanaeza control hii option.")

      if (isLink) {
        const code = body.match(linkRegex)[1]
        const groupInvite = await client.groupInviteCode(m.chat)
        if (code !== groupInvite) {
          await client.sendMessage(m.chat, {
            delete: {
              remoteJid: m.chat,
              fromMe: false,
              id: m.key.id,
              participant: m.key.participant
            }
          })
          reply("⛔ Link ya group zingine ni marufuku hapa! Umewahi toa without permission? BeltahBot anakumeza!")
        }
      }
    }

    if (body === "#antilink on") {
      if (!isAdmins && !isCreator) return reply("Hii command ni ya admins pekee!")
      if (antiLink) return reply('🚨 Antilink iko ON tayari kwa hii group, chillax!')
      global.db.data.chats[m.chat].antiLink = true
      reply('✅ Sasa BeltahBot ame-washa Antilink kwa hii group. Link zako zitapotea faster than ex wako!')
    }

    if (body === "#antilink off") {
      if (!isAdmins && !isCreator) return reply("Hii command ni ya admins pekee!")
      if (!antiLink) return reply('❌ Antilink haikuwa ON... relax boss.')
      global.db.data.chats[m.chat].antiLink = false
      reply('❎ BeltahBot ame-off Antilink. Links ziko free for now, lakini usibebe ujinga!')
    }

  } catch (err) {
    console.log(err)
  }
}