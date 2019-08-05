import Discord = require('discord.js');
import Settings = require('../../structs/Settings');
import Util = require('../../util/Util');
import Client = require('../../structs/Client');

const { object: settings } = Settings;

export = {
    name: 'play',
    description: 'Plays songs.',
    usage: 'play <?url|title|id>',
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
        if (!voiceConnection) {
            const voiceChannel = msg.member!.voice.channel!;
            if (voiceChannel.joinable)
                await voiceChannel.join();
        }
        const queue = settings.get(guild.id).queue;
        if (args.length === 0) {
            if (queue.size() > 0)
                Util.Youtube.play(settings, guild.id, msg.channel.id);
        } else {
            const message = await msg.channel.send(`Processing data. This may take several seconds/minutes.`) as Discord.Message;
            const added = await queue.addInput(args);
            if (queue.size() > 0)
                Util.Youtube.play(settings, guild.id, msg.channel.id);
            const description = `Added ${added} song(s)`;
            const embed = new Discord.MessageEmbed()
                .setColor(Util.Hex.generateNumber())
                .setDescription(description);
            msg.channel.send(embed);
            message.delete();
        }
    }
};