'use strict';

const Discord = require('discord.js');
const Hex = require('../../util/Hex');
const { Settings } = require('../../settings/settings');
const Message = require('../../util/Message');
const Transform = require('../../util/Transform');

const NAME_LIMIT = 13;
const DESCRIPTION_LIMIT = 2048;

module.exports = {
    name: 'plview',
    desc: 'View all or a specific playlist.',
    usage: 'plview <?playlist name>',
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
    execute(msg, { args }) {
        const playlists = Settings.get(msg.guild.id).playlists;
        const embed = new Discord.RichEmbed()
            .setColor(Hex.generate(true))
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
                const val = `\`${Transform.shortenText(song.title, NAME_LIMIT)}\` `
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
        Message.custom(msg, embed);
    }
};