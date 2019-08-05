import fs = require('fs');
import Queue = require('./Queue');

class MP3 {
    writeStream: fs.WriteStream;
    path: string;
    queue: Queue;

    constructor(writeStream: fs.WriteStream, path: string, queue: Queue) {
        this.writeStream = writeStream;
        this.path = path;
        this.queue = queue;
        let done = false;
        writeStream.on('close', () => {
            if (!done) {
                console.log('CLOSING');
                queue.downloading = undefined;
                done = true;
            }
        });
    }
}

export = MP3;