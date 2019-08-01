import PlaylistManager from './PlaylistManager';
import SongCollection from './SongCollection';

class GuildSettings {
    name: string | undefined;
    prefix: string;
    queue: SongCollection;
    playlists: PlaylistManager;

    constructor(
        data:
            {
                name?: string,
                prefix?: string,
                queue?: object[],
                playlists?: { [key: string]: object[] }
            } = {}
    ) {
        this.name = data.name;
        this.prefix = data.prefix || '!!';
        this.queue = new SongCollection(data.queue);
        this.playlists = new PlaylistManager(data.playlists);
    }

    set(data: { name?: string, prefix?: string } = {}) {
        if (data.name)
            this.name = data.name;
        if (data.prefix)
            this.prefix = data.prefix;
    }

    getElement() {
        return {
            name: this.name,
            prefix: this.prefix,
            queue: this.queue.getElement(),
            playlists: this.playlists.getElement()
        };
    }
}

export default GuildSettings;