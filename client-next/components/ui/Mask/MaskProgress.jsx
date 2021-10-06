import React from 'react';
import classNames from 'classnames';

export const MaskProgress = React.forwardRef(function MaskProgress(props, forwardedRef) {
    const { children, title, className, position = 'center', primary, secondary, ...other } = props;

    const progressElement = React.isValidElement(children)
        ? React.cloneElement(children, {
              primary,
              secondary
          })
        : null;

    return (
        <div
            className={classNames('mask__progress', className, {
                'mask__progress--primary': primary,
                'mask__progress--secondary': secondary,
                [`mask__progress--${position}`]: position
            })}
            {...other}
            ref={forwardedRef}
        >
            {progressElement}
            {title && <div className="mask__progress-title">{title}</div>}
        </div>
    );
});
