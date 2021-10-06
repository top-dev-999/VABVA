import React from 'react';
import PropTypes from 'prop-types';

const PricePageBanner = (props) => {
    const { children, title } = props;

    return (
        <div className="banner price-page__banner">
            <header className="banner__header">
                <h4 className="banner__title">{title}</h4>
            </header>
            <div className="banner__body">{children}</div>
        </div>
    );
};

PricePageBanner.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node
};

export { PricePageBanner };
