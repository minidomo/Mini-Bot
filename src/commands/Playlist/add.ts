import Discord from 'discord.js';
import Settings from '../../structs/Settings';
import Util from '../../util/Util';

const { object: settings } = Settings;

export default {
    name: 'add',
    description: 'Adds songs to a playist.',
    usage: 'add <playlist name> <?url|title|id>',
    validate(msg: Discord.Message, { args }: { base: string, args: string[] }) {
        if (args.length === 0) {
            Util.Message.correctUsage(msg, this.usage);
            return false;
        }
        const [name] = args;
        const playlists = settings.get(msg.guild.id).playlists;
        if (!playlists.has(name)) {
            Util.Message.playlistNotFound(msg, name);
            return false;
        }
        return true;
    },
    async execute(msg: Discord.Message, { args }: { base: string, args: string[] }) {
        const [name, ...rest] = args;
        const playlist = settings.get(msg.guild.id).playlists.get(name);
        const message = await msg.channel.send(`Processing data. This may take several seconds/minutes.`) as Discord.Message;
        let count = 0;
        if (args.length === 1) {
            const queue = settings.get(msg.guild.id).queue;
            queue.list.forEach(song => {
                if (!playlist.has(song)) {
                    playlist.add(song);
                    count++;
                }
            });
        } else {
            for (const elem of rest) {
                const validId = Util.Youtube.ytdl.validateID(elem);
                if (validId || Util.Youtube.ytdl.validateURL(elem)) {
                    if (await playlist.addId(elem))
                        count++;
                    else if (validId) {
                        const [vid] = await Util.Youtube.search(elem, 1);
                        if (await playlist.addId(vid.id!))
                            count++;
                    }
                } else if (Util.Youtube.url.PLAYLIST_REGEX.test(elem)) {
                    const match = Util.Youtube.url.PLAYLIST_REGEX.exec(elem);
                    if (match && match[1]) {
                        const res = Util.Youtube.url.playlist(match[1]);
                        const { data } = await Util.Youtube.ytplaylist(res, 'id');
                        for (const id of data.playlist)
                            if (await playlist.addId(id as string))
                                count++;
                    }
                } else {
                    const vids = await Util.Youtube.search(elem, 1);
                    for (const song of vids)
                        if (await playlist.addId(song.id!))
                            count++;
                }
            }
        }
        message.edit(`Added ${count} song(s) to the playist, \`${name}\``);
    }
};