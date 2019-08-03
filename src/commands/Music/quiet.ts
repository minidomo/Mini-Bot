import Discord = require('discord.js');
import Settings = require('../../structs/Settings');
import Util = require('../../util/Util');

const { object: settings } = Settings;

export = {
    name: 'quiet',
    description: 'Toggles on/off the bot\'s "playing..." messages.',
    usage: 'quiet',
    validate() {
        return true;
    },
    execute(msg: Discord.Message) {
        const guild = msg.guild!;
        const queue = settings.get(guild.id).queue;
        const val = queue.quietToggle();
        let description = `Quiet Mode: **${translate(val)}**\n${val ? 'No ' : ''}"Playing..." messages will be sent.`;
        const embed = new Discord.MessageEmbed()
            .setColor(Util.Hex.generateNumber())
            .setDescription(description);
        msg.channel.send(embed);
    }
};

const translate = (val: boolean) => val ? 'ON' : 'OFF';