import Arguments = require('./Arguments');
import Client = require('./Client');
import Song = require('./Song');
import SongCache = require('./SongCache');
import PlaylistManager = require('./PlaylistManager');
import SongCollection = require('./SongCollection');
import GuildSettings = require('./GuildSettings');
import Settings = require('./Settings');
import Queue = require('./Queue');
import RepeatState = require('./RepeatState');
import MP3 = require('./MP3');

export = {
    Client: Client,
    Arguments: Arguments,
    GuildSettings: GuildSettings,
    MP3: MP3,
    PlaylistManager: PlaylistManager,
    Queue: Queue,
    RepeatState: RepeatState,
    Settings: Settings,
    Song: Song,
    SongCache: SongCache,
    SongCollection: SongCollection
};