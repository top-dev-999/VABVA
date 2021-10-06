import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const FieldSelectedList = (props) => {
    const { children, className, ...other } = props;

    return (
        <div {...other} className={classNames('field-selected-list', className)}>
            {children}
        </div>
    );
};

FieldSelectedList.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
};

export { FieldSelectedList };
