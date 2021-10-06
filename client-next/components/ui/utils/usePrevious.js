import { useRef, useEffect } from 'react';

export function usePrevious(newValue) {
    const value = useRef();

    useEffect(() => {
        value.current = newValue;
    }, [newValue]);

    return value.current;
}
