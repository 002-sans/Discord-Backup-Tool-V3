const { pipeline } = require('node:stream');
const { promisify } = require('node:util');
const pipelineAsync = promisify(pipeline);

const Discord = require('discord.js');
const Selfbot = require('discord.js-selfbot-v13');

const config = require('./config.json');
const gradient = require('gradient-string');

const readline = require("node:readline");
const input = readline.createInterface({ input: process.stdin, output: process.stdout });

const bot_backup = require('@outwalk/discord-backup');
const selfbot_backup = require('discord.js-backup-v13');

const fs = require('node:fs');
//const fetch = require('node-fetch') // If you wanna activate node-fetch and do NPM I NODE-FETCH@cjs remove the first // in this line

[ './backups', './backups/selfbot', './backups/selfbot/emojis', './backups/selfbot/serveurs', './backups/bot', './backups/bot/serveurs', './backups/bot/emojis' ]
    .forEach(dir => fs.existsSync(dir) ? void(0) : fs.mkdirSync(dir));


if (!config.token) 
    return wait_for_token();




/**
 * @param {string} token The token of the selfbot
 * @description Connect the token to the script
 * @example selfbot_main("Your token here");
 * @returns {void}
*/
function selfbot_main(token){
    let dots = '';
    let counter = 0;

    logo();
    console.log(gradient(color())('\n>> Connexion en cours'));

    const connexion_interval = setInterval(() => {
        dots = '.'.repeat(counter % 4);
        process.stdout.write(`\r>> Connexion en cours${dots}   `);
        counter++;
    }, 500);

    const client = new Selfbot.Client({ presence: { status: 'invisible' } });
    client.login(token);

    client.on('ready', () => {
        clearInterval(connexion_interval);
        main_selfbot(client);
    });
}





// Functions


/**
 * @param {Selfbot.Client} client The client of the selfbot
 * @description The main function of the selfbot's client
 * @example const selfbot = new Selfbot.Client(); 
 * selfbot.login("TOKEN"); 
 * selfbot.once('ready', () => main_selfbot(selfbot));
*/
function main_selfbot(client){
    logo();

    console.log(gradient(color())(`    
                        [1]  - Créé Une Backup
                        [2]  - Créé Une Backup (Sans Chargement)
                        [3]  - Créé Une Backup Des Emotes
                        [4]  - Télécharger des emotes
                        [5]  - Créé Une Backup (Avec les Messages)
                        [6]  - Charger une Backup
                        [7]  - Supprime Les Tickets (Par nom)
                        [8]  - Supprime Les Tickets (d'une Categorie)
                        [9]  - Créé Un Modèle (Besoin de Permissions)
                        [10] - Affiche La Liste Des Backups
                        [0]  - Fermer`
    ))
  
    input.question(gradient(color())("Quel est votre Choix ? : "), async choix_menu => {

        switch(choix_menu){
            default:
                console.log(gradient(color())("[!] Choix Invalide"));
                await sleep(2000);
                main_selfbot(client);  
                break;

            case 1:
                input.question(gradient(color())(`Entrez votre ID de serveur : `), async server_id => {
                    const guild = client.guilds.cache.get(server_id) || client.guilds.fetch(server_id).catch(() => null);
                    if (!guild) return error("Aucun serveur de trouvé");

                    const created_backup = await selfbot_backup
                        .create(guild, { maxMessagesPerChannel: 0, doNotBackup: [ 'bans', 'emojis' ] })
                        .catch(() => null);

                    if (!created_backup) return error("Création de la backup impossible");
                    
                    const new_guild = await client.guilds.create(guild.name).catch(() => false);
                    if (!new_guild) return error('Création de serveur impossible');

                    console.log(gradient(color())(`Chargement de la backup de ${guild.name} en cours..`))
                    await selfbot_backup.load(created_backup, new_guild);
                    main_selfbot(client);
                })
                break;

            case 2:
                input.question(gradient(color())(`Entrez votre ID de serveur : `), async server_id => {
                    const guild = client.guilds.cache.get(server_id) || client.guilds.fetch(server_id).catch(() => null);
                    if (!guild) return error("Aucun serveur de trouvé");

                    const created_backup = await selfbot_backup
                        .create(guild, { maxMessagesPerChannel: 0, doNotBackup: [ 'bans', 'emojis' ] })
                        .catch(() => null);

                    if (!created_backup) return error("Création de la backup impossible");
                    input.question(gradient(color()(`Backup du serveur ${guild.name} crée: ${created_backup.id}\nAppuyez sur entrer pour continuer`)), () => main_selfbot(client));
                })
                break;

            case 3:
                input.question(gradient(color())(`Entrez votre ID de serveur : `), async server_id => {
                    const guild = client.guilds.cache.get(server_id) || client.guilds.fetch(server_id).catch(() => null);
                    if (!guild) return error("Aucun serveur de trouvé");

                    const emojis = await guild.emojis.fetch().catch(() => null);
                    if (!emojis) return error("Impossible de récupérer les emojis du serveur");
                    if (!emojis.size) return error(`${guild.name} n'a aucun emoji`);

                    const data = {
                        name: guild.name,
                        guild_id: guild.id,
                        date: Date.now(),
                        id: Array.from({length: 8}, () => Math.floor(Math.random() * 10)).join(''),
                        emojis: guild.emojis.cache.map(r => ({ link: `https://cdn.discordapp.com/emojis/${r.id}.${r.animated ? 'gif' : 'png'}`, name: r.name }))
                    }

                    fs.writeFileSync(`./backups/selfbot/emojis/${data.id}.json`, JSON.stringify(data, null, 4));
                    input.question(gradient(color()(`Backup des emojis du serveur ${guild.name} crée: ${data.id}\nAppuyez sur entrer pour continuer`)), () => main_selfbot(client));
                })
                break;

            case 4:
                input.question(gradient(color())(`Entrez votre ID de serveur : `), async server_id => {
                    const guild = client.guilds.cache.get(server_id) || client.guilds.fetch(server_id).catch(() => null);
                    if (!guild) return error("Aucun serveur de trouvé");

                    const emojis = await guild.emojis.fetch().catch(() => null);
                    if (!emojis) return error("Impossible de récupérer les emojis du serveur");
                    if (!emojis.size) return error(`${guild.name} n'a aucun emoji`);

                    fs.mkdirSync(guild.name);
                    for (const emoji of guild.emojis.cache.values()) {

                        const response = await fetch(`https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'png'}`).catch(() => false);
                        if (!response.ok) return;
                    
                        await pipelineAsync(response.body, fs.createWriteStream(`./${guild.name}/${emoji.name}.${emoji.animated ? 'gif' : 'png'}`));        
                    }

                    input.question(gradient(color()(`Téléchargement des emojis du serveur ${guild.name} crée\nAppuyez sur entrer pour continuer`)), () => main_selfbot(client));
                })
                break;

            case 5:
                input.question(gradient(color())(`Entrez votre ID de serveur : `), async server_id => {
                    const guild = client.guilds.cache.get(server_id) || client.guilds.fetch(server_id).catch(() => null);
                    if (!guild) return error("Aucun serveur de trouvé");

                    input.question(gradient(color())(`Combien de messages par salons voulez-vous (max 100) : `), async maxMessagesPerChannel => {
                        if (typeof maxMessagesPerChannel !== "number" || maxMessagesPerChannel < 0 || maxMessagesPerChannel > 100) 
                            return error("Veuillez entrer un nombre valide entre 0 et 100");

                        const created_backup = await selfbot_backup
                            .create(guild, { maxMessagesPerChannel, doNotBackup: [ 'bans', 'emojis' ] })
                            .catch(() => null);

                        if (!created_backup) return error("Création de la backup impossible");
                        
                        const new_guild = await client.guilds.create(guild.name).catch(() => false);
                        if (!new_guild) return error('Création de serveur impossible');

                        console.log(gradient(color())(`Chargement de la backup de ${guild.name} en cours..`))
                        await selfbot_backup.load(created_backup, new_guild);
                        main_selfbot(client);
                    })
                })
                break;

            case 6:
                input.question(gradient(color())(`Entrez votre ID de serveur : `), async server_id => {
                    const guild = client.guilds.cache.get(server_id)// || client.guilds.fetch(server_id).catch(() => null);
                    if (!guild) return error("Aucun serveur de trouvé");

                    input.question(gradient(color())(`Entrez l'ID de la backup : `), async backupId => {
                        if (fs.existsSync(`backups/selfbot/emojis/${backupId}.json`)){
                            if (!guild.members.me.permissions.has("CREATE_GUILD_EXPRESSIONS"))
                                return error("Vous n'avez pas les permissions requises");

                            input.question(gradient(color())("Voulez vous supprimer les emojis (y/n) : "), async delete_emoji => {
                                if (delete_emoji && delete_emoji.toLowerCase() == 'y')
                                    guild.emojis.cache.forEach(emoji => emoji.delete().catch(() => false));

                                const emojiData = require(`./backups/selfbot/emojis/${backupId}.json`);
                                for (const emoji of emojiData.emojis.values()){
                                    try {
                                        await guild.emojis.create(emoji.link, emoji.name);
                                        console.log(gradient(color())(`Emoji ${emoji.name} crée`))
                                        await sleep(500);
                                    } catch (e) { console.log(gradient(color())(`Emoji ${emoji.name} non effectuée: ${e}`)) }
                                }
                                main_selfbot(client);
                            })
                        }
                    })
                })
                break;

            case 7:

        }


        /**
         * @description Display an error
         * @param {string} error The error to display in the console
         * @returns {void}
         * @example error("Just an error");
        */
        async function error(error){
            console.log(gradient(color())(error));
            await sleep(2000);
            return main_selfbot(client);
        }
    })
}



/**
 * @returns {void}
 * @example console.log(color()); // Return the color in the console
 * @example gradient(color())("Hi");
 * @description Return a color from your config.json
*/
function color() {
    switch (config.color) {
        case "blue":
            return ["#3c00ff", "#07d6fa"]
        case "green":
            return ["#4dff00", "#00ff88"]
        case "pink":
            return ["#f5008f", "#f500dc"]
        case "red":
            return ["#f50018", "#f54e00"]
        case "cyan":
            return ["#00f59b", "#00f5e5", "#00f5e5"]
        case "orange":
            return ["#f54e00", "#f59f00"]
        case "yellow":
            return ["#f5cc00", "#d4f500"]
        default:
            return ["#3c00ff", "#07d6fa"]
    }
}

/**
 * @param {number} ms
 * @returns {Promise<void>}
 * @example await sleep(1000); // 1s
 * @description Wait for some time before continue the code
*/
async function sleep(ms){
    return await new Promise(r => setTimeout(r, ms))
}


/**
 * @returns {void}
 * @example logo();
 * @description Clear the console then display the logo
*/
function logo() {
    console.clear();
    console.log(gradient(color())(`
                ██████╗  █████╗  ██████╗██╗  ██╗██╗   ██╗██████╗     ████████╗ ██████╗  ██████╗ ██╗     
                ██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██║   ██║██╔══██╗    ╚══██╔══╝██╔═══██╗██╔═══██╗██║     
                ██████╔╝███████║██║     █████╔╝ ██║   ██║██████╔╝       ██║   ██║   ██║██║   ██║██║     
                ██╔══██╗██╔══██║██║     ██╔═██╗ ██║   ██║██╔═══╝        ██║   ██║   ██║██║   ██║██║     
                ██████╔╝██║  ██║╚██████╗██║  ██╗╚██████╔╝██║            ██║   ╚██████╔╝╚██████╔╝███████╗
                ╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝            ╚═╝    ╚═════╝  ╚═════╝ ╚══════╝`))
}


/**
 * @returns {Promise<boolean>}
 * @example await wait_for_token();
 * @description Vérifie si le token est valide (bot ou selfbot)
 */
async function wait_for_token() {
    return new Promise((resolve) => {
        logo()
        input.question(gradient(color())("\n\n>> Entrez votre token : "), async token => {
            const api = 'https://discord.com/api/v9/users/@me';
            const headers = { 'Authorization': token }
            try {
                let res = await fetch(api, headers);

                if (res.ok) {
                    console.log(gradient(color())("[INFO] Token utilisateur valide."));
                    config.token = token;
                    fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));
                    selfbot_main(token);
                    return resolve(true);
                }

                headers["Authorization"] = `Bot ${token}`
                res = await fetch(api, headers);

                if (res.ok) {
                    console.log(gradient(color())("[INFO] Token bot valide."));
                    config.token = token;
                    fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));
                    return resolve(true);
                }

                console.log(gradient(color())("[ERREUR] Token invalide."));
                await sleep(2000);
                resolve(false);
                wait_for_token();
            } catch (err) {
                console.log(gradient(color())("[ERREUR] Une erreur s'est produite : "), err.message);
                await sleep(2000);
                resolve(false);
                wait_for_token();
            }
        });
    });
}