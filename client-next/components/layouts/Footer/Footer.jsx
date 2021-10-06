import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Brand } from '../Brand';
import { Container } from '../Container';
import { SocialNetList } from '../SocialNet/SocialNetLilst';

const FooterInner = (props) => {
    const { condensed, className, ...other } = props;

    return (
        <footer
            {...other}
            className={classNames('footer', className, {
                'footer--condensed': condensed
            })}
        >
            <Container className="footer__layout">
                <Brand large />
                <SocialNetList className="footer__social-net-list" />
            </Container>
        </footer>
    );
};

FooterInner.propTypes = {
    condensed: PropTypes.bool,
    className: PropTypes.string
};

export const Footer = memo(FooterInner);
