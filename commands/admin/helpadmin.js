'use strict';

const Discord = require('discord.js');
const { Settings } = require('../../settings/settings');
const Hex = require('../../util/hex');
const Message = require('../../util/Message');

module.exports = {
    name: 'helpadmin',
    desc: 'Shows available admin commands.',
    usage: 'helpadmin',
    validate() {
        return true;
    },
    execute(msg) {
        commandEmbed
            .setColor(Hex.generate(true))
            .setTitle(`Admin Commands | Prefix: ${Settings.get(msg.guild.id).prefix}`);
        Message.custom(msg, commandEmbed);
    }
};

const fs = require('fs');
const commandFiles = fs.readdirSync('./commands/admin').filter(file => file.endsWith('.js'));
const DESCRIPTION_LIMIT = 2048;
let description = '';
let ellipses = false;
for (const file of commandFiles) {
    const command = require(`./${file}`);
    if (command.name) {
        const val = `\`${command.usage}\` ${command.desc}\n`;
        if (description.length + val.length <= DESCRIPTION_LIMIT - 3)
            description += val;
        else if (!ellipses) {
            description += '...';
            ellipses = true;
        }
    }
}
const commandEmbed = new Discord.RichEmbed()
    .setDescription(description);