import Discord from 'discord.js';
import Message from '../../util/Message';
import Settings from '../../structs/Settings';

export default {
    name: 'setprefix',
    description: 'Sets the prefix for this bot.',
    usage: 'setprefix <prefix>',
    validate(msg: Discord.Message, { args }: { base: string, args: string[] }) {
        if (!msg.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR!)) {
            Message.mustBeAdmin(msg);
            return false;
        }
        if (args.length < 1) {
            Message.correctUsage(msg, this.usage);
            return false;
        }
        if (!/^[^\w\d\s]+$/.test(args[0])) {
            msg.channel.send(`Invalid prefix. Prefix cannot include letters, numbers, whitespace, or underscores.`);
            return false;
        }
        return true;
    },
    execute(msg: Discord.Message, { args }: { base: string, args: string[] }) {
        Settings.object.get(msg.guild.id).prefix = args[0];
        msg.channel.send(`Prefix has been changed to: \`${args[0]}\``);
    }
};