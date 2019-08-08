import SongCollection = require('./SongCollection');
import RepeatState = require('./RepeatState');
import MP3 = require('./MP3');
import fs = require('fs');

class Queue extends SongCollection {
    repeat: RepeatState;
    quiet: boolean;
    downloading: MP3 | undefined;
    channelId: string | undefined;

    constructor(data: object[] = []) {
        super(data);
        this.repeat = new RepeatState();
        this.quiet = false;
        this.downloading = undefined;
        this.channelId = undefined;
    }

    quietToggle() {
        return this.quiet = !this.quiet;
    }

    download(writeStream: fs.WriteStream, path: string) {
        this.downloading = new MP3(writeStream, path, this);
    }
}

export = Queue;