import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';

import { Heading, Window, WindowBody, WindowHeader } from '../../../ui';
import { Check28Svg } from '../../../../assets/svg';

const CompanyReviewSuccessVerifyWindowInner = (props) => {
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
                    Review Published
                </Heading>
                <p className="confirm-message__text" tabIndex={1} style={{ outline: 0 }}>
                    Thank you for verifying your email address, your review has been pusblished.
                </p>
            </WindowBody>
        </Window>
    );
};

CompanyReviewSuccessVerifyWindowInner.propTypes = {
    open: PropTypes.bool,
    children: PropTypes.node,
    onClose: PropTypes.func
};

export const CompanyReviewSuccessVerifyWindow = memo(CompanyReviewSuccessVerifyWindowInner);
