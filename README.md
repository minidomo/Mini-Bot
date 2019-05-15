# Mini Bot (Work-In-Progress)  
Discord bot for my friend's server.  
Made with [Node.js](https://nodejs.org/en/).  

**Update April 21, 2019**
- Refractored code. Connect 4 now supports multiple games and servers. Will re-add previous commands from [v1.0.0](https://github.com/MiniDomo/Mini-Bot/tree/1.0.0) in the future.  

**Update April 22, 2019** 
- See [config.js.example](https://github.com/MiniDomo/Mini-Bot/blob/master/config.js.example) to understand how `config.js` should be structured.  

**Update May 4, 2019** 
- Audio commands added: `play`, `queue`, `repeat`, `skip`, and `stop`
  - Uses [ytdl-core](https://www.npmjs.com/package/ytdl-core) and [opusscript](https://www.npmjs.com/package/opusscript).
  - Audio commands require [FFmpeg](https://ffmpeg.org/) to be installed on host's computer.
- `config.js.example`
  - Renamed `music` server to `audio`.
  - Replaced `[]` parameters with `<>`.
  - Added support for audio commands.

**Update May 5, 2019**
- New `search` command
  - Usage: `!!search <video title>`
  - Use it to search for YouTube videos
  - Uses [axios](https://www.npmjs.com/package/axios) and [cheerio](https://www.npmjs.com/package/cheerio).
- `config.js.example`
  - Added `search` command

**Update May 12, 2019**
- Modified `search` command
  - Primary method uses [youtube-search](https://www.npmjs.com/package/youtube-search), which requires a [Youtube v3 API key](https://console.developers.google.com/apis/credentials). This is much faster than the previous method, which is now the secondary method. If a key is not provided, then it will utilize the secondary method.
- `config.js.example`
  - Added an `api_keys` object to the config which can be used to store API keys such as a Youtube v3 API key.

**Update May 15, 2019**
- Added Tic Tac Toe game
  - `!!ttt help` for a list of commands
  - The code functions similar to Connect 4
- `config.js.example`
  - Added `ttt` command
- `connect4.js`
  - Fixed issue where the bot would crash when a game would end due to using an undefined variable