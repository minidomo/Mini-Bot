import Discord = require('discord.js');
import Settings = require('../../structs/Settings');
import Util = require('../../util/Util');

const { object: settings } = Settings;

export = {
    name: 'repeat',
    description: 'Repeat the current song or whole queue.',
    usage: 'repeat <?current|queue>',
    validate(msg: Discord.Message, { args }: { base: string, args: string[] }) {
        if (args.length === 0)
            return true;
        else {
            const [state] = args;
            if (state === 'current' || state === 'queue')
                return true;
            Util.Message.correctUsage(msg, this.usage);
            return false;
        }
    },
    execute(msg: Discord.Message, { args }: { base: string, args: string[] }) {
        const guild = msg.guild!;
        const embed = new Discord.MessageEmbed().setColor(Util.Hex.generateNumber()).setTitle('Repeat');
        const queue = settings.get(guild.id).queue;
        let description = '';
        if (args.length > 0) {
            const [state] = args;
            queue.repeat.on(state);
            description += `${state} has been changed\n`;
        }
        description += `current: **${translate(queue.repeat.current)}**\nqueue: **${translate(queue.repeat.queue)}**`;
        embed.setDescription(description);
        msg.channel.send(embed);
    }
};

const translate = (val: boolean) => val ? 'ON' : 'OFF';