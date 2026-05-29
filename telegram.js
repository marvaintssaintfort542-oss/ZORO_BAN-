const { Telegraf } = require('telegraf');

// Ton Token Telegram de BotFather
const TELEGRAM_TOKEN = "7550664742:AAHeGHfC-Fdbn7GYCeT7l5-y7ZS2l5v_4pE"; 

const bot = new Telegraf(TELEGRAM_TOKEN);

// ⚠️ METS LE LIEN DIRECT DE TA PHOTO ICI (se terminant par .jpg ou .png)
const PHOTO_URL = "METS_LE_LIEN_DE_TA_PHOTO_ICI";

// Commande /start (Photo + Infos du Bot)
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
        `Tape /aide ou /menu pour voir les commandes.\n\n` +
        `⚡ *Powered by Dev Zoro*`;

    ctx.replyWithPhoto(PHOTO_URL, {
        caption: welcomeText,
        parse_mode: 'Markdown'
    });
});

// Commande /aide ou /menu (Toutes les cases stylées)
bot.command(['aide', 'menu'], (ctx) => {
    const menuText = 
        `╭━━━✦━━━〔 **GROUP MENU** 〕━━━✦━━━╮\n` +
        `┃\n` +
        `┃ 🌟 ➢ /ban \`[en réponse]\` : Éliminer la cible\n` +
        `┃ 🌟 ➢ /kick \`[en réponse]\` : Exclure un membre\n` +
        `┃ 🌟 ➢ /purge \`[en réponse]\` : Nettoyer le chat\n` +
        `┃\n` +
        `╰━━━✦━━━━━━━━━━━━━━━━━━✦━━━╯\n\n` +
        `╭━━━✦━━━〔 **DOWNLOAD MENU** 〕━━━✦━━━╮\n` +
        `┃\n` +
        `┃ ⬡ /play : Lancer une musique\n` +
        `┃ ⬡ /ytmp3 : Télécharger un son YouTube\n` +
        `┃ ⬡ /ytmp4 : Télécharger une vidéo YouTube\n` +
        `┃ ⬡ /download : Téléchargement général\n` +
        `┃ ⬡ /instagram : Vidéo ou post Insta\n` +
        `┃ ⬡ /playdoc : Audio en document\n` +
        `┃ ⬡ /videodoc : Vidéo en document\n` +
        `┃ ⬡ /facebook : Télécharger depuis FB\n` +
        `┃ ⬡ /mediafire : Lien Mediafire\n` +
        `┃ ⬡ /tiktok : Vidéo TikTok sans filigrane\n` +
        `┃\n` +
        `╰━━━✦━━━━━━━━━━━━━━━━━━━━✦━━━╯\n\n` +
        `╭━━━✦━━━〔 **OWNER MENU** 〕━━━✦━━━╮\n` +
        `┃\n` +
        `┃ ⬡ /join : Faire rejoindre le bot\n` +
        `┃ ⬡ /shutdown : Éteindre le système\n` +
        `┃ ⬡ /restart : Redémarrer ZORO-XMD\n` +
        `┃ ⬡ /unblock : Débloquer un utilisateur\n` +
        `┃ ⬡ /block : Bloquer un utilisateur\n` +
        `┃ ⬡ /listblock : Liste des bannis\n` +
        `┃ ⬡ /broadcast : Message de diffusion\n` +
        `┃ ⬡ /addowner : Ajouter un propriétaire\n` +
        `┃ ⬡ /delowner : Retirer un propriétaire\n` +
        `┃ ⬡ /newgc : Créer un nouveau groupe\n` +
        `┃\n` +
        `╰━━━✦━━━━━━━━━━━━━━━━━━━✦━━━╯\n\n` +
        `╭━━━✦━━━〔 **SYSTEM MENU** 〕━━━✦━━━╮\n` +
        `┃\n` +
        `┃ ⚙️ ➢ /ping : Tester la vitesse\n` +
        `┃ ⚙️ ➢ /statut : État de l'extension du territoire\n` +
        `┃\n` +
        `╰━━━✦━━━━━━━━━━━━━━━━━━✦━━━╯\n\n` +
        `⚡ **Powered by Dev Zoro**`;

    ctx.reply(menuText, { parse_mode: 'Markdown' });
});

// Commande /ping
bot.command('ping', (ctx) => ctx.reply('🏓 **Pong ! Énergie au maximum.**', { parse_mode: 'Markdown' }));

// Commande /statut
bot.command('statut', (ctx) => ctx.reply('🛡️ **Extension du territoire active. Système en ligne à 100%.**', { parse_mode: 'Markdown' }));

// Commande /ban ou /kick
bot.command(['ban', 'kick'], async (ctx) => {
    if (!ctx.message.reply_to_message) {
        return ctx.reply("⚠️ Tu dois utiliser cette commande en répondant au message du membre à exclure !");
    }
    
    const userId = ctx.message.reply_to_message.from.id;
    const chatId = ctx.chat.id;

    try {
        await ctx.banChatMember(chatId, userId);
        ctx.reply("⚔️ **Cible éliminée avec succès. Le secteur est nettoyé.**", { parse_mode: 'Markdown' });
    } catch (error) {
        ctx.reply("❌ **Erreur** : Impossible d'exclure ce membre. Vérifie que je suis bien Admin du groupe !", { parse_mode: 'Markdown' });
    }
});

bot.launch().then(() => {
    console.log('[TELEGRAM] Le bot ZORO-XMD signé est en ligne ! 🔮');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
