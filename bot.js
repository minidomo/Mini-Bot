'use strict';

const Discord = require('discord.js');
const client = new Discord.Client();

const config = require('./config');
const commandHandler = require('./handler/command');
const main = require('./handler/main');
const mainHandler = main.handler;
const LOG_TYPE = main.type;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    if (config.activity.name)
        client.user.setActivity(config.activity.name, config.activity.options);
});

client.on('message', msg => {
    mainHandler.log(msg, LOG_TYPE.NEW);
    if (!msg.author.bot)
        if (msg.content.startsWith(config.prefix)) {
            let obj = commandHandler.getArguments(msg, config.prefix);
            let success = commandHandler.handle(msg, obj, config);
        } else {
            mainHandler.handleFeature(msg, config.features.active);
        }
});

client.on('messageUpdate', (oldMessage, newMessage) => {
    if (oldMessage.content !== newMessage.content || oldMessage.attachments.size !== newMessage.attachments.size || oldMessage.embeds.length !== newMessage.embeds.length)
        mainHandler.log(newMessage, LOG_TYPE.EDITED);
});

client.on('messageDelete', deletedMessage => {
    mainHandler.log(deletedMessage, LOG_TYPE.DELETED);
});

client.login(config.token);