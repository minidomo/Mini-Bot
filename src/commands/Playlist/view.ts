import Discord from 'discord.js';
import Settings from '../../structs/Settings';
import Util from '../../util/Util';

const { object: settings } = Settings;

const NAME_LIMIT = 13;
const DESCRIPTION_LIMIT = 2048;

export default {
    name: 'view',
    description: 'View all or a specific playlist.',
    usage: 'view <?playlist name>',
    validate(msg: Discord.Message, { args }: { base: string, args: string[] }) {
        if (args.length === 0)
            return true;
        const [name] = args;
        const playlists = settings.get(msg.guild.id).playlists;
        if (playlists.has(name))
            return true;
        Util.Message.playlistNotFound(msg, name);
        return false;
    },
    execute(msg: Discord.Message, { args }: { base: string, args: string[] }) {
        const playlists = settings.get(msg.guild.id).playlists;
        const embed = new Discord.RichEmbed()
            .setColor(Util.Hex.generateNumber())
        let description = '';
        let ellipses = false;
        if (args.length === 0) {
            const names = playlists.names();
            for (const name of names) {
                const playlist = playlists.get(name);
                const val = `${name} \`${playlist.size()} song(s)\`\n`
                if (description.length + val.length <= DESCRIPTION_LIMIT - 3)
                    description += val;
                else if (!ellipses) {
                    description += '...';
                    ellipses = true;
                }
            }
            embed.setTitle(`${playlists.size()} Playlist(s)`)
        } else {
            const [name] = args;
            const playlist = playlists.get(name);
            const arr = playlist.list;
            for (const song of arr) {
                const val = `\`${Util.Transform.limitText(song.title!, NAME_LIMIT)}\` `
                    + `\`${song.id}\`\n`;
                if (description.length + val.length <= DESCRIPTION_LIMIT - 3)
                    description += val;
                else {
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