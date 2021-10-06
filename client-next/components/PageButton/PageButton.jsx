import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import { Button } from '../ui';

const PageButton = React.forwardRef(function PageButton(props, forwardedRef) {
    const { children, pathname, onClick, ...other } = props;
    const router = useRouter();

    const handleClick = useCallback(
        (ev) => {
            if (onClick) {
                onClick(ev);
            }

            if (pathname) {
                router.push(pathname);
            }
        },
        [pathname, router, onClick]
    );

    return (
        <Button {...other} onClick={handleClick} ref={forwardedRef}>
            {children}
        </Button>
    );
});

PageButton.propTypes = {
    children: PropTypes.node,
    pathname: PropTypes.string,
    onClick: PropTypes.func
};

export { PageButton };
