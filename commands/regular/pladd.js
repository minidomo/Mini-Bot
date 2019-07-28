'use strict';

const { Settings } = require('../../settings/settings');
const Youtube = require('../../util/Youtube');
const Message = require('../../util/Message');

module.exports = {
    name: 'pladd',
    desc: 'Adds songs to a playist.',
    usage: 'pladd <playlist name> <?url|title|id>',
    validate(msg, { args }) {
        if (args.length === 0) {
            Message.correctUsage(msg, this.usage);
            return false;
        }
        const [name] = args;
        const playlists = Settings.get(msg.guild.id).playlists;
        if (playlists.has(name)) {
            return true;
        } else {
            Message.playlistNotFound(msg, name);
        }
        return false;
    },
    async execute(msg, { args }) {
        const [name, ...rest] = args;
        const playlist = Settings.get(msg.guild.id).playlists.get(name);
        const message = await Message.custom(msg, `Processing data. This may take several seconds/minutes.`);
        let count = 0;
        if (args.length === 1) {
            const queue = Settings.get(msg.guild.id).queue;
            queue.list.forEach(song => {
                if (!playlist.has(song)) {
                    playlist.add(song);
                    count++;
                }
            });
        } else {
            for (const elem of rest) {
                const validId = Youtube.ytdl.validateID(elem);
                if (validId || Youtube.ytdl.validateURL(elem)) {
                    if (await playlist.addId(elem))
                        count++;
                    else if (validId) {
                        const [vid] = await Youtube.search(elem, 1);
                        if (await playlist.addId(vid.id))
                            count++;
                    }
                } else if (Youtube.url.PLAYLIST_REGEX.test(elem)) {
                    const match = Youtube.url.PLAYLIST_REGEX.exec(elem);
                    if (match && match[1]) {
                        const res = Youtube.url.playlist(match[1]);
                        const { data } = await Youtube.ytplaylist(res, 'id');
                        for (const id of data.playlist)
                            if (await playlist.addId(id))
                                count++;
                    }
                } else {
                    const vids = await Youtube.search(elem, 1);
                    for (const song of vids)
                        if (await playlist.addId(song.id))
                            count++;
                }
            }
        }
        message.edit(`Added ${count} song(s) to the playist, \`${name}\``);
    }
};