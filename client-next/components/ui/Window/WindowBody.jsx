import React from 'react';
import classNames from 'classnames';

export const WindowBody = (props) => {
    const { children, className, padding = true, painted, ...other } = props;

    return (
        <div
            className={classNames('window__body', className, {
                'window__body--painted': painted,
                'window__body--no-padding': !padding
            })}
            {...other}
        >
            {children}
        </div>
    );
};
