export const JsonParse = (content) => {
    try {
        return JSON.parse(content);
    } catch {
        return {};
    }
};

export const JsonStringify = (json) => {
    if (!json) {
        return '';
    }

    try {
        return JSON.stringify(json);
    } catch {
        return '';
    }
};

export const crawlerValidation = (userAgent = '') => {
    const regExp = new RegExp(
        '[a-z0-9\\-_]*(bot|crawl|archiver|transcoder|spider|uptime|validator|fetcher|cron|checker|reader|extractor|monitoring|analyzer|scraper)',
        'i'
    );
    const matches = regExp.exec(String(userAgent).trim());

    return matches && matches.length > 0;
};
