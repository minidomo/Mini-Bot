import Discord = require('discord.js');
import Arguments = require('./Arguments');

const client = new Discord.Client();

if (Arguments.debug)
    client.on('debug', console.log);

const token = Arguments.production ? process.env.PROD_BOT_TOKEN : process.env.TEST_BOT_TOKEN;

client.login(token);

export = client;