'use strict';

const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

const config = require('./config');
const commandHandler = require('./handler/command');
const main = require('./handler/main');
const mainHandler = main.handler;
const LOG_TYPE = main.type;

const chatlog = fs.createWriteStream(`./chatlogs/${new Date().toString().replace(/[:]/g, '-')}.log`);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    if (config.activity.name)
        client.user.setActivity(config.activity.name, config.activity.options);
});

client.on('message', msg => {
    mainHandler.log(msg, chatlog, LOG_TYPE.NEW);
    if (!msg.author.bot)
        if (msg.content.startsWith(config.prefix)) {
            let obj = commandHandler.getArguments(msg, config.prefix);
            let success = commandHandler.handle(msg, obj, config);
        } else {
            mainHandler.handleFeature(msg, config.features.active);
        }
});

client.on('messageUpdate', (oldMessage, newMessage) => {
    if (oldMessage.content !== newMessage.content)
        mainHandler.log(newMessage, chatlog, LOG_TYPE.EDITED);
});

client.on('messageDelete', deletedMessage => {
    mainHandler.log(deletedMessage, chatlog, LOG_TYPE.DELETED);
});

client.login(config.token);