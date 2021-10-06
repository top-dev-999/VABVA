import React, { useMemo, useCallback, useState } from 'react';

import { createCtx } from '../utils';

const formatKey = (key) => String(key).toLocaleLowerCase();

const WindowContext = createCtx();

export const useWindowManager = WindowContext.useContext;

export const WindowManagerProvider = (props) => {
    const { children } = props;

    const [windows, setWindows] = useState({});

    const handleOpen = useCallback((key, params) => {
        setWindows((prevState) => {
            if (key) {
                const formatedKey = formatKey(key);

                return { ...prevState, [formatedKey]: { ...params } };
            }

            return prevState;
        });
    }, []);

    const handleClose = useCallback((key) => {
        setWindows((prevState) => {
            const newState = { ...prevState };
            const formatedKey = formatKey(key);

            delete newState[formatedKey];

            return newState;
        });
    }, []);

    const handleIsOpen = useCallback(
        (key) => {
            const formatedKey = formatKey(key);

            return !!windows[formatedKey];
        },
        [windows]
    );

    const handleGetParams = useCallback(
        (key) => {
            const formatedKey = formatKey(key);

            return windows[formatedKey] || {};
        },
        [windows]
    );

    const contextValue = useMemo(
        () => ({
            isOpenWindow: handleIsOpen,
            getWindowParams: handleGetParams,
            openWindow: handleOpen,
            closeWindow: handleClose
        }),
        [handleClose, handleIsOpen, handleOpen, handleGetParams]
    );

    return <WindowContext.Provider value={contextValue}>{children}</WindowContext.Provider>;
};
