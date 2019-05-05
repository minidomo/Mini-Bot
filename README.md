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