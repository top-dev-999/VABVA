import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const IconButton = React.forwardRef(function IconButton(props, forwardedRef) {
    const { children, className, type = 'button', plain, ...other } = props;
    let iconElement = null;

    if (React.isValidElement(children)) {
        iconElement = React.cloneElement(children, {
            className: classNames('icon-btn__icon', children.props?.className)
        });
    }

    return (
        <button
            {...other}
            type={String(type)}
            className={classNames('icon-btn', className, {
                'icon-btn--plain': plain
            })}
            ref={forwardedRef}
        >
            {iconElement}
        </button>
    );
});

IconButton.propTypes = {
    children: PropTypes.element,
    className: PropTypes.string,
    type: PropTypes.string,
    plain: PropTypes.bool
};

export { IconButton };
