import faq from './Other/faq';
import setprefix from './Other/setprefix';
import prefix from './Other/prefix';
import create from './Playlist/create';
import delete_command from './Playlist/delete';
import add from './Playlist/add';
import remove from './Playlist/remove';
import view from './Playlist/view';
import rename from './Playlist/rename';
import pfile from './Playlist/pfile';
import pplay from './Music/pplay';
import play from './Music/play';
import queue from './Music/queue';
import qfile from './Music/qfile';
import skip from './Music/skip';
import stop from './Music/stop';
import setactivity from './Owner/setactivity';
import help from './Other/help';

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
    .set(setactivity.name, setactivity);

help.load(commands);

export default commands;