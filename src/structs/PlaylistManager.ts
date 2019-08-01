import SongCollection from './SongCollection';

class PlaylistManager {
    playlists: { [key: string]: SongCollection };

    constructor(data: { [key: string]: object[] } = {}) {
        this.playlists = {};
        Object.keys(data).forEach((name: string) => {
            this.playlists[name] = new SongCollection(data[name]);
        });
    }

    size() {
        return Object.keys(this.playlists).length;
    }

    names() {
        return Object.keys(this.playlists);
    }

    has(name: string) {
        return typeof this.playlists[name] === 'object';
    }

    get(name: string) {
        return this.playlists[name];
    }

    change(curname: string, newname: string) {
        this.playlists[newname] = this.playlists[curname];
        delete this.playlists[curname];
        return this.playlists[newname];
    }

    delete(name: string) {
        const ret = this.playlists[name];
        delete this.playlists[name];
        return ret;
    }

    create(name: string) {
        this.playlists[name] = new SongCollection();
        return this.playlists[name];
    }

    getElement() {
        const ret: { [key: string]: object } = {};
        Object.keys(this.playlists).forEach(name => ret[name] = this.playlists[name].getElement());
        return ret;
    }
}

export default PlaylistManager;