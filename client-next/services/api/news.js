import axios from 'axios';
import xml2js from 'xml2js';
import _get from 'lodash/get';

import { ResponseData } from './response-data';
import { allHtmlTagsPattern } from '../utils';

const parseImgTag = (imgTag = '') => {
    const srcMatch = String(imgTag).match(/src=\"([^\"]*)/);
    const altMatch = String(imgTag).match(/alt=\"([^\"]*)/);

    return {
        src: srcMatch ? srcMatch[1] : '',
        alt: altMatch ? altMatch[1] : ''
    };
};

const parseHtmlTags = (str = '') => {
    return String(str).replace(allHtmlTagsPattern, '');
};

const parseNewsResult = async (xml = '', limit = 0) => {
    try {
        const result = await xml2js.parseStringPromise(xml);
        let items = _get(result, 'rss.channel[0].item', []);

        if (limit && limit > 0) {
            items = items.slice(0, limit);
        }

        return items.map((item) => {
            const imgTag = _get(item, 'content:encoded[0]', '');
            const imageProps = parseImgTag(imgTag);

            let title = _get(item, 'title[0]', '');
            title = parseHtmlTags(title);

            let description = _get(item, 'description[0]', '');
            description = parseHtmlTags(description);

            return {
                id: _get(item, 'guid[0]._'),
                img: imageProps,
                title,
                description,
                linkHref: _get(item, 'link[0]')
            };
        });
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const getNews = async (limit = 0) => {
    const response = await axios.get('https://vabva.com/news/rss/', {
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    });

    const responseData = new ResponseData(response);
    const parsedData = await parseNewsResult(responseData.result, limit);

    return parsedData;
};
