import SongCollection = require('./SongCollection');
import RepeatState = require('./RepeatState');

class Queue extends SongCollection {
    repeat: RepeatState;
    quiet: boolean;

    constructor(data: object[] = []) {
        super(data);
        this.repeat = new RepeatState();
        this.quiet = false;
    }

    quietToggle() {
        return this.quiet = !this.quiet;
    }
}

export = Queue;