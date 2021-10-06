import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const PricePageAddThis = (props) => {
    const { url, widgetId, title } = props;

    useEffect(() => {
        if (window.addthis && window.addthis?.layers?.refresh) {
            window.addthis.layers.refresh();
        }

        if (window.addthis) {
            window.addthis.update('share', 'url', url);
        }

        return undefined;
    }, [url]);

    return (
        <div
            className={`addthis_inline_share_toolbox_${widgetId} price-page__addthis`}
            data-url={url}
            data-widget-id={widgetId}
            data-title={title}
            data-widget-type="inline"
        />
    );
};

PricePageAddThis.propTypes = {
    url: PropTypes.string.isRequired,
    widgetId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
};

export { PricePageAddThis };
