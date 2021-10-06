import React from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';

export const Backdrop = React.forwardRef(function Backdrop(props, forwardedRef) {
    const { open, className, transition, transitionProps, ...other } = props;

    const transitionPropsDefault = {
        appear: true,
        timeout: 300,
        classNames: 'backdrop'
    };

    const backdropComponent = (
        <div className={classNames('backdrop', className)} ref={forwardedRef} {...other} />
    );

    if (!transition) {
        return open ? backdropComponent : null;
    }

    return (
        <CSSTransition in={open} {...{ ...transitionPropsDefault, ...transitionProps }}>
            {backdropComponent}
        </CSSTransition>
    );
});
