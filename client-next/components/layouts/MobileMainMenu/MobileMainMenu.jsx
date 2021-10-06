import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import { IconButton, Modal } from '../../ui';
import { Cross14Svg } from '../../../assets/svg';
import { MainMenuLinks } from '../MainMenuLinks';
import { MainMenuButtons } from '../MainMenuButtons';

const MobileMainMenuInner = (props) => {
    const { open, onClose } = props;

    const handleClose = useCallback(() => {
        if (onClose) {
            onClose();
        }
    }, [onClose]);

    return (
        <Modal open={open} onClose={handleClose}>
            <CSSTransition appear in={open} classNames="mobile-main-menu" timeout={300}>
                <div className="mobile-main-menu">
                    <header className="mobile-main-menu__header">
                        <IconButton className="ml-auto" onClick={handleClose}>
                            <Cross14Svg />
                        </IconButton>
                    </header>
                    <nav className="mobile-main-menu__nav">
                        <MainMenuLinks className="mobile-main-menu__links" />
                        <MainMenuButtons className="mobile-main-menu__buttons" />
                    </nav>
                </div>
            </CSSTransition>
        </Modal>
    );
};

MobileMainMenuInner.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func
};

export const MobileMainMenu = memo(MobileMainMenuInner);
