const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, delay } = require('@whiskeysockets/baileys');
const pino = require('pino');
const { Boom } = require('@hapi/boom');
const { gererCommandes } = require('./commandes');

// ⚠️ METS TON NUMÉRO ICI (avec l'indicatif pays, ex: "33612345678" ou "50912345678")
// Laisse vide "" si tu veux utiliser le numéro par défaut ou une autre méthode
const NUMERO_BOT = "TON_NUMERO_ICI"; 

async function startZoroBot() {
    const { state, saveCreds } = await useMultiFileAuthState('session');

    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state,
        printQRInTerminal: !NUMERO_BOT // N'affiche le QR que si le numéro est vide
    });

    // Système de Code de Jumelage (Pairing Code)
    if (NUMERO_BOT && !sock.authState.creds.registered) {
        await delay(3000); // Attente que le système s'initialise
        try {
            let code = await sock.requestPairingCode(NUMERO_BOT.trim());
            console.log(`\n=========================================`);
            console.log(`🔑 TON CODE DE JUMELAGE : ${code}`);
            console.log(`=========================================\n`);
        } catch (error) {
            console.log("Erreur lors de la création du code de jumelage :", error);
        }
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('[ZORO] Connexion fermée, reconnexion :', shouldReconnect);
            if (shouldReconnect) {
                startZoroBot();
            }
        } else if (connection === 'open') {
            console.log('[ZORO] Le bot est connecté avec succès à WhatsApp ! ⚔️');
        }
    });

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
        const from = msg.key.remoteJid;
        const prefix = "."; 
        
        if (text.startsWith(prefix)) {
            const args = text.trim().split(/ +/);
            const command = args.shift().slice(prefix.length).toLowerCase();

            switch (command) {
                case 'ping':
                    await sock.sendMessage(from, { text: 'Pong! 🏓 Le bot Zoro est opérationnel.' }, { quoted: msg });
                    break;

                case 'aide':
                case 'menu':
                    const texteMenu = `⚔️ *BOT ZORO - MENU* ⚔️\n\n` +
                                      `*Modération :*\n` +
                                      `.kick / .ban - Exclure un membre\n` +
                                      `.kickall - Purger tout le groupe\n` +
                                      `.tagall / .tag - Mentionner tout le monde\n\n` +
                                      `*Général :*\n` +
                                      `.ping - Tester le bot\n` +
                                      `.statut - Voir le statut`;
                    await sock.sendMessage(from, { text: texteMenu }, { quoted: msg });
                    break;

                case 'statut':
                    await sock.sendMessage(from, { text: '🛡️ Système en ligne. Prêt à administrer le secteur.' }, { quoted: msg });
                    break;

                default:
                    await gererCommandes(sock, msg, command, args, from);
                    break;
            }
        }
    });
}

startZoroBot();
