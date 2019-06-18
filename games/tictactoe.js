'use strict';

const Discord = require('discord.js');
const Servers = require('../config').servers.tictactoe;
const UserUtil = require('../util/user');
const MAXR = 3, MAXC = 3, MAXTURNS = 9;
const Piece = { X: ':x:', O: ':o:', DEFAULT: ':white_large_square:' };
const Emojis = new Map()
    .set('🇦', 0)
    .set('🇧', 1)
    .set('🇨', 2)
    .set('1⃣', 0)
    .set('2⃣', 1)
    .set('3⃣', 2)
    .set('❌', -1);
const Emotes = {
    WIN: [':stuck_out_tongue:', ':joy:', ':stuck_out_tongue_winking_eye:', ':sunglasses:', ':first_place:', ':kissing_heart:'],
    LOSE: [':thinking:', ':disappointed:', ':tired_face:', ':rage:', ':sob:', ':second_place:', ':interrobang:']
};

// number & 1 === number % 2
class TicTacToe {
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

    static handleReaction(reaction, user, add) {
        const emoji = reaction.emoji.name;
        let status = false;
        if (Emojis.has(emoji)) {
            const userID = user.id;
            const guildID = reaction.message.guild.id;
            const val = Emojis.get(emoji);
            if (val >= 0) {
                const game = getGame(guildID, userID);
                if (game && isUsersTurn(game, userID)) {
                    if (add) {
                        game.move.push(reaction);
                        const obj = this.canPlace(game, user);
                        if (status = obj.result)
                            this.place(guildID, userID, game, obj.location);
                    } else {
                        game.move.shift();
                    }
                } else {
                    reaction.remove(user);
                }
            } else {
                if (status = this.canFF(guildID, userID))
                    this.ff(guildID, userID);
            }
        }
        return status;
    }

    static canPlace(game, user) {
        if (game.move.length < 2)
            return { result: false };
        const reactions = [...game.move];
        const firstType = getType(reactions[0].emoji.name);
        const secondType = getType(reactions[1].emoji.name);
        for (const reaction of game.move)
            reaction.remove(user);
        game.move = [];
        if (firstType === secondType)
            return { result: false };
        const r = Emojis.get(reactions[firstType].emoji.name);
        const c = Emojis.get(reactions[firstType + 1 & 1].emoji.name);
        if (game.board[r][c] === Piece.DEFAULT)
            return { result: true, location: [r, c] };
        return { result: false };
    }

    static place(guildID, userID, game, [r, c]) {
        game.board[r][c] = game.pieces[game.turn & 1];
        if (win(game, r, c))
            game.winner = game.turn & 1;
        else {
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
            if (author === u1 && author === u2)
                msg.channel.send('You cannot play against yourself.');
            else
                msg.channel.send('You cannot start a game for other people.');
            return false;
        }
        return true;
    }

    static start(msg, [user1, user2]) {
        const game = {
            users: [],
            pieces: [],
            board: [],
            turn: 0,
            move: []
        };
        if (Math.random() < .5)
            game.users.push(user1, user2);
        else
            game.users.push(user2, user1);
        if (Math.random() < .5)
            game.pieces.push(Piece.X, Piece.O);
        else
            game.pieces.push(Piece.O, Piece.X);
        for (let r = 0; r < MAXR; r++) {
            game.board.push([]);
            for (let c = 0; c < MAXC; c++)
                game.board[r].push(Piece.DEFAULT);
        }
        msg.channel.send('Creating game, please wait.')
            .then(message => {
                message.react('🇦')
                    .then(() => message.react('🇧'))
                    .then(() => message.react('🇨'))
                    .then(() => message.react('1⃣'))
                    .then(() => message.react('2⃣'))
                    .then(() => message.react('3⃣'))
                    .then(() => message.react('❌'))
                    .then(() => {
                        game.message = message;
                        printEmbed(game);
                    });
            });
        Servers.get(msg.guild.id).push(game);
    }
}

const getType = emoji => {
    switch (emoji) {
        case '🇦': case '🇧': case '🇨': return 1;
        case '1⃣': case '2⃣': case '3⃣': return 0;
        default: return -1;
    }
};

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
        while (row >= 0 && col >= 0 && row < MAXR && col < MAXC && count < 3 && game.board[row][col] === color) {
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
        if (c >= 2)
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
        let res = '', i = 0;
        for (const r of game.board) {
            res += i === 0 ? ':one:' : (i === 1 ? ':two:' : (i === 2 ? ':three:' : ''));
            i++;
            for (const c of r)
                res += c;
            res += '\n';
        }
        res += ':arrow_upper_right::regional_indicator_a::regional_indicator_b::regional_indicator_c:\n';
        return res;
    }
    const lowerDesc = () => {
        let res = '\n';
        if ('winner' in game) {
            if (game.winner === 2)
                res += `This match has ended as a draw!\n\n${game.users[0]} ${game.pieces[0]} ${Emotes.LOSE[Math.floor(Math.random() * Emotes.LOSE.length)]}
                    \n${game.users[1]} ${game.pieces[1]} ${Emotes.LOSE[Math.floor(Math.random() * Emotes.LOSE.length)]}`;
            else
                res += `${game.users[game.winner]} ${game.pieces[game.winner]} wins! ${Emotes.WIN[Math.floor(Math.random() * Emotes.WIN.length)]}
                    \n\n${game.users[game.winner + 1 & 1]} ${game.pieces[game.winner + 1 & 1]} loses! ${Emotes.LOSE[Math.floor(Math.random() * Emotes.LOSE.length)]}`;
        } else if ('forfeit' in game) {
            res += `${game.users[game.forfeit]} ${game.pieces[game.forfeit]} surrenders! ${Emotes.LOSE[Math.floor(Math.random() * Emotes.LOSE.length)]}
                \n\n${game.users[game.forfeit + 1 & 1]} ${game.pieces[game.forfeit + 1 & 1]} wins! ${Emotes.WIN[Math.floor(Math.random() * Emotes.WIN.length)]}`;
        } else {
            res += `${game.users[0]} ${game.pieces[0]} vs ${game.users[1]} ${game.pieces[1]}
                \n\n${game.users[game.turn & 1]}'s Move`;
        }
        return res;
    }
    const desc = getBoard() + lowerDesc();
    const embed = new Discord.RichEmbed()
        .setColor('AQUA')
        .setTitle('Game | Tic Tac Toe')
        .setDescription(desc);
    game.message.edit(embed);
};

module.exports = TicTacToe;