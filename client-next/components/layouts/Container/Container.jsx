import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Container = (props) => {
    const { children, className, ...other } = props;

    return (
        <div className={classNames('container-xl', className)} {...other}>
            {children}
        </div>
    );
};

Container.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
};

export { Container };
