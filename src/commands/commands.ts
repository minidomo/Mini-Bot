import faq = require('./Other/faq');
import setprefix = require('./Other/setprefix');
import prefix = require('./Other/prefix');
import create = require('./Playlist/create');
import delete_command = require('./Playlist/delete');
import add = require('./Playlist/add');
import remove = require('./Playlist/remove');
import view = require('./Playlist/view');
import rename = require('./Playlist/rename');
import pfile = require('./Playlist/pfile');
import pplay = require('./Music/pplay');
import play = require('./Music/play');
import queue = require('./Music/queue');
import qfile = require('./Music/qfile');
import skip = require('./Music/skip');
import stop = require('./Music/stop');
import setactivity = require('./Owner/setactivity');
import repeat = require('./Music/repeat');
import shuffle = require('./Music/shuffle');
import quiet = require('./Music/quiet');
import help = require('./Other/help');

class CommandMap extends Map<string, any>{
    constructor() {
        super();
    }

    get(id: string) {
        return super.get(id)!;
    }
}

const commands = new CommandMap()
    .set(help.name, help)
    .set(faq.name, faq)
    .set(prefix.name, prefix)
    .set(setprefix.name, setprefix)
    .set(create.name, create)
    .set(delete_command.name, delete_command)
    .set(add.name, add)
    .set(remove.name, remove)
    .set(view.name, view)
    .set(rename.name, rename)
    .set(pfile.name, pfile)
    .set(pplay.name, pplay)
    .set(play.name, play)
    .set(queue.name, queue)
    .set(qfile.name, qfile)
    .set(skip.name, skip)
    .set(stop.name, stop)
    .set(setactivity.name, setactivity)
    .set(repeat.name, repeat)
    .set(shuffle.name, shuffle)
    .set(quiet.name, quiet);

help.load(commands);

export = commands;