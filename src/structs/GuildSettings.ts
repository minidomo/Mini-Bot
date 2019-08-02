import PlaylistManager = require('./PlaylistManager');
import Queue = require('./Queue');

class GuildSettings {
    name: string | undefined;
    prefix: string;
    queue: Queue;
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
        this.queue = new Queue(data.queue);
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

export = GuildSettings;