import { useCallback, useEffect, useRef, useState } from 'react';

export function useLocalStorage(key, defaultData) {
    const localStorageRef = useRef(null);
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultData;
        } catch (error) {
            console.log(error);
            return defaultData;
        }
    });

    const setItem = useCallback(
        (item) => {
            try {
                const value = item instanceof Function ? item(storedValue) : item;
                setStoredValue(value);
                localStorage.setItem(key, JSON.stringify(value));
            } catch (error) {
                console.error(error);
            }
        },
        [key, storedValue]
    );

    const removeItem = useCallback(() => {
        try {
            localStorage.removeItem(key);
            setStoredValue(undefined);
        } catch (error) {
            console.error(error);
        }
    }, [key]);

    useEffect(() => {
        if (window && window.localStorage) {
            localStorageRef.current = window.localStorage;
        }
    }, []);

    useEffect(() => {
        if (!key) {
            console.error('useLocalStorage require a key prop!');
        }
    }, [key]);

    return [storedValue, setItem, removeItem];
}
