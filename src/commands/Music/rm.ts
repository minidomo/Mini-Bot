import Discord = require('discord.js');
import Settings = require('../../structs/Settings');
import Util = require('../../util/Util');

const { object: settings } = Settings;

export = {
    name: 'rm',
    description: 'Removes a song or a range of songs from the queue.',
    usage: 'rm <position1> <?position2>',
    validate(msg: Discord.Message, { args }: { base: string, args: string[] }) {
        if (args.length < 1) {
            Util.Message.correctUsage(msg, this.usage);
            return false;
        }
        if (!msg.member!.voice.channelID) {
            Util.Message.userMustBeInVoiceChannel(msg);
            return false;
        }
        const [pos, pos2] = args;
        if (!/^\d+$/.test(pos) || pos2 && !/^\d+$/.test(pos2)) {
            Util.Message.correctUsage(msg, this.usage);
            return false;
        }
        const guild = msg.guild!;
        const queue = settings.get(guild.id).queue;
        const num = parseInt(pos);
        if (num >= 1 && num <= queue.size() - 1) {
            if (pos2) {
                const num2 = parseInt(pos2);
                if (num2 >= 1 && num2 <= queue.size() - 1) {
                    return true;
                }
                Util.Message.mustBeANumberWithin(msg, 1, queue.size() - 1);
                return false;
            }
            return true;
        }
        Util.Message.mustBeANumberWithin(msg, 1, queue.size() - 1);
        return false;
    },
    execute(msg: Discord.Message, { args }: { base: string, args: string[] }) {
        const guild = msg.guild!;
        const queue = settings.get(guild.id).queue;
        const pos = parseInt(args[0]);
        let pos2 = args[1] ? Math.max(parseInt(args[1]), pos) : pos;
        const shouldRemove = pos2 - pos + 1;
        let removed = 0;
        for (let x = 0; x < shouldRemove && pos < queue.size(); x++)
            if (queue.remove(pos))
                removed++;
        const embed = new Discord.MessageEmbed()
            .setColor(Util.Hex.generateNumber())
            .setDescription(`Removed ${removed} song(s)`);
        msg.channel.send(embed);
    }
};