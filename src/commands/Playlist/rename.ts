import Discord from 'discord.js';
import Settings from '../../structs/Settings';
import Util from '../../util/Util';

const { object: settings } = Settings;

export default {
    name: 'rename',
    description: 'Renames a playlist.',
    usage: 'rename <current name> <new name>',
    validate(msg: Discord.Message, { args }: { base: string, args: string[] }) {
        if (args.length < 2) {
            Util.Message.correctUsage(msg, this.usage);
            return false;
        }
        const [current, newname] = args;
        const playlists = settings.get(msg.guild.id).playlists;
        if (playlists.has(current)) {
            if (playlists.has(newname)) {
                Util.Message.playlistAlreadyExists(msg, newname);
            } else {
                return true;
            }
        } else {
            Util.Message.playlistNotFound(msg, current);
        }
        return false;
    },
    execute(msg: Discord.Message, { args }: { base: string, args: string[] }) {
        const [current, newname] = args;
        const playlist = settings.get(msg.guild.id).playlists;
        playlist.change(current, newname);
        msg.channel.send(`playlist \`${current}\` has been renamed to \`${newname}\``);
    }
};