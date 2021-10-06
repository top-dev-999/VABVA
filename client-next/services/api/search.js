import _get from 'lodash/get';

import { http } from './http';
import { ResponseData } from './response-data';

const parseLocationResult = (result = []) => {
    if (!Array.isArray(result)) {
        return [];
    }

    return result.map((item) => {
        return {
            id: _get(item, '_id', ''),
            county: _get(item, 'county', ''),
            name: _get(item, 'name', ''),
            url: _get(item, 'full_url', '')
        };
    });
};

export const getLocation = async (query = '') => {
    const response = await http.post(`/getlocation`, null, {
        params: {
            name: query
        }
    });

    const responseData = new ResponseData(response);

    return parseLocationResult(responseData.result);
};
