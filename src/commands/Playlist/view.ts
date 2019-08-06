import Discord = require('discord.js');
import Settings = require('../../structs/Settings');
import Util = require('../../util/Util');

const { object: settings } = Settings;

const PLAYIST_NAME_LIMIT = 30;
const NAME_LIMIT = 70;
const DESCRIPTION_LIMIT = 2048;

export = {
    name: 'view',
    description: 'View all or a specific playlist.',
    usage: 'view <?playlist name> <?position>',
    validate(msg: Discord.Message, { args }: { base: string, args: string[] }) {
        if (args.length === 0)
            return true;
        const [name] = args;
        const playlists = settings.get(msg.guild!.id).playlists;
        if (!playlists.has(name)) {
            Util.Message.playlistNotFound(msg, name);
            return false;
        }
        if (args.length > 2 && !/^\d+$/.test(args[1])) {
            Util.Message.correctUsage(msg, this.usage);
            return false;
        }
        return true;
    },
    execute(msg: Discord.Message, { args }: { base: string, args: string[] }) {
        const guild = msg.guild!;
        const playlists = settings.get(guild.id).playlists;
        const embed = new Discord.MessageEmbed()
            .setColor(Util.Hex.generateNumber())
        let description = '';
        if (args.length === 0) {
            const names = playlists.names();
            for (const name of names) {
                const playlist = playlists.get(name);
                const val = `${Util.Transform.limitText(name, PLAYIST_NAME_LIMIT)} \`${playlist.size()} song(s)\`\n`
                if (description.length + val.length <= DESCRIPTION_LIMIT - 3)
                    description += val;
                else {
                    description += '...';
                    break;
                }
            }
            embed.setTitle(`${playlists.size()} Playlist(s)`)
        } else {
            const name = args[0];
            const playlist = playlists.get(name);
            const arr = playlist.list;
            let startPos = 0;
            if (args.length > 1) {
                const pos = parseInt(args[1]);
                if (pos >= 0 && pos <= arr.length - 1)
                    startPos = pos;
            }
            for (let x = startPos; x < arr.length; x++) {
                const song = arr[x];
                let title = Util.Youtube.fixTitle(song.title!);
                title = Util.Transform.limitText(title, NAME_LIMIT);
                const str = `\`${x}\` [\`${title}\`](${Util.Youtube.url.video(song.id!)}) \`${song.duration}\`\n`;
                if (description.length + str.length <= DESCRIPTION_LIMIT - 3) {
                    description += str;
                } else {
                    description += '...';
                    break;
                }
            }
            embed.setTitle(`${playlist.size()} Song(s)`);
        }
        embed.setDescription(description);
        msg.channel.send(embed);
    }
};