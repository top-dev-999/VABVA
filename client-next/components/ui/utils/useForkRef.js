import { useMemo } from 'react';
import { setRef } from './setRef';

export function useForkRef(refA, refB) {
    return useMemo(() => {
        if (!refA && !refB) {
            return null;
        }

        return (value) => {
            setRef(refA, value);
            setRef(refB, value);
        };
    }, [refA, refB]);
}
