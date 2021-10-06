import React from 'react';
import PropTypes from 'prop-types';

import NavLink from 'react-bootstrap/NavLink';

const TabButton = (props) => {
    const { eventKey, children, label, icon, className, ...other } = props;

    const iconElement = React.isValidElement(icon) ? (
        <span className="tabs__nav-icon-wrap">
            {React.cloneElement(icon, {
                className: 'tabs__nav-icon'
            })}
        </span>
    ) : null;

    const labelElement = label ? <span className="tabs__nav-label">{label}</span> : null;

    return (
        <NavLink
            {...other}
            as="button"
            eventKey={eventKey}
            bsPrefix="tabs__nav-button"
            className={className}
        >
            {iconElement}
            {labelElement}
            {children || null}
        </NavLink>
    );
};

TabButton.propTypes = {
    eventKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    children: PropTypes.node,
    label: PropTypes.string,
    icon: PropTypes.node
};

export { TabButton };
