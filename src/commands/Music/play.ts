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
                Util.Youtube.play(Client, settings, msg.guild.id, msg.channel.id);
        } else {
            let added = 0;
            for (const elem of args) {
                const validId = Util.Youtube.ytdl.validateID(elem);
                if (validId || Util.Youtube.ytdl.validateURL(elem)) {
                    if (await queue.addId(elem))
                        added++;
                    else if (validId) {
                        const [vid] = await Util.Youtube.search(elem, 1);
                        if (await queue.addId(vid.id!))
                            added++;
                    }
                } else if (Util.Youtube.url.PLAYLIST_REGEX.test(elem)) {
                    const match = Util.Youtube.url.PLAYLIST_REGEX.exec(elem);
                    if (match && match[1]) {
                        const res = Util.Youtube.url.playlist(match[1]);
                        const { data } = await Util.Youtube.ytplaylist(res, 'id');
                        for (const id of data.playlist)
                            if (await queue.addId(id as string))
                                added++;
                    }
                } else {
                    const vids = await Util.Youtube.search(elem, 1);
                    for (const song of vids)
                        if (await queue.addId(song.id!))
                            added++;
                }
                if (queue.size() > 0)
                    Util.Youtube.play(Client, settings, msg.guild.id, msg.channel.id);
            }
            const description = `Added ${added} song(s)`;
            const embed = new Discord.RichEmbed()
                .setColor(Util.Hex.generateNumber())
                .setDescription(description);
            msg.channel.send(embed);
        }
    }
};