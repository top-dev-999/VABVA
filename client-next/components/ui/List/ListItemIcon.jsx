import React from 'react';
import classNames from 'classnames';

export const ListItemIcon = React.forwardRef(function ListItemIcon(props, forwardedRef) {
    const { children, className, ...other } = props;

    return (
        <div className={classNames('list__icon', className)} ref={forwardedRef} {...other}>
            {children}
        </div>
    );
});
