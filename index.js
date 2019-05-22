'use strict';

const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

const config = require('./config');
const mainHandler = require('./handler/main');
const commandHandler = require('./handler/command');

const chatlog = fs.createWriteStream(`./chatlogs/${new Date().toString().replace(/[:]/g, '-')}.log`);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    if (config.activity.name)
        client.user.setActivity(config.activity.name, config.activity.options);
});

client.on('message', msg => {
    mainHandler.log(msg, chatlog);
    if (!msg.author.bot)
        if (msg.content.startsWith(config.prefix)) {
            let obj = commandHandler.getArguments(msg, config.prefix);
            let success = commandHandler.handle(msg, obj, config);
        } else {
            mainHandler.handleFeature(msg, config.features.active);
        }
});

client.on('messageUpdate', (oldMessage, newMessage) => {
    mainHandler.log(newMessage, chatlog, true);
});

client.login(config.token);