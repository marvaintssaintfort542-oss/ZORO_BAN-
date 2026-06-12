import {
    makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    delay,
} from "@whiskeysockets/baileys";

import pino from "pino";
import { Boom } from "@hapi/boom";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import handlerCommand from './handler.js';
import { smsg } from './Utils/func.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3002;
const sessionsDir = path.join(__dirname, 'accounts');

if (!fs.existsSync(sessionsDir)) fs.mkdirSync(sessionsDir, { recursive: true });

let tempDvmsys = {};

async function startUserBot(phoneNumber, isPairing = false) {
    const sessionName = `session_${phoneNumber.replace(/[^0-9]/g, '')}`;
    const sessionPath = path.join(sessionsDir, sessionName);

    if (isPairing && fs.existsSync(sessionPath)) {
        fs.rmSync(sessionPath, { recursive: true, force: true });
    }

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
    const { version } = await fetchLatestBaileysVersion();

    const dvmsy = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        browser: ["MariaBot", "Chrome", "1.0.0"],
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" })),
        }
    });

    dvmsy.ev.on("messages.upsert", async chatUpdate => {
        try {
            const msg = chatUpdate.messages[0];
            if (!msg.message || msg.key.remoteJid === 'status@broadcast') return;
            const m = smsg(dvmsy, msg);
            await handlerCommand(dvmsy, m, msg, chatUpdate);
        } catch (err) {
            console.error("Erreur handler:", err);
        }
    });

    dvmsy.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
            const shouldReconnect = new Boom(lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                console.log(`[${phoneNumber}] Connexion perdue, reconnexion...`);
                startUserBot(phoneNumber);
            }
        } else if (connection === "open") {
            console.log(`✅ [${phoneNumber}] Session active.`);
        }
    });

    dvmsy.ev.on("creds.update", saveCreds);
    return dvmsy;
}

// Routes Express
app.get("/pair", async (req, res) => {
    const num = req.query.number?.replace(/[^0-9]/g, '');
    if (!num) return res.status(400).json({ error: "Numéro invalide" });
    
    try {
        const dvmsy = await startUserBot(num, true);
        await delay(3000);
        const code = await dvmsy.requestPairingCode(num);
        res.json({ code });
    } catch (e) {
        res.status(500).json({ error: "Erreur lors de la génération du code." });
    }
});

app.get("/sessions/count", (req, res) => {
    const count = fs.readdirSync(sessionsDir).filter(f => f.startsWith('session_')).length;
    res.json({ count });
});

// Démarrage
app.listen(port, async () => {
    console.log(`🚀 Serveur Maria-XD démarré sur le port ${port}`);
    // Restauration silencieuse
    const files = fs.readdirSync(sessionsDir);
    for (const folder of files) {
        if (folder.startsWith('session_')) {
            startUserBot(folder.replace('session_', ''));
            await delay(2000);
        }
    }
});
