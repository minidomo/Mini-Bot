const Discord = require('discord.js');
const client = new Discord.Client();

const Settings = require('./settings.json');
const Methods = require('./methods.js');
const CommandList = require('./commands.js').Commands;
const prefix = '!!';

const InTheChatFeature = Methods.inTheChatFeature;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('iGUMDROP', { type: 'WATCHING' });
});

client.on('message', msg => {
    msg.content = msg.content.trim();
    console.log(msg.createdAt + ' ' + msg.author.username + ' ' + msg.author.id);
    if (msg.content.startsWith(prefix) && msg.author.id !== client.user.id) {
        let contentParts = Methods.getArguments(msg.content);
        if (!Methods.isUndefined(CommandList[contentParts.command])) {
            CommandList[contentParts.command].execute(msg, contentParts.args);
        }
    }
    // if (msg.content === 'ping') {
    //     msg.reply('pong');
    // }
    if (InTheChatFeature.checkFormat(msg.content)) {
        let contentLow = msg.content.toLowerCase();
        let lengthOfFirst = -1, indexOfLast = InTheChatFeature.getIndexOfRegex(contentLow, /\s+in\s+the\s+chat/), startingIndex = -1;
        let firstOccurence = contentLow.match(InTheChatFeature.isARegex(contentLow) ? InTheChatFeature.canIGetARegex : InTheChatFeature.canIGetAnRegex)[0];
        startingIndex = contentLow.indexOf(firstOccurence);
        lengthOfFirst = firstOccurence.length;
        if (!(lengthOfFirst === -1 || indexOfLast === -1 || startingIndex === -1)) {
            let chant = msg.content.substring(startingIndex + lengthOfFirst, indexOfLast).trim();
            InTheChatFeature.handleChant(msg.channel, msg.author.id, chant);
        }
    }
});

client.login(Settings['token']);