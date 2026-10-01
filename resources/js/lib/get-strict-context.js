import { createContext, createElement, useContext } from 'react';

export function getStrictContext(name) {
    const Context = createContext(undefined);
    Context.displayName = name;
    function Provider({ value, children }) {
        return createElement(Context.Provider, { value }, children);
    }
    function useStrictContext() {
        const value = useContext(Context);
        if (value === undefined) {
            throw new Error(`${name} must be used within its provider`);
        }
        return value;
    }
    return [Provider, useStrictContext];
}
