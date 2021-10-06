import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { SocialNetLink } from './SocialNetLink';

const SocialNetListInner = (props) => {
    const { className, size = '', ...other } = props;

    return (
        <ul {...other} className={classNames('social-net-list', className)}>
            <li>
                <SocialNetLink type="instagram" size={size} />
            </li>
            <li>
                <SocialNetLink type="twitter" size={size} />
            </li>
            <li>
                <SocialNetLink type="youtube" size={size} />
            </li>
            <li>
                <SocialNetLink type="pinterest" size={size} />
            </li>
        </ul>
    );
};

SocialNetListInner.propTypes = {
    className: PropTypes.string,
    size: PropTypes.string
};

export const SocialNetList = memo(SocialNetListInner);
