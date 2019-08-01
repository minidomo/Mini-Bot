import Song from './Song';
import Settings from './Settings';
import GuildSettings from './GuildSettings';
import fs from 'fs';

class SongCache extends Map<string, Song>{
    static object: SongCache;
    loaded: boolean;

    constructor() {
        super();
        this.loaded = false;
    }

    load(Settings: Settings) {
        const raw = fs.readFileSync(`${__dirname}/../../save/songcache.json`, { encoding: 'utf8' });
        const content = raw ? JSON.parse(raw) as [] : [];
        content.forEach(data => {
            const song = new Song(data);
            this.set(song.id!, song);
        });
        Settings.forEach((guildSettings: GuildSettings) => {
            guildSettings.queue.map.forEach((song, id) => {
                this.set(id, song);
            });
            const playlists = guildSettings.playlists;
            playlists.names().forEach((name: string) => {
                const playlist = playlists.get(name);
                playlist.list.forEach((song: Song) => {
                    this.set(song.id!, song);
                });
            });
        });
        this.loaded = true;
    }

    save() {
        let res: any = [];
        this.forEach(song => {
            res.push(song.getElement());
        });
        fs.writeFileSync(`${__dirname}/../../save/songcache.json`, JSON.stringify(res, null, 4));
    }
}

SongCache.object = new SongCache();

export default SongCache;