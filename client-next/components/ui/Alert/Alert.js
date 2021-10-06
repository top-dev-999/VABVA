import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export const Alert = React.forwardRef(function Alert(props, ref) {
    const { type = 'error', children, frame, className, ...other } = props;

    return (
        <div
            className={classNames('alert', className, {
                [`alert--${type}`]: type,
                'alert--frame': frame
            })}
            {...other}
            ref={ref}
        >
            <div className="alert__message">{children}</div>
        </div>
    );
});

Alert.propTypes = {
    type: PropTypes.oneOf(['error', 'warning', 'info', 'success']),
    children: PropTypes.node.isRequired,
    frame: PropTypes.bool,
    className: PropTypes.string
};
