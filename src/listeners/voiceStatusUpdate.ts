import Client from '../structs/Client';

Client.on('voiceStateUpdate', (oldMember, newMember) => {
    if (newMember.user.id === Client.user.id) {
        if (!newMember.voiceChannelID) {
            const voiceConnection = Client.voiceConnections.get(newMember.guild.id);
            if (voiceConnection)
                voiceConnection.disconnect();
        }
    }
});