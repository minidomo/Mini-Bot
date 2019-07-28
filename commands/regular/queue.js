'use strict';

const Discord = require('discord.js');
const Hex = require('../../util/Hex');
const { Settings } = require('../../settings/settings');
const Message = require('../../util/Message');
const Transform = require('../../util/Transform');
const client = require('../../structs/Client');

const DESCRIPTION_LIMIT = 2048;
const FIELD_VALUE_LIMIT = 1024;
const EMBED_LIMIT = 6000;

module.exports = {
    name: 'queue',
    desc: 'Shows the current queue.',
    usage: 'queue',
    validate() {
        return true;
    },
    execute(msg) {
        const embed = new Discord.RichEmbed()
            .setColor(Hex.generate(true));
        const queue = Settings.get(msg.guild.id).queue;
        const title = `${queue.size()} song(s)`;
        let description = '';
        const arr = queue.list;
        if (arr.length === 0)
            description = '¯\\\_(ツ)\_/¯';
        else {
            const NAME_LIMIT = 17;
            description = `\`${isPlaying(msg.guild.id) ? '⋆' : '•'}\` \`${Transform.shortenText(arr[0].title, NAME_LIMIT)}\` \`${arr[0].duration}\`\n`;
            for (let x = 1; x < arr.length; x++) {
                const song = arr[x];
                const str = `\`${x}\` \`${Transform.shortenText(song.title, NAME_LIMIT)}\` \`${song.duration}\`\n`;
                if (description.length + str.length <= DESCRIPTION_LIMIT - 3) {
                    description += str;
                } else {
                    description += '...';
                    break;
                }
            }
        }
        embed.setTitle(title)
            .setDescription(description);
        Message.custom(msg, embed);
    }
};

const isPlaying = (guild_id) => {
    const voiceConnection = client.voiceConnections.get(guild_id);
    if (voiceConnection) {
        const dispatcher = voiceConnection.dispatcher;
        if (dispatcher && !dispatcher.paused)
            return true;
    }
    return false;
};