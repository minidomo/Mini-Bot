'use strict';

const Discord = require('discord.js');
const Servers = require('../config').servers.connect4;
const UserUtil = require('../util/user');
const MAXC = 7, MAX_PLAYABLE_ROWS = 6, MAXTURNS = 42;
const Piece = { RED: ':red_circle:', BLUE: ':large_blue_circle:', WHITE: ':white_circle:' };
const Emojis = new Map()
    .set('🇦', 0)
    .set('🇧', 1)
    .set('🇨', 2)
    .set('🇩', 3)
    .set('🇪', 4)
    .set('🇫', 5)
    .set('🇬', 6)
    .set('❌', -1);
const Emotes = {
    WIN: [':stuck_out_tongue:', ':joy:', ':stuck_out_tongue_winking_eye:', ':sunglasses:', ':first_place:', ':kissing_heart:'],
    LOSE: [':thinking:', ':disappointed:', ':tired_face:', ':rage:', ':sob:', ':second_place:', ':interrobang:']
};

// number & 1 === number % 2
class Connect4 {
    static canFF(guildID, userID) {
        if (getGame(guildID, userID))
            return true;
        return false;
    }

    static ff(guildID, userID) {
        const game = getGame(guildID, userID);
        const mentions = UserUtil.idToMentions(userID);
        game.forfeit = Math.max(game.users.indexOf(mentions[0]), game.users.indexOf(mentions[1]));
        printEmbed(game);
        removeGame(guildID, userID);
    }

    static handleReaction(msgReaction, user) {
        const emoji = msgReaction.emoji.name;
        let status = false;
        if (Emojis.has(emoji)) {
            const column = Emojis.get(emoji);
            const userID = user.id;
            const guildID = msgReaction.message.guild.id;
            if (column >= 0) {
                const obj = this.canPlace(guildID, userID, column);
                if (status = obj.result)
                    this.place(guildID, userID, obj.row, column);

            } else {
                if (status = this.canFF(guildID, userID))
                    this.ff(guildID, userID);
            }
            msgReaction.remove(user);
        }
        return status;
    }

    static canPlace(guildID, userID, column) {
        const game = getGame(guildID, userID);
        if (game && isUsersTurn(game, userID)) {
            for (let r = MAX_PLAYABLE_ROWS - 1; r >= 0; r--)
                if (game.board[r][column] === Piece.WHITE)
                    return { result: true, row: r };
        }
        return { result: false };
    }

    static place(guildID, userID, row, column) {
        const game = getGame(guildID, userID);
        game.board[row][column] = game.colors[game.turn & 1];
        if (win(game, row, column)) {
            game.winner = game.turn & 1;
        } else {
            game.turn++;
            if (game.turn === MAXTURNS)
                game.winner = 2;
        }
        printEmbed(game);
        if ('winner' in game)
            removeGame(guildID, userID);
    }

    static canStart(msg, [user1, user2]) {
        if (!UserUtil.mentionIsAUser(user1) || !UserUtil.mentionIsAUser(user2)) {
            msg.channel.send('Both players must be users.');
            return false;
        }
        const mentionToID = mention => mention.replace(/^<@!?/g, '').replace(/>$/g, '');
        const u1 = UserUtil.mentionToID(user1);
        const u2 = UserUtil.mentionToID(user2);
        if (UserUtil.isBot(msg.guild.members, u1) || UserUtil.isBot(msg.guild.members, u2)) {
            msg.channel.send('Bots are not allowed to play.');
            return false;
        }
        const id = msg.guild.id;
        if (!Servers.has(id))
            Servers.set(id, []);
        const author = msg.author.id;
        if ((author === u1 && author !== u2) || (author !== u1 && author === u2)) {
            const g1 = getGameByMention(id, user1);
            const g2 = getGameByMention(id, user2);
            if (g1 || g2) {
                msg.channel.send('At least one of the users is currently in a game.');
                return false;
            }
        } else {
            msg.channel.send('You cannot start a game for other people.');
            return false;
        }
        return true;
    }

    static start(msg, [user1, user2]) {
        const game = {
            users: [],
            colors: [],
            board: [],
            turn: 0
        };
        if (Math.random() < .5)
            game.users.push(user1, user2);
        else
            game.users.push(user2, user1);
        if (Math.random() < .5)
            game.colors.push(Piece.RED, Piece.BLUE);
        else
            game.colors.push(Piece.BLUE, Piece.RED);
        for (let r = 0; r < MAX_PLAYABLE_ROWS; r++) {
            game.board.push([]);
            for (let c = 0; c < MAXC; c++)
                game.board[r].push(Piece.WHITE);
        }
        game.board.push([]);
        for (const c of 'abcdefg')
            game.board[MAX_PLAYABLE_ROWS].push(`:regional_indicator_${c}:`);
        msg.channel.send('Creating game, please wait.')
            .then(message => {
                message.react('🇦')
                    .then(() => message.react('🇧'))
                    .then(() => message.react('🇨'))
                    .then(() => message.react('🇩'))
                    .then(() => message.react('🇪'))
                    .then(() => message.react('🇫'))
                    .then(() => message.react('🇬'))
                    .then(() => message.react('❌'))
                    .then(() => {
                        game.message = message;
                        printEmbed(game);
                    });
            });
        Servers.get(msg.guild.id).push(game);
    }
}

const isUsersTurn = (game, userID) => {
    const mentions = UserUtil.idToMentions(userID);
    const cur = game.users[game.turn & 1]
    return cur === mentions[0] || cur === mentions[1];
};

const removeGame = (guildID, userID) => {
    let x = 0;
    const mentions = UserUtil.idToMentions(userID);
    for (const server of Servers.get(guildID)) {
        for (let a = 0; a < 2; a++)
            if (server.users[a] === mentions[0] || server.users[a] === mentions[1]) {
                Servers.get(guildID).splice(x, 1);
                return;
            }
        x++;
    }
};

const win = (game, r, c) => {
    const count = (dx, dy) => {
        const color = game.board[r][c];
        let count = 0;
        let row = r + dx;
        let col = c + dy;
        while (row >= 0 && col >= 0 && row < MAX_PLAYABLE_ROWS && col < MAXC && count < 3 && game.board[row][col] === color) {
            row += dx;
            col += dy;
            count++;
        }
        return count;
    };
    const dx = [0, 0, -1, 1, -1, 1, 1, -1];
    const dy = [-1, 1, 0, 0, -1, 1, -1, 1];
    for (let x = 0; x < dx.length; x += 2) {
        const c = count(dx[x], dy[x]) + count(dx[x + 1], dy[x + 1]);
        if (c >= 3)
            return true;
    }
    return false;
};

const getGameByMention = (guildID, mention) => {
    if (!Servers.has(guildID))
        return undefined;
    for (const server of Servers.get(guildID))
        if (server.users[0] === mention || server.users[1] === mention)
            return server;
    return undefined;
};

const getGame = (guildID, userID) => {
    if (!Servers.has(guildID))
        return undefined;
    const mentions = UserUtil.idToMentions(userID);
    for (const game of Servers.get(guildID)) {
        for (let a = 0; a < 2; a++)
            if (game.users[a] === mentions[0] || game.users[a] === mentions[1])
                return game;
    }
    return undefined;
};

const printEmbed = game => {
    const getBoard = () => {
        let res = '';
        for (const r of game.board) {
            for (const c of r)
                res += c + ' ';
            res = res.substr(0, res.length - 1) + '\n';
        }
        return res;
    };
    const lowerDesc = () => {
        let res = '\n';
        if (typeof game.winner !== 'undefined') {
            if (game.winner === 2)
                res += `This match has ended as a draw!\n\n${game.users[0]} ${game.colors[0]} ${Emotes.LOSE[Math.floor(Math.random() * Emotes.LOSE.length)]}
                    \n${game.users[1]} ${game.colors[1]} ${Emotes.LOSE[Math.floor(Math.random() * Emotes.LOSE.length)]}`;
            else
                res += `${game.users[game.winner]} ${game.colors[game.winner]} wins! ${Emotes.WIN[Math.floor(Math.random() * Emotes.WIN.length)]}
                    \n${game.users[game.winner + 1 & 1]} ${game.colors[game.winner + 1 & 1]} loses! ${Emotes.LOSE[Math.floor(Math.random() * Emotes.LOSE.length)]}`;
        } else if (typeof game.forfeit !== 'undefined') {
            res += `${game.users[game.forfeit]} ${game.colors[game.forfeit]} surrenders! ${Emotes.LOSE[Math.floor(Math.random() * Emotes.LOSE.length)]}
                \n${game.users[game.forfeit + 1 & 1]} ${game.colors[game.forfeit + 1 & 1]} wins! ${Emotes.WIN[Math.floor(Math.random() * Emotes.WIN.length)]}`;
        } else
            res += `${game.users[0]} ${game.colors[0]} vs ${game.users[1]} ${game.colors[1]}
                \n${game.users[game.turn & 1]}'s Move`;
        return res;
    };
    const desc = getBoard() + lowerDesc();
    const embed = new Discord.RichEmbed()
        .setColor('AQUA')
        .setTitle('Game | Connect 4')
        .setDescription(desc);
    game.message.edit(embed);
};

module.exports = Connect4;