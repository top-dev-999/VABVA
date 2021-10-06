import React from 'react';
import PropTypes from 'prop-types';

import Nav from 'react-bootstrap/Nav';
import NavItem from 'react-bootstrap/NavItem';

const TabsNav = (props) => {
    const { children, className, ...other } = props;

    const items = React.Children.map(children, (child, index) => {
        return (
            <NavItem bsPrefix="tabs__nav-item" as="li" key={index}>
                {child}
            </NavItem>
        );
    });

    if (!items) {
        return null;
    }

    return (
        <Nav {...other} bsPrefix="tabs__nav" as="ul" className={className}>
            {items}
        </Nav>
    );
};

TabsNav.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
};

export { TabsNav };
