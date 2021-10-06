import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { config } from '../../../config';

import { PageLink } from '../../PageLink';

const MainMenuLinksInner = (props) => {
    const { className, ...other } = props;

    return (
        <ul {...other} className={classNames('main-menu-links', className)}>
            <li className="main-menu-links__item">
                <PageLink
                    href={config.urls.news('tag/guides')}
                    className="link main-menu-links__link"
                >
                    Learn
                </PageLink>
            </li>
            <li className="main-menu-links__item">
                <PageLink href={config.urls.search()} className="link main-menu-links__link">
                    Skip Prices
                </PageLink>
            </li>
            <li className="main-menu-links__item">
                <PageLink href={config.urls.news()} className="link main-menu-links__link">
                    News
                </PageLink>
            </li>
        </ul>
    );
};

MainMenuLinksInner.propTypes = {
    className: PropTypes.string
};

export const MainMenuLinks = memo(MainMenuLinksInner);
