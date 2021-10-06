import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
    MediaInstagram24Svg,
    MediaPinterest24Svg,
    MediaTwitter24Svg,
    MediaYoutube24Svg
} from '../../../assets/svg';

import { config } from '../../../config';

const icons = {
    instagram: <MediaInstagram24Svg />,
    twitter: <MediaTwitter24Svg />,
    youtube: <MediaYoutube24Svg />,
    pinterest: <MediaPinterest24Svg />
};

const SocialNetLinkInner = (props) => {
    const { type, className, size = '', ...other } = props;

    const iconElement = icons[type];
    const pathname = config.urls.social(type) || '#';

    if (!iconElement) {
        return null;
    }

    return (
        <a
            {...other}
            href={pathname}
            className={classNames('social-net-link', className, {
                [`social-net-link--${type}`]: type,
                'social-net-link--large': size === 'large'
            })}
        >
            {iconElement}
        </a>
    );
};

SocialNetLinkInner.propTypes = {
    type: PropTypes.oneOf(['instagram', 'twitter', 'youtube', 'pinterest']),
    size: PropTypes.oneOf(['large', ''])
};

export const SocialNetLink = memo(SocialNetLinkInner);
