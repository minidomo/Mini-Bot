import Client = require('../structs/Client');

export = {
    isPlayingAudio(guildId: string) {
        const voiceConnection = Client.voice!.connections.get(guildId);
        if (voiceConnection) {
            const dispatcher = voiceConnection.dispatcher;
            if (dispatcher && !dispatcher.paused)
                return true;
        }
        return false;
    },
    isPaused(guildId: string) {
        const voiceConnection = Client.voice!.connections.get(guildId);
        if (voiceConnection) {
            const dispatcher = voiceConnection.dispatcher;
            if (dispatcher && dispatcher.paused)
                return true;
        }
        return false;
    }
};