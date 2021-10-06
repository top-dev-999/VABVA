import React from 'react';

import { SiteSkipHirePricePage } from '../../components/site/SiteSkipHirePricePage';
import { getPriceByUrl } from '../../services/api/price';

const validateUrls = (urls = []) => {
    if (urls && Array.isArray(urls) && urls.length === 2) {
        return urls;
    }

    return undefined;
};

export const getServerSideProps = async (context) => {
    try {
        const urls = validateUrls(context.params.urls);

        if (!urls) {
            return {
                notFound: true
            };
        }

        const result = await getPriceByUrl(urls);

        return {
            props: result
        };
    } catch (e) {
        console.error(e);

        return {
            notFound: true
        };
    }
};

const SkipHirePricePage = (props) => {
    return <SiteSkipHirePricePage {...props} />;
};

export default SkipHirePricePage;
