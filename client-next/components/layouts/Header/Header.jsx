import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Container } from '../Container';
import { HeaderExpandMenuButton } from './HeaderExpandMenuButton';
import { Brand } from '../Brand';
import { MainMenuLinks } from '../MainMenuLinks';
import { MainMenuButtons } from '../MainMenuButtons';

const Header = (props) => {
    const { condensed, className } = props;

    return (
        <header
            className={classNames('navbar', className, {
                'navbar--condensed': condensed
            })}
        >
            <Container className="navbar__layout">
                <Brand />
                <MainMenuLinks className="navbar__links" />
                <MainMenuButtons className="navbar__buttons" />
                <HeaderExpandMenuButton className="navbar__expanded-menu-btn" />
            </Container>
        </header>
    );
};

Header.propTypes = {
    condensed: PropTypes.bool,
    className: PropTypes.string
};

export { Header };
