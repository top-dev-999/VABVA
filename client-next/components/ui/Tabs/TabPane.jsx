import React from 'react';
import PropTypes from 'prop-types';

import TabPaneBootstap from 'react-bootstrap/TabPane';

const TabPane = (props) => {
    const { eventKey, children, className, ...other } = props;

    return (
        <TabPaneBootstap {...other} eventKey={eventKey} as="div" bsPrefix="tabs__pane">
            {children}
        </TabPaneBootstap>
    );
};

TabPane.propTypes = {
    eventKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    className: PropTypes.string,
    children: PropTypes.node
};

export { TabPane };
