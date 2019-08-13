# Mini Bot
Mini Bot is a music bot that features playlists. Users can create playlists through this bot and can be saved and played at any time.

**Previous Versions**  
Previous versions of Mini Bot are no longer being developed or maintained.
- [2.0.0](https://github.com/MiniDomo/Mini-Bot/tree/2.0.0)
- [1.0.0](https://github.com/MiniDomo/Mini-Bot/tree/1.0.0)

## Installation
Type the following in command prompt:
```shell
git clone https://github.com/minidomo/Mini-Bot.git
cd Mini-Bot
npm install
```

## Setup
This bot requires the use of [FFmpeg](https://ffmpeg.org). Install this to proceed.
1. Rename `.env.example` to `.env`
2. Put your bot's token after `PROD_BOT_TOKEN=`
    - If you have another bot that is dedicated to testing a bot's code before going to production, you can provide its token in the `.env` like so: `TEST_BOT_TOKEN=<token>` and type `npm run start` in command line to run with the `TEST_BOT_TOKEN`.
3. Provide your Discord user ID after `OWNER_ID=` which can be obtained by typing `\@<your discord username>` in a Discord text channel. The **numbers** between < and > represent your Discord user ID.
4. If you have a [YouTube v3 API Key](https://console.developers.google.com/apis/credentials) and would like to use it for faster searches, then you can place it after `YOUTUBE_API_KEY=`

## Scripts
To run the scripts, type the following in command prompt:
```shell
npm run <script name>
```

| Name | Description |
| - | - |
| `build` | Compiles the `src` folder and generates JavaScript files in the generated `dist` folder. |
| `start` | Runs the `build` script and starts the bot using the `TEST_BOT_TOKEN` |
| `start:prod` | Runs the `build` script and start the bot using the `PROD_BOT_TOKEN` |
| `clean` | Deletes the `dist` folder. |

## Bot Arguments
The scripts `start` and `start:prod` start the bot and pass arguments to enable/disable some functionalities.
| Name | Description |
| - | - |
| `-p`/`--prod` | Indicates that the bot will use the `PROD_BOT_TOKEN`. |
| `-sm`/`--saveMp3` | When the bot plays a new song, it will download the mp3 and save it to the folder `.\save\songs`. This can help with consistent playback. |
| `-ssc`/`--saveSongCache` | When a song is added the queue or a playlist, it's title, Youtube ID, duration, and channel is stored in memory. With this option turned on, it will save this information in `.\save\songcache.json` and can be used the next time the bot runs. This can be useful for when there are repeated searches for a song in which it will add to the queue or playlist much faster.
| `-d`/`--debug` | Prints out debug information to the console. |