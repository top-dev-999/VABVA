import React from 'react';
import PropTypes from 'prop-types';

import { PageLink } from '../../PageLink';
import { Location18Svg } from '../../../assets/svg';
import { config } from '../../../config';

const PricePageNearbyList = (props) => {
    const { items } = props;

    const shouldDisplayList = Array.isArray(items) && items.length > 0;

    if (!shouldDisplayList) {
        return null;
    }

    return (
        <>
            <p className="paragraph text-cursive mb-4">
                I&apos;ve also added a few of our service areas below so you can compare prices near
                you.
            </p>
            <ul className="list-styled list-styled--links">
                {items.map((item) => {
                    const { id, name, postcode, url } = item || {};
                    const pathname = config.urls.price(url);

                    return (
                        <li key={id}>
                            <Location18Svg className="list-styled__icon list-styled__icon--left" />
                            <PageLink href={pathname} className="link">
                                {name}, {postcode}
                            </PageLink>
                        </li>
                    );
                })}
            </ul>
        </>
    );
};

PricePageNearbyList.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            county: PropTypes.string,
            name: PropTypes.string,
            postcode: PropTypes.string,
            url: PropTypes.string
        })
    )
};

export { PricePageNearbyList };
