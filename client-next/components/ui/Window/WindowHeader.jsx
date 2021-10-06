import React from 'react';
import classNames from 'classnames';

import { IconButton } from '../IconButton';
import { useEventCallback } from '../utils';
import { useWindowContext } from './Window';
import { WindowTitle } from './WindowTitle';

import { Cross14Svg } from '../../../assets/svg';

export const WindowHeader = (props) => {
    const {
        title,
        icon,
        children,
        className,
        headingProps,
        onClose,
        closeIcon,
        renderTitle,
        ...other
    } = props;

    const { draggable } = useWindowContext();

    const handleClose = useEventCallback(() => {
        if (onClose) {
            onClose();
        }
    });

    const handleCloseClick = useEventCallback(() => {
        handleClose();
    });

    const handleCloseTouchEnd = useEventCallback((ev) => {
        ev.preventDefault();

        handleClose();
    });

    const iconContent = React.isValidElement(icon)
        ? React.cloneElement(icon, { className: 'window__header-icon' })
        : null;

    const titleContent = (title || renderTitle) && (
        <WindowTitle {...headingProps}>{title || (renderTitle && renderTitle(props))}</WindowTitle>
    );

    const closeIconContent = React.isValidElement(closeIcon) ? (
        React.cloneElement(closeIcon, {})
    ) : (
        <Cross14Svg />
    );

    return (
        <div
            className={classNames('window__header', className, {
                'react-draggable__handle': draggable
            })}
            {...other}
        >
            {iconContent}
            {titleContent}
            {children}
            {onClose && (
                <IconButton
                    plain
                    className="window__btn-close"
                    onClick={handleCloseClick}
                    onTouchEnd={handleCloseTouchEnd}
                >
                    {closeIconContent}
                </IconButton>
            )}
        </div>
    );
};
