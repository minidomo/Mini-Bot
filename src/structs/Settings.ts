import GuildSettings = require('./GuildSettings');
import Client = require('./Client');
import winston = require('winston');
import fs = require('fs');

class Settings extends Map<string, GuildSettings> {
    static object: Settings;
    loaded: boolean;

    constructor() {
        super();
        this.loaded = false;
    }

    get(id: string) {
        return super.get(id)!;
    }

    load(Logger: winston.Logger) {
        const raw = fs.readFileSync(`${__dirname}/../../save/settings.json`, { encoding: 'utf8' });
        const content: { [key: string]: any } = raw ? JSON.parse(raw) as {} : {};
        const rest = new Set(Object.keys(content));
        Client.guilds.forEach(guild => {
            if (rest.has(guild.id)) {
                rest.delete(guild.id);
                Logger.info(`Loading settings for ${guild.name} (${guild.id})`);
                const guildSettings = new GuildSettings(content[guild.id]);
                guildSettings.name = guild.name;
                this.set(guild.id, guildSettings);
            } else {
                Logger.info(`Creating settings for ${guild.name} (${guild.id})`);
                this.set(guild.id, new GuildSettings({ name: guild.name }));
            }
        });
        rest.forEach(id => {
            const guildSettings = new GuildSettings(content[id]);
            Logger.info(`Loading settings for ${guildSettings.name} (${id})`);
            this.set(id, guildSettings);
        });
        this.loaded = true;
    }

    save() {
        fs.writeFileSync(`${__dirname}/../../save/settings.json`, this.toJson());
    }

    toJson() {
        const obj: { [key: string]: any } = {};
        this.forEach((guildSettings: GuildSettings, id: string) => obj[id] = guildSettings.getElement());
        return JSON.stringify(obj, null, 4);
    }
}

Settings.object = new Settings();

export = Settings;