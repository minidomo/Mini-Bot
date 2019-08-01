import Discord from 'discord.js';
import Settings from '../../structs/Settings';
import Util from '../../util/Util';
import fs from 'fs';

const embed = new Discord.RichEmbed();

export default {
    name: 'help',
    description: 'Shows available commands.',
    usage: 'help',
    validate() {
        return true;
    },
    execute(msg: Discord.Message) {
        embed.setColor(Util.Hex.generateNumber())
            .setTitle(`Commands | Prefix: ${Settings.object.get(msg.guild.id).prefix}`);
        msg.channel.send(embed);
    },
    load(commands: Map<string, any>) {
        const command_dir = `${__dirname}/..`;
        const directories = fs.readdirSync(command_dir, { withFileTypes: true })
            .filter(source => source.isDirectory())
            .map(dir => dir.name);
        for (const dirname of directories) {
            const files = fs.readdirSync(`${command_dir}/${dirname}`).filter(name => name.endsWith('.js'))
                .map(name => name.substring(0, name.length - 3));
            let description = '';
            for (const filename of files) {
                const command = commands.get(filename);
                if (command.name)
                    description += `\`${command.usage}\` ${command.description}\n`;
            }
            description = Util.Transform.limitText(description.trim(), 1024);
            if (description)
                embed.addField(dirname, description, true);
        }
    }
};