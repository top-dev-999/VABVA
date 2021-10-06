import React from 'react';
import classNames from 'classnames';

export const ListSubheader = React.forwardRef(function ListSubheader(props, forwardedRef) {
    const { children, sticky, className, ...other } = props;

    return (
        <div
            className={classNames('list__subheader', className, {
                'list__subheader--sticky': sticky
            })}
            ref={forwardedRef}
            {...other}
        >
            {children}
        </div>
    );
});
