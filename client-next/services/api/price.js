import _get from 'lodash/get';

import { http } from './http';
import { ResponseData } from './response-data';

const parsePrice = (value = 0) => {
    const price = Number.parseFloat(value);

    if (!Number.isNaN(price)) {
        return Math.round(price * 100) / 100;
    }

    return 0;
};

const parsePriceResult = (result = {}) => {
    const records = _get(result, 'currentRecord', []);

    const items = records.map((item) => {
        const id = _get(item, 'yard', null);
        const name = _get(item, 'name', '');
        const prices = _get(item, 'prices', []) || [];

        const priceMin = prices.reduce((min, price) => {
            return Math.min(min, parsePrice(price));
        }, parsePrice(prices[0]));

        const priceMax = prices.reduce((max, price) => {
            return Math.max(max, parsePrice(price));
        }, parsePrice(prices[0]));

        const priceSum = prices.reduce((sum, price) => {
            return sum + parsePrice(price);
        }, 0);

        const priceAvg = priceSum / prices.length;

        return {
            id,
            name,
            priceMin: priceMin.toFixed(2),
            priceAvg: priceAvg.toFixed(2),
            priceMax: priceMax.toFixed(2)
        };
    });

    const lat = _get(result, 'locationProperties.coordinates.latitude', 0) || 0;
    const lng = _get(result, 'locationProperties.coordinates.longitude', 0) || 0;

    const location = {
        coordinates: lat && lng && [lat, lng],
        displayName: _get(result, 'locationProperties.displayName', ''),
        name: _get(result, 'locationProperties.name', ''),
        county: _get(result, 'locationProperties.county', ''),
        postcode: _get(result, 'locationProperties.postcode', '')
    };

    const nerbyPlaces = _get(result, 'nearbyPlaces', []);

    const nearby = nerbyPlaces.map((item) => {
        return {
            id: _get(item, '_id', ''),
            county: _get(item, 'county', ''),
            name: _get(item, 'name', ''),
            postcode: _get(item, 'postcode_sector', ''),
            url: _get(item, 'full_url', '')
        };
    });

    return {
        items,
        location,
        nearby
    };
};

export const getPriceByUrl = async (urls = []) => {
    const response = await http.post('/getprice', null, {
        params: {
            url: encodeURIComponent(urls[0]),
            sub_url: encodeURIComponent(urls[1])
        }
    });

    const responseData = new ResponseData(response);

    return parsePriceResult(responseData.result);
};
