import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import BootstapButton from 'react-bootstrap/Button';

const Button = React.forwardRef(function Button(props, forwardedRef) {
    const {
        children,
        iconRight,
        iconLeft,
        width,
        variant,
        truncate = true,
        size,
        link,
        href = '#',
        className,
        style,
        ...other
    } = props;

    // This needs to proper work of truncation
    const textContent = (
        <span key="text" className="btn__text">
            {children}
        </span>
    );
    const content = [textContent];
    let customStyle = { ...style };

    if (React.isValidElement(iconRight)) {
        const iconRightElement = React.cloneElement(iconRight, {
            key: 'icon-right',
            className: classNames('btn__icon', 'btn__icon--right')
        });
        content.push(iconRightElement);
    }

    if (React.isValidElement(iconLeft)) {
        const iconLeftElement = React.cloneElement(iconLeft, {
            key: 'icon-left',
            className: classNames('btn__icon', 'btn__icon--left')
        });
        content.unshift(iconLeftElement);
    }

    if (width) {
        customStyle = {
            maxWidth: width,
            width: '100%',
            ...customStyle
        };
    }

    let Component = BootstapButton;

    if (link) {
        Component = 'a';
    }

    // console.log({ variant });

    return (
        <Component
            {...other}
            {...(link && { href })}
            {...(!link && { variant, size })}
            className={classNames(className, {
                btn: link,
                [`btn-${variant}`]: link && variant,
                [`btn-${size}`]: link && size,
                'btn-link': link,
                'btn--truncate': truncate
            })}
            style={customStyle}
            ref={forwardedRef}
        >
            {content}
        </Component>
    );
});

Button.propTypes = {
    iconRight: PropTypes.element,
    iconLeft: PropTypes.element,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    link: PropTypes.bool,
    href: PropTypes.string,
    variant: PropTypes.string,
    truncate: PropTypes.bool,
    size: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object
};

export { Button };
