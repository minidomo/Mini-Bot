import Discord from 'discord.js';
import Settings from '../../structs/Settings';

const { object: settings } = Settings;

export default {
    name: 'prefix',
    description: 'Shows the prefix of the bot.',
    usage: 'prefix',
    validate() {
        return true;
    },
    execute(msg: Discord.Message) {
        msg.channel.send(`Prefix is: \`${settings.get(msg.guild.id).prefix}\``);
    }
};