const Discord = require('discord.js');
const Selfbot = require('discord.js-selfbot-v13');

const config = require('./config.json');
const gradient = require('gradient-string');

const readline = require("node:readline");
const input = readline.createInterface({ input: process.stdin, output: process.stdout });

const fs = require('node:fs');
//const fetch = require('node-fetch') // If you wanna activate node-fetch and do NPM I NODE-FTCH@cjs remove the first // in this line

if (!config.token) 
    return wait_for_token();







// Functions

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
        console.clear();
        input.question(gradient(color())(">> Entrez votre token : "), async token => {
            const api = 'https://discord.com/api/v9/users/@me';
            const headers = { 'Authorization': token }
            try {
                let res = await fetch(api, headers);

                if (res.ok) {
                    console.log(gradient(color())("[INFO] Token utilisateur valide."));
                    config.token = token;
                    fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));
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