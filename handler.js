import config from './config.js';
import { getMessageInfo, getGroupInfo, getUserPermissions } from './Utils/messageUtils.js';

// Import dynamique ou statique (recommandé de regrouper les commandes)
import * as commands from './commands/index.js'; 

global.config = config;

export default async function handlerCommand(dvmsy, m, msg, chatUpdate, options) {
    try {
        if (!m) return;

        const messageInfo = getMessageInfo(m, dvmsy);
        const { body, sender } = messageInfo;
        
        if (!body || !body.startsWith(config.PREFIX)) return;
        
        const args = body.slice(config.PREFIX.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        
        const groupInfo = await getGroupInfo(m, dvmsy);
        const userPerms = getUserPermissions(sender, config.OWNERS);
        
        const fullMessage = {
            ...m,
            ...messageInfo,
            ...groupInfo,
            ...userPerms,
            args,
            pushName: messageInfo.pushName || sender.split('@')[0]
        };

        console.log(`📩 Commande: ${commandName} de ${fullMessage.pushName}`);

        // Exécution dynamique
        await executeCommand(commandName, fullMessage, dvmsy, args);

    } catch (error) {
        console.error('Erreur dans handlerCommand:', error);
    }
}

async function executeCommand(cmd, fullMessage, dvmsy, args) {
    // Mapping des alias vers les fonctions
    const cmdMap = {
        'ping': commands.ping,
        'menu': commands.menu, 'help': commands.menu, 'aide': commands.menu,
        'info': commands.info, 'infobot': commands.info,
        'owner': commands.owner, 'restart': commands.owner, 'shutdown': commands.owner,
        'broadcast': commands.owner, 'eval': commands.owner,
        'tagall': commands.group, 'hidetag': commands.group, 'link': commands.group, 'groupinfo': commands.group,
        'runtime': handleUptime
    };

    if (cmdMap[cmd]) {
        if (cmd === 'runtime') return await handleUptime(fullMessage, dvmsy);
        await cmdMap[cmd](fullMessage, dvmsy, cmd, args);
    } else {
        console.log(`Commande inconnue: ${cmd}`);
    }
}

async function handleUptime(m, dvmsy) {
    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const mnt = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);
    await dvmsy.sendMessage(m.key.remoteJid, { text: `⏰ *Runtime:* ${h}h ${mnt}m ${s}s` });
}
