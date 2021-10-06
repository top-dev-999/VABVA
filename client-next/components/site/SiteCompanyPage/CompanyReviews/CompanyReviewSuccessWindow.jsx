import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';

import { Heading, Window, WindowBody, WindowHeader } from '../../../ui';
import { Check28Svg } from '../../../../assets/svg';

const CompanyReviewSuccessWindowInner = (props) => {
    const { open, children, onClose, ...other } = props;

    const handleClose = useCallback(() => {
        if (onClose) {
            onClose();
        }
    }, [onClose]);

    return (
        <Window
            {...other}
            open={open}
            centered
            maxWidth={460}
            onClose={handleClose}
            onEscapeKeyDown={handleClose}
            disableFocusBounding={false}
            disableRestoreFocus
        >
            <WindowHeader title="Success" onClose={handleClose} />
            <WindowBody className="confirm-message">
                <div className="confirm-message__icon">
                    <Check28Svg />
                </div>
                <Heading size={4} className="confirm-message__title">
                    Thank you for <br />
                    submitting your review
                </Heading>
                <p className="confirm-message__text" tabIndex={1} style={{ outline: 0 }}>
                    Please check your email inbox and click on the confirmation link so we can
                    publish it.
                </p>
            </WindowBody>
        </Window>
    );
};

CompanyReviewSuccessWindowInner.propTypes = {
    open: PropTypes.bool,
    children: PropTypes.node,
    onClose: PropTypes.func
};

export const CompanyReviewSuccessWindow = memo(CompanyReviewSuccessWindowInner);
