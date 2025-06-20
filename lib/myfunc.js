/**
 * BeltahBot - A WhatsApp Bot
 * Powered by: Beltah x Knight
 * Owner: Ishaq Ibrahim
 * 
 * License: MIT
 * 
 * Credits:
 * - Baileys Library by @adiwajshing
 */

const {
    proto,
    delay,
    getContentType
} = require('@whiskeysockets/baileys')
const chalk = require('chalk')
const fs = require('fs')
const Crypto = require('crypto')
const axios = require('axios')
const moment = require('moment-timezone')
const { sizeFormatter } = require('human-readable')
const util = require('util')
const Jimp = require('jimp')
const path = require('path')
const { tmpdir } = require('os')

// Time and Formatting Utilities
const unixTimestampSeconds = (date = new Date()) => Math.floor(date.getTime() / 1000)
exports.unixTimestampSeconds = unixTimestampSeconds

exports.generateMessageTag = (epoch) => {
    let tag = unixTimestampSeconds().toString()
    if (epoch) tag += '.--' + epoch
    return tag
}

exports.processTime = (timestamp, now) => moment.duration(now - moment(timestamp * 1000)).asSeconds()

exports.getRandom = (ext) => `${Math.floor(Math.random() * 10000)}${ext}`

exports.getBuffer = async (url, options) => {
    try {
        const res = await axios({
            method: "get",
            url,
            headers: {
                'DNT': 1,
                'Upgrade-Insecure-Request': 1
            },
            ...options,
            responseType: 'arraybuffer'
        })
        return res.data
    } catch (err) {
        return err
    }
}

exports.fetchJson = async (url, options) => {
    try {
        const res = await axios({
            method: 'GET',
            url,
            headers: {
                'User-Agent': 'Mozilla/5.0'
            },
            ...options
        })
        return res.data
    } catch (err) {
        return err
    }
}

exports.runtime = function(seconds) {
    seconds = Number(seconds)
    const d = Math.floor(seconds / (3600 * 24))
    const h = Math.floor(seconds % (3600 * 24) / 3600)
    const m = Math.floor(seconds % 3600 / 60)
    const s = Math.floor(seconds % 60)
    return `${d ? d + ' days, ' : ''}${h ? h + ' hours, ' : ''}${m ? m + ' minutes, ' : ''}${s ? s + ' seconds' : ''}`
}

exports.clockString = (ms) => {
    const h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
    const m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
    const s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

exports.sleep = async (ms) => new Promise(resolve => setTimeout(resolve, ms))

exports.isUrl = (url) => {
    return url.match(new RegExp(/https?:\/\/[^\s]+/, 'gi'))
}

exports.getTime = (format, date) => {
    return date ? moment(date).format(format) : moment.tz('Africa/Nairobi').format(format)
}

exports.formatDate = (n, locale = 'en') => {
    return new Date(n).toLocaleDateString(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    })
}

exports.formatp = sizeFormatter({
    std: 'JEDEC',
    decimalPlaces: 2,
    keepTrailingZeroes: false,
    render: (literal, symbol) => `${literal} ${symbol}B`,
})

exports.bytesToSize = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

exports.getSizeMedia = (path) => {
    return new Promise((resolve, reject) => {
        if (/http/.test(path)) {
            axios.get(path)
                .then((res) => {
                    let length = parseInt(res.headers['content-length'])
                    let size = exports.bytesToSize(length, 3)
                    if (!isNaN(length)) resolve(size)
                }).catch(reject)
        } else if (Buffer.isBuffer(path)) {
            let length = Buffer.byteLength(path)
            let size = exports.bytesToSize(length, 3)
            if (!isNaN(length)) resolve(size)
        } else {
            reject('Unknown media type')
        }
    })
}

exports.parseMention = (text = '') => {
    return [...text.matchAll(/@(\d{5,16})/g)].map(v => v[1] + '@s.whatsapp.net')
}

exports.getGroupAdmins = (participants) => {
    return participants.filter(p => p.admin).map(p => p.id)
}

// Auto Serialize Incoming Messages
exports.smsg = (Beltah, m, store) => {
    if (!m) return m
    const M = proto.WebMessageInfo

    if (m.key) {
        m.id = m.key.id
        m.isBaileys = m.id?.startsWith('BAE5') && m.id.length === 16
        m.chat = m.key.remoteJid
        m.fromMe = m.key.fromMe
        m.isGroup = m.chat.endsWith('@g.us')
        m.sender = Beltah.decodeJid(m.fromMe ? Beltah.user.id : m.participant || m.key.participant || m.chat)
        if (m.isGroup) m.participant = Beltah.decodeJid(m.key.participant)
    }

    if (m.message) {
        m.mtype = getContentType(m.message)
        m.msg = m.mtype === 'viewOnceMessage' ? m.message[m.mtype].message[getContentType(m.message[m.mtype].message)] : m.message[m.mtype]
        m.body = m.message.conversation || m.msg.caption || m.msg.text || ''
        if (m.msg.contextInfo) {
            const quoted = m.quoted = m.msg.contextInfo.quotedMessage || null
            m.mentionedJid = m.msg.contextInfo.mentionedJid || []

            if (quoted) {
                let type = getContentType(quoted)
                m.quoted = quoted[type]
                m.quoted.mtype = type
                m.quoted.id = m.msg.contextInfo.stanzaId
                m.quoted.chat = m.msg.contextInfo.remoteJid || m.chat
                m.quoted.sender = Beltah.decodeJid(m.msg.contextInfo.participant)
                m.quoted.fromMe = m.quoted.sender === (Beltah.user?.id)
                m.quoted.text = m.quoted.text || m.quoted.caption || ''
                m.getQuotedObj = async () => {
                    if (!m.quoted.id) return false
                    const q = await store.loadMessage(m.chat, m.quoted.id, Beltah)
                    return exports.smsg(Beltah, q, store)
                }

                const vM = m.quoted.fakeObj = M.fromObject({
                    key: {
                        remoteJid: m.quoted.chat,
                        fromMe: m.quoted.fromMe,
                        id: m.quoted.id
                    },
                    message: quoted,
                    ...(m.isGroup ? { participant: m.quoted.sender } : {})
                })

                m.quoted.delete = () => Beltah.sendMessage(m.quoted.chat, { delete: vM.key })
                m.quoted.copyNForward = (jid, forceForward = false, options = {}) => Beltah.copyNForward(jid, vM, forceForward, options)
                m.quoted.download = () => Beltah.downloadMediaMessage(m.quoted)
            }
        }
    }

    if (m.msg?.url) m.download = () => Beltah.downloadMediaMessage(m.msg)

    m.text = m.body
    m.reply = (text, chatId = m.chat, options = {}) =>
        Buffer.isBuffer(text)
            ? Beltah.sendMedia(chatId, text, 'file', '', m, options)
            : Beltah.sendText(chatId, text, m, options)

    m.copy = () => exports.smsg(Beltah, M.fromObject(M.toObject(m)))
    m.copyNForward = (jid = m.chat, forceForward = false, options = {}) =>
        Beltah.copyNForward(jid, m, forceForward, options)

    return m
}

exports.reSize = (buffer, w, h) => {
    return new Promise(async (resolve, reject) => {
        try {
            const j = await Jimp.read(buffer)
            const resized = await j.resize(w, h).getBufferAsync(Jimp.MIME_JPEG)
            resolve(resized)
        } catch (e) {
            reject(e)
        }
    })
}

// Auto reload on update
let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`✅ BeltahBot updated: ${__filename}`))
    delete require.cache[file]
    require(file)
})