import Discord = require('discord.js');
import Settings = require('../../structs/Settings');
import Util = require('../../util/Util');

const { object: settings } = Settings;

export = {
    name: 'current',
    description: 'Shows information about the current song.',
    usage: 'current',
    validate() {
        return true;
    },
    execute(msg: Discord.Message) {
        const guild = msg.guild!;
        const queue = settings.get(guild.id).queue;
        let description: string;
        if (queue.size() === 0) {
            description = 'Nothing playing ¯\\\_(ツ)\_/¯';
        } else {
            const song = queue.first();
            description = `Currently playing [${Util.Youtube.fixTitle(song.title!)}](${Util.Youtube.url.video(song.id!)}) by ${song.author} \`${song.duration}\``
        }
        const embed = new Discord.MessageEmbed()
            .setColor(Util.Hex.generateNumber())
            .setDescription(description);
        msg.channel.send(embed);
    }
};