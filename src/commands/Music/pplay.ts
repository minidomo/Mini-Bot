import Discord from 'discord.js';
import Settings from '../../structs/Settings';
import Util from '../../util/Util';
import Client from '../../structs/Client';

const { object: settings } = Settings;

export default {
    name: 'pplay',
    description: 'Play playlists.',
    usage: 'pplay <?playlist names>',
    validate(msg: Discord.Message) {
        if (msg.member.voiceChannelID) {
            return true;
        }
        Util.Message.userMustBeInVoiceChannel(msg);
        return false;
    },
    async execute(msg: Discord.Message, { args }: { base: string, args: string[] }) {
        const voiceConnection = Client.voiceConnections.get(msg.guild.id);
        if (!voiceConnection) {
            const voiceChannel = msg.member.voiceChannel;
            if (voiceChannel.joinable)
                await voiceChannel.join();
        }
        const queue = settings.get(msg.guild.id).queue;
        if (args.length === 0) {
            if (queue.size() > 0)
                Util.Youtube.play(settings, msg.guild.id, msg.channel.id);
        } else {
            let added = 0;
            const playlists = settings.get(msg.guild.id).playlists;
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
                Util.Youtube.play(settings, msg.guild.id, msg.channel.id);
            const description = `Added ${added} song(s)`;
            const embed = new Discord.RichEmbed()
                .setColor(Util.Hex.generateNumber())
                .setDescription(description);
            msg.channel.send(embed);
        }
    }
};