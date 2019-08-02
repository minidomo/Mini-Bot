import Discord = require('discord.js');
import Settings = require('../../structs/Settings');
import Util = require('../../util/Util');

const { object: settings } = Settings;

export = {
    name: 'delete',
    description: 'Delete playlists.',
    usage: 'delete <names>',
    validate(msg: Discord.Message, { args }: { base: string, args: string[] }) {
        if (args.length === 0) {
            Util.Message.correctUsage(msg, this.usage);
            return false;
        }
        return true;
    },
    execute(msg: Discord.Message, { args }: { base: string, args: string[] }) {
        const playlists = settings.get(msg.guild!.id).playlists;
        let count = 0, description = '';
        for (const name of args) {
            if (!playlists.has(name))
                continue;
            playlists.delete(name);
            description += name + '\n';
            count++;
        }
        const embed = new Discord.MessageEmbed()
            .setColor(Util.Hex.generateNumber())
            .setTitle(`${count} Playlist(s) Deleted`)
            .setDescription(description);
        msg.channel.send(embed);
    }
};