# Updates
#### April 21, 2019
- Refactored code. Connect 4 now supports multiple games and servers. Will re-add previous commands from [v1.0.0](https://github.com/MiniDomo/Mini-Bot/tree/1.0.0) in the future.  

#### April 22, 2019
- See [config.js.example](https://github.com/MiniDomo/Mini-Bot/blob/master/config.js.example) to understand how `config.js` should be structured.  

#### May 4, 2019
- Audio commands added: `play`, `queue`, `repeat`, `skip`, and `stop`
  - Uses [ytdl-core](https://www.npmjs.com/package/ytdl-core) and [opusscript](https://www.npmjs.com/package/opusscript).
  - Audio commands require [FFmpeg](https://ffmpeg.org/) to be installed on host's computer.
- `config.js.example`
  - Renamed `music` server to `audio`.
  - Replaced `[]` parameters with `<>`.
  - Added support for audio commands.

#### May 5, 2019
- New `search` command
  - Usage: `!!search <video title>`
  - Use it to search for YouTube videos
  - Uses [axios](https://www.npmjs.com/package/axios) and [cheerio](https://www.npmjs.com/package/cheerio).
- `config.js.example`
  - Added `search` command

#### May 12, 2019
- Modified `search` command
  - Primary method uses [youtube-search](https://www.npmjs.com/package/youtube-search), which requires a [Youtube v3 API key](https://console.developers.google.com/apis/credentials). This is much faster than the previous method, which is now the secondary method. If a key is not provided, then it will utilize the secondary method.
- `config.js.example`
  - Added an `api_keys` object to the config which can be used to store API keys such as a Youtube v3 API key.

#### May 15, 2019
- Added Tic Tac Toe game (Changed command name [May 17, 2019](https://github.com/MiniDomo/Mini-Bot#may-17-2019))
  - `!!ttt help` for a list of commands
  - The code functions similar to Connect 4
- `config.js.example`
  - Added `ttt` command
- `connect4.js`
  - Fixed issue where the bot would crash when a game would end due to using an undefined variable

#### May 17, 2019
- Added `remove` command
  - Usage: `!!remove <audio number>` (0 for the current audio)
  - Removes the specified audio from the queue
- `connect4.js`
  - Fixed issue where the game would be removed from the server after the first move
  - Refactored in `getGame(msg)` method
- `tictactoe.js`
  - Refactored some variables
- `ttt.js` changed to `t.js`
  - Refactored 
- `config.js.example`
  - Added `remove` command
  - Adjusted change from `ttt` to `t`

#### May 22, 2019
- Chat logs are now also recorded in `.log` files
  - Added the folder, `chatlogs`
  - Now support logging edited messages
- `bot.js`
  - Added event for edited messages
  - Created a `WriteStream`
- `main.js`
  - Added support for the `WriteStream` and edited messages
- `.gitignore`
  - Ignored `.log` files in the folder, `chatlogs`.

#### May 28, 2019
- Added `rps` (RNG Rock Paper Scissors) game
  - Usage: `!!rps <user1> <user2>`
- Added `util` folder
  - Created to group common methods that I've used in multiple files
- `games` and `commands` refactored code for the creation of `util` and made assigned variables at the top of files to `const`
- Updated `config.js.example`
  - Removed unnecessary `restrictable` properties in `commands`
  - Added `rps`

#### May 29, 2019
- `play` can now receive and play audio given a video title
  - `play.js` passes a callback function to `search.js`
- Fixed issue with `tictactoe.js` where uppercase letters would be passed in `canPlace()` but not in `place()`
- Logging
  - Now logs deleted messages and embed titles
  - Created enums for the type of data being logged
  - Affects `main.js` and `bot.js`

#### May 31, 2019
- Updated [axios](https://www.npmjs.com/package/axios) to 0.19.0 to prevent potential security vulnerability

#### June 1, 2019
- Fixed issue in `stop` and `skip`
  - `stop` did not properly check if a bot was in a voice channel and could possibly crash the bot with a consecutive call to `stop`
  - `skip` did not properly check if the queue was empty and would crash the bot when there was a call to `skip` with an empty queue if the bot had been called with at least one of its audio related commands on the respective server
- Appropriately renamed `index.js` to `bot.js`

#### June 3, 2019
- Added link to github repository in `info`
- Added `move` command
  - Usage: `!!move <old position> <new position>`
  - Moves an audio track to a new position

#### June 4, 2019
- Added `redirect` command
  - Directs 'Now playing' messages created from the bot to the channel the command was last used in
  - Usage: `!!redirect`
- Error messages now shown in console in `play` and `search`
- Updated some wording
- Added Installation Guide

#### June 5, 2019
- Added `url` command
  - Gets the URL of the specified audio track in the queue
  - Usage: `!!url <position>`

#### June 6, 2019
- Fixed issue in `connect4.js` where if someone typed multiple characters for a coordinate, the bot would crash
- Added losing emotes for draws in Tic Tac Toe and Connect 4

#### June 7, 2019
- Added `clear` command
  - Clears the queue (i.e. removes all audio tracks from the queue).
  - Usage: `!!clear`
- Added `resume` and `pause` commands
  - Resumes and pauses the current audio respectively
  - Usage: `!!resume`, `!!pause`
- Changed the `song` state in `repeat` to `current`
- More thorough check for logging edited messages

#### June 8, 2019
- Added `shuffle` command
  - Shuffles the queue when there's at least 3 tracks in the queue.
  - Usage: `!!shuffle`
- Updated dependencies for `youtube-search` in `package-lock.json` to remove vulnerabilities

#### June 10, 2019
- Changed structure of extensions in `ext`
- Logging now uses [winston](https://www.npmjs.com/package/winston) for improved performance
- Output to console and `.logs` in `chatlogs` are now the same and formatted similarly to the previous `.logs`

#### June 11, 2019
- Changed most uses of `let` to `const` for improved coding style
- Utilized more [destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) overall
- Changed structure of commands
  - Instead of classes, they are now objects and include properties that were in `config.commands`
  - Commands and sub-commands now use maps and are initialized upon startup
  - Sub-commands are stored in folders named by their parent command while in a `subcommand` folder
- Removed all leftover `chatlog` objects in `bot.js` that were not removed in the previous update
- Added an `exiting` function that will run when an uncaught exception has occurred or the program is closed via `SIGINT` (`Ctrl + C`)
  - This will disconnect the bot from voice channels it is in
- Extensions now have a `active` property which indicate whether or not they can be used
- Restructured `config.js`
  - `config.commands` is now a map
  - `config.features` is removed in replacement of extensions having their own `active` property and an array of active extensions is initialized in `./handler/main.js`
  - `config.servers` now use maps
- By default, commands with parameters now send out a message showing their usage or help command if the user inputted an incorrect amount of parameters
- Added documentation to `.js` files in `handler`
- Updated some documentation in `user.js`
- Music/video related changes
  - The use of the word 'audio' is now being replaced by 'video' for better representation of what the users are sending
  - Removed the `dispatcher` property and now the dispatcher must be called by utilizing the Message object (the `msg` parameter by default)
  - Added `currentVideo` property which indicates the current video playing
  - The current video playing is now considered not in the queue
    - This fixed multiple issues such as using `clear` would remove all songs, and using `skip` would not be able to skip the current video