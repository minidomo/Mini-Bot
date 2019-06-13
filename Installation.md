# Installation Guide
## Creating the bot and adding to your servers
Note that this section is also explained on the official [discord.js guide](https://discordjs.guide/preparations/).
1. Go to https://discordapp.com/developers/applications/ and log in
2. Click `New Application`
3. Give your bot a name and click `Create`
4. Under `Settings` on the left, click `Bot`
5. Click `Add Bot` then click `Yes, do it!`
6. Under `Settings` on the left, click `General Information`
7. Copy your `Client ID`
8. Open https://discordapi.com/permissions.html in a new tab
9. Select your permissions for your bot
10. Paste your client id where it says `Client ID:`
11. Click the link that was generated
12. Select the server for the bot to join and click `Authorize`

## Installing the bot
This requires installing [Node.js](https://nodejs.org/en/) (Download either option). [git](https://git-scm.com/) is not required to install but recommended. If you do not install `git`, then click this [link](https://github.com/MiniDomo/Mini-Bot/archive/master.zip) to download the bot's files and then extract the files.  
If you have `git` installed, then open command prompt and type:
```
$ git clone https://github.com/MiniDomo/Mini-Bot.git
```
Now whether or not you have `git` installed, go into the bot's files so that you can see `package.json` and open command prompt in that folder and type:
```
$ npm install
```
1. Change `config.js.example` to `config.js`
2. Go to https://discordapp.com/developers/applications/ and log in
3. Click on your bot
4. Under `Settings` on the left, click `Bot`
5. Under `Token`, click `Copy`
6. In `config.js`, paste your token where it says `config.token`. The result should look like `config.token = '<your token that you pasted>';`
7. Save the file

If you want to use the command `play` for YouTube videos, then you must install [FFmpeg](https://ffmpeg.zeranoe.com/builds/). See instructions [here](https://github.com/MiniDomo/Mini-Bot/blob/master/Installation.md#installing-ffmpeg).

## Running the bot
Open the command prompt and in the same directory as your bot, type:
```
$ node bot
```
To stop the bot, press `ctrl + c` until it stops

## Installing FFmpeg
1. Go to https://ffmpeg.zeranoe.com/builds/
2. Click `Download Build`
3. Extract the folder
4. Open the folder, and open the `bin` folder
5. Copy the folder's path
6. Press the Window's key on your keyboard and type `environment variables` and press enter
7. Click `Environment Variables...`
8. Under `System variables`, find the variable `Path`
9. Click `Path` and then click `Edit`
10. Click `New` and paste the folder's path
11. Click `OK`

If you did this, make sure to open a new command prompt to ensure the change takes affect before running the bot.