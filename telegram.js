const { Telegraf } = require('telegraf');

// Ton Token Telegram de BotFather
const TELEGRAM_TOKEN = "7550664742:AAHeGHfC-Fdbn7GYCeT7l5-y7ZS2l5v_4pE"; 

const bot = new Telegraf(TELEGRAM_TOKEN);

// Commande /start
bot.start((ctx) => {
    ctx.reply("⚔️ *Bot Zoro-XMD Actif* ⚔️\nPrêt à administrer et sécuriser le secteur. Tape /aide pour voir les commandes.", { parse_mode: 'Markdown' });
});

// Commande /aide
bot.command(['aide', 'menu'], (ctx) => {
    const menu = `⚔️ *MENU DE MODÉRATION ZORO-XMD* ⚔️\n\n` +
                 `*Commandes de nettoyage :*\n` +
                 `• /ban ou /kick (en réponse à un membre) : Éliminer la cible\n` +
                 `• /purge (en réponse à un message) : Supprime tous les messages jusqu'ici\n\n` +
                 `*Général :*\n` +
                 `• /ping : Tester la réactivité du bot\n` +
                 `• /statut : Vérifier les systèmes`;
    ctx.reply(menu, { parse_mode: 'Markdown' });
});

// Commande /ping
bot.command('ping', (ctx) => ctx.reply('🏓 Pong ! Énergie au maximum.'));

// Commande /statut
bot.command('statut', (ctx) => ctx.reply('🛡️ Extension du territoire active. Système en ligne à 100%.'));

// Commande /ban ou /kick
bot.command(['ban', 'kick'], async (ctx) => {
    if (!ctx.message.reply_to_message) {
        return ctx.reply("⚠️ Tu dois utiliser cette commande en répondant au message du membre à exclure !");
    }
    
    const userId = ctx.message.reply_to_message.from.id;
    const chatId = ctx.chat.id;

    try {
        await ctx.banChatMember(chatId, userId);
        ctx.reply("⚔️ Cible éliminée avec succès. Le secteur est nettoyé.");
    } catch (error) {
        ctx.reply("❌ Erreur : Impossible d'exclure ce membre. Vérifie que je suis bien Admin du groupe !");
    }
});

bot.launch().then(() => {
    console.log('[TELEGRAM] Le bot Zoro-XMD est en ligne et prêt ! 🔮');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
