import Discord = require('discord.js');
import Settings = require('../../structs/Settings');
import Util = require('../../util/Util');
import Client = require('../../structs/Client');

const { object: settings } = Settings;

const numberRegex = /^\d+$/;

export = {
    name: 'move',
    description: 'Moves a song to the specified position.',
    usage: 'move <current position> <new position>',
    validate(msg: Discord.Message, { args }: { base: string, args: string[] }) {
        if (args.length < 2) {
            Util.Message.correctUsage(msg, this.usage);
            return false;
        }
        if (!msg.member!.voice.channelID) {
            Util.Message.userMustBeInVoiceChannel(msg);
            return false;
        }
        const voiceConnection = Client.voice!.connections.get(msg.guild!.id);
        if (!voiceConnection) {
            Util.Message.botMustBeInVoiceChannel(msg);
            return false;
        }
        if (!numberRegex.test(args[0]) || !numberRegex.test(args[1])) {
            Util.Message.correctUsage(msg, this.usage);
            return false;
        }
        const { queue } = settings.get(msg.guild!.id);
        if (queue.size() === 0) {
            Util.Message.queueIsEmpty(msg);
            return false;
        }
        const cpos = parseInt(args[0]);
        const npos = parseInt(args[1]);
        if (cpos >= 1 && cpos < queue.size() && npos >= 1 && npos < queue.size()) {
            return true;
        }
        Util.Message.mustBeANumberWithin(msg, 1, queue.size() - 1);
        return false;
    },
    execute(msg: Discord.Message, { args }: { base: string, args: string[] }) {
        const guild = msg.guild!;
        const cpos = parseInt(args[0]);
        const npos = parseInt(args[1]);
        const { queue } = settings.get(guild.id);
        const song = queue.list[cpos];
        let description = `Moved [${Util.Youtube.fixTitle(song.title!)}](${Util.Youtube.url.video(song.id!)}) to ${npos}`;
        if (cpos !== npos)
            queue.move(cpos, npos);
        const embed = new Discord.MessageEmbed()
            .setColor(Util.Hex.generateNumber())
            .setDescription(description);
        msg.channel.send(embed);
    }
};