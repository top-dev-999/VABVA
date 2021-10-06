import React from 'react';
import Scrollbars from 'react-custom-scrollbars';

import { setRef, useEventCallback } from '../utils';

export const Scrollbar = React.forwardRef(function Scrollbar(props, forwardedRef) {
    const {
        children,
        disabled,
        enableVerticalTrack,
        enableHorizontalTrack,
        onScroll,
        ...other
    } = props;

    const handleRef = useEventCallback((node) => {
        if (forwardedRef) {
            setRef(forwardedRef, node?.view || null);
        }
    });

    const handleScroll = useEventCallback((ev) => {
        ev.stopPropagation();

        if (onScroll) {
            onScroll(ev);
        }
    });

    const renderTrackVertical = useEventCallback((renderProps) => {
        return !disabled ? (
            <div
                {...renderProps}
                className="custom-scrollbars-track custom-scrollbars-track--vertical"
            />
        ) : (
            <div />
        );
    });

    const renderTrackHorizontal = useEventCallback((renderProps) => {
        return !disabled ? (
            <div
                {...renderProps}
                className="custom-scrollbars-track custom-scrollbars-track--horizontal"
            />
        ) : (
            <div />
        );
    });

    const renderThumb = useEventCallback((renderProps) => {
        return !disabled ? <div {...renderProps} className="custom-scrollbars-thumb" /> : <div />;
    });

    return (
        <Scrollbars
            {...other}
            {...(enableVerticalTrack && { renderTrackVertical })}
            {...(enableHorizontalTrack && { renderTrackHorizontal })}
            universal
            renderThumbHorizontal={renderThumb}
            renderThumbVertical={renderThumb}
            onScroll={handleScroll}
            ref={handleRef}
        >
            {children}
        </Scrollbars>
    );
});
