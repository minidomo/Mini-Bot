'use strict';

const Discord = require('discord.js');
const client = new Discord.Client();

const config = require('./config');
const mainHandler = require('./handler/main');
const commandHandler = require('./handler/command');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    mainHandler.log(msg);
    if (!msg.author.bot)
        if (msg.content.startsWith(config.prefix)) {
            let obj = commandHandler.getArguments(msg, config.prefix);
            let success = commandHandler.handle(msg, obj, config.commands);
        } else {
            mainHandler.handleFeature(msg, config.features.active);
        }
});

client.login(config.token);