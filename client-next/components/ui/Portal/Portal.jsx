import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { setRef } from '../utils';

export const Portal = React.forwardRef(function Portal(props, forwardedRef) {
    const { children, onRendered } = props;
    const [mountNode, setMountNode] = useState(null);

    useEffect(() => {
        setMountNode(document.body);
    }, []);

    useEffect(() => {
        if (mountNode && forwardedRef) {
            setRef(forwardedRef, mountNode);
        }

        return () => {
            if (forwardedRef) {
                setRef(forwardedRef, null);
            }
        };
    }, [mountNode, forwardedRef]);

    useEffect(() => {
        if (onRendered && mountNode) {
            onRendered();
        }
    }, [onRendered, mountNode]);

    return mountNode ? ReactDOM.createPortal(children, mountNode) : mountNode;
});
