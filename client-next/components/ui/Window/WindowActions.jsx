import React from 'react';
import classNames from 'classnames';

export const WindowActions = (props) => {
    const { children, className, ...other } = props;

    const items = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return child;
        }
        return null;
    });

    return (
        <div className={classNames('window__actions', className)} {...other}>
            {items}
        </div>
    );
};
