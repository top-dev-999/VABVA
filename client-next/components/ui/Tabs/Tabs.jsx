import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import TabContainer from 'react-bootstrap/TabContainer';

const Tabs = (props) => {
    const { children, defaultActiveKey, activeKey, className, onSelect, ...other } = props;

    return (
        <div className={classNames('tabs', className)}>
            <TabContainer
                defaultActiveKey={defaultActiveKey}
                activeKey={activeKey}
                onSelect={onSelect}
                {...other}
            >
                {children}
            </TabContainer>
        </div>
    );
};

Tabs.propTypes = {
    children: PropTypes.node,
    defaultActiveKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    className: PropTypes.string,
    onSelect: PropTypes.func
};

export { Tabs };
