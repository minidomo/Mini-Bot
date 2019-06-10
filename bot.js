'use strict';

const Discord = require('discord.js');
const client = new Discord.Client();
const winston = require('winston');

const config = require('./config');
const commandHandler = require('./handler/command');
const { handler: mainHandler, logtype: LOG_TYPE } = require('./handler/main');
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: `./chatlogs/${new Date().toString().replace(/[:]/g, '-')}.log` })
    ],
    format: winston.format.printf(log => `[${log.level.toUpperCase()}] - ${log.message}`)
});

client.on('ready', () => {
    logger.info(`Logged in as ${client.user.tag}!`);
    if (config.activity.name)
        client.user.setActivity(config.activity.name, config.activity.options);
});

client.on('message', msg => {
    msg.logger = logger;
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
    newMessage.logger = logger;
    if (oldMessage.content !== newMessage.content || oldMessage.attachments.size !== newMessage.attachments.size || oldMessage.embeds.length !== newMessage.embeds.length)
        mainHandler.log(newMessage, chatlog, LOG_TYPE.EDITED);
});

client.on('messageDelete', deletedMessage => {
    deletedMessage.logger = logger;
    mainHandler.log(deletedMessage, chatlog, LOG_TYPE.DELETED);
});

client.login(config.token);