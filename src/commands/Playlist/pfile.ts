import Discord = require('discord.js');
import Settings = require('../../structs/Settings');
import Util = require('../../util/Util');
import fs = require('fs');

const { object: settings } = Settings;

export = {
    name: 'pfile',
    description: 'Returns a file containing the list of playlists/songs.',
    usage: 'pfile <?playlist name>',
    validate(msg: Discord.Message, { args }: { base: string, args: string[] }) {
        if (args.length === 0)
            return true;
        const [name] = args;
        const playlists = settings.get(msg.guild!.id).playlists;
        if (playlists.has(name))
            return true;
        Util.Message.playlistNotFound(msg, name);
        return false;
    },
    async execute(msg: Discord.Message, { args }: { base: string, args: string[] }) {
        const guild = msg.guild!;
        const playlists = settings.get(guild.id).playlists;
        let filename = `${guild.id}-PLAYLIST`, body;
        if (args.length === 0) {
            filename += '.json';
            body = JSON.stringify(playlists.getElement(), null, 4);
        } else {
            const [name] = args;
            filename += `-${name}.json`;
            const playlist = playlists.get(name);
            body = JSON.stringify(playlist.getElement(), null, 4);
        }
        const path = `./${filename}`;
        fs.writeFileSync(path, body);
        await msg.channel.send({
            files: [{
                attachment: path,
                name: filename
            }]
        });
        if (fs.existsSync(path))
            fs.unlinkSync(path);
    }
};