class Arguments {
    production: boolean;
    saveMp3: boolean;
    saveSongCache: boolean;
    debug: boolean;

    constructor() {
        const args = process.argv.slice();
        this.production = args.some(arg => arg === '-p' || arg === '--prod');
        this.saveMp3 = args.some(arg => arg === '-sm' || arg === '--saveMp3');
        this.saveSongCache = args.some(arg => arg === '-ssc' || arg === '--saveSongCache');
        this.debug = args.some(arg => arg === '-d' || arg === '--debug');
    }
}

const args = new Arguments();

export = args;