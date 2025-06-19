
/**
 * BeltahBot - WhatsApp Bot
 * Copyright (c) 2025 Ishaq Ibrahim
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the MIT License.
 * 
 * Powered by: Beltah x Knight
 * AI Stack: Gminay â†’ CrewDrew â†’ ChatGPT
 */
require('./bdelta-secure/index.js');
require('./settings')
require('./keepalive')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const chalk = require('chalk')
const FileType = require('file-type')
const path = require('path')
const axios = require('axios')
const { handleMessages, handleGroupParticipantUpdate, handleStatus } = require('./main');
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, await, sleep, reSize } = require('./lib/myfunc')
const { 
    default: makeWASocket,
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage,
    jidDecode,
    proto,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} = require("@whiskeysockets/baileys")
const NodeCache = require("node-cache")
const pino = require("pino")
const readline = require("readline")
const { parsePhoneNumber } = require("libphonenumber-js")
const { PHONENUMBER_MCC } = require('@whiskeysockets/baileys/lib/Utils/generics')
const { rmSync, existsSync } = require('fs')
const { join } = require('path')

const store = {
    messages: {},
    contacts: {},
    chats: {},
    groupMetadata: async (jid) => ({}),
    bind: function(ev) {
        ev.on('messages.upsert', ({ messages }) => {
            messages.forEach(msg => {
                if (msg.key && msg.key.remoteJid) {
                    this.messages[msg.key.remoteJid] = this.messages[msg.key.remoteJid] || {}
                    this.messages[msg.key.remoteJid][msg.key.id] = msg
                }
            })
        })
        ev.on('contacts.update', (contacts) => {
            contacts.forEach(contact => {
                if (contact.id) this.contacts[contact.id] = contact
            })
        })
        ev.on('chats.set', (chats) => {
            this.chats = chats
        })
    },
    loadMessage: async (jid, id) => this.messages[jid]?.[id] || null
}

let phoneNumber = "254741819582"
let owner = JSON.parse(fs.readFileSync('./data/owner.json'))

global.botname = "BeltahBot"
global.themeemoji = "ðŸ¤–"

const settings = require('./settings')
const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

const rl = process.stdin.isTTY ? readline.createInterface({ input: process.stdin, output: process.stdout }) : null
const question = (text) => rl ? new Promise((resolve) => rl.question(text, resolve)) : Promise.resolve(settings.ownerNumber || phoneNumber)

async function startBeltahBot() {
    let { version } = await fetchLatestBaileysVersion()
    const { state, saveCreds } = await useMultiFileAuthState(`./session`)
    const msgRetryCounterCache = new NodeCache()

    const conn = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: !pairingCode,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
        },
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        getMessage: async (key) => {
            let jid = jidNormalizedUser(key.remoteJid)
            let msg = await store.loadMessage(jid, key.id)
            return msg?.message || ""
        },
        msgRetryCounterCache
    })

    store.bind(conn.ev)

    conn.ev.on('messages.upsert', async chatUpdate => {
        try {
            const mek = chatUpdate.messages[0]
            if (!mek.message) return
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
            if (mek.key && mek.key.remoteJid === 'status@broadcast') return await handleStatus(conn, chatUpdate)
            if (!conn.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
            if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
            await handleMessages(conn, chatUpdate, true)
        } catch (err) {
            console.error("âš ï¸ Error handling message:", err)
            if (mek.key && mek.key.remoteJid) {
                await conn.sendMessage(mek.key.remoteJid, { text: 'âš ï¸ Error iko kwa response ya message. Ngoja kidogo.' }).catch(console.error);
            }
        }
    })

    conn.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }

    conn.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = conn.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
        }
    })

    conn.getName = (jid, withoutContact = false) => {
        id = conn.decodeJid(jid)
        withoutContact = conn.withoutContact || withoutContact 
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = await conn.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? { id, name: 'WhatsApp' } : id === conn.decodeJid(conn.user.id) ? conn.user : (store.contacts[id] || {})
        return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }

    conn.public = true
    conn.serializeM = (m) => smsg(conn, m, store)

    if (pairingCode && !conn.authState.creds.registered) {
        if (useMobile) throw new Error('Cannot use pairing code with mobile API')

        let phoneNumber = global.phoneNumber || await question(chalk.bgBlack(chalk.greenBright(`
ðŸ“² Type your WhatsApp number
Format: 2547XXXXXXXX : `)))
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
        if (!phoneNumber.startsWith('254')) phoneNumber = '254' + phoneNumber

        setTimeout(async () => {
            try {
                let code = await conn.requestPairingCode(phoneNumber)
                code = code?.match(/.{1,4}/g)?.join("-") || code
                console.log(chalk.greenBright(`ðŸ’¬ Pairing Code: `), chalk.white(code))
                console.log(chalk.yellow(`
ðŸ“± Open WhatsApp > Settings > Linked Devices > Link a Device`))
            } catch (error) {
                console.error('â›” Error requesting pairing code:', error)
            }
        }, 3000)
    }

    conn.ev.on('connection.update', async (s) => {
        const { connection, lastDisconnect } = s
        if (connection == "open") {
            console.log(chalk.cyan(`
âœ… Connected as: ${JSON.stringify(conn.user, null, 2)}`))
            const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net'
            await conn.sendMessage(botNumber, {
                text: `âœ… *BeltahBot imeconnect!* ðŸ‘‘
â° ${new Date().toLocaleString()}

Bot iko ready kuskiza maombi zako ðŸ”¥`
            })
        }
        if (connection === "close" && lastDisconnect?.error?.output?.statusCode !== 401) {
            startBeltahBot()
        }
    })

    conn.ev.on('creds.update', saveCreds)
    conn.ev.on('group-participants.update', async (update) => await handleGroupParticipantUpdate(conn, update))
    conn.ev.on('messages.upsert', async (m) => m.messages[0].key?.remoteJid === 'status@broadcast' && await handleStatus(conn, m))
    conn.ev.on('status.update', async (status) => await handleStatus(conn, status))
    conn.ev.on('messages.reaction', async (status) => await handleStatus(conn, status))

    return conn
}

startBeltahBot().catch(err => {
    console.error('âŒ Fatal Error:', err)
    process.exit(1)
})

process.on('uncaughtException', err => console.error('âŒ Uncaught Exception:', err))
process.on('unhandledRejection', err => console.error('âŒ Unhandled Rejection:', err))

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`â™»ï¸ Reloaded: ${__filename}`))
    delete require.cache[file]
    require(file)
})
