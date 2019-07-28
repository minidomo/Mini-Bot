'use strict';

const client = require('../structs/Client');

client.on('voiceStateUpdate', (oldmem, newmem) => {
    if (newmem.user.id === client.user.id) {
        if (!newmem.voiceChannelID) {
            const voiceConnection = client.voiceConnections.get(newmem.guild.id);
            if (voiceConnection)
                voiceConnection.disconnect();
        }
    }
});