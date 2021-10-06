import { useCallback, useMemo } from 'react';
import { scrollbarSize } from 'dom-helpers';

export const useBodyOverflow = () => {
    const isBodyOverflowing = useCallback(() => {
        if (window) {
            return window.innerWidth > document.documentElement.clientWidth;
        }
        return false;
    }, []);

    const setBodyOverflow = useCallback((overflow = true, consideringScrollSize = true) => {
        if (!document) {
            return;
        }

        const { style } = document.body;

        if (overflow) {
            style.removeProperty('overflow');
            style.removeProperty('padding-right');
        } else {
            style.setProperty('overflow', 'hidden');
            if (consideringScrollSize) {
                style.setProperty('padding-right', `${scrollbarSize()}px`);
            }
        }
    }, []);

    return useMemo(
        () => ({
            isBodyOverflowing,
            setBodyOverflow
        }),
        [isBodyOverflowing, setBodyOverflow]
    );
};
