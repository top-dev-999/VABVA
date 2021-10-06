import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { config } from '../../../config';
import { PageLink } from '../../PageLink';

const MainMenuButtonsInner = (props) => {
    const { className, ...other } = props;

    return (
        <ul {...other} className={classNames('main-menu-buttons', className)}>
            <li className="main-menu-buttons__item">
                <PageLink
                    href={config.urls.events()}
                    className="btn btn-link btn-outline-light main-menu-buttons__btn"
                >
                    Events
                </PageLink>
            </li>
            <li className="main-menu-buttons__item">
                <PageLink
                    href={config.urls.maps()}
                    className="btn btn-link btn-light main-menu-buttons__btn"
                >
                    Waste Map
                </PageLink>
            </li>
        </ul>
    );
};

MainMenuButtonsInner.propTypes = {
    className: PropTypes.string
};

export const MainMenuButtons = memo(MainMenuButtonsInner);
