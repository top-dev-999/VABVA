import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Container } from '../Container';
import { Header } from '../Header';
import { Footer } from '../Footer';

const PageLayout = (props) => {
    const { children, disableContainer = false, className } = props;

    const contentElement = !disableContainer ? <Container>{children}</Container> : children;

    return (
        <div className={classNames('page', className)}>
            <Header condensed className="page__header" />
            <main className="page__main">{contentElement}</main>
            <Footer condensed className="page__footer" />
        </div>
    );
};

PageLayout.propTypes = {
    children: PropTypes.node,
    disableContainer: PropTypes.bool,
    className: PropTypes.string
};

export { PageLayout };
