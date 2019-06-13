'use strict';

const Discord = require('discord.js');
const config = require('../../../config');

// creating the help embed once to send out fast 
const fs = require('fs');
const commandFiles = fs.readdirSync('./commands/subcommands/c4').filter(file => file.endsWith('.js'));
let description = '';
for (const file of commandFiles) {
    const command = require(`./${file}`);
    if (command.visible)
        description += `\`${command.usage}\` ${command.desc}\n`;
}
const helpEmbed = new Discord.RichEmbed()
    .setColor('RED')
    .setTitle(`Sub-commands | Prefix: ${config.prefix}c4`)
    .setDescription(description);

module.exports = {
    name: 'help',
    visible: true,
    useable: true,
    desc: `Shows the sub-commands of \`${config.prefix}c4\`.`,
    usage: 'help',
    pass(msg, obj) {
        return true;
    },
    run(msg, obj) {
        msg.channel.send(helpEmbed);
    }
};