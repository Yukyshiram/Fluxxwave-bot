const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const vcard = require('./vcard')
const location = require('./location')

const pino = require('pino')

async function connectWhatsapp() {
    const auth = await useMultiFileAuthState("fluxxwave_session");
    const socket = makeWASocket({
        printQRInTerminal: true,
        browser: ["Fluxxwave Bot", "safari", "1.0.0"],
        auth: auth.state,
        logger: pino({ level: "silent" })
    })

    socket.ev.on("creds.update", auth.saveCreds);
    socket.ev.on("connection.update", async ({ connection }) => {
        if (connection === "open") {
            console.log("El bot se ha iniciado exitosamente")
        } else if (connection === "close") {
            await connectWhatsapp();
        }
    })

    socket.ev.on("messages.upsert", async ({ messages, type }) => {
        const chat = messages[0];
        const mensaje = (chat.message?.extendedTextMessage?.text ?? chat.message?.ephemeralMessage?.message?.text ?? chat.message?.conversation)?.toLowerCase() || "";

        console.log(mensaje);
        const id = chat.key.remoteJid;

        if (mensaje == '.ping') {
            await socket.sendMessage(id, { text: "Hello World" }, { quoted: chat })
            await socket.sendMessage(id, { text: "Hello World2" })
        } else if (mensaje == '.card') {
            await socket.sendMessage(id, {
                contacts: {
                    displayName: "Jeff",
                    contacts: [{ vcard }],
                },
            });
        } else if (mensaje == '.reaction') {
            const reactionMessage = {
                react: {
                    text: "💖", // use an empty string to remove the reaction
                    key: chat.key,
                },
            };

            await socket.sendMessage(id, reactionMessage);
        } else if (mensaje == '.location') {
            await socket.sendMessage(id, {
                location
            });
        } else if (mensaje == '.link') {
            await socket.sendMessage(id, {
                text: "Hi, this was sent using https://github.com/adiwajshing/baileys",
            });
        } else if (mensaje == '.presencea'){
            await socket.sendPresenceUpdate("available", id);
        } else if (mensaje == '.presencei'){
            await socket.sendPresenceUpdate("recording", id);
        }
    })
}

connectWhatsapp()