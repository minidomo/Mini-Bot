const pad = (num: number) => ('0' + num).slice(-2);

const hhmmss = (secs: string | number) => {
    let seconds = typeof secs === 'string' ? parseInt(secs) : secs;
    let min = Math.floor(seconds / 60);
    seconds %= 60;
    let hours = Math.floor(min / 60);
    min %= 60;
    return `${pad(hours)}:${pad(min)}:${pad(seconds)}`;
};

export default {
    secToHHMMSS(sec: string | number) {
        return hhmmss(sec);
    },
    limitText(text: string, limit: number) {
        const trimmed = text.trim();
        if (trimmed.length > limit)
            return trimmed.substr(0, limit - 3).trimRight() + '...';
        return trimmed;
    },
    ensureFormatUrl(url: string) {
        if (url.startsWith('<') && url.endsWith('>'))
            return url.substring(1, url.length - 1);
        return url;
    }
};