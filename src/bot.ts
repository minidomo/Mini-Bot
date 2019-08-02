// loading all files in a specific order to prevent any errors from module.exports not being loaded
require ('./structs/Arguments');
require('./structs/Client');
require('./structs/Song');
require('./structs/SongCache');
require('./util/Transform');
require('./util/Logger');
require('./util/Hex');
require('./util/Youtube');
require('./structs/SongCollection');
require('./structs/RepeatState');
require('./structs/Queue');
require('./structs/PlaylistManager');
require('./structs/GuildSettings');
require('./structs/Settings');
require('./structs/Structs');

require('./util/Message');
require('./util/Emotes');
require('./util/Util');

require('./listeners/ready');
require('./listeners/exit');
require('./listeners/guildCreate');
require('./listeners/guildDelete');
require('./listeners/voiceStatusUpdate');

require('./commands/Music/repeat');
require('./commands/Owner/setactivity');
require('./commands/Music/stop');
require('./commands/Music/skip');
require('./commands/Music/qfile');
require('./commands/Music/queue');
require('./commands/Music/play');
require('./commands/Music/pplay');
require('./commands/Playlist/pfile');
require('./commands/Playlist/rename');
require('./commands/Playlist/view');
require('./commands/Playlist/remove');
require('./commands/Playlist/add');
require('./commands/Playlist/delete');
require('./commands/Playlist/create');
require('./commands/Other/setprefix');
require('./commands/Other/prefix');
require('./commands/Other/faq');
require('./commands/Other/help');
require('./commands/commands');

require('./util/Handler');
require('./listeners/message');