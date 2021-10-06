import React from 'react';
import PropTypes from 'prop-types';

import ReactPlayer from 'react-player';

const PricePagePlayer = (props) => {
    const { url } = props;

    if (!url) {
        return null;
    }

    return (
        <div className="price-page__player">
            <ReactPlayer url={url} height="100%" width="100%" />
        </div>
    );
};

PricePagePlayer.propTypes = {
    url: PropTypes.string
};

export { PricePagePlayer };
