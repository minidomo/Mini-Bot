import Discord = require('discord.js');
import Client = require('../../structs/Client');

export = {
    name: 'setactivity',
    description: 'Sets the activity of the bot.',
    usage: 'setactivity <?activity>',
    validate(msg: Discord.Message) {
        return msg.author!.id === process.env.OWNER_ID;
    },
    execute(msg: Discord.Message, { args }: { base: string, args: string[] }) {
        const val = args.length === 0 ? '@me help' : args[0];
        Client.user!.setActivity(val);
        msg.channel.send(`The bot's activity has been changed to: \`${val}\``);
    }
};