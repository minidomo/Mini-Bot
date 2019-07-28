'use strict';

const { Settings } = require('../../settings/settings');
const Message = require('../../util/Message');

module.exports = {
    name: 'plrename',
    desc: 'Renames a playlist.',
    usage: 'plrename <current name> <new name>',
    validate(msg, { args }) {
        if (args.length < 2) {
            Message.correctUsage(msg, this.usage);
            return false;
        }
        const [current, newname] = args;
        const playlists = Settings.get(msg.guild.id).playlists;
        if (playlists.has(current)) {
            if (playlists.has(newname)) {
                Message.playlistAlreadyExists(msg, newname);
            } else {
                return true;
            }
        } else {
            Message.playlistNotFound(msg, current);
        }
        return false;
    },
    execute(msg, { args }) {
        const [current, newname] = args;
        const playlist = Settings.get(msg.guild.id).playlists;
        playlist.change(current, newname);
        Message.custom(msg, `playlist \`${current}\` has been renamed to \`${newname}\``);
    }
};