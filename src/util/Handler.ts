import Discord from 'discord.js';
import Settings from '../structs/Settings';
import Commands from '../commands/commands';
import Client from '../structs/Client';

const mention_regex = /^(<@!?(\d+)>)/;
const prefix_regex = /^([^\w\d\s]+)/;

export default {
    getArgs(content: string | string[], guildId: string) {
        if (typeof content === 'string') {
            const mentionMatch = mention_regex.exec(content);
            const prefix = Settings.object.get(guildId).prefix;
            const prefixMatch = prefix_regex.exec(content);
            if (prefixMatch && prefixMatch[1] === prefix || mentionMatch && mentionMatch[1] && mentionMatch[2] === Client.user.id) {
                let pre = content.substr(mentionMatch ? mentionMatch[1].length : prefix.length).trimLeft().split(/\s+/g);
                const fixed = pre.join(' ');
                const parsed = fixed.match(/("[^"]*"|[^\s]+)/g);
                if (parsed) {
                    const arr = parsed.map(str => {
                        let res = str;
                        if (str.startsWith('"') && str.endsWith('"'))
                            res = str.substring(1, str.length - 1).trim();
                        return res;
                    }).filter(str => str.length > 0);
                    return {
                        base: arr.shift()!.toLowerCase(),
                        args: arr
                    };
                }
            }
            return undefined;
        } else {
            const arr = content.slice();
            return {
                base: arr.shift()!.toLowerCase(),
                args: arr
            };
        }
    },
    handle(msg: Discord.Message, obj: { base: string, args: string[] }) {
        if (Commands.has(obj.base)) {
            const command = Commands.get(obj.base);
            if (command.validate(msg, obj)) {
                command.execute(msg, obj);
                return true;
            }
        }
        return false;
    }
};