import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

const PageLink = React.forwardRef(function PageLink(props, forwardedRef) {
    const { children, href, shallow = false, ...other } = props;

    return (
        <Link href={href} shallow={shallow}>
            <a {...other} ref={forwardedRef}>
                {children}
            </a>
        </Link>
    );
});

PageLink.propTypes = {
    children: PropTypes.node,
    href: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    shallow: PropTypes.bool
};

export { PageLink };
