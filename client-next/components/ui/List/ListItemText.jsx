import React from 'react';
import classNames from 'classnames';

export const ListItemText = React.forwardRef(function ListItemText(props, forwardedRef) {
    const { children, className, truncate, flex, ...other } = props;

    return (
        <div
            className={classNames('list__text', className, {
                'list__text--truncate': truncate,
                'list__text--flex': flex
            })}
            ref={forwardedRef}
            {...other}
        >
            {children}
        </div>
    );
});
