'use strict';

const Discord = require('discord.js');
const client = new Discord.Client();
const winston = require('winston');

const config = require('./config');
const commandHandler = require('./handler/command');
const reactionHandler = require('./handler/reaction');
const { handler: mainHandler, logtype: LOG_TYPE } = require('./handler/main');
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: `./chatlogs/${new Date().toString().replace(/[:]/g, '-')}.log` })
    ],
    format: winston.format.printf(log => `[${log.level.toUpperCase()}] - ${log.message}`)
});

// storing commands in a map
const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    config.commands.set(command.name, command);
}
// initialize types
config.embedTypes.Game
    .set('Tic Tac Toe', require('./games/tictactoe'))
    .set('Connect 4', require('./games/connect4'));
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
            const obj = commandHandler.getArguments(msg.content);
            const success = commandHandler.handle(msg, obj);
        } else {
            mainHandler.handleFeature(msg);
        }
});

client.on('messageUpdate', (oldMessage, newMessage) => {
    newMessage.logger = logger;
    if (oldMessage.content !== newMessage.content || oldMessage.attachments.size !== newMessage.attachments.size || oldMessage.embeds.length !== newMessage.embeds.length)
        mainHandler.log(newMessage, LOG_TYPE.EDITED);
});

client.on('messageDelete', deletedMessage => {
    deletedMessage.logger = logger;
    mainHandler.log(deletedMessage, LOG_TYPE.DELETED);
});

client.on('messageReactionAdd', (messageReaction, user) => {
    if (user.bot)
        return;
    if (messageReaction.message.author.bot) {
        const ret = reactionHandler.check(messageReaction);
        if (ret.passed) {
            const success = ret.handle(messageReaction, user, true);
        }
    }
});

client.on('messageReactionRemove', (messageReaction, user) => {
    if (user.bot)
        return;
    if (messageReaction.message.author.bot) {
        const ret = reactionHandler.check(messageReaction);
        if (ret.passed) {
            const success = ret.handle(messageReaction, user, false);
        }
    }
});

client.login(config.token);

const exiting = () => {
    // when closing the program, disconnect the bot from any voice channels
    logger.info('Disconnecting from voice channels');
    for (const guildID of config.servers.audio.keys()) {
        const guild = client.guilds.get(guildID);
        if (guild.voiceConnection)
            guild.voiceConnection.disconnect();
    }
    process.exit(0);
};

process.on('SIGINT', exiting);
process.on('SIGTERM', exiting);
process.on('uncaughtException', err => {
    logger.error(err);
    console.error(err);
    exiting();
});