import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import classNames from 'classnames';

import { useMergedRefs, useIsFocusVisible, useEventCallback } from '../utils';
import { ListItemContext } from './ListItemContext';

export const ListItem = React.forwardRef(function ListItem(props, forwardedRef) {
    const {
        button,
        link,
        autoFocus,
        selected,
        disabled,
        highlighted,
        children,
        className,
        alignItems,
        onClick,
        onFocus,
        onBlur,
        onMouseDown,
        onKeyDown,
        ...other
    } = props;

    const [focusVisible, setFocusVisible] = useState(false);
    const { isFocusVisible, onBlurVisible, focusVisibleRef } = useIsFocusVisible();

    const elementRef = useRef(null);
    const handleRef = useMergedRefs(elementRef, focusVisibleRef, forwardedRef);

    const handleFocus = useEventCallback((ev) => {
        if (isFocusVisible(ev)) {
            setFocusVisible(true);
        }

        if (onFocus) {
            onFocus(ev);
        }
    });

    const handleBlur = useEventCallback((ev) => {
        if (focusVisible) {
            onBlurVisible();
            setFocusVisible(false);
        }

        if (onBlur) {
            onBlur(ev);
        }
    });

    const handleClick = useCallback(
        (ev) => {
            if (onClick && !disabled) {
                onClick(ev);
            }
        },
        [onClick, disabled]
    );

    const handleKeyDown = useCallback(
        (ev) => {
            if (ev.key === 'Enter' || ev.key === ' ') {
                ev.preventDefault();

                handleClick(ev);
            }

            if (onKeyDown) {
                onKeyDown(ev);
            }
        },
        [handleClick, onKeyDown]
    );

    useEffect(() => {
        if (autoFocus && button && !disabled && elementRef.current) {
            elementRef.current.focus({ preventScroll: false });
        }
    }, [autoFocus, button, disabled]);

    const componentProps = {
        role: button ? 'button' : 'listitem',
        tabIndex: button && !disabled ? 0 : undefined,
        'aria-disabled': disabled,
        className: classNames('list__item', className, {
            'list__item--button': button || link,
            'list__item--selected': selected,
            'list__item--highlighted': highlighted,
            'list__item--disabled': disabled,
            'list__item--focus-visible': focusVisible,
            [`u-flex-align-items-${alignItems}`]: alignItems
        }),
        ...other,
        onClick: handleClick,
        onFocus: handleFocus,
        onBlur: handleBlur,
        onKeyDown: handleKeyDown
    };

    const Component = link ? 'a' : 'div';

    const context = useMemo(() => ({ disabled }), [disabled]);

    return (
        <ListItemContext.Provider value={context}>
            <Component {...componentProps} ref={handleRef}>
                {children}
            </Component>
        </ListItemContext.Provider>
    );
});

export default ListItem;
