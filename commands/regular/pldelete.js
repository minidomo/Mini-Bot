'use strict';

const { Settings } = require('../../settings/settings');
const Message = require('../../util/Message');
const Discord = require('discord.js');
const Hex = require('../../util/Hex');

module.exports = {
    name: 'pldelete',
    desc: 'Delete playlists.',
    usage: 'pldelete <names>',
    validate(msg, { args }) {
        if (args.length === 0) {
            Message.correctUsage(msg, this.usage);
            return false;
        }
        return true;
    },
    execute(msg, { args }) {
        const playlists = Settings.get(msg.guild.id).playlists;
        let count = 0, description = '';
        for (const name of args) {
            if (!playlists.has(name))
                continue;
            playlists.delete(name);
            description += name + '\n';
            count++;
        }
        const embed = new Discord.RichEmbed()
            .setColor(Hex.generate(true))
            .setTitle(`${count} Playlist(s) Deleted`)
            .setDescription(description);
        Message.custom(msg, embed);
    }
};