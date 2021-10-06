import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { NewsTile } from './NewsTile';

const News = (props) => {
    const { data = [], className, ...other } = props;

    const shouldDisplayItems = data.length > 0;

    if (!shouldDisplayItems) {
        return null;
    }

    return (
        <div {...other} className={classNames('news', className)}>
            {data.map((item, index) => (
                <NewsTile key={index} {...item} />
            ))}
        </div>
    );
};

News.propTypes = {
    data: PropTypes.array,
    className: PropTypes.string
};

export { News };
