import React, { useEffect } from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';

import { useEventCallback } from '../utils';

const cachedStyleValues = {};

const updateAnchorStyles = (node, reset = false) => {
    if (node) {
        const { style } = node;

        if (!reset) {
            cachedStyleValues.position = style.getPropertyValue('position') || null;
            cachedStyleValues.overflow = style.getPropertyValue('overflow') || null;
        }

        style.setProperty('position', reset ? cachedStyleValues?.position : 'relative');
        style.setProperty('overflow', reset ? cachedStyleValues?.overflow : 'hidden');
    }
};

export const Mask = React.forwardRef(function Mask(props, forwardedRef) {
    const { open, fixed, className, children, anchorRef, transitionProps, ...other } = props;

    const handleTransitionExited = useEventCallback((element) => {
        if (anchorRef && anchorRef.current && !fixed) {
            const node = anchorRef.current;

            updateAnchorStyles(node, true);
        }

        if (transitionProps?.onExited) {
            transitionProps.onExited(element);
        }
    });

    useEffect(() => {
        if (anchorRef && anchorRef.current && !fixed) {
            const node = anchorRef.current;

            if (open) {
                updateAnchorStyles(node);
            }
        }

        return undefined;
    }, [anchorRef, open, fixed]);

    return (
        <CSSTransition
            in={open}
            timeout={200}
            classNames="mask"
            unmountOnExit
            onExited={handleTransitionExited}
            {...transitionProps}
        >
            <div
                className={classNames('mask', className, {
                    'mask--fixed': fixed
                })}
                {...other}
                ref={forwardedRef}
            >
                {children}
            </div>
        </CSSTransition>
    );
});
