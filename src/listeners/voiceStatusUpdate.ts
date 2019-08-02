import Client = require('../structs/Client');

Client.on('voiceStateUpdate', (oldState, newState) => {
    if (newState.member!.id === Client.user!.id) {
        if (!newState.channelID) {
            const voiceConnection = Client.voice!.connections.get(newState.guild.id);
            if (voiceConnection)
                voiceConnection.disconnect();
        }
    }
});