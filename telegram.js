const { Telegraf } = require('telegraf');

// Ton Token Telegram de BotFather
const TELEGRAM_TOKEN = "7550664742:AAHeGHfC-Fdbn7GYCeT7l5-y7ZS2l5v_4pE"; 

const bot = new Telegraf(TELEGRAM_TOKEN);

// ⚠️ METS LE LIEN DIRECT DE TA PHOTO ICI (se terminant par .jpg ou .png)
const PHOTO_URL = "METS_LE_LIEN_DE_TA_PHOTO_ICI";

// Commande /start (Photo + Infos du Bot stylées)
bot.start((ctx) => {
    const welcomeText = 
        `╭━━━✦━━━〔 **BOT INFO** 〕━━━✦━━━╮\n` +
        `┃\n` +
        `┃ ✦ **BOT** : ZORO-XMD\n` +
        `┃ ✦ **USER** : @${ctx.botInfo.username}\n` +
        `┃ ✦ **TYPE** : NODEJS (TELEGRAF)\n` +
        `┃ ✦ **PREFIX** : « / »\n` +
        `┃ ✦ **VERSION** : 1.0.0\n` +
        `┃ ✦ **MODE** : PUBLIC\n` +
        `┃ ✦ **DEV** : PDG-ZORO\n` +
        `┃\n` +
        `╰━━━✦━━━━━━━━━━━━━━━━━━✦━━━╯\n\n` +
        `⚔️ *ZORO-XMD est prêt à sécuriser le secteur.*\n` +
        `Tape /aide ou /menu pour voir les commandes.`;

    ctx.replyWithPhoto(PHOTO_URL, {
        caption: welcomeText,
        parse_mode: 'Markdown'
    });
});

// Commande /aide ou /menu (Toutes les commandes rangées dans des cases stylées)
bot.command(['aide', 'menu'], (ctx) => {
    const menuText = 
        `╭━━━✦━━━〔 **GROUP MENU** 〕━━━✦━━━╮\n` +
        `┃\n` +
        `┃ 🌟 ➢ /ban \`[en réponse]\` : Éliminer la cible\n` +
        `┃ 🌟 ➢ /kick \`[en réponse]\` : Exclure un membre\n` +
        `┃ 🌟 ➢ /purge \`[en réponse]\` : Nettoyer le chat\n` +
        `┃\n` +
        `╰━━━✦━━━━━━━━━━━━━━━━━━✦━━━╯\n\n` +
