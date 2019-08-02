import Discord = require('discord.js');
import Settings = require('../../structs/Settings');

const { object: settings } = Settings;

export = {
    name: 'prefix',
    description: 'Shows the prefix of the bot.',
    usage: 'prefix',
    validate() {
        return true;
    },
    execute(msg: Discord.Message) {
        msg.channel.send(`Prefix is: \`${settings.get(msg.guild!.id).prefix}\``);
    }
};