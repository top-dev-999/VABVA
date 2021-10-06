import React from 'react';
import PropTypes from 'prop-types';

import TabContent from 'react-bootstrap/TabContent';

const TabsContent = (props) => {
    const { children, className, ...other } = props;

    return (
        <TabContent {...other} bsPrefix="tabs__content" as="div" className={className}>
            {children}
        </TabContent>
    );
};

TabsContent.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
};

export { TabsContent };
