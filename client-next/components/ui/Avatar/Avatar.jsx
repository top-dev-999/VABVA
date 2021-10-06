import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Avatar = React.forwardRef(function Avatar(props, forwardedRef) {
    const { children, text = true, rounded = true, size, className, ...other } = props;

    let content = children;

    if (text) {
        content = <span className="avatar__text">{children}</span>;
    }

    return (
        <div
            {...other}
            className={classNames('avatar', className, {
                'avatar--rouded': rounded,
                [`avatar--size-${size}`]: size
            })}
            ref={forwardedRef}
        >
            {content}
        </div>
    );
});

Avatar.propTypes = {
    children: PropTypes.node,
    text: PropTypes.bool,
    rounded: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'large']),
    className: PropTypes.string
};

export { Avatar };
