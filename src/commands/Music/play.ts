import Discord from 'discord.js';
import Settings from '../../structs/Settings';
import Util from '../../util/Util';
import Client from '../../structs/Client';

const { object: settings } = Settings;

export default {
    name: 'play',
    description: 'Plays songs.',
    usage: 'play <?url|title|id>',
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
            const added = await queue.addInput(args);
            if (added > 0)
                Util.Youtube.play(settings, msg.guild.id, msg.channel.id);
            const description = `Added ${added} song(s)`;
            const embed = new Discord.RichEmbed()
                .setColor(Util.Hex.generateNumber())
                .setDescription(description);
            msg.channel.send(embed);
        }
    }
};