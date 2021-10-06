import React from 'react';

export function createCtx() {
    const Context = React.createContext(undefined);
    const Provider = Context.Provider;

    const useContext = () => {
        const contextValue = React.useContext(Context);

        if (contextValue === undefined) {
            throw new Error('useContext must be inside a provider with a value!');
        }

        return contextValue;
    };

    return { Provider, useContext };
}
