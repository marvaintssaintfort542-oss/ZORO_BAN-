const { Telegraf } = require('telegraf');

// Ton Token Telegram de BotFather
const TELEGRAM_TOKEN = "7550664742:AAHeGHfC-Fdbn7GYCeT7l5-y7ZS2l5v_4pE"; 

const bot = new Telegraf(TELEGRAM_TOKEN);

// URL de ta photo pour le /start (Mets ton lien public ici)
const PHOTO_URL = "METS_LE_LIEN_DE_TA_PHOTO_ICI";

// État des modules de sécurité (Activé/Désactivé)
let antiLinkActive = false;
let antiWordActive = false;
let antiSpamActive = false;

// Commande /start avec Photo
bot.start((ctx) => {
    ctx.replyWithPhoto(PHOTO_URL, {
        caption: "⚔️ *Bot Zoro-XMD Actif* ⚔️\nPrêt à sécuriser et administrer le secteur.\nTape /menu pour voir toutes les commandes.",
        parse_mode: 'Markdown'
    });
});

// Menu complet style WhatsApp
bot.command(['menu', 'aide'], (ctx) => {
    const menu = `⚔️ *「 ZORO-XMD GROUP MENU 」* ⚔️\n\n` +
                 `*⚙️ GESTION DU GROUPE :*\n` +
                 `• /closetime : Fermer le groupe\n` +
                 `• /opentime : Ouvrir le groupe\n` +
                 `• /setdesc [texte] : Changer la description\n` +
                 `• /setgpp : Changer la photo du groupe\n` +
                 `• /linkgc : Obtenir le lien du groupe\n` +
                 `• /revoke : Réinitialiser le lien\n\n` +
                 `*🔨 MODÉRATION & NETTOYAGE :*\n` +
                 `• /kick (en réponse) : Exclure un membre\n` +
                 `• /add [ID] : Ajouter un membre\n` +
                 `• /promote (en réponse) : M
