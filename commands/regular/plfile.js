'use strict';

const { Settings } = require('../../settings/settings');
const Message = require('../../util/Message');
const fs = require('fs');

module.exports = {
    name: 'plfile',
    desc: 'Returns a file containing the list of playlists/songs.',
    usage: 'plfile <?playlist name>',
    validate(msg, { args }) {
        if (args.length === 0)
            return true;
        const [name] = args;
        const playlists = Settings.get(msg.guild.id).playlists;
        if (playlists.has(name))
            return true;
        Message.playlistNotFound(msg, name);
        return false;
    },
    async execute(msg, { args }) {
        const playlists = Settings.get(msg.guild.id).playlists;
        let filename = `${msg.guild.id}-PLAYLIST`, body;
        if (args.length === 0) {
            filename += '.json';
            body = JSON.stringify(playlists.getElement(), null, 4);
        } else {
            const [name] = args;
            filename += `-${name}.json`;
            const playlist = playlists.get(name);
            body = JSON.stringify(playlist.getElement(), null, 4);
        }
        const path = `./${filename}`;
        fs.writeFileSync(path, body);
        await msg.channel.send({
            files: [{
                attachment: path,
                name: filename
            }]
        });
        if (fs.existsSync(path))
            fs.unlinkSync(path);
    }
};