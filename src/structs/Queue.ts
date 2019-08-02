import SongCollection = require('./SongCollection');
import RepeatState = require('./RepeatState');

class Queue extends SongCollection {
    repeat: RepeatState;

    constructor(data: object[] = []) {
        super(data);
        this.repeat = new RepeatState();
    }
}

export = Queue;