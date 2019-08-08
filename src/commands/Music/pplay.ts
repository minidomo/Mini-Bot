import Discord = require('discord.js');
import Settings = require('../../structs/Settings');
import Util = require('../../util/Util');
import Client = require('../../structs/Client');

const { object: settings } = Settings;

export = {
    name: 'pplay',
    description: 'Play playlists.',
    usage: 'pplay <?playlist names>',
    validate(msg: Discord.Message) {
        if (msg.member!.voice.channelID) {
            return true;
        }
        Util.Message.userMustBeInVoiceChannel(msg);
        return false;
    },
    async execute(msg: Discord.Message, { args }: { base: string, args: string[] }) {
        const guild = msg.guild!;
        const voiceConnection = Client.voice!.connections.get(guild.id);
        const queue = settings.get(guild.id).queue;
        if (!voiceConnection) {
            const voiceChannel = msg.member!.voice.channel!;
            if (voiceChannel.joinable) {
                queue.channelId = msg.channel.id;
                await voiceChannel.join();
            }
        }
        if (args.length === 0) {
            if (queue.size() > 0)
                Util.Youtube.play(settings, guild.id);
        } else {
            let added = 0;
            const playlists = settings.get(guild.id).playlists;
            for (const name of args) {
                if (!playlists.has(name))
                    continue;
                const playlist = playlists.get(name);
                playlist.list.forEach(song => {
                    if (!queue.has(song)) {
                        queue.add(song);
                        added++;
                    }
                });
            }
            if (queue.size() > 0)
                Util.Youtube.play(settings, guild.id);
            const description = `Added ${added} song(s)`;
            const embed = new Discord.MessageEmbed()
                .setColor(Util.Hex.generateNumber())
                .setDescription(description);
            msg.channel.send(embed);
        }
    }
};