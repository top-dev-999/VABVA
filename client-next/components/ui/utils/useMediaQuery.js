import { useEffect, useState } from 'react';
import { useMountedRef } from './useMountedRef';

const isSupportMatchMedia = () => {
    return typeof window !== 'undefined' && typeof window.matchMedia !== 'undefined';
};

export function useMediaQuery(query) {
    const [matches, setMatches] = useState(() =>
        isSupportMatchMedia() ? window.matchMedia(query).matches : false
    );

    const isMountedRef = useMountedRef();

    useEffect(() => {
        if (!isSupportMatchMedia()) {
            return undefined;
        }

        const mqList = window.matchMedia(query);

        const updateMatches = () => {
            if (isMountedRef.current) {
                setMatches(mqList.matches);
            }
        };

        updateMatches();

        mqList.addEventListener('change', updateMatches);

        return () => {
            mqList.removeEventListener('change', updateMatches);
        };
    }, [query, isMountedRef]);

    return matches;
}
