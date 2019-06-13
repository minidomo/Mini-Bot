'use strict';

let config = {};

// discord token
config.token = process.env.BOT_TOKEN;

// command prefix
config.prefix = '!!';

// bot activity
config.activity = { name: '!!help', options: { url: null, type: null } };

// bot API keys
config.api_keys = {
    youtube: process.env.YOUTUBE_API_KEY
};

// servers
config.servers = {
    connect4: new Map(),
    audio: new Map(),
    tictactoe: new Map()
};

// commands
config.commands = new Map();

module.exports = config;